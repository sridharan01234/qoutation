# Google Authentication Setup Instructions

1. Ensure your Google OAuth credentials are properly configured in the Google Cloud Console:
   - Authorized JavaScript origins should include your development and production URLs
   - Authorized redirect URIs should include:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-production-domain.com/api/auth/callback/google` (for production)

2. Verify your environment variables are properly set in your `.env` file:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000 # or your production URL
NEXTAUTH_SECRET=your_secret_here
```

3. These changes have been implemented in the code:
   - Added proper authorization configuration for Google Provider
   - Included prompt for account selection
   - Added offline access and response type configurations

4. If you're still experiencing issues:
   - Clear your browser cookies and cache
   - Verify network requests in browser developer tools
   - Ensure no CORS issues are present
   - Check if the redirect URI matches exactly with what's configured in Google Cloud Console