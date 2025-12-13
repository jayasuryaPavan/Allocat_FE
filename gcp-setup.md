# Frontend GCP Deployment Guide

This guide walks you through deploying the Allocat ERP Vue.js frontend to Google Cloud Storage and Cloud CDN.

## Prerequisites

1. **Backend deployed** and running (get the Cloud Run URL)
2. **gcloud CLI** installed and configured
3. **Node.js 18+** and npm installed
4. **Domain** configured (from Porkbun)

## Step 1: Update Environment Configuration

Before building, update the production environment file with your backend URL:

**File**: `src/environments/environment.prod.ts` or `src/environments/production.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.run.app', // Your Cloud Run backend URL
  // ... other config
};
```

## Step 2: Build the Frontend

```bash
cd Frontend
npm install
npm run build:prod
```

This creates a `dist/` directory with optimized static files.

## Step 3: Deploy to Cloud Storage

### Option A: Using Deployment Script (Recommended)

```bash
chmod +x gcp-deploy.sh
./gcp-deploy.sh YOUR_PROJECT_ID https://your-backend-url.run.app
```

### Option B: Manual Deployment

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Create bucket
gsutil mb -p YOUR_PROJECT_ID -c STANDARD -l northamerica-northeast1 \
  gs://YOUR_PROJECT_ID-allocat-frontend

# Configure for static hosting
gsutil web set -m index.html -e index.html \
  gs://YOUR_PROJECT_ID-allocat-frontend

# Set CORS
cat > cors.json << EOF
[
  {
    "origin": ["https://yourdomain.com", "https://www.yourdomain.com"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
EOF
gsutil cors set cors.json gs://YOUR_PROJECT_ID-allocat-frontend

# Upload files
gsutil -m rsync -r -d dist/ gs://YOUR_PROJECT_ID-allocat-frontend/

# Make bucket public
gsutil iam ch allUsers:objectViewer \
  gs://YOUR_PROJECT_ID-allocat-frontend
```

## Step 4: Set Up Cloud CDN (Recommended)

Cloud CDN provides:
- Global content delivery
- HTTPS
- Better performance
- Lower latency

```bash
# Create backend bucket
gcloud compute backend-buckets create allocat-frontend-backend \
  --gcs-bucket-name=YOUR_PROJECT_ID-allocat-frontend

# Create URL map
gcloud compute url-maps create allocat-frontend-map \
  --default-backend-bucket=allocat-frontend-backend

# Create HTTPS proxy
gcloud compute target-https-proxies create allocat-frontend-https-proxy \
  --url-map=allocat-frontend-map \
  --ssl-certificates=YOUR_SSL_CERT_NAME

# Create forwarding rule (global)
gcloud compute forwarding-rules create allocat-frontend-https-rule \
  --global \
  --target-https-proxy=allocat-frontend-https-proxy \
  --ports=443
```

## Step 5: Map Custom Domain

### Get the IP Address

```bash
gcloud compute forwarding-rules describe allocat-frontend-https-rule \
  --global \
  --format="value(IPAddress)"
```

### Configure DNS in Porkbun

1. Log into Porkbun
2. Go to DNS settings for your domain
3. Add an **A record**:
   - **Host**: `@` (or `www` for www subdomain)
   - **Answer**: The IP address from above
   - **TTL**: 300

### Alternative: Use Firebase Hosting (Simpler)

Firebase Hosting is easier to set up and includes:
- Free SSL certificates
- Global CDN
- Custom domain support
- Simple deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (in Frontend directory)
firebase init hosting

# Deploy
npm run build:prod
firebase deploy --only hosting
```

## Step 6: Update Backend CORS

Update your backend `application-prod.properties`:

```properties
spring.web.cors.allowed-origins=https://yourdomain.com,https://www.yourdomain.com
```

Redeploy the backend if needed.

## Step 7: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check browser console for errors
3. Test API connectivity
4. Verify authentication flow

## Cost Estimation

- **Cloud Storage**: ~$0.026/GB/month (very cheap for static files)
- **Cloud CDN**: ~$0.08/GB egress (first 10TB free per month)
- **Firebase Hosting**: Free tier includes 10 GB storage, 360 MB/day transfer

**Total**: ~$1-5 USD/month for typical usage

## Troubleshooting

### CORS Errors

- Check backend CORS configuration
- Verify allowed origins match your domain exactly
- Check browser console for specific error

### 404 Errors on Routes

- Ensure `index.html` is served for all routes (SPA routing)
- Configure error page in bucket settings
- For Cloud CDN, ensure URL map handles all paths

### API Connection Issues

- Verify backend URL in environment files
- Check backend is accessible
- Verify CORS settings

### Update Deployment

After code changes:

```bash
npm run build:prod
./gcp-deploy.sh YOUR_PROJECT_ID
```

Or with Firebase:

```bash
npm run build:prod
firebase deploy --only hosting
```

## Next Steps

- [ ] Set up CI/CD for automatic deployments
- [ ] Configure monitoring and error tracking
- [ ] Set up staging environment
- [ ] Optimize bundle size and performance
- [ ] Configure service worker for offline support (PWA)
