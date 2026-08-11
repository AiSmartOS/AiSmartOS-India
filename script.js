// =========================
// AiSmartOS Website JavaScript
// =========================

document.addEventListener("DOMContentLoaded", function () {

    console.log("AiSmartOS website loaded successfully!");


    // =========================
    // MOBILE NAVIGATION DRAWER
    // =========================

    const menuButton =
        document.getElementById("menu-button");

    const mobileDrawer =
        document.getElementById("mobile-drawer");

    const drawerClose =
        document.getElementById("drawer-close");

    const drawerOverlay =
        document.getElementById("drawer-overlay");

    const drawerLinks =
        document.querySelectorAll(".drawer-links a");


    // Open drawer
    function openDrawer() {

        if (!mobileDrawer) return;

        mobileDrawer.classList.add("open");

        if (drawerOverlay) {
            drawerOverlay.classList.add("open");
        }

        document.body.classList.add("drawer-open");

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        mobileDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        if (drawerOverlay) {
            drawerOverlay.setAttribute(
                "aria-hidden",
                "false"
            );
        }
    }


    // Close drawer
    function closeDrawer() {

        if (!mobileDrawer) return;

        mobileDrawer.classList.remove("open");

        if (drawerOverlay) {
            drawerOverlay.classList.remove("open");
        }

        document.body.classList.remove("drawer-open");

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        mobileDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        if (drawerOverlay) {
            drawerOverlay.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    }


    // Hamburger button
    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openDrawer
        );
    }


    // Close button
    if (drawerClose) {

        drawerClose.addEventListener(
            "click",
            closeDrawer
        );
    }


    // Close when background is clicked
    if (drawerOverlay) {

        drawerOverlay.addEventListener(
            "click",
            closeDrawer
        );
    }


    // Close after selecting a drawer link
    drawerLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            closeDrawer
        );

    });


    // =========================
    // CLOSE DRAWER WITH ESCAPE
    // =========================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                mobileDrawer &&
                mobileDrawer.classList.contains("open")
            ) {
                closeDrawer();
            }

        }
    );


    // =========================
    // CLOSE DRAWER WHEN
    // RESIZING TO DESKTOP
    // =========================

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 800 &&
                mobileDrawer &&
                mobileDrawer.classList.contains("open")
            ) {
                closeDrawer();
            }

        }
    );


    // =========================
    // DESKTOP NAVIGATION LINKS
    // =========================

    const navLinks =
        document.querySelectorAll(".nav-links a");

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


    // =========================
    // HERO BUTTONS
    // =========================

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


    // =========================
    // FEATURE CARDS
    // =========================

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

                if (!titleElement) return;

                console.log(
                    "Feature selected:",
                    titleElement.textContent.trim()
                );

            }
        );

    });

});