$$ = window.$$ || {};

$$.UserAuthStateController = function () {

    const userAuthStateLabel = document.getElementById("user-auth-state");

    let showUserProfile = false;

    userAuthStateLabel.onclick = (event) => toggleShowUserProfile(event);

    return {
        onUserSignedIn: onUserSignedIn
    };

    function onUserSignedIn() {
        userAuthStateLabel.innerText = "O";
    }

    function toggleShowUserProfile(event) {
        event && event.preventDefault();
        showUserProfile = !showUserProfile;
        $$.UserProfileController.toggleShow(showUserProfile);
    }

}();