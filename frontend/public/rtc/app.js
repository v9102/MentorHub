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
const chatChannels = {};

let isBlurEnabled = false;
let segmenter = null;
let blurCanvas = null;
let blurCtx = null;
let animationId = null;
let rawLocalStream = null;
let blurWorking = false;
let sourceVideo = null;
let isHost = false;
let isRealMediaActive = false;

let isScreenSharing = false;
let screenShareStream = null;
let preScreenShareStream = null;
let sessionTimerInterval = null;
let sessionStartTime = null;
let rtcMentorName = '';
let rtcStudentName = '';
let rtcRole = '';
let activeSidePanel = null;

const BLUR_CONFIG = {
  backgroundBlurAmount: 15,
  outputFPS: 30
};

function createDummyStream() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  const drawBlank = () => {
    ctx.fillStyle = '#2C2C2E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
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
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', () => createRoom(true));
  document.querySelector('#joinBtn').addEventListener('click', () => createRoom(false));
  document.querySelector('#micBtn').addEventListener('click', toggleMic);
  document.querySelector('#camBtn').addEventListener('click', toggleCam);
  document.querySelector('#blurBtn').addEventListener('click', toggleBlur);
  document.querySelector('#screenShareBtn').addEventListener('click', toggleScreenShare);
  document.querySelector('#peopleBtn').addEventListener('click', () => toggleSidePanel('participants'));
  document.querySelector('#toggleChatBtn').addEventListener('click', () => toggleSidePanel('chat'));
  document.querySelector('#closeChatBtn').addEventListener('click', closeSidePanel);
  document.querySelector('#closeParticipantsBtn').addEventListener('click', closeSidePanel);

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
  rtcRole = urlParams.get('role') || '';
  let rtcState = urlParams.get('state');
  rtcMentorName = urlParams.get('mentorName') || '';
  rtcStudentName = urlParams.get('studentName') || '';

  if (rtcRoomId) {
    const grBtn = document.querySelector('#greenRoomJoinBtn');

    toggleRealMedia().then(() => {
      const previewContainer = document.querySelector('#video-preview');
      const previewVideo = document.createElement('video');
      previewVideo.autoplay = true;
      previewVideo.muted = true;
      previewVideo.srcObject = localStream;
      previewContainer.appendChild(previewVideo);

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

      if (rtcRole === "mentor") {
        window.parent.postMessage({ type: "MEETING_STARTED" }, "*");
      }

      await joinRoom(rtcRoomId);

      document.querySelector('#green-room').classList.remove('active');
      document.querySelector('#main-meeting').style.display = 'flex';
      startSessionTimer();
    }, { once: true });
  }
}

/* ── Side Panel Management ─────────────────────────── */

function toggleSidePanel(panel) {
  const sidePanel = document.querySelector('#side-panel');
  const chatTab = document.querySelector('#chat-panel');
  const participantsTab = document.querySelector('#participants-tab');
  const chatBtn = document.querySelector('#toggleChatBtn');
  const peopleBtn = document.querySelector('#peopleBtn');

  if (activeSidePanel === panel) {
    closeSidePanel();
    return;
  }

  activeSidePanel = panel;
  sidePanel.style.display = 'flex';

  if (panel === 'chat') {
    chatTab.style.display = 'flex';
    participantsTab.style.display = 'none';
    chatBtn.classList.add('active-panel');
    peopleBtn.classList.remove('active-panel');
  } else if (panel === 'participants') {
    chatTab.style.display = 'none';
    participantsTab.style.display = 'flex';
    chatBtn.classList.remove('active-panel');
    peopleBtn.classList.add('active-panel');
    updateParticipantsList();
  }
}

function closeSidePanel() {
  document.querySelector('#side-panel').style.display = 'none';
  activeSidePanel = null;
  document.querySelector('#toggleChatBtn').classList.remove('active-panel');
  document.querySelector('#peopleBtn').classList.remove('active-panel');
}

