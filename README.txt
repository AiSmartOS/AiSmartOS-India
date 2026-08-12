AiSmartOS website package
=========================

Files:
- index.html      Main landing page
- auth.html       Sign in / Create account + Google/Facebook/GitHub/Discord
- settings.html   My Account + profile picture + first name + sign out
- ace.html        Protected ACE AI page
- style.css       Full responsive design
- app.js          Home page auth state, drawer/mobile behavior, ACE gate
- auth.js         Email/password auth, OAuth, password strength, profile creation
- settings.js     Profile editing
- config.js       Supabase URL/key configuration
- setup.sql       Database table/RLS starter SQL

IMPORTANT:
1. The UI works immediately with a localStorage demo account if Supabase is not configured.
2. For real accounts and social login, configure Supabase in config.js.
3. Run setup.sql in Supabase SQL Editor.
4. Create a PUBLIC Storage bucket called "avatars".
5. Enable Google, Facebook, GitHub and Discord under Supabase Authentication > Providers.
6. Add your GitHub Pages site and auth.html callback URL to Supabase Authentication > URL Configuration.
7. Never put a Supabase service_role key in these files. Use only the anon/publishable key.
8. For downloadable files you add later, use the same auth check before starting the download. Do not rely on hiding a download button alone for private files.
