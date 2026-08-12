/* =========================================================
   AiSmartOS - Main Website Script
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupHeader();
    setupDrawer();
    setupProtectedLinks();
    setupAccountButtons();
    setupAceAI();
    updateAccountUI();
    listenForAuthChanges();
});


/* =========================================================
   FIXED HEADER
   ========================================================= */

function setupHeader() {

    const header =
        document.querySelector("header") ||
        document.querySelector(".site-header");

    if (!header) return;

    header.classList.add("aismartos-fixed-header");
}


/* =========================================================
   MOBILE DRAWER
   ========================================================= */

function setupDrawer() {

    const drawer =
        document.querySelector("#drawer") ||
        document.querySelector(".drawer") ||
        document.querySelector(".side-drawer");

    const overlay =
        document.querySelector("#drawer-overlay") ||
        document.querySelector(".drawer-overlay");

    const menuButton =
        document.querySelector("#menu-btn") ||
        document.querySelector(".menu-btn") ||
        document.querySelector("[data-menu]");

    const closeButton =
        document.querySelector("#drawer-close") ||
        document.querySelector(".drawer-close") ||
        document.querySelector("[data-drawer-close]");

    if (!drawer || !menuButton) return;


    function openDrawer() {

        drawer.classList.add("active");
        drawer.classList.add("open");

        if (overlay) {
            overlay.classList.add("active");
            overlay.classList.add("show");
        }

        document.body.classList.add("drawer-open");
    }


    function closeDrawer() {

        drawer.classList.remove("active");
        drawer.classList.remove("open");

        if (overlay) {
            overlay.classList.remove("active");
            overlay.classList.remove("show");
        }

        document.body.classList.remove("drawer-open");
    }


    menuButton.addEventListener("click", (event) => {

        event.preventDefault();

        openDrawer();

    });


    if (closeButton) {

        closeButton.addEventListener("click", (event) => {

            event.preventDefault();

            closeDrawer();

        });

    }


    if (overlay) {

        overlay.addEventListener("click", closeDrawer);

    }


    drawer.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeDrawer);

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeDrawer();

        }

    });
}


/* =========================================================
   SUPABASE USER
   ========================================================= */

async function getCurrentUser() {

    if (!window.aiSmartOSSupabase) {

        console.warn("Supabase is not initialized.");

        return null;
    }


    const { data, error } =
        await window.aiSmartOSSupabase.auth.getUser();


    if (error) {

        console.warn("Unable to get user:", error.message);

        return null;
    }


    return data.user || null;
}


/* =========================================================
   GET FIRST NAME
   ========================================================= */

function getFirstName(user) {

    if (!user) return "User";


    const metadata =
        user.user_metadata || {};


    const firstName =
        metadata.first_name ||
        metadata.firstName ||
        metadata.name ||
        user.email?.split("@")[0] ||
        "User";


    return firstName
        .trim()
        .split(/\s+/)[0];
}


/* =========================================================
   GET PROFILE IMAGE
   ========================================================= */

function getProfileImage(user) {

    if (!user) return "";


    const metadata =
        user.user_metadata || {};


    return (
        metadata.avatar_url ||
        metadata.avatar ||
        metadata.picture ||
        ""
    );
}


/* =========================================================
   UPDATE ACCOUNT UI
   ========================================================= */

async function updateAccountUI() {

    const user =
        await getCurrentUser();


    const signInElements =
        document.querySelectorAll(
            ".nav-button, .sign-in-btn, #sign-in-btn, [data-signin]"
        );


    const accountElements =
        document.querySelectorAll(
            ".my-account, #my-account, [data-account]"
        );


    const accountNames =
        document.querySelectorAll(
            ".account-name, #account-name, [data-account-name]"
        );


    const accountImages =
        document.querySelectorAll(
            ".account-dp, #account-dp, [data-account-dp]"
        );


    if (user) {

        /* -------------------------
           LOGGED IN
        ------------------------- */

        signInElements.forEach(element => {

            element.style.display = "none";

        });


        accountElements.forEach(element => {

            element.style.display = "";

        });


        const firstName =
            getFirstName(user);


        accountNames.forEach(element => {

            element.textContent = firstName;

        });


        const image =
            getProfileImage(user);


        accountImages.forEach(element => {

            if (image) {

                element.src = image;

            } else {

                element.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(firstName) +
                    "&background=5865f2&color=ffffff";

            }

            element.alt =
                firstName;

        });


    } else {

        /* -------------------------
           LOGGED OUT
        ------------------------- */

        signInElements.forEach(element => {

            element.style.display = "";

        });


        accountElements.forEach(element => {

            element.style.display = "none";

        });

    }
}


