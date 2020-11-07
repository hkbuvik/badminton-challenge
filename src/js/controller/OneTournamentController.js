$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const tournamentPanel = document.getElementById("one-tournament-panel");
    const tournamentName = document.getElementById("started-tournament-name");
    const tournamentRanking = document.getElementById("tournament-ranking");
    const setupNextMatchesButton = document.getElementById("setup-next-matches-button");

    let currentKey;
    let currentTournamentName;
    let currentPlayers = [];

    let listeners = [];

    setupNextMatchesButton.onclick = setupNextMatches;
    return {
        show: show,
        hide: hide
    };

    function show(key) {
        currentKey = key;
        listeners.push(
            $$.OneTournament.onTournamentValueChange(key, snapshot => {
                const tournament = snapshot.val();
                tournamentName.innerHTML = currentTournamentName = tournament.name;
                renderTournamentPanel(true);
            }));
        listeners.push(
            $$.OneTournament.onPlayersValueChange(key, snapshot => {
                currentPlayers = [];
                snapshot.forEach(playerSnapshot => {
                    currentPlayers.unshift(playerSnapshot.val())
                });
                renderTournamentPanel(true);
            }));
        listeners.push(
            $$.CurrentUser.isAdmin(() => setupNextMatchesButton.className = "fullWidth"));
    }

    function hide() {
        renderTournamentPanel(false);
        currentKey = null;
        currentPlayers = [];
        listeners.forEach(listener => {
            listener.off();
        });
        listeners = [];

    }

    function setupNextMatches() {
        
    }

    function renderTournamentPanel(show) {
        tournamentPanel.className = show ? "" : "hidden";
        if (show) {
            tournamentName.innerText = currentTournamentName;
            tournamentRanking.innerHTML = "";
            currentPlayers.forEach(player => {
                tournamentRanking.innerHTML += "<li>" + player + "</li>";
            });
        }
    }
}();