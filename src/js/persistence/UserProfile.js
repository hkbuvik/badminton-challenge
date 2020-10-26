$$ = window.$$ || {};

$$.UserProfile = function () {

    return {
        updateUserDisplayName: (userDisplayName, onSuccess, onError, onFinally) => {
            firebase.auth().currentUser
                .updateProfile({displayName: userDisplayName})
                .then(() => onSuccess(userDisplayName))
                .catch((error) => onError(userDisplayName, error))
                .finally(() => onFinally());
        }
    };

}();