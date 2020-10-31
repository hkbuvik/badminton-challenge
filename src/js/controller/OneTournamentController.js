$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const oneTournamentPanel = document.getElementById("one-tournament-panel");

    return {
        show: show
    };

    function show(key) {
        oneTournamentPanel.className = "";
    }
}();