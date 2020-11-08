$$ = window.$$ || {};

$$.StartedTournamentController = function () {

    const tournamentPanel = document.getElementById("started-tournament-panel");
    const tournamentName = document.getElementById("started-tournament-name");
    const roundNumber = document.getElementById("round-number");
    const matches = document.getElementById("matches");
    const tournamentRanking = document.getElementById("tournament-ranking");
    const setupNextMatchesButton = document.getElementById("setup-next-matches-button");

    let currentKey;
    let currentTournamentName;
    let currentRoundNumber;
    let currentPlayers = [];

    let listeners = [];

    setupNextMatchesButton.onclick = setupNextMatches;
    return {
        show: show,
        hide: hide
    };

    function show(tournamentKey) {
        currentKey = tournamentKey;
        listeners.push(
            $$.TournamentDescriptions.onValueChange(snapshot => {
                const tournament = snapshot.val()[tournamentKey];
                currentTournamentName = tournament.name;
            }),
            $$.Tournament.onTournamentValueChange(tournamentKey, snapshot => {
                const tournament = snapshot.val();
                // noinspection JSUnresolvedVariable
                currentRoundNumber = tournament.currentRoundNumber ? tournament.currentRoundNumber : 0;
                renderTournamentPanel(true);
            }),
            $$.Tournament.onPlayersValueChange(tournamentKey, snapshot => {
                currentPlayers = [];
                snapshot.forEach(playerSnapshot => {
                    currentPlayers.unshift(playerSnapshot.val())
                });
                renderTournamentPanel(true);
            }),
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
            roundNumber.innerText = currentRoundNumber + 1;
            if (currentRoundNumber > 0) {
                tournamentRanking.innerHTML = "";
                currentPlayers.forEach(player => {
                    tournamentRanking.innerHTML += "<li>" + player + "</li>";
                });
            }
        }
    }
}();