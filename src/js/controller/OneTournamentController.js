$$ = window.$$ || {};

$$.OneTournamentController = function () {

    const oneTournamentPanel = document.getElementById("one-tournament-panel");
    const tournamentName = document.getElementById("tournament-name");
    const playersList = document.getElementById("tournament-players");
    const addPlayerButton = document.getElementById("add-player-button");
    const removePlayerButton = document.getElementById("remove-player-button");
    const startTournamentButton = document.getElementById("start-tournament-button");
    const registrationDeadlineText = document.getElementById("registration-deadline-text");
    const registrationDeadlinePassedText = document.getElementById("registration-deadline-passed-text");
    const noPlayersRegisteredText = document.getElementById("no-players-registered-text");

    let currentTournamentKey;
    let currentPlayers = [];

    let listeners = [];

    addPlayerButton.onclick = addPlayer;
    removePlayerButton.onclick = removePlayer;
    startTournamentButton.onclick = startTournament;

    return {
        show: show,
        hide: hide
    };

    function show(tournamentKey) {
        currentTournamentKey = tournamentKey;
        oneTournamentPanel.className = "";
        listeners.push(
            $$.OneTournament.onTournamentValueChange(tournamentKey, snapshot => {
                const tournament = snapshot.val();
                tournamentName.innerHTML = tournament.name;
                registrationDeadlineText.innerText = new Date(tournament.registrationDeadline).toLocaleDateString();
                if (Date.now() > tournament.registrationDeadline) {
                    renderRegistrationDeadlineIsPassed();
                } else {
                    let isPlayerRegistered = tournament.players && tournament.players[$$.CurrentUser.key()] != null;
                    renderRegistrationStatus(isPlayerRegistered);
                }
            }));
        listeners.push(
            $$.OneTournament.onPlayersValueChange(tournamentKey, snapshot => {
                currentPlayers = [];
                snapshot.forEach(playerSnapshot => {
                    currentPlayers.unshift(playerSnapshot.val())
                });
                renderPlayerList(currentPlayers);
            }));
        listeners.push(
            $$.CurrentUser.isAdmin(() => startTournamentButton.className = "fullWidth"));
    }

    function hide() {
        renderHidden();
        currentTournamentKey = null;
        listeners.forEach(listener => {
            listener.off();
        });
        listeners = [];
    }

    function addPlayer() {
        $$.OneTournament.addPlayer(currentTournamentKey);
        renderRegistrationStatus(true);
    }

    function removePlayer() {
        $$.OneTournament.removePlayer(currentTournamentKey);
        renderRegistrationStatus(false);
    }

    function startTournament() {
        const tournamentKey = currentTournamentKey;
        hide();

        // TODO: $$.SsTournament.start(tournamentKey);
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
            noPlayersRegisteredText.className = "fullWidth subtext";
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
        registrationDeadlinePassedText.className = "fullWidth subtext";
    }

}();