function updateParticipantsList() {
  const list = document.querySelector('#participants-list');
  if (!list) return;
  list.innerHTML = '';

  const localName = rtcRole === 'mentor' ? rtcMentorName : rtcStudentName;
  addParticipantItem(list, localName || 'You', rtcRole, true);

  if (Object.keys(peerConnections).length > 0) {
    const remoteName = rtcRole === 'mentor' ? rtcStudentName : rtcMentorName;
    const remoteRole = rtcRole === 'mentor' ? 'student' : 'mentor';
    addParticipantItem(list, remoteName || 'Participant', remoteRole, false);
  }
}

function addParticipantItem(container, name, role, isLocal) {
  const item = document.createElement('div');
  item.className = 'participant-item';

  const avatar = document.createElement('div');
  avatar.className = 'participant-avatar';
  avatar.textContent = name.charAt(0).toUpperCase();

  const info = document.createElement('div');
  info.className = 'participant-info';

  const displayName = document.createElement('div');
  displayName.className = 'participant-display-name';
  displayName.textContent = isLocal ? `${name} (You)` : name;

  const roleTag = document.createElement('div');
  roleTag.className = 'participant-role-tag';
  roleTag.textContent = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';

  info.appendChild(displayName);
  info.appendChild(roleTag);
  item.appendChild(avatar);
  item.appendChild(info);
  container.appendChild(item);
}

/* ── Session Timer ─────────────────────────────────── */

