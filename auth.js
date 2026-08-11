/* =========================================
   AiSmartOS Authentication System
   auth.js
========================================= */


/* =========================================
   SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "https://mxkzwbgtvaccfwlaovhr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ttq-ivZPAf1btYyjvZYT7g_fN1TEyUt";


/* =========================================
   CREATE SUPABASE CLIENT
========================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================
   REDIRECT URL
========================================= */

const REDIRECT_URL =
    window.location.origin +
    "/AiSmartOS-India/auth.html";


/* =========================================
   SOCIAL LOGIN
========================================= */

async function signInWithProvider(provider) {

    try {

        const { error } =
            await supabaseClient.auth.signInWithOAuth({

                provider: provider,

                options: {
                    redirectTo: REDIRECT_URL
                }

            });


        if (error) {
            throw error;
        }

    } catch (error) {

        console.error(
            provider + " login error:",
            error
        );

        alert(
            "Sign in failed.\n\n" +
            error.message
        );

    }

}


/* =========================================
   GOOGLE LOGIN
========================================= */

async function signInWithGoogle() {

    await signInWithProvider("google");

}


/* =========================================
   FACEBOOK LOGIN
========================================= */

async function signInWithFacebook() {

    await signInWithProvider("facebook");

}


/* =========================================
   GITHUB LOGIN
========================================= */

async function signInWithGitHub() {

    await signInWithProvider("github");

}


/* =========================================
   DISCORD LOGIN
========================================= */

async function signInWithDiscord() {

    await signInWithProvider("discord");

}


/* =========================================
   EMAIL LOGIN
========================================= */

async function signInWithEmail() {

    const emailInput =
        document.getElementById("email");


    if (!emailInput) {

        console.error(
            "Email input not found."
        );

        return;

    }


    const email =
        emailInput.value.trim();


    if (!email) {

        alert(
            "Please enter your email address."
        );

        return;

    }


    try {

        const { error } =
            await supabaseClient.auth.signInWithOtp({

                email: email,

                options: {

                    emailRedirectTo:
                        REDIRECT_URL

                }

            });


        if (error) {
            throw error;
        }


        alert(
            "Magic link sent! 📧\n\n" +
            "Check your email and click the link to continue."
        );


    } catch (error) {

        console.error(
            "Email login error:",
            error
        );

        alert(
            "Email sign in failed.\n\n" +
            error.message
        );

    }

}


/* =========================================
   GET CURRENT USER
========================================= */

async function getCurrentUser() {

    try {

        const {
            data: { user },
            error
        } =
            await supabaseClient.auth.getUser();


        if (error) {
            throw error;
        }


        return user;


    } catch (error) {

        console.error(
            "User check error:",
            error
        );

        return null;

    }

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

    try {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {
            throw error;
        }


        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        alert(
            "Logout failed.\n\n" +
            error.message
        );

    }

}


/* =========================================
   AUTH STATE LISTENER
========================================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "AiSmartOS Auth Event:",
            event
        );


        if (session) {

            console.log(
                "Logged in user:",
                session.user
            );

        }

    }
);


/* =========================================
   CONNECT LOGIN BUTTONS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* Google */

        const googleButton =
            document.getElementById(
                "google-login"
            );

        if (googleButton) {

            googleButton.addEventListener(
                "click",
                signInWithGoogle
            );

        }


        /* Facebook */

        const facebookButton =
            document.getElementById(
                "facebook-login"
            );

        if (facebookButton) {

            facebookButton.addEventListener(
                "click",
                signInWithFacebook
            );

        }


        /* GitHub */

        const githubButton =
            document.getElementById(
                "github-login"
            );

        if (githubButton) {

            githubButton.addEventListener(
                "click",
                signInWithGitHub
            );

        }


        /* Discord */

        const discordButton =
            document.getElementById(
                "discord-login"
            );

        if (discordButton) {

            discordButton.addEventListener(
                "click",
                signInWithDiscord
            );

        }


        /* Email */

        const emailButton =
            document.getElementById(
                "email-login"
            );

        if (emailButton) {

            emailButton.addEventListener(
                "click",
                signInWithEmail
            );

        }


        console.log(
            "✅ AiSmartOS Authentication System Loaded"
        );

    }
);
