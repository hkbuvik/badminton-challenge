$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const oneTournamentPanel = document.getElementById("one-tournament-panel");
    const tournamentName = document.getElementById("tournament-name");
    const playersList = document.getElementById("tournament-players");
    const addPlayerButton = document.getElementById("add-player-button");
    const removePlayerButton = document.getElementById("remove-player-button");

    let currentTournamentKey;

    addPlayerButton.onclick = addPlayer;
    removePlayerButton.onclick = removePlayer;

    return {
        show: show
    };

    function show(tournamentKey) {
        currentTournamentKey = tournamentKey;
        oneTournamentPanel.className = "";
        $$.OneTournament.onTournamentValueChange(tournamentKey, snapshot => {
            tournamentName.innerText = "- " + snapshot.val().name;
            let isPlayerAdded = snapshot.val().players[$$.CurrentUser.key()] != null;
            renderAddRemovePlayerButtons(isPlayerAdded);
        });
        $$.OneTournament.onPlayersValueChange(tournamentKey, renderPlayerList);
    }

    function addPlayer() {
        $$.OneTournament.addPlayer(currentTournamentKey);
        renderAddRemovePlayerButtons(true);
    }

    function removePlayer() {
        $$.OneTournament.removePlayer(currentTournamentKey);
        renderAddRemovePlayerButtons(false);
    }

    function renderPlayerList(snapshot) {
        playersList.innerHTML = "";
        snapshot.forEach(playerSnapshot => {
            playersList.innerHTML += playerSnapshot.val() + "<br>";
        });
    }

    function renderAddRemovePlayerButtons(isPlayerAdded) {
        addPlayerButton.className = isPlayerAdded ? "hidden" : "fullWidth";
        removePlayerButton.className = isPlayerAdded ? "fullWidth" : "hidden";
    }

}();