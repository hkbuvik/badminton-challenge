$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const oneTournamentPanel = document.getElementById("one-tournament-panel");
    const tournamentName = document.getElementById("tournament-name");
    const playersList = document.getElementById("tournament-players");
    const addPlayerButton = document.getElementById("add-player-button");

    let currentTournamentKey;

    addPlayerButton.onclick = addPlayer;

    return {
        show: show
    };

    function show(key) {
        currentTournamentKey = key;
        oneTournamentPanel.className = "";
        $$.OneTournament.onTournamentValueChange(key, snapshot => tournamentName.innerText = snapshot.val().name);
        $$.OneTournament.onPlayersValueChange(key, renderPlayerList);
    }

    function renderPlayerList(snapshot) {
        playersList.innerHTML = "";
        snapshot.forEach(playerSnapshot => {
            playersList.innerHTML += playerSnapshot.val() + "<br>";
        });
    }

    function addPlayer() {
        $$.OneTournament.addPlayer(currentTournamentKey);
    }

}();