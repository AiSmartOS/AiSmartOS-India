(() => {
  const cfg=window.AISMART_CONFIG||{};
  const ready=cfg.SUPABASE_URL?.startsWith("http")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("PASTE_");
  const sb=ready&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
  const $=id=>document.getElementById(id);
  const fallback=n=>`https://ui-avatars.com/api/?name=${encodeURIComponent(n||"User")}&background=6246ea&color=fff&bold=true&size=256`;
  let user=null, avatarUrl=null;

  async function load(){
    if(sb){
      user=(await sb.auth.getUser()).data.user;
      if(!user) return location.href="auth.html";
      const {data}=await sb.from(cfg.PROFILE_TABLE).select("*").eq("id",user.id).maybeSingle();
      $("editName").value=data?.first_name||user.user_metadata?.first_name||user.email.split("@")[0];
      $("profileName").textContent=$("editName").value;
      $("profileEmail").textContent=user.email;
      avatarUrl=data?.avatar_url||user.user_metadata?.avatar_url||fallback($("editName").value);
      $("profileAvatar").src=avatarUrl;
    }else{
      const raw=localStorage.getItem("aism_user"); if(!raw)return location.href="auth.html";
      user=JSON.parse(raw); $("editName").value=user.first_name; $("profileName").textContent=user.first_name;
      $("profileEmail").textContent=user.email; avatarUrl=user.avatar_url||fallback(user.first_name); $("profileAvatar").src=avatarUrl;
    }
  }
  $("editAvatar").addEventListener("change",e=>{const f=e.target.files[0];if(f)$("profileAvatar").src=URL.createObjectURL(f)});
  $("saveProfile").onclick=async()=>{
    const name=$("editName").value.trim(); if(!name)return $("settingsMessage").textContent="First name is required.";
    const file=$("editAvatar").files[0];
    try{
      if(sb){
        if(file){
          const ext=(file.name.split(".").pop()||"png").toLowerCase(), path=`${user.id}/${Date.now()}.${ext}`;
          const up=await sb.storage.from(cfg.AVATAR_BUCKET).upload(path,file,{upsert:true,contentType:file.type});
          if(up.error)throw up.error;
          avatarUrl=sb.storage.from(cfg.AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
        }
        const {error}=await sb.from(cfg.PROFILE_TABLE).upsert({id:user.id,first_name:name,avatar_url:avatarUrl});
        if(error)throw error;
      }else{
        user.first_name=name; if(file) user.avatar_url=$("profileAvatar").src;
        localStorage.setItem("aism_user",JSON.stringify(user));
      }
      $("profileName").textContent=name; $("settingsMessage").textContent="Profile updated successfully.";
    }catch(e){$("settingsMessage").textContent=e.message||"Could not save profile."}
  };
  $("logoutBtn").onclick=async()=>{
    if(sb) await sb.auth.signOut(); else localStorage.removeItem("aism_user");
    location.href="index.html";
  };
  load();
})();