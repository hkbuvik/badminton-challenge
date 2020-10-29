$$ = window.$$ || {};

$$.main = function () {

    const onUserSignedIn = (user) => $$.UserProfileController.onUserSignedIn(user);

    $$.FirebaseController.init(onUserSignedIn);

    setTimeout(
        () => $$.Tournaments().add("Høst 2020"),
        5000);

}();


