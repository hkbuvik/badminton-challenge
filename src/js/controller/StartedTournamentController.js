$$ = window.$$ || {};

$$.StartedTournamentController = function () {

    const tournamentPanel = document.getElementById("started-tournament-panel");
    const tournamentName = document.getElementById("started-tournament-name");
    const roundNumber = document.getElementById("round-number");
    const rankingPanel = document.getElementById("ranking-panel");
    const rankingDate = document.getElementById("ranking-date");
    const rankingList = document.getElementById("ranking-list");
    const matches = document.getElementById("matches");
    const setupNextMatchesButton = document.getElementById("setup-next-matches-button");

    let currentTournamentKey;
    let currentTournamentName;
    let currentRoundNumber;
    let currentPlayers = [];
    let currentRanking = [];
    let currentRankingDate;
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
                renderTournamentPanel(true);
            }),
            $$.Tournament.onTournamentValueChange(tournamentKey, snapshot => {
                const tournament = snapshot.val();
                // noinspection JSUnresolvedVariable
                currentRoundNumber = tournament.currentRoundNumber ? tournament.currentRoundNumber : 0;
                // noinspection JSUnresolvedVariable
                currentRankingDate = tournament.rankingsCreatedAt ? tournament.rankingsCreatedAt : 0;
                currentRanking = [];
                // noinspection JSUnresolvedVariable
                if (tournament.rankings) {
                    // noinspection JSUnresolvedVariable
                    tournament.rankings.forEach(ranking => {
                        currentRanking.push(ranking);
                    });
                }
                currentMatches = [];
                if (tournament.matches) {
                    // noinspection JSUnresolvedVariable
                    tournament.matches.forEach(match => {
                        currentMatches.push(match);
                    });
                }
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
            Array.from(currentPlayers).forEach(idAndPlayer => newRanking.push(idAndPlayer[0]));
            randomize(newRanking);
        } else {
            // TODO: calculate
            for (let index = 0; index < currentRanking.length; index++) {
                const currentRankingElement = currentRanking[index];
                newRanking.push(currentRanking[index]);
            }
            randomize(newRanking);
        }
        // Persist new ranking.
        const newRoundNumber = currentRoundNumber + 1;
        $$.Tournament.setRanking(currentTournamentKey, newRanking, newRoundNumber)
            .then(() => {

                // Setup new matches
                let newMatches = [];
                let match;
                for (let index = 0; index < currentRanking.length; index++) {
                    if (currentRanking.length % 2 !== 0 && index === (currentRanking.length - 1)) {
                        // Odd number of players: The last match is not possible.
                        return;
                    }
                    const playerId = currentRanking[index];
                    if (index % 2 === 0) {
                        match = {
                            "player1": playerId,
                            "player2": ""
                        }
                    } else {
                        // noinspection JSUnusedAssignment
                        match.player2 = playerId;
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

    function setMatchWinner(playerName) {
        console.log(playerName + " won!")
        // $$.Tournament.setWinner(playerName)
        //     .then(() => {
        //         // The view is refreshed by the listener.
        //     });
    }

    function renderMatch(match) {
        const aMatch = document.createElement("li");
        const player1 = document.createElement("span");
        const player1Name = playerNameFromId(match.player1);
        player1.appendChild(renderWinnerLink(player1Name, match.winner === match.player1));
        const player2 = document.createElement("span");
        const player2Name = playerNameFromId(match.player2);
        player2.appendChild(renderWinnerLink(player2Name, match.winner === match.player2));
        aMatch.appendChild(player1);
        aMatch.appendChild(document.createTextNode(" - "));
        aMatch.appendChild(player2);
        matches.appendChild(aMatch);
    }

    function renderTournamentPanel(show) {
        tournamentPanel.className = show ? "" : "hidden";
        if (show) {
            tournamentName.innerText = currentTournamentName;
            roundNumber.innerText = currentRoundNumber;
            if (currentRoundNumber > 0) {
                rankingPanel.className = "";
                matches.className = "";
                matches.innerHTML = "";
                currentMatches.forEach(match => {
                    renderMatch(match);
                });
                rankingDate.innerText = new Date(currentRankingDate).toLocaleDateString();
                rankingList.innerHTML = "";
                currentRanking.forEach(ranking => {
                    rankingList.innerHTML += "<li>" + playerNameFromId(ranking) + "</li>";
                });
            }
        }
    }

    function renderWinnerLink(playerName, won) {
        const a = document.createElement("a");
        a.setAttribute("href", "");
        a.innerHTML = playerName + " " + (won ? "😎" : "");
        a.onclick = (event) => {
            event && event.preventDefault();
            setMatchWinner(playerName);
        };
        return a;
    }

    function playerNameFromId(playerId) {
        return currentPlayers.filter(player => player[0] === playerId)[0][1]
    }

}();