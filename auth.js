/* =========================================================
   AiSmartOS - Authentication
   Email + Password + OAuth
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupPasswordStrength();
    setupAuthForms();
    setupOAuthButtons();
    handleExistingSession();
});


/* =========================================================
   SUPABASE CHECK & FALLBACK
   ========================================================= */

function getSupabase() {
    // Check custom global object or default supabase instance
    if (window.aiSmartOSSupabase) {
        return window.aiSmartOSSupabase;
    }
    
    if (typeof supabase !== 'undefined' && supabase.auth) {
        return supabase;
    }

    console.error("Supabase is not initialized. Check config.js and script tags.");
    return null;
}


/* =========================================================
   ELEMENT HELPERS & MESSAGES
   ========================================================= */

function get(id) {
    return document.getElementById(id);
}

function showMessage(message, type = "error") {
    const messageBox = get("auth-message");

    if (!messageBox) {
        alert(message);
        return;
    }

    messageBox.textContent = message;
    messageBox.className = "auth-message " + type;
    messageBox.style.display = "block";
}

function setLoading(button, loading) {
    if (!button) return;

    if (loading) {
        button.dataset.originalText = button.textContent;
        button.textContent = "Please wait...";
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || "Continue";
        button.disabled = false;
    }
}


/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

function setupPasswordStrength() {
    const password = get("signup-password") || get("password");
    const indicator = get("password-strength");
    const label = get("password-strength-label");

    if (!password) return;

    password.addEventListener("input", () => {
        const value = password.value;

        if (!value) {
            if (indicator) indicator.style.width = "0";
            if (label) {
                label.textContent = "";
                label.className = "";
            }
            return;
        }

        let score = 0;
        if (value.length >= 8) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        let strength = "Basic";
        let className = "basic";
        let width = "33%";

        if (score >= 4) {
            strength = "Strong";
            className = "strong";
            width = "100%";
        } else if (score >= 3) {
            strength = "Normal";
            className = "normal";
            width = "66%";
        }

        if (indicator) {
            indicator.style.width = width;
            indicator.className = "password-strength-bar " + className;
        }

        if (label) {
            label.textContent = strength;
            label.className = className;
        }
    });
}


/* =========================================================
   AUTH FORMS SETUP
   ========================================================= */

function setupAuthForms() {
    const signInForm = get("signin-form");
    const signUpForm = get("signup-form");

    if (signInForm) {
        signInForm.addEventListener("submit", handleSignIn);
    }

    if (signUpForm) {
        signUpForm.addEventListener("submit", handleSignUp);
    }
}


/* =========================================================
   SIGN IN (EMAIL/PASSWORD)
   ========================================================= */

async function handleSignIn(event) {
    event.preventDefault();

    const client = getSupabase();
    if (!client) {
        showMessage("Authentication service is not available. Please refresh.", "error");
        return;
    }

    const email = get("signin-email")?.value.trim();
    const password = get("signin-password")?.value;

    if (!email || !password) {
        showMessage("Please enter your email and password.", "error");
        return;
    }

    const button = event.submitter;
    setLoading(button, true);

    const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });

    setLoading(button, false);

    if (error) {
        showMessage(error.message, "error");
        return;
    }

    showMessage("Signed in successfully! Redirecting...", "success");
    redirectAfterLogin();
}


/* =========================================================
   SIGN UP
   ========================================================= */

async function handleSignUp(event) {
    event.preventDefault();

    const client = getSupabase();
    if (!client) {
        showMessage("Authentication service is not available. Please refresh.", "error");
        return;
    }

    const firstName = get("signup-first-name")?.value.trim();
    const email = get("signup-email")?.value.trim();
    const password = get("signup-password")?.value;

    if (!firstName) { showMessage("Please enter your first name.", "error"); return; }
    if (!email) { showMessage("Please enter your email.", "error"); return; }
    if (!password) { showMessage("Please enter a password.", "error"); return; }
    if (password.length < 6) { showMessage("Password must contain at least 6 characters.", "error"); return; }

    const button = event.submitter;
    setLoading(button, true);

    const { data, error } = await client.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { first_name: firstName },
            emailRedirectTo: getRedirectURL()
        }
    });

    setLoading(button, false);

    if (error) {
        showMessage(error.message, "error");
        return;
    }

    if (!data.session) {
        showMessage("Account created! Please check your email to verify your account.", "success");
        return;
    }

    showMessage("Account created successfully! Redirecting...", "success");
    redirectAfterLogin();
}


/* =========================================================
   OAUTH BUTTONS SETUP & SIGN-IN
   ========================================================= */

function setupOAuthButtons() {
    const providers = ["google", "facebook", "github", "discord"];

    providers.forEach(provider => {
        const buttons = document.querySelectorAll(`[data-provider="${provider}"]`);
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                signInWithProvider(provider);
            });
        });
    });
}

async function signInWithProvider(provider) {
    const client = getSupabase();
    if (!client) {
        showMessage("Authentication service is not available.", "error");
        return;
    }

    const redirect = getRedirectURL();

    const { error } = await client.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: redirect
        }
    });

    if (error) {
        showMessage(error.message, "error");
    }
}


/* =========================================================
   DYNAMIC REDIRECT URL (GITHUB PAGES COMPATIBLE)
   ========================================================= */

function getRedirectURL() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("redirect");

    if (requested) {
        return new URL(requested, window.location.origin).href;
    }

    // Dynamic repo path resolution for GitHub Pages
    const pathName = window.location.pathname;
    let basePath = "/";
    
    if (pathName.includes("/AiSmartOS-India/")) {
        basePath = "/AiSmartOS-India/";
    }

    return `${window.location.origin}${basePath}index.html`;
}

function redirectAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("redirect");

    if (requested) {
        window.location.href = new URL(requested, window.location.origin).href;
        return;
    }

    const pathName = window.location.pathname;
    let basePath = "./";
    
    if (pathName.includes("/AiSmartOS-India/")) {
        basePath = "/AiSmartOS-India/";
    }

    window.location.href = `${basePath}index.html`;
}


/* =========================================================
   SESSION CHECK & CALLBACK
   ========================================================= */

async function handleExistingSession() {
    const client = getSupabase();
    if (!client) return;

    const { data } = await client.auth.getSession();
    if (!data.session) return;

    const params = new URLSearchParams(window.location.search);
    if (params.has("redirect")) {
        redirectAfterLogin();
    }
}

async function handleOAuthCallback() {
    const client = getSupabase();
    if (!client) return;

    const { data, error } = await client.auth.getSession();
    if (error) {
        console.error("OAuth session error:", error.message);
        return;
    }

    if (data.session) {
        redirectAfterLogin();
    }
}

handleOAuthCallback();

window.AiSmartOSAuth = {
    signInWithProvider,
    redirectAfterLogin
};
