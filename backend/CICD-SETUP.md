# GitHub CI/CD Setup - Step by Step Guide

## 🎯 Goal
Set up automatic deployments: Push to GitHub `main` → Cloud Build → Deploy to Cloud Run

## 📋 Prerequisites
- ✅ GitHub repository: https://github.com/v9102/MentorHub
- ✅ Cloud Build enabled
- ✅ Working `cloudbuild.yaml` in `backend/` folder

---

## Step 1: Connect GitHub to Google Cloud Build

### Option A: Via GCP Console (Easiest - RECOMMENDED)

 1. **Open Cloud Build Triggers page:**
    - Go to: https://console.cloud.google.com/cloud-build/triggers?project=mentorhub-hosting
    
2. **Click "CONNECT REPOSITORY"** (top of page)

3. **Select source:** Choose "GitHub (Cloud Build GitHub App)"

4. **Authenticate:** Click "Continue" and sign in to your GitHub account

5. **Select repository:**
   - Organization/Username: `v9102`
   - Repository: `MentorHub`
   - Check "I understand..."
   - Click "Connect"

6. **Create a trigger (in same flow):**
   - Click "CREATE TRIGGER"

---

## Step 2: Configure the Trigger

Fill in these details:

### Basic Information
- **Name:** `deploy-backend-on-push`
- **Description:** `Auto-deploy backend to Cloud Run on push to main`
- **Region:** `asia-south1`

### Event
- **Event:** ✅ Push to a branch

### Source
- **Repository:** `v9102/MentorHub` (should be pre-selected)
- **Branch:** `^main$` (regex pattern)

### Configuration
- **Type:** ✅ Cloud Build configuration file (yaml or json)
- **Location:** `backend/cloudbuild.yaml`

### Advanced (Optional - Recommended)
Click "SHOW INCLUDED AND IGNORED FILE FILTERS"
- **Included files filter (glob):** `backend/**`
  - This ensures trigger only runs when backend code changes
  - Won't trigger on frontend/docs changes

### Substitution variables
Add these (click "+ ADD VARIABLE"):
- `_REGION` = `asia-south1`
- `_SERVICE_NAME` = `mentorhub-backend`

### Service account
- Leave as default: `Cloud Build Service Account`

Click **"CREATE"**

---

## Step 3: Verify Trigger Setup

### Check via Console
1. Go to: https://console.cloud.google.com/cloud-build/triggers?project=mentorhub-hosting
2. You should see: `deploy-backend-on-push` with status "Enabled"

### Check via CLI
```powershell
# List all triggers
gcloud builds triggers list --project=mentorhub-hosting

# Describe your trigger
gcloud builds triggers describe deploy-backend-on-push --project=mentorhub-hosting
```

---

## Step 4: Test the Pipeline

### Method 1: Manual Trigger (Safest First Test)

**Via Console:**
1. Go to triggers page
2. Click ⋮ (three dots) next to `deploy-backend-on-push`
3. Click "Run trigger"
4. Select branch: `main`
5. Click "Run trigger"

**Via CLI:**
```powershell
gcloud builds triggers run deploy-backend-on-push --branch=main --project=mentorhub-hosting
```

### Method 2: Automatic Trigger (Real Test)

Make a small change and push:

```powershell
cd c:\Users\rajra\Desktop\unstop\mentorhub2

# Make a small change (add comment to any backend file)
# For example, add a comment to backend/server.js

git add backend/
git commit -m "test: verify CI/CD pipeline"
git push origin main
```

### Monitor the Build

**Via Console:**
- Go to: https://console.cloud.google.com/cloud-build/builds?project=mentorhub-hosting
- Watch the build progress in real-time

**Via CLI:**
```powershell
# Watch logs in real-time
gcloud builds log --stream $(gcloud builds list --limit=1 --format="value(id)" --project=mentorhub-hosting) --project=mentorhub-hosting
```

---

## Step 5: Verify Deployment

After build completes successfully:

```powershell
# Check latest revision
gcloud run revisions list --service mentorhub-backend --region asia-south1 --project mentorhub-hosting --limit 1

# Test API
curl https://mentorhub-backend-5gk6jbun2q-el.a.run.app/api/mentors
```

---

## 🎉 Success Indicators

✅ **Trigger created** - Visible in Cloud Build Triggers
✅ **Build triggered automatically on push** - Builds appear in history
✅ **Build succeeds** - Status shows "SUCCESS"
✅ **New revision deployed** - Cloud Run shows new revision
✅ **API responds** - Endpoint returns data

---

## 🔧 Troubleshooting

### Trigger doesn't fire on push
**Check:**
- Branch name is exactly `main` (not `master`)
- You pushed to the correct repository
- File filter includes the files you changed

### Build fails
**Check:**
- Build logs in Cloud Console
- Ensure `backend/cloudbuild.yaml` is correct
- Verify secrets still exist and are accessible

### Deployment fails
**Check:**
- Cloud Run service exists
- Service account has permissions
- Secrets are properly configured

---

## 📚 What Happens When You Push

```
┌─────────────────────┐
│  You: git push      │
│  to GitHub main     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Cloud Build        │
│  detects push       │
│  (within seconds)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Runs cloudbuild    │
│  .yaml:             │
│  1. Build Docker    │
│  2. Push to Artifact│
│  3. Deploy to Run   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Backend updated!   │
│  New revision live  │
└─────────────────────┘
```

**Total time:** ~2-5 minutes from push to deployment

---

## 🔐 Security Best Practices

### 1. Branch Protection (Recommended)
On GitHub, protect your `main` branch:
1. Go to: https://github.com/v9102/MentorHub/settings/branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Include administrators

### 2. Secrets Management
- ✅ All secrets in Google Secret Manager (not in code)
- ✅ Never commit `.env` files
- ✅ Use `.gitignore` to exclude sensitive files

---

## 🎯 Next Steps

1. ✅ Set up trigger (follow steps above)
2. ✅ Test with manual trigger
3. ✅ Test with real push
4. 📝 Update team documentation
5. 🎨 (Optional) Add build status badge to README:
   ```markdown
   ![Build Status](https://storage.googleapis.com/mentorhub-hosting_cloudbuild/status.svg)
   ```

---

## 💡 Pro Tips

### Only deploy backend changes
The file filter `backend/**` you added ensures frontend changes won't trigger backend deployments. Smart!

### Monitor build notifications
Set up Slack/email notifications for build failures:
1. Cloud Build → Settings
2. Enable "Cloud Build Pub/Sub notifications"
3. Configure your notification channel

### Staging environment
Later, create a second trigger for `develop` branch → `mentorhub-backend-staging` service for testing before production.

---

Need help with any step? Just ask!
