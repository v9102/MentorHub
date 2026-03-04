// mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let localStream = null;
let roomDialog = null;
let roomId = null;
let localUid = null;
const peerConnections = {};
const chatChannels = {}; // Store chat datachannels

let isBlurEnabled = false;
let segmenter = null;
let blurCanvas = null;
let blurCtx = null;
let animationId = null;
let rawLocalStream = null;
let blurWorking = false;
let sourceVideo = null;
let isHost = false;

const BLUR_CONFIG = {
  backgroundBlurAmount: 15,
  outputFPS: 30
};

let isRealMediaActive = false;

function createDummyStream() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  const drawBlank = () => {
    ctx.fillStyle = '#2E3A59';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Camera Off', canvas.width / 2, canvas.height / 2);
  };
  drawBlank();
  setInterval(drawBlank, 1000);

  const videoStream = canvas.captureStream(10);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const ds = audioCtx.createMediaStreamDestination();
  const silentAudio = ds.stream.getAudioTracks()[0];
  silentAudio.enabled = false;

  return new MediaStream([videoStream.getVideoTracks()[0], silentAudio]);
}

function init() {
  // No forced camera start required
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', () => createRoom(true));
  document.querySelector('#joinBtn').addEventListener('click', () => createRoom(false));
  document.querySelector('#micBtn').addEventListener('click', toggleMic);
  document.querySelector('#camBtn').addEventListener('click', toggleCam);
  document.querySelector('#blurBtn').addEventListener('click', toggleBlur);

  // Custom Modal Logic (Optional, for legacy compatibility)
  const dialog = document.querySelector('#room-dialog');
  if (dialog) {
    roomDialog = {
      open: () => dialog.classList.add('active'),
      close: () => dialog.classList.remove('active')
    };
    dialog.querySelectorAll('[data-mdc-dialog-action]').forEach(btn => {
      btn.addEventListener('click', () => roomDialog.close());
    });
  }

  const shareDlg = document.querySelector('#share-dialog');
  if (shareDlg) {
    const shareDialogObj = {
      open: () => shareDlg.classList.add('active'),
      close: () => shareDlg.classList.remove('active')
    };
    shareDlg.querySelectorAll('[data-mdc-dialog-action]').forEach(btn => {
      btn.addEventListener('click', () => shareDialogObj.close());
    });

    const shareBtn = document.querySelector('#shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const inviteLink = `${window.location.origin}/${roomId}`;
        const linkInput = document.querySelector('#share-link');
        if (linkInput) {
          linkInput.value = inviteLink;
          linkInput.select();
          navigator.clipboard.writeText(inviteLink).then(() => {
            console.log('Invite link copied to clipboard');
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
        shareDialogObj.open();
      });
    }
  }

  // Chat Panel Modals
  document.querySelector('#toggleChatBtn').addEventListener('click', () => {
    document.querySelector('#chat-panel').classList.toggle('active');
  });
  document.querySelector('#closeChatBtn').addEventListener('click', () => {
    document.querySelector('#chat-panel').classList.remove('active');
  });

  document.querySelector('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#chat-input');
    const text = input.value.trim();
    if (text) {
      displayChatMessage(localUid, text, true);
      Object.values(chatChannels).forEach(channel => {
        if (channel.readyState === 'open') {
          channel.send(text);
        }
      });
      input.value = '';
    }
  });

  // Init dummy stream instantly so WebRTC can connect without permissions
  localStream = createDummyStream();
  rawLocalStream = localStream;
  document.querySelector('#hangupBtn').disabled = false;
  document.querySelector('#micBtn').disabled = false;
  document.querySelector('#camBtn').disabled = false;
  document.querySelector('#blurBtn').disabled = false;
  document.querySelector('#previewMicBtn').addEventListener('click', toggleMic);
  document.querySelector('#previewCamBtn').addEventListener('click', toggleCam);
  document.querySelector('#previewBlurBtn').addEventListener('click', toggleBlur);

  console.log('Preloading blur model...');
  initBlur().then(() => {
    console.log('Blur model preloaded');
  }).catch(err => {
    console.warn('Blur preload failed:', err);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const rtcRoomId = urlParams.get('roomId');
  const rtcRole = urlParams.get('role');
  let rtcState = urlParams.get('state');

  if (rtcRoomId) {
    const grBtn = document.querySelector('#greenRoomJoinBtn');

    // Automatically start real media for the green room
    toggleRealMedia().then(() => {
      // Attach local stream to the preview box safely
      const previewContainer = document.querySelector('#video-preview');
      const previewVideo = document.createElement('video');
      previewVideo.autoplay = true;
      previewVideo.muted = true;
      previewVideo.srcObject = localStream;
      previewContainer.appendChild(previewVideo);

      // Setup icons syncing
      setInterval(() => {
        const btnMic = document.querySelector('#micBtn i').innerText;
        const btnCam = document.querySelector('#camBtn i').innerText;
        document.querySelector('#previewMicBtn i').innerText = btnMic;
        document.querySelector('#previewCamBtn i').innerText = btnCam;
      }, 500);
    });

    const checkStudentWait = () => {
      if (rtcRole === "student" && rtcState !== "meeting_started" && rtcState !== "In progress") {
        grBtn.disabled = true;
        grBtn.innerText = 'Waiting for Mentor...';
        grBtn.classList.add('bg-slate-400');
        return true;
      }
      return false;
    };

    if (checkStudentWait()) {
      window.addEventListener("message", (event) => {
        if (event.data?.type === "MENTOR_STARTED") {
          rtcState = "meeting_started";
          grBtn.disabled = false;
          grBtn.innerText = 'Join Now';
          grBtn.classList.remove('bg-slate-400');
        }
      });
    }

    grBtn.addEventListener('click', async () => {
      grBtn.disabled = true;
      grBtn.innerText = 'Joining...';

      // Notify parent Next.js app to update backend state
      if (rtcRole === "mentor") {
        window.parent.postMessage({ type: "MEETING_STARTED" }, "*");
      }

      await joinRoom(rtcRoomId);

      // Hide Green Room, show Main Meeting
      document.querySelector('#green-room').classList.remove('active');
      document.querySelector('#main-meeting').style.display = 'flex';
    }, { once: true });
  }
}

function toggleMic() {
  if (!isRealMediaActive) {
    toggleRealMedia();
    return;
  }
  const audioTrack = localStream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    const btnIcon = document.querySelector('#micBtn i');
    btnIcon.innerText = audioTrack.enabled ? 'mic' : 'mic_off';
  }
}

