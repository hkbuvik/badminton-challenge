$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const oneTournamentPanel = document.getElementById("one-tournament-panel");
    const tournamentName = document.getElementById("tournament-name");
    const playersList = document.getElementById("tournament-players");
    const addPlayerButton = document.getElementById("add-player-button");
    const removePlayerButton = document.getElementById("remove-player-button");
    const startTournamentButton = document.getElementById("start-tournament-button");
    const registrationDeadlinePassedText = document.getElementById("registration-deadline-passed-text");

    let currentTournamentKey;
    let currentPlayers = [];

    addPlayerButton.onclick = addPlayer;
    removePlayerButton.onclick = removePlayer;
    startTournamentButton.onclick = startTournament;

    return {
        show: show
    };

    function show(tournamentKey) {
        currentTournamentKey = tournamentKey;
        oneTournamentPanel.className = "";
        $$.OneTournament.onTournamentValueChange(tournamentKey, snapshot => {
            tournamentName.innerText = "- " + snapshot.val().name;
            if (Date.now() > snapshot.val().registrationDeadline) {
                renderRegistrationDeadlineIsPassed()
            } else {
                let isPlayerRegistered = snapshot.val().players && snapshot.val().players[$$.CurrentUser.key()] != null;
                renderRegistrationStatus(isPlayerRegistered);
            }
        });
        $$.OneTournament.onPlayersValueChange(tournamentKey, snapshot => {
            currentPlayers = [];
            snapshot.forEach(playerSnapshot => {
                currentPlayers.unshift(playerSnapshot.val())
            });
            renderPlayerList(currentPlayers);
        });
        $$.CurrentUser.isAdmin(() => startTournamentButton.className = "fullWidth")
    }

    function addPlayer() {
        $$.OneTournament.addPlayer(currentTournamentKey);
        renderRegistrationStatus(true);
    }

    function startTournament() {
        // TODO: Turn off $$.OneTournament.onPlayersValueChange
        // TODO: Set up matches
    }

    function removePlayer() {
        $$.OneTournament.removePlayer(currentTournamentKey);
        renderRegistrationStatus(false);
    }

    function renderPlayerList(players) {
        playersList.innerHTML = "";
        players.forEach(player => {
            playersList.innerHTML += "<li>" + player + "</li>";
        });
    }

    function renderRegistrationStatus(isPlayerRegistered) {
        addPlayerButton.className = isPlayerRegistered ? "hidden" : "fullWidth";
        removePlayerButton.className = isPlayerRegistered ? "fullWidth" : "hidden";
    }

    function renderRegistrationDeadlineIsPassed() {
        addPlayerButton.className = "hidden";
        removePlayerButton.className = "hidden";
        registrationDeadlinePassedText.className = "fullWidth subtext";
    }

}();