function startSessionTimer() {
  sessionStartTime = Date.now();
  const timerEl = document.querySelector('#sessionTimer');
  if (!timerEl) return;

  sessionTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const hrs = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;
    timerEl.textContent = hrs > 0
      ? `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

function stopSessionTimer() {
  if (sessionTimerInterval) {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
  }
}

/* ── Mic / Cam Toggles ─────────────────────────────── */

function toggleMic() {
  if (!isRealMediaActive) {
    toggleRealMedia();
    return;
  }
  const audioTrack = localStream.getAudioTracks()[0];
  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;
    const btn = document.querySelector('#micBtn');
    const icon = btn.querySelector('i');
    const label = btn.querySelector('.ctrl-btn-label');
    icon.innerText = audioTrack.enabled ? 'mic' : 'mic_off';
    if (audioTrack.enabled) {
      btn.classList.remove('muted');
      if (label) label.textContent = 'Mute';
    } else {
      btn.classList.add('muted');
      if (label) label.textContent = 'Unmute';
    }
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
    const btn = document.querySelector('#camBtn');
    const icon = btn.querySelector('i');
    const label = btn.querySelector('.ctrl-btn-label');
    icon.innerText = videoTrack.enabled ? 'videocam' : 'videocam_off';
    if (videoTrack.enabled) {
      btn.classList.remove('muted');
      if (label) label.textContent = 'Stop';
    } else {
      btn.classList.add('muted');
      if (label) label.textContent = 'Start';
    }
  }
}

/* ── Screen Share ──────────────────────────────────── */

async function toggleScreenShare() {
  if (!isScreenSharing) {
    try {
      screenShareStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false
      });

      const screenTrack = screenShareStream.getVideoTracks()[0];
      preScreenShareStream = localStream;

      Object.values(peerConnections).forEach(pcStub => {
        const sender = pcStub.pc.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack).catch(e => console.error(e));
      });

      isScreenSharing = true;
      const btn = document.querySelector('#screenShareBtn');
      btn.classList.add('sharing');
      btn.querySelector('i').innerText = 'cancel_presentation';
      const label = btn.querySelector('.ctrl-btn-label');
      if (label) label.textContent = 'Stop';

      screenTrack.onended = () => stopScreenShare();
    } catch (err) {
      console.log('Screen share cancelled or failed:', err);
    }
  } else {
    stopScreenShare();
  }
}

function stopScreenShare() {
  if (!isScreenSharing) return;

  if (screenShareStream) {
    screenShareStream.getTracks().forEach(t => t.stop());
    screenShareStream = null;
  }

  const restoreStream = preScreenShareStream || localStream;
  const videoTrack = restoreStream.getVideoTracks()[0];

  Object.values(peerConnections).forEach(pcStub => {
    const sender = pcStub.pc.getSenders().find(s => s.track && s.track.kind === 'video');
    if (sender && videoTrack) sender.replaceTrack(videoTrack).catch(e => console.error(e));
  });

  localStream = restoreStream;
  preScreenShareStream = null;
  isScreenSharing = false;

  const btn = document.querySelector('#screenShareBtn');
  btn.classList.remove('sharing');
  btn.querySelector('i').innerText = 'present_to_all';
  const label = btn.querySelector('.ctrl-btn-label');
  if (label) label.textContent = 'Share';
}

/* ── Real Media Toggle (preserved) ─────────────────── */

async function toggleRealMedia() {
  if (isRealMediaActive) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    isRealMediaActive = true;

    const newVideoTrack = stream.getVideoTracks()[0];
    const newAudioTrack = stream.getAudioTracks()[0];

    rawLocalStream = stream;

    if (isBlurEnabled) {
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

    document.querySelector('#micBtn').classList.remove('muted');
    document.querySelector('#camBtn').classList.remove('muted');
    const micLabel = document.querySelector('#micBtn .ctrl-btn-label');
    if (micLabel) micLabel.textContent = 'Mute';
    const camLabel = document.querySelector('#camBtn .ctrl-btn-label');
    if (camLabel) camLabel.textContent = 'Stop';

  } catch (err) {
    console.error('Failed to get user media', err);
    alert('Failed to access camera and microphone.');
  }
}

/* ── Remote Audio / Kick (preserved) ───────────────── */

function toggleRemoteAudio(uid) {
  const videoElement = document.getElementById(`video-${uid}`);
  if (videoElement) {
    videoElement.muted = !videoElement.muted;
    const btn = document.getElementById(`mute-btn-${uid}`);
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) icon.innerText = videoElement.muted ? 'volume_off' : 'volume_up';
      if (videoElement.muted) btn.classList.add('muted');
      else btn.classList.remove('muted');
    }
  }
}

async function kickParticipant(uid) {
  if (confirm('Remove this participant?')) {
    const db = firebase.firestore();
    await db.collection('rooms').doc(roomId).collection('participants').doc(uid).delete();
  }
}

/* ── Room Creation / Joining (signaling preserved) ─── */

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
  document.querySelector('#currentRoom').innerText = roomId;
  console.log('Current room:', roomId);

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

/* ── Signaling Handlers (unchanged) ────────────────── */

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

/* ── Chat (preserved, with name display) ───────────── */

function displayChatMessage(sender, text, isLocal) {
  const messagesDiv = document.querySelector('#chat-messages');
  if (!messagesDiv) return;
  const wrapper = document.createElement('div');
  wrapper.className = `chat-bubble ${isLocal ? 'local' : 'remote'}`;

  if (!isLocal) {
    const nameSpan = document.createElement('span');
    nameSpan.className = 'chat-sender-name';
    const remoteName = rtcRole === 'mentor' ? rtcStudentName : rtcMentorName;
    nameSpan.innerText = remoteName || `User ${sender.substring(0, 4)}`;
    wrapper.appendChild(nameSpan);
  }

  const textNode = document.createTextNode(text);
  wrapper.appendChild(textNode);
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/* ── Peer Connection (unchanged) ───────────────────── */

function createPeerConnection(remoteUid, participantsRef) {
  const pc = new RTCPeerConnection(configuration);

  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });

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

/* ── Video Element Management (redesigned) ─────────── */

function addVideoElement(uid, stream, isLocal) {
  if (isLocal) {
    const pip = document.querySelector('#self-pip');
    const video = document.createElement('video');
    video.id = `video-${uid}`;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.srcObject = stream;
    const label = pip.querySelector('.pip-label');
    pip.insertBefore(video, label);
  } else {
    const container = document.querySelector('#remote-video-container');
    const placeholder = document.querySelector('#remote-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    const video = document.createElement('video');
    video.id = `video-${uid}`;
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = stream;
    container.appendChild(video);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'video-controls';
    controlsDiv.id = `controls-${uid}`;

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
      kickBtn.className = 'control-btn';
      kickBtn.title = 'Remove';
      const kickIcon = document.createElement('i');
      kickIcon.className = 'material-icons';
      kickIcon.innerText = 'person_remove';
      kickBtn.appendChild(kickIcon);
      kickBtn.addEventListener('click', () => kickParticipant(uid));
      controlsDiv.appendChild(kickBtn);
    }

    container.appendChild(controlsDiv);

    const remoteLabel = document.querySelector('#remote-label');
    const remoteName = document.querySelector('#remoteParticipantName');
    if (remoteLabel) remoteLabel.style.display = '';
    if (remoteName) {
      const name = rtcRole === 'mentor' ? rtcStudentName : rtcMentorName;
      remoteName.textContent = name || `User ${uid.substring(0, 4)}`;
    }

    if (activeSidePanel === 'participants') updateParticipantsList();
  }
}

function removeParticipant(remoteUid) {
  if (peerConnections[remoteUid]) {
    peerConnections[remoteUid].pc.close();
    delete peerConnections[remoteUid];
  }

  const video = document.getElementById(`video-${remoteUid}`);
  if (video) video.remove();
  const controls = document.getElementById(`controls-${remoteUid}`);
  if (controls) controls.remove();

  const container = document.querySelector('#remote-video-container');
  if (container && !container.querySelector('video')) {
    const placeholder = document.querySelector('#remote-placeholder');
    if (placeholder) placeholder.style.display = '';
    const remoteLabel = document.querySelector('#remote-label');
    if (remoteLabel) remoteLabel.style.display = 'none';
  }

  if (activeSidePanel === 'participants') updateParticipantsList();
}

/* ── Hang Up (updated for new DOM) ─────────────────── */

async function hangUp(e) {
  stopSessionTimer();
  if (isScreenSharing) stopScreenShare();

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
  tracks.forEach(track => track.stop());

  Object.keys(chatChannels).forEach(uid => {
    if (chatChannels[uid]) chatChannels[uid].close();
    delete chatChannels[uid];
  });

  if (roomId && localUid) {
    const db = firebase.firestore();
    await db.collection('rooms').doc(roomId).collection('participants').doc(localUid).delete();
  }

  const remoteContainer = document.querySelector('#remote-video-container');
  if (remoteContainer) {
    remoteContainer.querySelectorAll('video').forEach(v => v.remove());
    remoteContainer.querySelectorAll('.video-controls').forEach(c => c.remove());
    const placeholder = document.querySelector('#remote-placeholder');
    if (placeholder) placeholder.style.display = '';
  }

  const pip = document.querySelector('#self-pip');
  if (pip) {
    const pipVideo = pip.querySelector('video');
    if (pipVideo) pipVideo.remove();
  }

  const remoteLabel = document.querySelector('#remote-label');
  if (remoteLabel) remoteLabel.style.display = 'none';

  closeSidePanel();

  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#micBtn').disabled = true;
  document.querySelector('#camBtn').disabled = true;
  document.querySelector('#blurBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  const greenRoomBtn = document.querySelector('#greenRoomJoinBtn');
  if (greenRoomBtn) {
    greenRoomBtn.style.display = 'none';
    greenRoomBtn.disabled = false;
  }

  const path = window.location.pathname.slice(1);
  if (path) {
    window.location.replace('/');
  } else {
    document.location.reload(true);
  }
}

/* ── Background Blur (preserved) ───────────────────── */

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