function toggleCam() {
  if (!isRealMediaActive) {
    toggleRealMedia();
    return;
  }
  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;
    const btnIcon = document.querySelector('#camBtn i');
    btnIcon.innerText = videoTrack.enabled ? 'videocam' : 'videocam_off';
  }
}

async function toggleRealMedia() {
  if (isRealMediaActive) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    isRealMediaActive = true;

    const newVideoTrack = stream.getVideoTracks()[0];
    const newAudioTrack = stream.getAudioTracks()[0];

    rawLocalStream = stream;

    if (isBlurEnabled) {
      // Background blur currently handling video, we let toggleBlur restart it if we were to support it
      // Let's just reset the local stream safely
      localStream = stream;
      isBlurEnabled = false;
      document.querySelector('#blurBtn i').innerText = 'blur_on';
    } else {
      localStream = stream;
    }

    Object.values(peerConnections).forEach(pcStub => {
      const videoSender = pcStub.pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (videoSender) videoSender.replaceTrack(newVideoTrack).catch(e => console.error(e));

      const audioSender = pcStub.pc.getSenders().find(s => s.track && s.track.kind === 'audio');
      if (audioSender) audioSender.replaceTrack(newAudioTrack).catch(e => console.error(e));
    });

    const localVideo = document.querySelector(`#video-${localUid}`);
    if (localVideo) localVideo.srcObject = localStream;

    const camIcon = document.querySelector('#camBtn i');
    camIcon.innerText = 'videocam';
    const micIcon = document.querySelector('#micBtn i');
    micIcon.innerText = 'mic';

  } catch (err) {
    console.error('Failed to get user media', err);
    alert('Failed to access camera and microphone.');
  }
}

