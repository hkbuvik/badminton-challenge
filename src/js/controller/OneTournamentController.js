$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const oneTournamentPanel = document.getElementById("one-tournament-panel");
    const tournamentName = document.getElementById("tournament-name");

    return {
        show: show
    };

    function show(key) {
        oneTournamentPanel.className = "";
        $$.OneTournament.onValueChange(key, snapshot => tournamentName.innerText = snapshot.val().name);
    }
}();