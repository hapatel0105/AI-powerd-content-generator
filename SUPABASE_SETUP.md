# Supabase Setup Guide for AI Content Generator

This guide will walk you through setting up Supabase for your AI-powered content generator project.

## 🚀 Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In" if you already have an account
3. Click "New Project"
4. Choose your organization
5. Fill in the project details:
   - **Name**: `ai-content-generator` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## 🔑 Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`)

## 📝 Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ Important**: Never commit your `.env.local` file to version control!

## 🗄️ Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase-schema.sql` from your project
4. Click **Run** to execute the SQL

This will create:
- `users` table with credits system
- `content` table for storing generated content
- Row Level Security (RLS) policies
- Automatic triggers for user creation
- Proper indexes for performance

## 🔐 Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Click **Save**

## 📧 Step 6: Configure Email Settings (Optional)

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your email provider (Gmail, SendGrid, etc.)
3. Test the email configuration

## 🚀 Step 7: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Try to register a new account

4. Check your Supabase dashboard under **Authentication** → **Users** to see if the user was created

5. Check **Table Editor** → **users** to see if the user profile was created

## 🔍 Step 8: Verify Database Tables

1. Go to **Table Editor** in your Supabase dashboard
2. You should see:
   - `users` table
   - `content` table
3. Click on each table to verify the structure and data

## 🛡️ Step 9: Test Row Level Security

1. Create a test user account
2. Generate some content
3. Try to access content from different accounts to verify RLS is working

## 📊 Step 10: Monitor Your App

1. Go to **Logs** to see authentication and database activity
2. Use **Database** → **Logs** to monitor SQL queries
3. Check **Authentication** → **Users** for user management

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Verify your environment variables are correct
   - Make sure you're using the right keys (anon vs service role)

2. **"Table doesn't exist" error**
   - Run the SQL schema again
   - Check if the tables were created in **Table Editor**

3. **Authentication not working**
   - Verify your redirect URLs are correct
   - Check the browser console for errors
   - Verify your environment variables are loaded

4. **RLS policies not working**
   - Check if RLS is enabled on your tables
   - Verify the policies are correctly applied
   - Test with different user accounts

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🔄 Next Steps

After setting up Supabase:

1. **Update your components** to use the new Supabase client
2. **Test the authentication flow** end-to-end
3. **Verify content generation** works with the new database
4. **Deploy your application** with the new Supabase configuration

## 🎉 You're All Set!

Your AI content generator is now powered by Supabase! You have:
- ✅ Secure user authentication
- ✅ PostgreSQL database with RLS
- ✅ Real-time capabilities
- ✅ Built-in user management
- ✅ Scalable infrastructure

Happy coding! 🚀
