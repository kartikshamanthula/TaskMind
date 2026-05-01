# Deployment Guide 🚀

Follow these steps to take your **Regular Task Manager** live on Vercel.

## 1. Initialize Git & Push to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create a repo on GitHub.com and follow their instructions to push:
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. In the **"Environment Variables"** section, add the following keys from your `.env.local`:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `RESEND_API_KEY`
5. Click **"Deploy"**.

## 3. Post-Deployment Checklist

- **MongoDB Whitelisting**: Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) or configure Vercel's IP range if needed. (For Atlas, `0.0.0.0/0` is usually required for Vercel functions).
- **Verify Routes**: Navigate to your new `.vercel.app` URL and test the login, task board, and daily tasks.
- **Check OCR**: Test the bill scanning feature to ensure the AI integration is working in production.

## Why Vercel?
Vercel is the creator of Next.js and provides the best experience for deploying Next.js apps with zero configuration, automatic SSL, and global edge distribution.
