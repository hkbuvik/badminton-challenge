$$ = window.$$ || {};

$$.CurrentUser = function () {

    let isCurrentUserAdmin = false;

    return {
        isAdmin: isAdmin,
        isNotAdmin: isNotAdmin,
        init: init,
        key: key,
        displayName: displayName,
        onIsAdminValueChange: onIsAdminValueChange,
        updateUserDisplayName: updateUserDisplayName
    };

    function init() {
        onIsAdminValueChange(isAdmin => isCurrentUserAdmin = isAdmin);
        console.log("Checking if current user is administrator...");
        return firebase.database()
            .ref("admins/" + key())
            .once("value", snapshot => {
                isCurrentUserAdmin = snapshot.exists();
                console.log("Current user is" + (isCurrentUserAdmin ? "" : " not") + " administrator");
            });
    }

    function isAdmin() {
        return isCurrentUserAdmin;
    }

    function isNotAdmin() {
        return !isCurrentUserAdmin;
    }

    function key() {
        return firebase.auth().currentUser.uid;
    }

    function displayName() {
        const currentUser = firebase.auth().currentUser;
        return currentUser.displayName && currentUser.displayName.length > 0
            ? currentUser.displayName
            : currentUser.email
    }

    function onIsAdminValueChange(onValueChange) {
        const whenIsAdminRef = firebase.database().ref("admins/" + key());
        whenIsAdminRef.on("value", snapshot => {
            isAdmin = snapshot.val();
            onValueChange(isAdmin);
        });
        return whenIsAdminRef;
    }

    function updateUserDisplayName(userDisplayName, onSuccess, onError, onFinally) {
        // noinspection JSUnresolvedFunction
        firebase.auth().currentUser
            .updateProfile({displayName: userDisplayName})
            .then(() => {
                // Update the display name in the database also.
                firebase.database().ref("players/" + key() + "/tournaments").once("value",
                    snapshot => {
                        const displayName = userDisplayName.length === 0 ? displayName() : userDisplayName;
                        snapshot.forEach(tournament => {
                            const playerUpdates = {};
                            playerUpdates["tournaments/" + tournament.key + "/players/" + key()] = displayName;
                            firebase.database().ref().update(playerUpdates)
                                .then(() => {
                                    // And then invoke the callback.
                                    onSuccess(userDisplayName);
                                });
                        });
                    });
            })
            .catch((error) => onError(userDisplayName, error))
            .finally(() => onFinally());
    }

}();