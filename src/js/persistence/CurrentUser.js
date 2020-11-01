$$ = window.$$ || {};

$$.CurrentUser = function () {

    return {
        key: key,
        displayName: displayName,
        isAdmin: isAdmin,
        isNotAdmin: isNotAdmin,
        updateUserDisplayName: updateUserDisplayName
    };

    function key() {
        return firebase.auth().currentUser.uid;
    }

    function displayName() {
        const currentUser = firebase.auth().currentUser;
        return currentUser.displayName
            ? currentUser.displayName
            : currentUser.email
    }

    function isAdmin(onIsAdmin) {
        firebase.database().ref("admins/" + key()).on("value", snapshot => {
            if (snapshot.val()) {
                onIsAdmin();
            }
        });
    }

    function isNotAdmin(onIsNotAdmin) {
        firebase.database().ref("admins/" + key()).on("value", snapshot => {
            if (!snapshot.val()) {
                onIsNotAdmin();
            }
        });
    }

    function updateUserDisplayName(userDisplayName, onSuccess, onError, onFinally) {
        firebase.auth().currentUser
            .updateProfile({displayName: userDisplayName})
            .then(() => {
                // Update the display name in the database also.
                firebase.database().ref("players/" + key() + "/tournaments").once("value",
                    snapshot => {
                        snapshot.forEach(tournament => {
                            const playerUpdates = {};
                            playerUpdates[key()] = userDisplayName;
                            firebase.database().ref("tournaments/" + tournament.key + "/players/")
                                .update(playerUpdates);
                        });
                    });

                // And then invoke the callback.
                onSuccess(userDisplayName);
            })
            .catch((error) => onError(userDisplayName, error))
            .finally(() => onFinally());

    }

}();