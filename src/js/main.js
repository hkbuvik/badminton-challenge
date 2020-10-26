$$ = window.$$ || {};

$$.main = function () {

    const onUserSignedIn = (user) => $$.UserProfileController.onUserSignedIn(user);

    $$.FirebaseController.init(onUserSignedIn);

}();


