$$ = window.$$ || {};

$$.main = function () {

    const onUserSignedIn = (user) => {
        $$.UserProfileController.onUserSignedIn(user);
        $$.TournamentsController.init();
    };

    $$.FirebaseController.init(onUserSignedIn);

    console.log("Badminton Challenge application started " + Date.now());
}();


