$$ = window.$$ || {};

$$.UserProfileController = function () {

    const userProfilePanelModal = document.getElementById("user-profile-panel-modal");
    const userProfilePanelModalShowLink = document.getElementById("user-profile-panel-modal-show-link");
    const userProfilePanelModalHideLink = document.getElementById("user-profile-panel-modal-hide-link");
    const userProfilePanelModalContent = document.getElementById("user-profile-panel-modal-content");
    const userProfilePanel = document.getElementById("user-profile-panel");

    const userEmail = document.getElementById("user-email");
    const userDisplayNameInput = document.getElementById("user-display-name-input");
    const updateUserDisplayNameButton = document.getElementById("update-user-display-name-button");
    const updateUserDisplayNameStatus = document.getElementById("update-user-display-name-status");

    const requestNotificationButton = document.getElementById("request-notification-button");
    const notificationStatusPanel = document.getElementById("notification-status-panel");
    const notificationNotSet = document.getElementById("notification-not-set");
    const notificationGranted = document.getElementById("notification-granted");
    const notificationNotGranted = document.getElementById("notification-not-granted");

    let isShown = false;

    updateUserDisplayNameButton.onclick = updateUserDisplayName;
    userProfilePanelModalHideLink.onclick = hide;

    if ($$.NotificationController.isNotificationSupported()) {
        notificationStatusPanel.className = "sub-fieldset";
        requestNotificationButton.onclick = askForNotificationPermission;
        renderNotificationStatus();
    }

    return {
        onUserSignedIn: onUserSignedIn,
        show: show,
        hide: hide
    };

    function onUserSignedIn(user) {
        userEmail.innerText = user.email;
        if (user.displayName) {
            userDisplayNameInput.value = user.displayName;
        }
        $$.UserAuthStateController.onUserSignedIn();
    }

    function show() {
        if (userProfilePanelModal.className !== "hidden") {
            hide();
            return;
        }
        userProfilePanelModal.className = "overlay";
        userProfilePanel.className = "modal";
        userProfilePanelModalContent.className = "content";
        userProfilePanelModalHideLink.className = "cancel";
        userProfilePanelModalShowLink.click();
        userProfilePanelModalShowLink.href = "";
        isShown = true;
    }

    function hide(forceHide) {
        if (!forceHide && userProfilePanelModal.className === "hidden") {
            show();
            return;
        }
        userProfilePanelModal.className = "hidden";
        userProfilePanel.className = "hidden";
        userProfilePanelModalContent.className = "hidden";
        userProfilePanelModalHideLink.className = "hidden";
        userProfilePanelModalHideLink.click();
        userProfilePanelModalShowLink.href = "#user-profile-panel-modal";
        isShown = false;
    }

    function updateUserDisplayName() {
        userDisplayNameInput.disabled = true;
        $$.CurrentUser.updateUserDisplayName(
            userDisplayNameInput.value,
            () => updateUserDisplayNameStatus.innerText = "Lagret!",
            (displayName, error) => {
                updateUserDisplayNameStatus.innerText = "✘";
                console.warn('Failed to save user display name' + displayName + '! Error: ' + error);
            },
            () => {
                userDisplayNameInput.disabled = false;
                setTimeout(() => updateUserDisplayNameStatus.innerText = "", 3000);
            }
        );
    }

    function askForNotificationPermission() {
        $$.NotificationController.askForNotificationPermission(() => {
            renderNotificationStatus();
        });
    }

    function renderNotificationStatus() {
        if ($$.NotificationController.isNotificationGranted()) {
            notificationNotSet.className = "hidden";
            notificationGranted.className = "";
            notificationNotGranted.className = "hidden";
            requestNotificationButton.className = "hidden";
        } else if ($$.NotificationController.isNotificationDenied()) {
            notificationNotSet.className = "hidden";
            notificationGranted.className = "hidden";
            notificationNotGranted.className = "";
            requestNotificationButton.className = "hidden";
        } else {
            notificationNotSet.className = "";
            notificationGranted.className = "hidden";
            notificationNotGranted.className = "hidden";
            requestNotificationButton.className = "fullWidth";
        }
    }

}();