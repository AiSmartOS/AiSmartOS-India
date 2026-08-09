// =========================
// AiSmartOS Website JavaScript
// =========================


// Page completely load hone ke baad code chalega
document.addEventListener("DOMContentLoaded", function () {

    console.log("AiSmartOS website loaded successfully!");


    // =========================
    // NAVIGATION LINKS
    // =========================

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            console.log(
                "Navigation clicked:",
                link.textContent
            );

        });

    });


    // =========================
    // HERO BUTTONS
    // =========================

    const heroButtons =
        document.querySelectorAll(".hero-buttons a");

    heroButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "Hero button clicked:",
                button.textContent
            );

        });

    });


    // =========================
    // FEATURE CARDS
    // =========================

    const featureCards =
        document.querySelectorAll(
            ".features-container article"
        );

    featureCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const title =
                card.querySelector("h3").textContent;

            console.log(
                "Feature selected:",
                title
            );

        });

    });

});
