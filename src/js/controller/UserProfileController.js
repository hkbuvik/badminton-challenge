$$ = window.$$ || {};

$$.UserProfileController = function () {

    const userProfilePanel = document.getElementById("user-profile-panel");
    const userEmail = document.getElementById("user-email");
    const userDisplayNameInput = document.getElementById("user-display-name-input");
    const updateUserDisplayNameButton = document.getElementById("update-user-display-name-button");
    const updateUserDisplayNameStatus = document.getElementById("update-user-display-name-status");

    updateUserDisplayNameButton.onclick = updateUserDisplayName;

    return {
        onUserSignedIn: onUserSignedIn,
        toggleShow: toggleShow
    };

    function onUserSignedIn(user) {
        userEmail.innerText = user.email;
        if (user.displayName) {
            userDisplayNameInput.value = user.displayName;
        }
        $$.UserAuthStateController.onUserSignedIn();
    }

    function toggleShow(show) {
        userProfilePanel.className = show ? "" : "hidden";
    }

    function updateUserDisplayName() {
        userDisplayNameInput.disabled = true;
        $$.CurrentUser.updateUserDisplayName(
            userDisplayNameInput.value,
            () => updateUserDisplayNameStatus.innerText = "✔",
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