

## Exact Changes for Deploying to Vercel with poolabs.in

### 1. Add `vercel.json` to project root
This file ensures SPA routing works (so `/mvstr-admin-x9k2` and other routes don't 404 on refresh):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 2. Set Environment Variables in Vercel Dashboard
After importing your GitHub repo into Vercel, go to **Settings → Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://ilbyqryqnxjakuoisbbf.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your anon key (the long `eyJ...` string) |
| `VITE_SUPABASE_PROJECT_ID` | `ilbyqryqnxjakuoisbbf` |

### 3. Update Auth Redirect URLs
You need to add your new domain to the allowed redirect URLs in the backend auth configuration so login, signup, and password reset work. I will use the auth configuration tool to add:
- `https://poolabs.in/**`
- `https://www.poolabs.in/**`

### 4. Connect Domain in Vercel
In Vercel **Settings → Domains**, add `poolabs.in` and `www.poolabs.in`, then update your DNS records at your domain registrar to point to Vercel's servers.

### 5. Update Password Reset Redirect
In `src/pages/SignIn.tsx`, the reset password redirect uses `window.location.origin` which will automatically resolve to `poolabs.in` once deployed — no code change needed.

### Implementation
- Create `vercel.json` file
- Configure auth redirect URLs for your new domain

Everything else (admin panel, gallery, payments, auth) works as-is since the backend is independent of the frontend host.

