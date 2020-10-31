$$ = window.$$ || {};

$$.main = function () {

    const onUserSignedIn = (user) => {
        $$.UserProfileController.onUserSignedIn(user);
        $$.TournamentsController.init();
    };

    $$.FirebaseController.init(onUserSignedIn);

}();