function toggleRemoteAudio(uid) {
  const videoElement = document.getElementById(`video-${uid}`);
  if (videoElement) {
    videoElement.muted = !videoElement.muted;
    const btn = document.getElementById(`mute-btn-${uid}`);
    if (btn) {
      btn.innerText = videoElement.muted ? 'volume_off' : 'volume_up';
      if (videoElement.muted) btn.classList.add('muted');
      else btn.classList.remove('muted');
    }
  }
}

async function kickParticipant(uid) {
  if (confirm(`Are you sure you want to kick participant ${uid}?`)) {
    const db = firebase.firestore();
    await db.collection('rooms').doc(roomId).collection('participants').doc(uid).delete();
  }
}

async function createRoom(isCreator) {
  if (isCreator) {
    await joinRoom();
  } else {
    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#joinBtn').disabled = true;
    document.querySelector('#confirmJoinBtn').addEventListener('click', async () => {
      roomId = document.querySelector('#room-id').value;
      await joinRoom(roomId);
    }, { once: true });
    roomDialog.open();
  }
}

async function joinRoom(id = null) {
  const db = firebase.firestore();

  if (!id) {
    const roomRef = await db.collection('rooms').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      hostId: localUid
    });
    roomId = roomRef.id;
    isHost = true;
    window.history.pushState(null, '', `/${roomId}`);
  } else {
    roomId = id;
    const roomSnap = await db.collection('rooms').doc(roomId).get();
    if (roomSnap.exists && roomSnap.data().hostId === localUid) {
      isHost = true;
    } else {
      isHost = false;
    }
  }

  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = `Current room is ${roomId}`;

  const shareBtn = document.querySelector('#shareBtn');
  if (shareBtn) {
    shareBtn.style.display = isHost ? 'inline-flex' : 'none';
  }
  document.querySelector('#toggleChatBtn').style.display = 'inline-flex';

  localUid = Math.random().toString(36).substring(7);
  console.log('My local UID:', localUid);

  const roomRef = db.collection('rooms').doc(roomId);
  const participantsRef = roomRef.collection('participants');

  await participantsRef.doc(localUid).set({
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  });

  participantsRef.doc(localUid).onSnapshot(doc => {
    if (!doc.exists) {
      alert('You have been kicked from the room.');
      hangUp();
    }
  });

  addVideoElement(localUid, localStream, true);

  participantsRef.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const remoteUid = change.doc.id;
        if (remoteUid !== localUid) {
          console.log('New participant:', remoteUid);
          await handleParticipant(remoteUid, participantsRef);
        }
      } else if (change.type === 'removed') {
        const remoteUid = change.doc.id;
        if (remoteUid !== localUid) {
          console.log('Participant removed:', remoteUid);
          removeParticipant(remoteUid);
        }
      }
    });
  });

  const myDocRef = participantsRef.doc(localUid);

  myDocRef.collection('offers').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        const remoteUid = change.doc.id;
        await handleOffer(remoteUid, data.offer, participantsRef);
      }
    });
  });

  myDocRef.collection('answers').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        const remoteUid = change.doc.id;
        await handleAnswer(remoteUid, data.answer);
      }
    });
  });

  myDocRef.collection('candidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        const remoteUid = data.sender;
        await handleCandidate(remoteUid, data);
      }
    });
  });
}

