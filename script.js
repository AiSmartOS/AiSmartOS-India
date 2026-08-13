/* =========================================================
   AiSmartOS
   Main Website JavaScript
========================================================= */

const SUPABASE_URL =
    "https://mxkzwbgtvaccfwlaovhr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ttq-ivZPAf1btYyjvZYT7g_fN1TEyUt";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


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
   DRAWER
========================================================= */

function openDrawer() {

    if (!drawer) return;

    drawer.classList.add("open");

    drawerOverlay?.classList.add("open");

    document.body.style.overflow = "hidden";
}


function closeDrawerMenu() {

    if (!drawer) return;

    drawer.classList.remove("open");

    drawerOverlay?.classList.remove("open");

    document.body.style.overflow = "";
}


menuBtn?.addEventListener(
    "click",
    openDrawer
);


closeDrawer?.addEventListener(
    "click",
    closeDrawerMenu
);


drawerOverlay?.addEventListener(
    "click",
    closeDrawerMenu
);


/* Close drawer when clicking a link */

document.querySelectorAll(
    ".drawer-nav a"
).forEach(link => {

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

    if (!user) return null;

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
   CREATE AVATAR
========================================================= */

function setDrawerAvatar(user) {

    if (!drawerAvatar) return;

    const avatar =
        getAvatar(user);

    drawerAvatar.innerHTML = "";

    if (avatar) {

        const img =
            document.createElement("img");

        img.src = avatar;

        img.alt = "Profile";

        img.onerror = () => {

            drawerAvatar.innerHTML =
                "👤";

        };

        drawerAvatar.appendChild(img);

    } else {

        drawerAvatar.innerHTML =
            "👤";

    }
}


/* =========================================================
   HEADER ACCOUNT
========================================================= */

function renderHeaderAccount(user) {

    if (!accountHeader) return;

    accountHeader.innerHTML = "";

    if (!user) return;

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


    if (avatar) {

        const img =
            document.createElement("img");

        img.src = avatar;

        img.className =
            "header-avatar";

        img.alt =
            "Profile";

        link.appendChild(img);

    }


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
   RENDER LOGIN STATE
========================================================= */

async function updateAuthUI() {

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
            data?.session;

        const user =
            session?.user || null;


        if (user) {

            /* =========================
               LOGGED IN
            ========================= */

            if (signInBtn) {

                signInBtn.textContent =
                    "My Account";

                signInBtn.href =
                    "settings.html";

            }


            drawerAccount
                ?.classList
                .remove("hidden");


            drawerSettings
                ?.classList
                .remove("hidden");


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


            setDrawerAvatar(user);

            renderHeaderAccount(user);


        } else {

            /* =========================
               LOGGED OUT
            ========================= */

            if (signInBtn) {

                signInBtn.textContent =
                    "Get Started";

                signInBtn.href =
                    "auth.html";

            }


            drawerAccount
                ?.classList
                .add("hidden");


            drawerSettings
                ?.classList
                .add("hidden");


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
   AUTH STATE LISTENER
========================================================= */

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

            }

        }
    );


/* =========================================================
   ACE AI
========================================================= */

aceAiButton?.addEventListener(
    "click",
    async () => {

        try {

            const {
                data
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (data?.session) {

                /*
                 * Future ACE AI page
                 */

                window.location.href =
                    "ace-ai.html";

            } else {

                const go =
                    confirm(
                        "ACE AI is available for signed-in users.\n\nSign in to continue?"
                    );


                if (go) {

                    window.location.href =
                        "auth.html";

                }

            }

        } catch (error) {

            console.error(error);

            window.location.href =
                "auth.html";

        }

    }
);


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
            async event => {

                event.preventDefault();


                const {
                    data
                } =
                    await supabaseClient
                        .auth
                        .getSession();


                if (!data?.session) {

                    alert(
                        "Please sign in before downloading this file."
                    );

                    window.location.href =
                        "auth.html";

                    return;

                }


                const file =
                    element.dataset
                        .protectedDownload;


                if (file) {

                    window.location.href =
                        file;

                }

            }
        );

    });


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAuthUI();

    }
);