/*
  AiSmartOS configuration
  1) Create a Supabase project.
  2) Put your Project URL and anon/publishable key below.
  3) In Supabase Auth > URL Configuration, add your GitHub Pages URL
     and https://YOUR-USERNAME.github.io/YOUR-REPO/auth.html
  4) Enable Google/Facebook/GitHub/Discord providers and configure their OAuth credentials.
*/
window.AISMART_CONFIG = {
  SUPABASE_URL: "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE",
  SUPABASE_ANON_KEY: "PASTE_YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE",
  PROFILE_TABLE: "profiles",
  AVATAR_BUCKET: "avatars"
};
