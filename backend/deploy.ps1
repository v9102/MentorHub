# Deploy MentorHub Backend to Cloud Run
# This script provides step-by-step deployment commands

Write-Host "MentorHub Backend Deployment to Cloud Run" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "mentorhub-hosting"
$SERVICE_NAME = "mentorhub-backend"
$REGION = "asia-south1"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Service: $SERVICE_NAME" -ForegroundColor Yellow  
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host ""

# Step 1: Verify secrets exist
Write-Host "[Step 1] Verifying secrets in Secret Manager..." -ForegroundColor Green
gcloud secrets list --project=$PROJECT_ID --filter="name:MONGO_URI OR name:clerk-secret-key OR name:jwt-secret"

Write-Host ""
Write-Host "[Step 2] Building and deploying..." -ForegroundColor Green
Write-Host "Running: gcloud builds submit..."

gcloud builds submit `
  --tag="$REGION-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/${SERVICE_NAME}:latest" `
  --project=$PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[Step 3] Deploying to Cloud Run..." -ForegroundColor Green
    
    gcloud run deploy $SERVICE_NAME `
      --image="$REGION-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/${SERVICE_NAME}:latest" `
      --region=$REGION `
      --platform=managed `
      --allow-unauthenticated `
      --set-env-vars=NODE_ENV=production `
      --set-secrets=MONGO_URI=MONGO_URI:latest,CLERK_SECRET_KEY=clerk-secret-key:latest,JWT_SECRET=jwt-secret:latest `
      --cpu=1 `
      --memory=512Mi `
      --min-instances=0 `
      --max-instances=10 `
      --port=8080 `
      --project=$PROJECT_ID
      
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Getting service URL..." -ForegroundColor Cyan
        gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format="value(status.url)"
    }
} else {
    Write-Host "Build failed. Checking recent build logs..." -ForegroundColor Red
    gcloud builds list --limit=1 --project=$PROJECT_ID
}
