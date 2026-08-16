/* =========================================================
   AiSmartOS
   Main Website JavaScript
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://mxkzwbgtvaccfwlaovhr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ttq-ivZPAf1btYyjvZYT7g_fN1TEyUt";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

let supabaseClient = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

} else {

    console.error(
        "Supabase library not loaded. Check your Supabase CDN script in index.html."
    );

}


/* =========================================================
   ELEMENTS
========================================================= */

const menuBtn =
    document.getElementById("menuBtn");

const closeDrawer =
    document.getElementById("closeDrawer");

const drawer =
    document.getElementById("drawer");

const drawerOverlay =
    document.getElementById("drawerOverlay");

const drawerAccount =
    document.getElementById("drawerAccount");

const drawerSettings =
    document.getElementById("drawerSettings");

const drawerAvatar =
    document.getElementById("drawerAvatar");

const drawerName =
    document.getElementById("drawerName");

const signInBtn =
    document.getElementById("signInBtn");

const accountHeader =
    document.getElementById("accountHeader");

const aceAiButton =
    document.getElementById("aceAiButton");

const heroUserName =
    document.getElementById("heroUserName");


/* =========================================================
   ACE AI WEBSITE
========================================================= */

const ACE_AI_URL =
    "https://aismartos.github.io/Ace-Ai/";


/* =========================================================
   DRAWER
========================================================= */

function openDrawer() {

    if (!drawer) return;

    drawer.classList.add("open");

    if (drawerOverlay) {
        drawerOverlay.classList.add("open");
    }

    document.body.style.overflow = "hidden";
}


function closeDrawerMenu() {

    if (!drawer) return;

    drawer.classList.remove("open");

    if (drawerOverlay) {
        drawerOverlay.classList.remove("open");
    }

    document.body.style.overflow = "";
}


/* Open drawer */

menuBtn?.addEventListener(
    "click",
    openDrawer
);


/* Close drawer */

closeDrawer?.addEventListener(
    "click",
    closeDrawerMenu
);


/* Close drawer by clicking outside */

drawerOverlay?.addEventListener(
    "click",
    closeDrawerMenu
);


/* Close drawer after navigation */

document
    .querySelectorAll(".drawer-nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeDrawerMenu
        );

    });


/* =========================================================
   FIRST NAME
========================================================= */

function getFirstName(user) {

    if (!user) {
        return "User";
    }


    const metadata =
        user.user_metadata || {};


    let name =
        metadata.full_name ||
        metadata.name ||
        metadata.display_name ||
        metadata.first_name ||
        user.email?.split("@")[0] ||
        "User";


    name =
        String(name)
            .trim()
            .split(/\s+/)[0];


    return name || "User";
}


/* =========================================================
   AVATAR
========================================================= */

function getAvatar(user) {

    if (!user) {
        return null;
    }


    const metadata =
        user.user_metadata || {};


    return (
        metadata.avatar_url ||
        metadata.picture ||
        metadata.photo_url ||
        null
    );

}


/* =========================================================
   DRAWER AVATAR
========================================================= */

function setDrawerAvatar(user) {

    if (!drawerAvatar) return;


    const avatar =
        getAvatar(user);


    drawerAvatar.innerHTML = "";


    if (avatar) {

        const img =
            document.createElement("img");


        img.src =
            avatar;


        img.alt =
            "Profile";


        img.onerror = function () {

            drawerAvatar.innerHTML =
                "👤";

        };


        drawerAvatar.appendChild(
            img
        );

    } else {

        drawerAvatar.innerHTML =
            "👤";

    }

}


/* =========================================================
   HEADER ACCOUNT
========================================================= */

function renderHeaderAccount(user) {

    if (!accountHeader) {
        return;
    }


    accountHeader.innerHTML =
        "";


    if (!user) {
        return;
    }


    const name =
        getFirstName(user);


    const avatar =
        getAvatar(user);


    const link =
        document.createElement("a");


    link.href =
        "settings.html";


    link.className =
        "header-account";


    /* Avatar */

    if (avatar) {

        const img =
            document.createElement("img");


        img.src =
            avatar;


        img.className =
            "header-avatar";


        img.alt =
            "Profile";


        img.onerror =
            function () {

                this.remove();

            };


        link.appendChild(
            img
        );

    }


    /* First name */

    const nameElement =
        document.createElement("span");


    nameElement.className =
        "header-account-name";


    nameElement.textContent =
        name;


    link.appendChild(
        nameElement
    );


    accountHeader.appendChild(
        link
    );

}


