# Deployment Troubleshooting Guide

## Current Status
All Cloud Build deployment attempts are failing. The builds are failing but we haven't been able to see the detailed error message yet.

## To View the Actual Error

### Option 1: GCP Console (RECOMMENDED)
1. Open your browser and go to: https://console.cloud.google.com/cloud-build/builds?project=mentorhub-hosting
2. Click on the most recent failed build
3. Look at the "Build log" tab to see the exact error
4. Take a screenshot or copy the error message

### Option 2: Command Line (if you want to try)
```powershell
# Get the latest build ID
$BUILD_ID = gcloud builds list --limit=1 --format="value(id)" --project mentorhub-hosting

# View the logs
gcloud logging read "resource.type=build AND resource.labels.build_id=$BUILD_ID" --limit=50 --project=mentorhub-hosting --format=json
```

## Common Issues and Solutions

### Issue 1: Permissions
**Error**: "Permission denied" or "Access denied"
**Solution**: Enable the Cloud Build service account to access Secret Manager
```powershell
gcloud projects add-iam-policy-binding mentorhub-hosting \
    --member="serviceAccount:979734095552@cloudbuild.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Issue 2: Secret Names Mismatch
**Error**: "Secret not found"
**Solution**: Verify secret names match exactly
```powershell
gcloud secrets list --project mentorhub-hosting
```

### Issue 3: Dockerfile Syntax
**Error**: Docker build errors
**Solution**: Test Docker build locally (requires Docker Desktop)
```powershell
docker build -t test-image .
```

### Issue 4: Node.js Version or Dependencies
**Error**: npm install fails
**Solution**: Check package.json and ensure all dependencies are valid

## Alternative Deployment Methods

### Method A: Deploy without Dockerfile (Buildpacks)
Remove or rename the Dockerfile temporarily and let Google use buildpacks:
```powershell
# Rename Dockerfile
Move-Item Dockerfile Dockerfile.backup

# Deploy with buildpacks
gcloud run deploy mentorhub-backend `
  --source=. `
  --region=asia-south1 `
  --project=mentorhub-hosting
```

### Method B: Use Pre-built Image from Another Registry
If you have the image elsewhere (like Docker Hub):
```powershell
gcloud run deploy mentorhub-backend `
  --image=your-dockerhub-username/mentorhub-backend `
  --region=asia-south1 `
  --project=mentorhub-hosting
```

## Next Steps
1. View the build logs in GCP Console (Option 1 above)
2. Share the error message
3. We'll fix the specific issue causing the failure
