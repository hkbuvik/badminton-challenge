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

    let isShown = false;

    updateUserDisplayNameButton.onclick = updateUserDisplayName;
    userProfilePanelModalHideLink.onclick = hide;

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

}();