/* =========================================================
   UPDATE AUTH UI
========================================================= */

async function updateAuthUI() {

    /* Supabase unavailable */

    if (!supabaseClient) {

        console.warn(
            "Supabase client unavailable."
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        const session =
            data?.session || null;


        const user =
            session?.user || null;


        /* =================================================
           LOGGED IN
        ================================================= */

        if (user) {

            /* Header button */

            if (signInBtn) {

                signInBtn.textContent =
                    "My Account";


                signInBtn.href =
                    "settings.html";

            }


            /* Drawer account */

            if (drawerAccount) {

                drawerAccount.classList.remove(
                    "hidden"
                );

            }


            /* Drawer settings */

            if (drawerSettings) {

                drawerSettings.classList.remove(
                    "hidden"
                );

            }


            /* First name */

            const firstName =
                getFirstName(user);


            if (drawerName) {

                drawerName.textContent =
                    firstName;

            }


            if (heroUserName) {

                heroUserName.textContent =
                    firstName;

            }


            /* Avatar */

            setDrawerAvatar(
                user
            );


            /* Desktop account */

            renderHeaderAccount(
                user
            );

        }


        /* =================================================
           LOGGED OUT
        ================================================= */

        else {

            if (signInBtn) {

                signInBtn.textContent =
                    "Get Started";


                signInBtn.href =
                    "auth.html";

            }


            if (drawerAccount) {

                drawerAccount.classList.add(
                    "hidden"
                );

            }


            if (drawerSettings) {

                drawerSettings.classList.add(
                    "hidden"
                );

            }


            if (heroUserName) {

                heroUserName.textContent =
                    "User";

            }


            if (accountHeader) {

                accountHeader.innerHTML =
                    "";

            }

        }

    } catch (error) {

        console.error(
            "Auth UI error:",
            error
        );

    }

}


/* =========================================================
   SUPABASE AUTH STATE
========================================================= */

if (supabaseClient) {

    supabaseClient
        .auth
        .onAuthStateChange(
            (_event, session) => {

                const user =
                    session?.user || null;


                updateAuthUI();


                if (user) {

                    const firstName =
                        getFirstName(user);


                    if (heroUserName) {

                        heroUserName.textContent =
                            firstName;

                    }

                } else {

                    if (heroUserName) {

                        heroUserName.textContent =
                            "User";

                    }

                }

            }
        );

}


/* =========================================================
   ACE AI
   IMPORTANT:
   ACE AI DOES NOT REQUIRE AiSmartOS LOGIN
========================================================= */

if (aceAiButton) {

    aceAiButton.addEventListener(
        "click",
        function () {

            /*
             * Anyone can open ACE AI.
             *
             * No AiSmartOS authentication
             * check is performed here.
             */

            window.location.href =
                ACE_AI_URL;

        }
    );

}


/* =========================================================
   PROTECTED DOWNLOADS
========================================================= */

document
    .querySelectorAll(
        "[data-protected-download]"
    )
    .forEach(element => {

        element.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();


                /* Supabase unavailable */

                if (!supabaseClient) {

                    alert(
                        "Authentication service is currently unavailable."
                    );

                    return;

                }


                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .getSession();


                    if (error) {

                        console.error(
                            "Download session error:",
                            error
                        );

                        return;

                    }


                    /* Not logged in */

                    if (!data?.session) {

                        alert(
                            "Please sign in before downloading this file."
                        );


                        window.location.href =
                            "auth.html";


                        return;

                    }


                    /* Logged in */

                    const file =
                        element.dataset
                            .protectedDownload;


                    if (file) {

                        window.location.href =
                            file;

                    }

                } catch (error) {

                    console.error(
                        "Download error:",
                        error
                    );

                }

            }
        );

    });


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "AiSmartOS website loaded successfully."
        );


        updateAuthUI();

    }
);
