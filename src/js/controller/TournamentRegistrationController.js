$$ = window.$$ || {};

$$.TournamentRegistrationController = function () {

    const oneTournamentPanel = document.getElementById("tournament-registration-panel");
    const tournamentName = document.getElementById("tournament-name");
    const playersList = document.getElementById("tournament-players");
    const addPlayerButton = document.getElementById("add-player-button");
    const removePlayerButton = document.getElementById("remove-player-button");
    const startTournamentButton = document.getElementById("start-tournament-button");
    const registrationDeadlineText = document.getElementById("registration-deadline-text");
    const registrationDeadlinePassedText = document.getElementById("registration-deadline-passed-text");
    const noPlayersRegisteredText = document.getElementById("no-players-registered-text");

    let currentTournamentKey;
    let currentTournamentName;
    let currentPlayers = [];

    let listeners = [];

    addPlayerButton.onclick = addPlayer;
    removePlayerButton.onclick = removePlayer;
    startTournamentButton.onclick = startTournament;
    startTournamentButton.disabled = true;

    return {
        show: show,
        hide: hide
    };

    function show(tournamentKey) {
        currentTournamentKey = tournamentKey;
        oneTournamentPanel.className = "";
        listeners.push(
            $$.TournamentDescriptions.onValueChange(snapshot => {
                const tournament = snapshot.val()[tournamentKey];
                tournamentName.innerHTML = currentTournamentName = tournament.name;
                registrationDeadlineText.innerText = new Date(tournament.registrationDeadline).toLocaleDateString();
                if (Date.now() > tournament.registrationDeadline) {
                    renderRegistrationDeadlineIsPassed();
                }
            }),
            $$.Tournament.onPlayersValueChange(tournamentKey, snapshot => {
                currentPlayers = [];
                snapshot.forEach(playerSnapshot => {
                    currentPlayers.unshift(playerSnapshot.val())
                });
                startTournamentButton.disabled = (currentPlayers.length < 3);
                let isPlayerRegistered = currentPlayers.indexOf($$.CurrentUser.displayName()) === 0;
                renderRegistrationStatus(isPlayerRegistered);
                renderPlayerList(currentPlayers);
            }),
            $$.CurrentUser.onIsAdminValueChange(isAdmin =>
                startTournamentButton.className = isAdmin ? "fullWidth" : "hidden"));
    }

    function hide() {
        renderHidden();
        currentTournamentKey = null;
        currentPlayers = [];
        listeners.forEach(listener => {
            listener.off();
        });
        listeners = [];
    }

    function addPlayer() {
        $$.Tournament.addPlayer(currentTournamentKey);
        renderRegistrationStatus(true);
    }

    function removePlayer() {
        $$.Tournament.removePlayer(currentTournamentKey);
        renderRegistrationStatus(false);
    }

    function startTournament() {
        $$.TournamentDescriptions
            .start(currentTournamentKey)
            .then(() => {
                $$.StartedTournamentController.show(currentTournamentKey);
                hide();
            });
        // TODO: finally
    }

    function renderHidden() {
        oneTournamentPanel.className = "hidden";
        registrationDeadlinePassedText.className = "hidden";
    }

    function renderPlayerList(players) {
        if (players.length > 0) {
            playersList.innerHTML = "";
            players.forEach(player => {
                playersList.innerHTML += "<li>" + player + "</li>";
            });
            noPlayersRegisteredText.className = "hidden";
            playersList.className = "fullWidth";
        } else {
            noPlayersRegisteredText.className = "fullWidth small-font";
            playersList.className = "hidden";
        }
    }

    function renderRegistrationStatus(isPlayerRegistered) {
        addPlayerButton.className = isPlayerRegistered ? "hidden" : "fullWidth";
        removePlayerButton.className = isPlayerRegistered ? "fullWidth" : "hidden";
    }

    function renderRegistrationDeadlineIsPassed() {
        addPlayerButton.className = "hidden";
        removePlayerButton.className = "hidden";
        registrationDeadlinePassedText.className = "fullWidth small-font";
    }

}();