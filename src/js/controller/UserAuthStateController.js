$$ = window.$$ || {};

$$.UserAuthStateController = function () {

    const userAuthStateLabel = document.getElementById("user-auth-state");

    let showUserProfile = false;

    userAuthStateLabel.onclick = toggleShowUserProfile;

    return {
        onUserSignedIn: onUserSignedIn
    };

    function onUserSignedIn() {
        userAuthStateLabel.innerHTML = "&#8801;&#8801;";
    }

    function toggleShowUserProfile(event) {
        event && event.preventDefault();
        showUserProfile = !showUserProfile;
        $$.UserProfileController.toggleShow(showUserProfile);
    }

}();