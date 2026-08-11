// =========================================
// AiSmartOS WEBSITE JAVASCRIPT
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("AiSmartOS website loaded successfully.");


    // =====================================
    // ELEMENTS
    // =====================================

    const menuButton =
        document.getElementById("menuButton");

    const mobileDrawer =
        document.getElementById("mobileDrawer");

    const drawerOverlay =
        document.getElementById("drawerOverlay");

    const drawerClose =
        document.getElementById("drawerClose");

    const drawerLinks =
        document.querySelectorAll(".drawer-navigation a");


    // =====================================
    // OPEN DRAWER
    // =====================================

    function openDrawer() {

        if (!mobileDrawer) return;

        mobileDrawer.classList.add("active");

        drawerOverlay.classList.add("active");

        document.body.classList.add("drawer-open");

        mobileDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    // =====================================
    // CLOSE DRAWER
    // =====================================

    function closeDrawer() {

        if (!mobileDrawer) return;

        mobileDrawer.classList.remove("active");

        drawerOverlay.classList.remove("active");

        document.body.classList.remove("drawer-open");

        mobileDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    // =====================================
    // MENU BUTTON
    // =====================================

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                const isOpen =
                    mobileDrawer.classList.contains("active");

                if (isOpen) {

                    closeDrawer();

                } else {

                    openDrawer();

                }

            }
        );

    }


    // =====================================
    // CLOSE BUTTON
    // =====================================

    if (drawerClose) {

        drawerClose.addEventListener(
            "click",
            function () {

                closeDrawer();

            }
        );

    }


    // =====================================
    // OVERLAY CLICK
    // =====================================

    if (drawerOverlay) {

        drawerOverlay.addEventListener(
            "click",
            function () {

                closeDrawer();

            }
        );

    }


    // =====================================
    // DRAWER LINKS
    // =====================================

    drawerLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeDrawer();

            }
        );

    });


    // =====================================
    // ESCAPE KEY
    // =====================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeDrawer();

            }

        }
    );


    // =====================================
    // DESKTOP/MOBILE RESIZE
    // =====================================

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 800) {

                closeDrawer();

            }

        }
    );


    // =====================================
    // HERO BUTTON LOG
    // =====================================

    const heroButtons =
        document.querySelectorAll(
            ".hero-buttons a"
        );

    heroButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                console.log(
                    "Hero button:",
                    button.textContent.trim()
                );

            }
        );

    });


    // =====================================
    // FEATURE CARDS
    // =====================================

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


    // =====================================
    // TEST DRAWER
    // =====================================

    console.log(
        "Mobile drawer system initialized."
    );

});