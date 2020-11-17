$$ = window.$$ || {};

$$.Main = function () {

    $$.FirebaseController.init((user) => {
        $$.VersionController.init();
        $$.NotificationController.init();
        $$.UserProfileController.onUserSignedIn(user);
        $$.CurrentUser.init()
            .then(() => {
                $$.TournamentsController.show();
            });
    });

    const now = new Date();
    console.log("Badminton Challenge application started " + now.toLocaleDateString() + " " + now.toLocaleTimeString());
}();
