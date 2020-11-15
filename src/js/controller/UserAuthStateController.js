$$ = window.$$ || {};

$$.UserAuthStateController = function () {

    const userAuthStateLabel = document.getElementById("user-auth-state");

    let showUserProfile = false;

    userAuthStateLabel.onclick = toggleShowUserProfile;

    return {
        onUserSignedIn: onUserSignedIn
    };

    function onUserSignedIn() {
        userAuthStateLabel.innerText = "👤";
    }

    function toggleShowUserProfile(event) {
        event && event.preventDefault();
        showUserProfile = !showUserProfile;
        if (showUserProfile) {
            $$.UserProfileController.show();
        } else {
            $$.UserProfileController.hide();
        }
    }

}();