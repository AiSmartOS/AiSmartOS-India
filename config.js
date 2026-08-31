window.AISMART_CONFIG = {
  SUPABASE_URL: "https://mxkzwbgtvaccfwlaovhr.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a3p3Ymd0dmFjY2Z3bGFvdmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MzQzMDIsImV4cCI6MjEwMjAxMDMwMn0.E-Np1VjKI7aTQHswNF0escwyDxH6TmVbkeNByvO9694"

​

", // Replace with your complete JWT anon key
  PROFILE_TABLE: "profiles",
  AVATAR_BUCKET: "avatars"
};

// Initialize the Supabase Client Instance
if (typeof supabase !== 'undefined' && supabase.createClient) {
    const client = supabase.createClient(
        window.AISMART_CONFIG.SUPABASE_URL,
        window.AISMART_CONFIG.SUPABASE_ANON_KEY
    );

    // Assign to multiple global window variables to match any key name expected by auth.js
    window.aiSmartOSSupabase = client;
    window.supabaseClient = client;
    window.supabaseInstance = client;
} else {
    console.error("Supabase CDN library is missing or failed to load. Check script order in auth.html.");
}
