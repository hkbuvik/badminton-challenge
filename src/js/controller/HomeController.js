$$ = window.$$ || {};

$$.HomeController = function () {

    const homeLink = document.getElementById("home-link");

    homeLink.onclick = showHome;

    function showHome(event) {
        event && event.preventDefault();
        $$.UserProfileController.toggleShow(false);
        $$.OneTournamentRegistrationController.hide();
        $$.OneTournamentController.hide();
        $$.TournamentsController.show();
    }

}();