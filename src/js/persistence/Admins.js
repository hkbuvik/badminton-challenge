$$ = window.$$ || {};

$$.Admins = function () {

    return {
        onContainsCurrentUser: onContainsCurrentUser
    };

    function onContainsCurrentUser(onContainsCurrentUser) {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref("admins/" + uid).on("value", snapshot => {
            if (snapshot.val()) {
                onContainsCurrentUser();
            }
        });
    }

}();