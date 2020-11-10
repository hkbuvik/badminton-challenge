$$ = window.$$ || {};

$$.StartedTournamentController = function () {

    const tournamentPanel = document.getElementById("started-tournament-panel");
    const rankingPanel = document.getElementById("ranking-panel");
    const tournamentName = document.getElementById("started-tournament-name");
    const roundNumber = document.getElementById("round-number");
    const matches = document.getElementById("matches");
    const tournamentRanking = document.getElementById("tournament-ranking");
    const setupNextMatchesButton = document.getElementById("setup-next-matches-button");

    let currentTournamentKey;
    let currentTournamentName;
    let currentRoundNumber;
    let currentPlayers = [];
    let currentRanking = [];
    let currentMatches = [];

    let listeners = [];

    setupNextMatchesButton.onclick = setupNextMatches;
    return {
        show: show,
        hide: hide
    };

    function show(tournamentKey) {
        currentTournamentKey = tournamentKey;
        listeners.push(
            $$.TournamentDescriptions.onValueChange(snapshot => {
                const tournament = snapshot.val()[tournamentKey];
                currentTournamentName = tournament.name;
            }),
            $$.Tournament.onTournamentValueChange(tournamentKey, snapshot => {
                const tournament = snapshot.val();
                // noinspection JSUnresolvedVariable
                currentRoundNumber = tournament.currentRoundNumber ? tournament.currentRoundNumber : 0;
                currentRanking = [];
                // noinspection JSUnresolvedVariable
                tournament.rankings.forEach(ranking => {
                    const key = Object.keys(ranking)[0];
                    currentRanking.push([key, ranking[key]]);
                });
                currentMatches = [];
                // noinspection JSUnresolvedVariable
                tournament.matches.forEach(match => {
                    currentMatches.push(match);
                });
                renderTournamentPanel(true);
            }),
            $$.Tournament.onPlayersValueChange(tournamentKey, snapshot => {
                currentPlayers = [];
                snapshot.forEach(playerSnapshot => {
                    const player = [playerSnapshot.key, playerSnapshot.val()];
                    currentPlayers.unshift(player)
                });
                renderTournamentPanel(true);
            }),
            $$.CurrentUser.isAdmin(() => setupNextMatchesButton.className = "fullWidth"));
    }

    function hide() {
        renderTournamentPanel(false);
        currentTournamentKey = null;
        currentPlayers = [];
        listeners.forEach(listener => {
            listener.off();
        });
        listeners = [];
    }

    function setupNextMatches() {

        // Calculate new ranking.
        let newRanking = [];
        if (currentRoundNumber === 0) {
            newRanking = Array.from(currentPlayers);
            randomize(newRanking);
        } else {
            // TODO: calculate
            for (let index = 0; index < currentRanking.length; index++) {
                const currentRankingElement = currentRanking[index];
                const ranking = [];
                ranking.push(currentRankingElement[0]);
                ranking.push(currentRankingElement[1]);
                newRanking.push(ranking);
            }
            randomize(newRanking);
        }

        // Persist new ranking.
        $$.Tournament.setRanking(currentTournamentKey, newRanking, ++currentRoundNumber)
            .then(() => {

                // Setup new matches
                let newMatches = [];
                let match;
                for (let index = 0; index < currentRanking.length; index++) {
                    if (currentRanking.length % 2 !== 0 && index == (currentRanking.length - 1)) {
                        // Odd number of players: The last match is not possible.
                        return;
                    }
                    const currentRankingElement = currentRanking[index];
                    const playerName = currentRankingElement[1];
                    if (index % 2 === 0) {
                        match = {
                            "player1": playerName,
                            "player2": ""
                        }
                    } else {
                        // noinspection JSUnusedAssignment
                        match.player2 = playerName;
                        // noinspection JSUnusedAssignment
                        newMatches.push(match);
                    }
                }

                // Persist new matches.
                $$.Tournament.setMatches(currentTournamentKey, newMatches)
                    .then(() => {
                        // TODO: render a "New matches is set up" message?

                        // The view is refreshed by the listener.
                    });
            });
    }

    function randomize(array) {
        let j, x, i;
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
    }

    function renderTournamentPanel(show) {
        tournamentPanel.className = show ? "" : "hidden";
        if (show) {
            tournamentName.innerText = currentTournamentName;
            roundNumber.innerText = currentRoundNumber + 1;
            if (currentRoundNumber > 0) {
                rankingPanel.className = "";
                matches.className = "";
                matches.innerHTML = "";
                currentMatches.forEach(match => {
                    matches.innerHTML += "<li>" + match.player1 + " - " + match.player2;
                });
                tournamentRanking.innerHTML = "";
                currentRanking.forEach(ranking => {
                    tournamentRanking.innerHTML += "<li>" + ranking[1] + "</li>";
                });
            }
        }
    }
}();