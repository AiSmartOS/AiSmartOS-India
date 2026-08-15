/* =========================================================
   Independence Day Page JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Mobile drawer functionality
    const menuBtn = document.getElementById("menuBtn");
    const closeDrawer = document.getElementById("closeDrawer");
    const drawer = document.getElementById("drawer");
    const drawerOverlay = document.getElementById("drawerOverlay");

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

    menuBtn?.addEventListener("click", openDrawer);
    closeDrawer?.addEventListener("click", closeDrawerMenu);
    drawerOverlay?.addEventListener("click", closeDrawerMenu);

    // Close drawer when clicking any link inside it
    document.querySelectorAll(".drawer-nav a").forEach(link => {
        link.addEventListener("click", closeDrawerMenu);
    });

});