async function handleParticipant(remoteUid, participantsRef) {
  if (localUid < remoteUid) {
    console.log(`I (${localUid}) am calling ${remoteUid}`);
    const pc = createPeerConnection(remoteUid, participantsRef);
    peerConnections[remoteUid] = { pc: pc };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await participantsRef.doc(remoteUid).collection('offers').doc(localUid).set({
      offer: { type: offer.type, sdp: offer.sdp }
    });
  } else {
    console.log(`I (${localUid}) am waiting for offer from ${remoteUid}`);
  }
}

async function handleOffer(remoteUid, offer, participantsRef) {
  console.log(`Received offer from ${remoteUid}`);
  let pcStub = peerConnections[remoteUid];
  let pc;
  if (pcStub && pcStub.pc) {
    pc = pcStub.pc;
  } else {
    pc = createPeerConnection(remoteUid, participantsRef);
    peerConnections[remoteUid] = { pc: pc };
  }

  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  await participantsRef.doc(remoteUid).collection('answers').doc(localUid).set({
    answer: { type: answer.type, sdp: answer.sdp }
  });
}

async function handleAnswer(remoteUid, answer) {
  console.log(`Received answer from ${remoteUid}`);
  const pcStub = peerConnections[remoteUid];
  if (pcStub && pcStub.pc) {
    await pcStub.pc.setRemoteDescription(new RTCSessionDescription(answer));
  }
}

async function handleCandidate(remoteUid, candidateData) {
  if (peerConnections[remoteUid] && peerConnections[remoteUid].pc) {
    console.log(`Adding candidate from ${remoteUid}`);
    await peerConnections[remoteUid].pc.addIceCandidate(new RTCIceCandidate(candidateData));
  }
}

function displayChatMessage(sender, text, isLocal) {
  const messagesDiv = document.querySelector('#chat-messages');
  if (!messagesDiv) return;
  const wrapper = document.createElement('div');
  wrapper.className = `chat-bubble ${isLocal ? 'local' : 'remote'}`;

  if (!isLocal) {
    const nameSpan = document.createElement('span');
    nameSpan.className = 'chat-sender-name';
    nameSpan.innerText = `User ${sender.substring(0, 4)}`;
    wrapper.appendChild(nameSpan);
  }

  const textNode = document.createTextNode(text);
  wrapper.appendChild(textNode);
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function createPeerConnection(remoteUid, participantsRef) {
  const pc = new RTCPeerConnection(configuration);

  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });

  // Setup DataChannel for Chat
  const chatChannel = pc.createDataChannel('chat');
  chatChannels[remoteUid] = chatChannel;
  chatChannel.onmessage = (event) => {
    displayChatMessage(remoteUid, event.data, false);
  };

  pc.addEventListener('datachannel', event => {
    if (event.channel.label === 'chat') {
      chatChannels[remoteUid] = event.channel;
      event.channel.onmessage = (e) => displayChatMessage(remoteUid, e.data, false);
    }
  });

  pc.addEventListener('icecandidate', event => {
    if (event.candidate) {
      participantsRef.doc(remoteUid).collection('candidates').add({
        sender: localUid,
        candidate: event.candidate.candidate,
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex
      });
    }
  });

  pc.addEventListener('track', event => {
    console.log('Got remote track from:', remoteUid);
    let remoteStream = new MediaStream();
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });

    if (!document.getElementById(`video-${remoteUid}`)) {
      addVideoElement(remoteUid, remoteStream, false);
    }
  });

  return pc;
}

