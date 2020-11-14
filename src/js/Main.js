$$ = window.$$ || {};

$$.Main = function () {

    $$.FirebaseController.init((user) => {
        $$.UserProfileController.onUserSignedIn(user);
        $$.CurrentUser.init()
            .then(() => {
                $$.TournamentsController.init();
            });
    });

    console.log("Badminton Challenge application started " + Date.now());
}();
