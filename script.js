// =========================================
// AiSmartOS WEBSITE JAVASCRIPT
// =========================================


// =========================================
// SUPABASE CONFIG
// =========================================

const SUPABASE_URL =
    "https://mxkzwbgtvaccfwlaovhr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_ttq-ivZPAf1btYyjvZYT7g_fN1TEyUt";

let supabaseClient = null;


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "AiSmartOS website loaded."
        );


        // =====================================
        // DRAWER ELEMENTS
        // =====================================

        const menuButton =
            document.getElementById(
                "menuButton"
            );

        const mobileDrawer =
            document.getElementById(
                "mobileDrawer"
            );

        const drawerOverlay =
            document.getElementById(
                "drawerOverlay"
            );

        const drawerClose =
            document.getElementById(
                "drawerClose"
            );


        // =====================================
        // OPEN DRAWER
        // =====================================

        function openDrawer() {

            if (!mobileDrawer) {
                return;
            }

            mobileDrawer.classList.add(
                "active"
            );

            drawerOverlay.classList.add(
                "active"
            );

            document.body.classList.add(
                "drawer-open"
            );

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

            if (!mobileDrawer) {
                return;
            }

            mobileDrawer.classList.remove(
                "active"
            );

            drawerOverlay.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "drawer-open"
            );

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


                    if (
                        mobileDrawer.classList.contains(
                            "active"
                        )
                    ) {

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
        // OVERLAY
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
        // DRAWER NAV LINKS
        // =====================================

        const drawerLinks =
            document.querySelectorAll(
                ".drawer-navigation a"
            );

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


        // =====================================
        // ESC KEY
        // =====================================

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeDrawer();

                }

            }
        );


        // =====================================
        // DESKTOP RESIZE
        // =====================================

        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth > 800
                ) {

                    closeDrawer();

                }

            }
        );


        // =====================================
        // SUPABASE INITIALIZATION
        // =====================================

        if (
            typeof window.supabase ===
            "undefined"
        ) {

            console.error(
                "Supabase library was not loaded."
            );

            return;

        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );


        console.log(
            "Supabase initialized."
        );


        // =====================================
        // ACCOUNT UI
        // =====================================

        await updateAccountUI();


        // =====================================
        // AUTH STATE LISTENER
        // =====================================

        supabaseClient.auth.onAuthStateChange(
            async function (
                event,
                session
            ) {

                console.log(
                    "Auth event:",
                    event
                );

                await updateAccountUI();

            }
        );


        // =====================================
        // ACCOUNT UI FUNCTION
        // =====================================

        async function updateAccountUI() {

            if (!supabaseClient) {
                return;
            }


            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                console.error(
                    "Session error:",
                    error
                );

                return;

            }


            const session =
                data.session;


            const account =
                document.getElementById(
                    "drawerAccount"
                );

            const avatar =
                document.getElementById(
                    "drawerAvatar"
                );

            const name =
                document.getElementById(
                    "drawerName"
                );

            const status =
                document.getElementById(
                    "drawerAccountStatus"
                );


            if (
                !account ||
                !avatar ||
                !name
            ) {

                return;

            }


            // =================================
            // USER IS NOT LOGGED IN
            // =================================

            if (
                !session ||
                !session.user
            ) {

                account.style.display =
                    "none";

                return;

            }


            // =================================
            // USER IS LOGGED IN
            // =================================

            account.style.display =
                "flex";


            const user =
                session.user;


            const metadata =
                user.user_metadata || {};


            // =================================
            // FIRST NAME
            // =================================

            let firstName = "";


            if (
                metadata.first_name
            ) {

                firstName =
                    metadata.first_name;

            }

            else if (
                metadata.full_name
            ) {

                firstName =
                    metadata.full_name
                        .trim()
                        .split(" ")[0];

            }

            else if (
                metadata.name
            ) {

                firstName =
                    metadata.name
                        .trim()
                        .split(" ")[0];

            }

            else if (
                user.email
            ) {

                firstName =
                    user.email
                        .split("@")[0];

            }

            else {

                firstName =
                    "User";

            }


            // =================================
            // PROFILE PHOTO
            // =================================

            const avatarURL =
                metadata.avatar_url ||
                metadata.picture ||
                null;


            // =================================
            // SET NAME
            // =================================

            name.textContent =
                firstName;


            if (status) {

                status.textContent =
                    "My Account";

            }


            // =================================
            // SET AVATAR
            // =================================

            if (avatarURL) {

                avatar.innerHTML = "";

                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    avatarURL;

                image.alt =
                    firstName;

                image.referrerPolicy =
                    "no-referrer";

                avatar.appendChild(
                    image
                );

            }

            else {

                avatar.innerHTML =
                    "👤";

            }

        }


        // =====================================
        // FEATURE CARD LOG
        // =====================================

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
                            card.querySelector(
                                "h3"
                            );

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


    }
);
