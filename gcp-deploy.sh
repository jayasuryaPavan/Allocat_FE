#!/bin/bash

# GCP Frontend Deployment Script for Allocat ERP
# Usage: ./gcp-deploy.sh [project-id] [backend-url]

set -e

PROJECT_ID=${1:-${GOOGLE_CLOUD_PROJECT}}
BACKEND_URL=${2}
BUCKET_NAME="${PROJECT_ID}-allocat-frontend"
REGION="northamerica-northeast1"

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Project ID is required"
    echo "Usage: ./gcp-deploy.sh [project-id] [backend-url]"
    echo "Example: ./gcp-deploy.sh my-project https://allocat-erp-xxxxx.run.app"
    exit 1
fi

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Warning: Backend URL not provided"
    echo "The frontend will need to be configured with the backend URL"
    echo "You can update it later in the environment files"
fi

echo "🚀 Starting frontend deployment to GCP..."
echo "Project ID: $PROJECT_ID"
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"
if [ -n "$BACKEND_URL" ]; then
    echo "Backend URL: $BACKEND_URL"
fi

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📦 Enabling required GCP APIs..."
gcloud services enable \
    storage-component.googleapis.com \
    storage-api.googleapis.com

# Build the frontend
echo "🔨 Building frontend..."
if [ -n "$BACKEND_URL" ]; then
    # Update environment file with backend URL
    echo "Updating environment configuration..."
    # This would need to be done in the build process
    # For now, we'll build and the user can update the environment file manually
fi

npm install
npm run build:prod

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Create bucket if it doesn't exist
echo "🪣 Setting up Cloud Storage bucket..."
if ! gsutil ls -b gs://$BUCKET_NAME &>/dev/null; then
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME
    echo "✅ Bucket created"
else
    echo "✅ Bucket already exists"
fi

# Configure bucket for static website hosting
echo "⚙️  Configuring bucket for static hosting..."
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME

# Set CORS configuration
echo "🌐 Setting CORS configuration..."
cat > /tmp/cors.json << EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF
gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
rm /tmp/cors.json

# Set bucket permissions
echo "🔐 Setting bucket permissions..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Upload files
echo "📤 Uploading files to Cloud Storage..."
gsutil -m rsync -r -d dist/ gs://$BUCKET_NAME/

# Set cache control for static assets
echo "💾 Setting cache control..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/assets/**
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://$BUCKET_NAME/*.html
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://$BUCKET_NAME/*.json

echo ""
echo "✅ Frontend deployment complete!"
echo ""
echo "Static website URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo ""
echo "Next steps:"
echo "1. Set up Cloud CDN (optional but recommended):"
echo "   gcloud compute backend-buckets create allocat-frontend-backend \\"
echo "     --gcs-bucket-name=$BUCKET_NAME"
echo ""
echo "2. Configure custom domain mapping"
echo "3. Update CORS settings in backend to allow your domain"
echo "4. Update frontend environment files with backend URL if not done already"