function addVideoElement(uid, stream, isLocal) {
  const videoContainer = document.querySelector('#videos');

  const div = document.createElement('div');
  div.className = 'video-container';
  div.id = `container-${uid}`;

  const video = document.createElement('video');
  video.id = `video-${uid}`;
  video.autoplay = true;
  video.playsInline = true;
  video.srcObject = stream;
  if (isLocal) {
    video.muted = true;
  }

  div.appendChild(video);

  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'video-controls';

  if (!isLocal) {
    const muteBtn = document.createElement('button');
    muteBtn.className = 'control-btn';
    muteBtn.title = 'Mute Audio';
    muteBtn.id = `mute-btn-${uid}`;
    const muteIcon = document.createElement('i');
    muteIcon.className = 'material-icons';
    muteIcon.innerText = 'volume_up';
    muteBtn.appendChild(muteIcon);
    muteBtn.addEventListener('click', () => toggleRemoteAudio(uid));
    controlsDiv.appendChild(muteBtn);

    if (isHost) {
      const kickBtn = document.createElement('button');
      kickBtn.className = 'control-btn kick-btn';
      kickBtn.title = 'Kick Participant';
      const kickIcon = document.createElement('i');
      kickIcon.className = 'material-icons';
      kickIcon.innerText = 'person_remove';
      kickBtn.appendChild(kickIcon);
      kickBtn.addEventListener('click', () => kickParticipant(uid));
      controlsDiv.appendChild(kickBtn);
    }
  }

  if (!isLocal || (isLocal && isHost)) {
    div.appendChild(controlsDiv);
  }

  videoContainer.appendChild(div);

  // Make element draggable
  makeDraggable(div);
}

function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  element.addEventListener("mousedown", dragStart);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("mousemove", drag);

  function dragStart(e) {
    if (e.target.closest('.video-controls')) return; // Allow clicking buttons

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === element || element.contains(e.target)) {
      isDragging = true;
      element.classList.add('dragging');
      // Ensure absolute position if not already
      // element.style.position = 'absolute'; // Optional: if we want free float from grid
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    element.classList.remove('dragging');
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, element);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}

function removeParticipant(remoteUid) {
  if (peerConnections[remoteUid]) {
    peerConnections[remoteUid].pc.close();
    delete peerConnections[remoteUid];
  }
  const videoContainer = document.getElementById(`container-${remoteUid}`);
  if (videoContainer) {
    videoContainer.remove();
  }
}

async function hangUp(e) {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (sourceVideo) {
    sourceVideo.pause();
    sourceVideo.srcObject = null;
    sourceVideo = null;
  }

  const tracks = localStream.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  Object.keys(chatChannels).forEach(uid => {
    if (chatChannels[uid]) chatChannels[uid].close();
    delete chatChannels[uid];
  });

  if (roomId && localUid) {
    const db = firebase.firestore();
    await db.collection('rooms').doc(roomId).collection('participants').doc(localUid).delete();
  }

  document.querySelector('#videos').innerHTML = '';
  document.querySelector('#cameraBtn').disabled = false;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#micBtn').disabled = true;
  document.querySelector('#camBtn').disabled = true;
  document.querySelector('#blurBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';
  document.querySelector('#greenRoomJoinBtn').style.display = 'none';
  document.querySelector('#greenRoomJoinBtn').disabled = false;
  document.querySelector('#greenRoomJoinBtn').innerHTML = '<i class="material-icons left">meeting_room</i><span class="btn-text">Join Meeting</span>';

  const shareBtn = document.querySelector('#shareBtn');
  if (shareBtn) shareBtn.style.display = 'none';

  const path = window.location.pathname.slice(1);
  if (path) {
    window.location.replace('/');
  } else {
    document.location.reload(true);
  }
}

async function initBlur() {
  return new Promise((resolve, reject) => {
    try {
      segmenter = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
      });

      segmenter.setOptions({ modelSelection: 1 });

      segmenter.onResults((results) => {
        if (!blurWorking || !blurCanvas || !blurCtx) return;

        blurCanvas.width = results.image.width;
        blurCanvas.height = results.image.height;

        blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);

        blurCtx.save();
        blurCtx.drawImage(results.image, 0, 0, blurCanvas.width, blurCanvas.height);
        blurCtx.restore();

        blurCtx.save();
        blurCtx.globalCompositeOperation = 'destination-in';
        blurCtx.drawImage(results.segmentationMask, 0, 0, blurCanvas.width, blurCanvas.height);
        blurCtx.restore();

        blurCtx.save();
        blurCtx.globalCompositeOperation = 'destination-over';
        blurCtx.filter = `blur(${BLUR_CONFIG.backgroundBlurAmount}px)`;
        blurCtx.drawImage(results.image, 0, 0, blurCanvas.width, blurCanvas.height);
        blurCtx.restore();
      });

      segmenter.initialize().then(() => {
        console.log('MediaPipe Selfie Segmentation loaded');
        resolve();
      }).catch(reject);
    } catch (err) {
      console.error('Failed to load segmentation model:', err);
      reject(err);
    }
  });
}

