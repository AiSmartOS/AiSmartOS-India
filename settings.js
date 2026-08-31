(() => {
  const cfg = window.AISMART_CONFIG || {};
  const ready =
    cfg.SUPABASE_URL?.startsWith("http") &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_ANON_KEY.includes("PASTE_");

  // Re-use existing initialized client instance or create a new one
  const sb =
    window.supabaseClient ||
    window.aiSmartOSSupabase ||
    (ready && window.supabase
      ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
      : null);

  const $ = (id) => document.getElementById(id);
  const fallback = (n) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      n || "User"
    )}&background=6246ea&color=fff&bold=true&size=256`;

  let user = null;
  let avatarUrl = null;

  // Load and populate user settings data
  async function load() {
    if (sb) {
      // 1. Await session retrieval from browser storage to avoid instant redirects
      const {
        data: { session },
        error,
      } = await sb.auth.getSession();

      if (!session || error) {
        return location.replace("auth.html");
      }

      user = session.user;

      // 2. Query user metadata from Supabase database
      const { data } = await sb
        .from(cfg.PROFILE_TABLE || "profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

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
      // Fallback for local storage session tracking
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

  // Handle local avatar file preview
  const editAvatarEl = $("editAvatar");
  if (editAvatarEl) {
    editAvatarEl.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && $("profileAvatar")) {
        $("profileAvatar").src = URL.createObjectURL(file);
      }
    });
  }

  // Handle saving profile changes
  const saveBtn = $("saveProfile");
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const nameEl = $("editName");
      const msgEl = $("settingsMessage");

      const name = nameEl ? nameEl.value.trim() : "";
      if (!name) {
        if (msgEl) msgEl.textContent = "First name is required.";
        return;
      }

      const file = editAvatarEl?.files[0];

      try {
        if (sb) {
          // Upload new image if selected
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

          // Update profile row in database
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

  // Handle user logout
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

  // Execute initialization after DOM contents load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
