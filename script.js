// =========================
// AiSmartOS Website JavaScript
// =========================

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "AiSmartOS website loaded successfully!"
    );


    // =========================
    // MOBILE DRAWER ELEMENTS
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
        document.querySelectorAll(
            ".drawer-links a"
        );


    // =========================
    // CHECK ELEMENTS
    // =========================

    if (
        !menuButton ||
        !mobileDrawer ||
        !drawerClose ||
        !drawerOverlay
    ) {

        console.error(
            "AiSmartOS: Mobile drawer elements not found."
        );

        return;
    }


    // =========================
    // OPEN DRAWER
    // =========================

    function openDrawer() {

        mobileDrawer.classList.add("open");

        drawerOverlay.classList.add("open");

        document.body.classList.add(
            "drawer-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        drawerOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        console.log(
            "Mobile navigation drawer opened."
        );
    }


    // =========================
    // CLOSE DRAWER
    // =========================

    function closeDrawer() {

        mobileDrawer.classList.remove("open");

        drawerOverlay.classList.remove("open");

        document.body.classList.remove(
            "drawer-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        drawerOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        console.log(
            "Mobile navigation drawer closed."
        );
    }


    // =========================
    // HAMBURGER CLICK
    // =========================

    menuButton.addEventListener(
        "click",
        function () {

            if (
                mobileDrawer.classList.contains(
                    "open"
                )
            ) {

                closeDrawer();

            } else {

                openDrawer();

            }

        }
    );


    // =========================
    // CLOSE BUTTON
    // =========================

    drawerClose.addEventListener(
        "click",
        closeDrawer
    );


    // =========================
    // OVERLAY CLICK
    // =========================

    drawerOverlay.addEventListener(
        "click",
        closeDrawer
    );


    // =========================
    // DRAWER NAVIGATION
    // =========================

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


    // =========================
    // ESCAPE KEY
    // =========================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                mobileDrawer.classList.contains(
                    "open"
                )
            ) {

                closeDrawer();

            }

        }
    );


    // =========================
    // RESIZE PROTECTION
    // =========================

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 800 &&
                mobileDrawer.classList.contains(
                    "open"
                )
            ) {

                closeDrawer();

            }

        }
    );


    // =========================
    // DESKTOP NAVIGATION
    // =========================

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );

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


    // =========================
    // HERO BUTTONS
    // =========================

    const heroButtons =
        document.querySelectorAll(
            ".hero-buttons a"
        );

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


    // =========================
    // FEATURE CARDS
    // =========================

    const featureCards =
        document.querySelectorAll(
            ".features-container article"
        );

    featureCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const titleElement =
                        card.querySelector("h3");

                    if (!titleElement) {
                        return;
                    }

                    console.log(
                        "Feature selected:",
                        titleElement.textContent.trim()
                    );

                }
            );

        }
    );

});