async function toggleBlur() {
  const btn = document.querySelector('#blurBtn');
  const btnIcon = btn.querySelector('i');

  if (!isBlurEnabled) {
    btn.disabled = true;
    try {
      if (!segmenter) {
        console.log('Loading MediaPipe Segmentation...');
        await initBlur();
      }

      const videoTrack = rawLocalStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      sourceVideo = document.createElement('video');
      sourceVideo.autoplay = true;
      sourceVideo.muted = true;
      sourceVideo.playsInline = true;
      sourceVideo.width = settings.width || 640;
      sourceVideo.height = settings.height || 480;
      sourceVideo.srcObject = new MediaStream([videoTrack]);

      await new Promise(r => {
        sourceVideo.onloadedmetadata = () => {
          sourceVideo.play();
          r();
        };
      });

      if (!blurCanvas) {
        blurCanvas = document.createElement('canvas');
        blurCanvas.width = sourceVideo.videoWidth;
        blurCanvas.height = sourceVideo.videoHeight;
        blurCtx = blurCanvas.getContext('2d');
      }

      blurCtx.drawImage(sourceVideo, 0, 0, blurCanvas.width, blurCanvas.height);

      const canvasStream = blurCanvas.captureStream(BLUR_CONFIG.outputFPS);
      const blurredVideoTrack = canvasStream.getVideoTracks()[0];
      const audioTrack = rawLocalStream.getAudioTracks()[0];

      localStream = new MediaStream([blurredVideoTrack, audioTrack]);

      blurWorking = true;

      async function processFrame() {
        if (!blurWorking) return;
        await segmenter.send({ image: sourceVideo });
        animationId = requestAnimationFrame(processFrame);
      }

      await segmenter.send({ image: sourceVideo });

      const localVideo = document.querySelector(`#video-${localUid}`);
      if (localVideo) {
        localVideo.srcObject = localStream;
      }

      Object.values(peerConnections).forEach(pcStub => {
        const sender = pcStub.pc.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(blurredVideoTrack).catch(err => {
            console.error('Failed to replace track:', err);
          });
        }
      });

      processFrame();

      isBlurEnabled = true;
      btnIcon.innerText = 'blur_off';
      console.log('Background blur enabled');
    } catch (err) {
      console.error('Failed to enable blur:', err);
      alert('Failed to enable background blur. Check console for details.');
      blurWorking = false;
    } finally {
      btn.disabled = false;
    }

  } else {
    blurWorking = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (sourceVideo) {
      sourceVideo.pause();
      sourceVideo.srcObject = null;
      sourceVideo = null;
    }

    localStream = rawLocalStream;

    const localVideo = document.querySelector(`#video-${localUid}`);
    if (localVideo) {
      localVideo.srcObject = localStream;
    }

    const videoTrack = localStream.getVideoTracks()[0];
    Object.values(peerConnections).forEach(pcStub => {
      const sender = pcStub.pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(videoTrack).catch(err => {
          console.error('Failed to replace track:', err);
        });
      }
    });

    isBlurEnabled = false;
    btnIcon.innerText = 'blur_on';
    console.log('Background blur disabled');
  }
}

init();
