(() => {
  const cfg = window.AISMART_CONFIG || {};

  // 1. MUST use the pre-initialized client from config.js
  const sb =
    window.supabaseClient ||
    window.aiSmartOSSupabase ||
    (typeof supabase !== "undefined" && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY
      ? supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
      : null);

  const $ = (id) => document.getElementById(id);
  const fallback = (n) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      n || "User"
    )}&background=6246ea&color=fff&bold=true&size=256`;

  let user = null;
  let avatarUrl = null;

  async function load() {
    if (sb) {
      // Get current active session safely
      const { data: { session }, error } = await sb.auth.getSession();

      if (error || !session) {
        return location.replace("auth.html");
      }

      user = session.user;

      // Fetch profile from database
      const { data, error: dbError } = await sb
        .from(cfg.PROFILE_TABLE || "profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (dbError) {
        console.warn("Could not fetch profile table:", dbError.message);
      }

      const firstName =
        data?.first_name ||
        user.user_metadata?.first_name ||
        user.email.split("@")[0];

      if ($("editName")) $("editName").value = firstName;
      if ($("profileName")) $("profileName").textContent = firstName;
      if ($("profileEmail")) $("profileEmail").textContent = user.email;

      avatarUrl =
        data?.avatar_url ||
        user.user_metadata?.avatar_url ||
        fallback(firstName);

      if ($("profileAvatar")) $("profileAvatar").src = avatarUrl;
    } else {
      const raw = localStorage.getItem("aism_user");
      if (!raw) return location.replace("auth.html");

      user = JSON.parse(raw);
      if ($("editName")) $("editName").value = user.first_name || "";
      if ($("profileName")) $("profileName").textContent = user.first_name || "User";
      if ($("profileEmail")) $("profileEmail").textContent = user.email || "";

      avatarUrl = user.avatar_url || fallback(user.first_name);
      if ($("profileAvatar")) $("profileAvatar").src = avatarUrl;
    }
  }

  // Handle local avatar preview
  const editAvatarEl = $("editAvatar");
  if (editAvatarEl) {
    editAvatarEl.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && $("profileAvatar")) {
        $("profileAvatar").src = URL.createObjectURL(file);
      }
    });
  }

  // Save changes
  const saveBtn = $("saveProfile");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const nameEl = $("editName");
      const msgEl = $("settingsMessage");

      if (msgEl) msgEl.textContent = ""; // Clear previous message

      const name = nameEl ? nameEl.value.trim() : "";
      if (!name) {
        if (msgEl) msgEl.textContent = "First name is required.";
        return;
      }

      const file = editAvatarEl?.files[0];

      try {
        if (sb) {
          // Upload avatar image if selected
          if (file) {
            const ext = (file.name.split(".").pop() || "png").toLowerCase();
            const path = `${user.id}/${Date.now()}.${ext}`;
            const bucketName = cfg.AVATAR_BUCKET || "avatars";

            const up = await sb.storage
              .from(bucketName)
              .upload(path, file, { upsert: true, contentType: file.type });

            if (up.error) throw up.error;

            avatarUrl = sb.storage
              .from(bucketName)
              .getPublicUrl(path).data.publicUrl;
          }

          // Update database table
          const { error } = await sb
            .from(cfg.PROFILE_TABLE || "profiles")
            .upsert({ id: user.id, first_name: name, avatar_url: avatarUrl });

          if (error) throw error;
        } else {
          user.first_name = name;
          if (file && $("profileAvatar")) {
            user.avatar_url = $("profileAvatar").src;
          }
          localStorage.setItem("aism_user", JSON.stringify(user));
        }

        if ($("profileName")) $("profileName").textContent = name;
        if (msgEl) msgEl.textContent = "Profile updated successfully.";
      } catch (err) {
        if (msgEl) msgEl.textContent = err.message || "Could not save profile.";
      }
    };
  }

  // Handle logout
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      if (sb) {
        await sb.auth.signOut();
      } else {
        localStorage.removeItem("aism_user");
      }
      location.replace("index.html");
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
