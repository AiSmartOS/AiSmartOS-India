/* =====================================================
   AiSmartOS WEBSITE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       ELEMENTS
    ================================================= */

    const menuToggle =
        document.getElementById("menu-toggle");

    const mobileDrawer =
        document.getElementById("mobile-drawer");

    const drawerClose =
        document.getElementById("drawer-close");

    const drawerBackdrop =
        document.getElementById("drawer-backdrop");



    /* =================================================
       OPEN DRAWER
    ================================================= */

    function openDrawer() {

        if (!mobileDrawer) return;

        mobileDrawer.classList.add("open");

        drawerBackdrop.classList.add("open");

        document.body.classList.add("drawer-open");

        mobileDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

        }

    }



    /* =================================================
       CLOSE DRAWER
    ================================================= */

    function closeDrawer() {

        if (!mobileDrawer) return;

        mobileDrawer.classList.remove("open");

        drawerBackdrop.classList.remove("open");

        document.body.classList.remove("drawer-open");

        mobileDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    }



    /* =================================================
       TOGGLE DRAWER
    ================================================= */

    function toggleDrawer() {

        if (
            mobileDrawer &&
            mobileDrawer.classList.contains("open")
        ) {

            closeDrawer();

        } else {

            openDrawer();

        }

    }



    /* =================================================
       MENU BUTTON
    ================================================= */

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleDrawer
        );

    }



    /* =================================================
       CLOSE BUTTON
    ================================================= */

    if (drawerClose) {

        drawerClose.addEventListener(
            "click",
            closeDrawer
        );

    }



    /* =================================================
       BACKDROP
    ================================================= */

    if (drawerBackdrop) {

        drawerBackdrop.addEventListener(
            "click",
            closeDrawer
        );

    }



    /* =================================================
       DRAWER LINKS
    ================================================= */

    const drawerLinks =
        document.querySelectorAll(
            ".drawer-links a"
        );

    drawerLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeDrawer();

            }
        );

    });



    /* =================================================
       ESC KEY
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeDrawer();

            }

        }
    );



    /* =================================================
       PREVENT DRAWER ON DESKTOP
    ================================================= */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 800) {

                closeDrawer();

            }

        }
    );



    /* =================================================
       NAVIGATION LOGGING
    ================================================= */

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );

    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                console.log(
                    "Navigation clicked:",
                    link.textContent.trim()
                );

            }
        );

    });



    /* =================================================
       HERO BUTTONS
    ================================================= */

    const heroButtons =
        document.querySelectorAll(
            ".hero-buttons a"
        );

    heroButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                console.log(
                    "Hero button clicked:",
                    button.textContent.trim()
                );

            }
        );

    });



    /* =================================================
       FEATURE CARDS
    ================================================= */

    const featureCards =
        document.querySelectorAll(
            ".features-container article"
        );

    featureCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                const titleElement =
                    card.querySelector("h3");

                if (titleElement) {

                    console.log(
                        "Feature selected:",
                        titleElement.textContent.trim()
                    );

                }

            }
        );

    });



    /* =================================================
       ACCOUNT UI
       
       This section currently prepares the UI.
       Actual Supabase profile data will be connected
       when the account/profile system is finalized.
    ================================================= */

    function setAccountUI(
        firstName,
        avatarURL,
        loggedIn
    ) {

        const navButton =
            document.getElementById(
                "nav-auth-button"
            );

        const headerAccount =
            document.getElementById(
                "header-account"
            );

        const headerAvatar =
            document.getElementById(
                "header-account-avatar"
            );

        const headerName =
            document.getElementById(
                "header-account-name"
            );


        const drawerAvatar =
            document.getElementById(
                "drawer-account-avatar"
            );

        const drawerName =
            document.getElementById(
                "drawer-account-name"
            );

        const drawerLabel =
            document.getElementById(
                "drawer-account-label"
            );


        /* ---------------------------------------------
           NOT LOGGED IN
        --------------------------------------------- */

        if (!loggedIn) {

            if (navButton) {

                navButton.style.display =
                    "inline-flex";

            }

            if (headerAccount) {

                headerAccount.style.display =
                    "none";

            }

            if (drawerName) {

                drawerName.textContent =
                    "My Account";

            }

            if (drawerLabel) {

                drawerLabel.textContent =
                    "Sign in to your account";

            }

            if (drawerAvatar) {

                drawerAvatar.src =
                    "IMG-20260805-WA0000.jpg";

            }

            return;

        }


        /* ---------------------------------------------
           LOGGED IN
        --------------------------------------------- */

        if (navButton) {

            navButton.style.display =
                "none";

        }

        if (headerAccount) {

            headerAccount.style.display =
                "flex";

        }

        if (headerAvatar && avatarURL) {

            headerAvatar.src =
                avatarURL;

        }

        if (headerName) {

            headerName.textContent =
                firstName || "User";

        }


        if (drawerAvatar && avatarURL) {

            drawerAvatar.src =
                avatarURL;

        }

        if (drawerName) {

            drawerName.textContent =
                firstName || "User";

        }

        if (drawerLabel) {

            drawerLabel.textContent =
                "My Account";

        }

    }



    /* =================================================
       INITIAL ACCOUNT STATE
       
       Until Supabase auth is connected on this page,
       keep Sign In visible.
    ================================================= */

    setAccountUI(
        null,
        null,
        false
    );



    /* =================================================
       IMAGE FALLBACK
       
       If user's custom/profile image fails,
       use AiSmartOS logo.
    ================================================= */

    const accountImages =
        document.querySelectorAll(
            "#header-account-avatar, #drawer-account-avatar"
        );

    accountImages.forEach(function (image) {

        image.addEventListener(
            "error",
            function () {

                image.src =
                    "IMG-20260805-WA0000.jpg";

            }
        );

    });



    /* =================================================
       WEBSITE READY
    ================================================= */

    console.log(
        "AiSmartOS website loaded successfully!"
    );

});