// =====================================================
// AiSmartOS WEBSITE JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("AiSmartOS website loaded successfully.");


    // =================================================
    // ELEMENTS
    // =================================================

    const body = document.body;

    const menuButton =
        document.getElementById("menu-button");

    const drawer =
        document.getElementById("mobile-drawer");

    const drawerClose =
        document.getElementById("drawer-close");

    const drawerOverlay =
        document.getElementById("drawer-overlay");

    const drawerLinks =
        document.querySelectorAll(".drawer-links a");

    const navLinks =
        document.querySelectorAll(".nav-links a");

    const heroButtons =
        document.querySelectorAll(".hero-buttons a");


    // =================================================
    // SAFETY CHECK
    // =================================================

    if (
        !menuButton ||
        !drawer ||
        !drawerClose ||
        !drawerOverlay
    ) {

        console.error(
            "AiSmartOS: Navigation drawer elements not found."
        );

        return;
    }


    // =================================================
    // OPEN DRAWER
    // =================================================

    function openDrawer() {

        body.classList.add("drawer-open");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        drawer.setAttribute(
            "aria-hidden",
            "false"
        );

        drawerOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        // Prevent page from scrolling behind drawer

        body.style.overflow = "hidden";

        console.log("Navigation drawer opened.");
    }


    // =================================================
    // CLOSE DRAWER
    // =================================================

    function closeDrawer() {

        body.classList.remove("drawer-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        drawer.setAttribute(
            "aria-hidden",
            "true"
        );

        drawerOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        // Restore scrolling

        body.style.overflow = "";

        console.log("Navigation drawer closed.");
    }


    // =================================================
    // HAMBURGER CLICK
    // =================================================

    menuButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            if (
                body.classList.contains(
                    "drawer-open"
                )
            ) {

                closeDrawer();

            } else {

                openDrawer();

            }

        }
    );


    // =================================================
    // CLOSE BUTTON
    // =================================================

    drawerClose.addEventListener(
        "click",
        function () {

            closeDrawer();

        }
    );


    // =================================================
    // OVERLAY CLICK
    // =================================================

    drawerOverlay.addEventListener(
        "click",
        function () {

            closeDrawer();

        }
    );


    // =================================================
    // DRAWER LINKS
    // =================================================

    drawerLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    closeDrawer();

                }
            );

        }
    );


    // =================================================
    // ESC KEY
    // =================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                body.classList.contains(
                    "drawer-open"
                )
            ) {

                closeDrawer();

            }

        }
    );


    // =================================================
    // DESKTOP NAVIGATION
    // =================================================

    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    console.log(
                        "Navigation clicked:",
                        link.textContent.trim()
                    );

                }
            );

        }
    );


    // =================================================
    // HERO BUTTONS
    // =================================================

    heroButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    console.log(
                        "Hero button clicked:",
                        button.textContent.trim()
                    );

                }
            );

        }
    );


    // =================================================
    // FEATURE CARDS
    // =================================================

    const featureCards =
        document.querySelectorAll(
            ".features-container article"
        );

    featureCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const title =
                        card.querySelector("h3");

                    if (title) {

                        console.log(
                            "Feature selected:",
                            title.textContent.trim()
                        );

                    }

                }
            );

        }
    );


    // =================================================
    // RESPONSIVE SAFETY
    // =================================================

    window.addEventListener(
        "resize",
        function () {

            /*
             * If the user opens the drawer and then
             * rotates/resizes the device to desktop,
             * automatically close the drawer.
             */

            if (
                window.innerWidth > 800 &&
                body.classList.contains(
                    "drawer-open"
                )
            ) {

                closeDrawer();

            }

        }
    );

});