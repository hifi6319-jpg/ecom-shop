# Deployment Guide

## 1. Supabase Setup
1.  **Create Project**: Go to [Supabase](https://supabase.com) and create a new project.
2.  **SQL Setup**:
    - Go to the **SQL Editor** in Supabase.
    - Copy the content of `supabase/schema.sql`.
    - Paste and Run.
3.  **Storage Setup**:
    - Go to **Storage**.
    - Create a new bucket named `products`.
    - Make sure it is **Public**.
4.  **Keys**:
    - Go to **Project Settings > API**.
    - Copy `Project URL` and `anon` public key.

## 2. Environment Variables
Create a `.env` file in the root directory (local) or set these in your deployment provider (Vercel).
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Vercel Deployment
1.  Push this code to GitHub/GitLab.
2.  Import the repository in [Vercel](https://vercel.com).
3.  In "Environment Variables", add the two variables above.
4.  Click **Deploy**.

## 4. Admin Access
1.  Sign up a new user via the app (Login page).
2.  Go to Supabase **Table Editor > profiles**.
3.  Find your user and change the `role` from `user` to `admin`.
4.  Refresh the app, you will see the Admin link.
