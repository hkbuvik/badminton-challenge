$$ = window.$$ || {};

$$.CurrentUser = function () {

    return {
        isAdmin: isAdmin,
        isNotAdmin: isNotAdmin,
        updateUserDisplayName: updateUserDisplayName
    };

    function isAdmin(onIsAdmin) {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref("admins/" + uid).on("value", snapshot => {
            if (snapshot.val()) {
                onIsAdmin();
            }
        });
    }

    function isNotAdmin(onIsNotAdmin) {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref("admins/" + uid).on("value", snapshot => {
            if (!snapshot.val()) {
                onIsNotAdmin();
            }
        });
    }

    function updateUserDisplayName(userDisplayName, onSuccess, onError, onFinally) {
        firebase.auth().currentUser
            .updateProfile({displayName: userDisplayName})
            .then(() => onSuccess(userDisplayName))
            .catch((error) => onError(userDisplayName, error))
            .finally(() => onFinally());
    }

}();