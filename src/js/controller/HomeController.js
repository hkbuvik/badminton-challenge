$$ = window.$$ || {};

$$.HomeController = function () {

    const homeLink = document.getElementById("home-link");

    homeLink.onclick = showHome;

    function showHome(event) {
        event && event.preventDefault();
        $$.UserProfileController.hide(true);
        $$.TournamentRegistrationController.hide();
        $$.StartedTournamentController.hide();
        $$.TournamentsController.show();
    }

}();