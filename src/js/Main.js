$$ = window.$$ || {};

$$.Main = function () {

    $$.FirebaseController.init((user) => {
        $$.NotificationController.init();
        $$.UserProfileController.onUserSignedIn(user);
        $$.CurrentUser.init()
            .then(() => {
                $$.VersionController.init();
                $$.AdminController.init();
                $$.TournamentsController.show();
            });
    });

    const now = new Date();
    console.log("Badminton Challenge application started " + now.toLocaleDateString() + " " + now.toLocaleTimeString());
}();
