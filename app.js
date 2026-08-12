(() => {
  const $ = s => document.querySelector(s);
  const toast = (msg) => {
    const el = $("#toast"); if (!el) return;
    el.textContent = msg; el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2600);
  };

  const menuBtn = $("#mobileMenuBtn"), nav = $("#mobileNav");
  menuBtn?.addEventListener("click", () => nav.classList.toggle("open"));
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  let supabaseClient = null;
  if (window.supabase && window.AISMART_CONFIG?.SUPABASE_URL?.startsWith("http")) {
    supabaseClient = window.supabase.createClient(AISMART_CONFIG.SUPABASE_URL, AISMART_CONFIG.SUPABASE_ANON_KEY);
  }

  const fallbackAvatar = (name = "User") =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6246ea&color=fff&bold=true&size=128`;

  async function updateUserUI() {
    let user = null, profile = null;
    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getUser();
      user = data?.user || null;
      if (user) {
        const res = await supabaseClient.from(AISMART_CONFIG.PROFILE_TABLE).select("first_name,avatar_url").eq("id", user.id).maybeSingle();
        profile = res.data || null;
      }
    } else {
      const raw = localStorage.getItem("aism_user");
      user = raw ? JSON.parse(raw) : null;
    }

    const name = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";
    document.querySelectorAll("[data-user-name]").forEach(e => e.textContent = name.split(" ")[0]);

    const headerAuth = $("#headerAuth"), headerAccount = $("#headerAccount");
    if (user) {
      if (headerAuth) { headerAuth.textContent = "My Account"; headerAuth.href = "settings.html"; }
      if (headerAccount) {
        headerAccount.classList.remove("hidden");
        headerAccount.innerHTML = `<img src="${profile?.avatar_url || user?.user_metadata?.avatar_url || fallbackAvatar(name)}" alt="">${name.split(" ")[0]}`;
        headerAccount.href = "settings.html";
      }
    }
  }

  $("#aceFab")?.addEventListener("click", async () => {
    let logged = false;
    if (supabaseClient) logged = !!(await supabaseClient.auth.getUser()).data?.user;
    else logged = !!localStorage.getItem("aism_user");
    if (logged) location.href = "ace.html";
    else { toast("Please sign in to use ACE AI."); setTimeout(() => location.href = "auth.html", 900); }
  });

  updateUserUI();
})();