/* =========================================================
   AUTH STATE LISTENER
   ========================================================= */

function listenForAuthChanges() {

    if (!window.aiSmartOSSupabase) return;


    window.aiSmartOSSupabase.auth.onAuthStateChange(
        () => {

            updateAccountUI();

        }
    );
}


/* =========================================================
   PROTECTED LINKS
   ========================================================= */

function setupProtectedLinks() {

    document.addEventListener("click", async event => {

        const protectedElement =
            event.target.closest(
                "[data-requires-login]"
            );


        if (!protectedElement) return;


        const user =
            await getCurrentUser();


        if (!user) {

            event.preventDefault();


            const destination =
                protectedElement.getAttribute("href") ||
                "index.html";


            window.location.href =
                "auth.html?redirect=" +
                encodeURIComponent(destination);

        }

    });
}


/* =========================================================
   ACCOUNT BUTTON
   ========================================================= */

function setupAccountButtons() {

    document.addEventListener("click", async event => {

        const accountButton =
            event.target.closest(
                "#my-account, .my-account, [data-account]"
            );


        if (!accountButton) return;


        const user =
            await getCurrentUser();


        if (!user) {

            event.preventDefault();

            window.location.href =
                "auth.html";

            return;
        }


        const href =
            accountButton.getAttribute("href");


        if (!href) {

            event.preventDefault();

            window.location.href =
                "settings.html";

        }

    });
}


/* =========================================================
   SETTINGS BUTTON
   ========================================================= */

document.addEventListener("click", async event => {

    const settingsButton =
        event.target.closest(
            "#settings-btn, .settings-btn, [data-settings]"
        );


    if (!settingsButton) return;


    event.preventDefault();


    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "auth.html";

        return;
    }


    window.location.href =
        "settings.html";

});


/* =========================================================
   LOGOUT
   ========================================================= */

document.addEventListener("click", async event => {

    const logoutButton =
        event.target.closest(
            "#logout-btn, .logout-btn, [data-logout]"
        );


    if (!logoutButton) return;


    event.preventDefault();


    if (!window.aiSmartOSSupabase) return;


    const { error } =
        await window.aiSmartOSSupabase.auth.signOut();


    if (error) {

        console.error(
            "Logout failed:",
            error.message
        );

        return;
    }


    window.location.href =
        "index.html";

});


/* =========================================================
   ACE AI BUTTON
   ========================================================= */

function setupAceAI() {

    document.addEventListener("click", async event => {

        const aceButton =
            event.target.closest(
                "#ace-ai-button, .ace-ai-button, [data-ace-ai]"
            );


        if (!aceButton) return;


        event.preventDefault();


        const user =
            await getCurrentUser();


        if (!user) {

            window.location.href =
                "auth.html?redirect=ace.html";

            return;
        }


        window.location.href =
            "ace.html";

    });
}


/* =========================================================
   DOWNLOAD PROTECTION
   ========================================================= */

document.addEventListener("click", async event => {

    const download =
        event.target.closest(
            "[data-download]"
        );


    if (!download) return;


    const user =
        await getCurrentUser();


    if (!user) {

        event.preventDefault();


        const destination =
            download.getAttribute("href") ||
            "index.html";


        window.location.href =
            "auth.html?redirect=" +
            encodeURIComponent(destination);

    }

});


/* =========================================================
   GLOBAL AiSmartOS OBJECT
   ========================================================= */

window.AiSmartOS = {

    getUser: getCurrentUser,

    updateAccountUI: updateAccountUI

};
