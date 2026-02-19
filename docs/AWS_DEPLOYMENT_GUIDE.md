# Production Environment Variables for AWS

When deploying to AWS, create an `.env.production` file or set these variables in the AWS App Runner / ECS environment configuration. **Do not commit sensitive values to version control.**

### 1. Core Web Configuration

- `NEXT_PUBLIC_BASE_URL`: The full URL of your AWS deployment (e.g., `https://your-app-name.awsapprunner.com`).
- `MONGODB_URI`: Your production MongoDB connection string (e.g., MongoDB Atlas).
- `IRON_SESSION_PASSWORD`: A random string of at least 32 characters for session encryption.
- `SESSION_SECRET`: A secret key for additional signing.

### 2. PhonePe Payment Gateway (Production)

- `PHONEPE_CLIENT_ID`: Your production PhonePe Client ID.
- `PHONEPE_CLIENT_SECRET`: Your production PhonePe Client Secret.
- `PHONEPE_CLIENT_VERSION`: `1` (unless instructed otherwise by PhonePe).
- `PHONEPE_ENV`: `PRODUCTION`

### 3. Google OAuth

- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
- `GOOGLE_CALLBACK_URL`: `${NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`

### 4. Cloudinary

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

### 5. Web Push (VAPID)

- `VAPID_PUBLIC_KEY`: Your VAPID public key.
- `VAPID_PRIVATE_KEY`: Your VAPID private key.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Same as `VAPID_PUBLIC_KEY`.
