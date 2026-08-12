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
   SUPABASE CHECK
   ========================================================= */

function getSupabase() {

    if (!window.aiSmartOSSupabase) {

        console.error(
            "Supabase is not initialized. Check config.js and script order."
        );

        return null;
    }

    return window.aiSmartOSSupabase;
}


/* =========================================================
   ELEMENT HELPERS
   ========================================================= */

function get(id) {

    return document.getElementById(id);

}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(message, type = "error") {

    const messageBox =
        get("auth-message");


    if (!messageBox) {

        alert(message);

        return;
    }


    messageBox.textContent =
        message;


    messageBox.className =
        "auth-message " + type;


    messageBox.style.display =
        "block";

}


/* =========================================================
   LOADING
   ========================================================= */

function setLoading(button, loading) {

    if (!button) return;


    if (loading) {

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "Please wait...";

        button.disabled =
            true;

    } else {

        button.textContent =
            button.dataset.originalText ||
            "Continue";

        button.disabled =
            false;
    }

}


/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

function setupPasswordStrength() {

    const password =
        get("signup-password") ||
        get("password");


    const indicator =
        get("password-strength");


    const label =
        get("password-strength-label");


    if (!password) return;


    password.addEventListener(
        "input",
        () => {

            const value =
                password.value;


            if (!value) {

                if (indicator)
                    indicator.style.width = "0";


                if (label) {

                    label.textContent =
                        "";

                    label.className =
                        "";

                }

                return;
            }


            let score = 0;


            if (value.length >= 8)
                score++;


            if (/[a-z]/.test(value))
                score++;


            if (/[A-Z]/.test(value))
                score++;


            if (/[0-9]/.test(value))
                score++;


            if (/[^A-Za-z0-9]/.test(value))
                score++;


            let strength =
                "Basic";


            let className =
                "basic";


            let width =
                "33%";


            if (score >= 4) {

                strength =
                    "Strong";

                className =
                    "strong";

                width =
                    "100%";

            } else if (score >= 3) {

                strength =
                    "Normal";

                className =
                    "normal";

                width =
                    "66%";

            }


            if (indicator) {

                indicator.style.width =
                    width;

                indicator.className =
                    "password-strength-bar " +
                    className;

            }


            if (label) {

                label.textContent =
                    strength;

                label.className =
                    className;

            }

        }
    );
}


/* =========================================================
   AUTH FORMS
   ========================================================= */

function setupAuthForms() {

    const signInForm =
        get("signin-form");


    const signUpForm =
        get("signup-form");


    if (signInForm) {

        signInForm.addEventListener(
            "submit",
            handleSignIn
        );

    }


    if (signUpForm) {

        signUpForm.addEventListener(
            "submit",
            handleSignUp
        );

    }

}


/* =========================================================
   SIGN IN
   ========================================================= */

async function handleSignIn(event) {

    event.preventDefault();


    const supabase =
        getSupabase();


    if (!supabase) {

        showMessage(
            "Authentication service is not available.",
            "error"
        );

        return;
    }


    const email =
        get("signin-email")?.value.trim();


    const password =
        get("signin-password")?.value;


    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    const button =
        event.submitter;


    setLoading(
        button,
        true
    );


    const { data, error } =
        await supabase.auth.signInWithPassword({

            email: email,

            password: password

        });


    setLoading(
        button,
        false
    );


    if (error) {

        showMessage(
            error.message,
            "error"
        );

        return;
    }


    showMessage(
        "Signed in successfully! Redirecting...",
        "success"
    );


    redirectAfterLogin();

}


/* =========================================================
   SIGN UP
   ========================================================= */

async function handleSignUp(event) {

    event.preventDefault();


    const supabase =
        getSupabase();


    if (!supabase) {

        showMessage(
            "Authentication service is not available.",
            "error"
        );

        return;
    }


    const firstName =
        get("signup-first-name")?.value.trim();


    const email =
        get("signup-email")?.value.trim();


    const password =
        get("signup-password")?.value;


    if (!firstName) {

        showMessage(
            "Please enter your first name.",
            "error"
        );

        return;
    }


    if (!email) {

        showMessage(
            "Please enter your email.",
            "error"
        );

        return;
    }


    if (!password) {

        showMessage(
            "Please enter a password.",
            "error"
        );

        return;
    }


    if (password.length < 6) {

        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );

        return;
    }


    const button =
        event.submitter;


    setLoading(
        button,
        true
    );


    const { data, error } =
        await supabase.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    first_name:
                        firstName

                }

            }

        });


    setLoading(
        button,
        false
    );


    if (error) {

        showMessage(
            error.message,
            "error"
        );

        return;
    }


    /*
       If email confirmation is enabled,
       Supabase won't create an active session
       until the user verifies their email.
    */

    if (!data.session) {

        showMessage(
            "Account created! Please check your email to verify your account.",
            "success"
        );

        return;
    }


    showMessage(
        "Account created successfully! Redirecting...",
        "success"
    );


    redirectAfterLogin();

}


/* =========================================================
   OAUTH
   ========================================================= */

function setupOAuthButtons() {

    const providers = [
        "google",
        "facebook",
        "github",
        "discord"
    ];


    providers.forEach(provider => {

        const buttons =
            document.querySelectorAll(
                `[data-provider="${provider}"]`
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    signInWithProvider(
                        provider
                    );

                }
            );

        });

    });

}


/* =========================================================
   OAUTH LOGIN
   ========================================================= */

async function signInWithProvider(provider) {

    const supabase =
        getSupabase();


    if (!supabase) {

        showMessage(
            "Authentication service is not available.",
            "error"
        );

        return;
    }


    const redirect =
        getRedirectURL();


    const { error } =
        await supabase.auth.signInWithOAuth({

            provider: provider,

            options: {

                redirectTo:
                    redirect

            }

        });


    if (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   REDIRECT URL
   ========================================================= */

function getRedirectURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requested =
        params.get("redirect");


    if (requested) {

        return new URL(
            requested,
            window.location.origin
        ).href;

    }


    return new URL(
        "index.html",
        window.location.origin
    ).href;
}


/* =========================================================
   AFTER LOGIN
   ========================================================= */

function redirectAfterLogin() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requested =
        params.get("redirect");


    if (requested) {

        window.location.href =
            new URL(
                requested,
                window.location.origin
            ).href;

        return;
    }


    window.location.href =
        "index.html";
}


/* =========================================================
   EXISTING SESSION
   ========================================================= */

async function handleExistingSession() {

    const supabase =
        getSupabase();


    if (!supabase) return;


    const { data } =
        await supabase.auth.getSession();


    if (!data.session) return;


    /*
       Don't force redirect when user is simply
       viewing auth.html after logging out or
       opening the page manually.
    */

    const params =
        new URLSearchParams(
            window.location.search
        );


    if (params.has("redirect")) {

        redirectAfterLogin();

    }

}


/* =========================================================
   GOOGLE / OAUTH CALLBACK
   ========================================================= */

async function handleOAuthCallback() {

    const supabase =
        getSupabase();


    if (!supabase) return;


    const { data, error } =
        await supabase.auth.getSession();


    if (error) {

        console.error(
            "OAuth session error:",
            error.message
        );

        return;
    }


    if (data.session) {

        redirectAfterLogin();

    }

}


handleOAuthCallback();


/* =========================================================
   EXPORT
   ========================================================= */

window.AiSmartOSAuth = {

    signInWithProvider,

    redirectAfterLogin

};
