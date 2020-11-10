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
                        const key = Object.keys(ranking)[0];
                        currentRanking.push([key, ranking[key]]);
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
                console.table(currentPlayers)
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
                    if (currentRanking.length % 2 !== 0 && index === (currentRanking.length - 1)) {
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

    function setMatchWinner(playerName) {
        console.log(playerName + " won!")
        $$.Tournament.setWinner(playerName)
            .then(() => {
                // The view is refreshed by the listener.
            });
    }

    function renderMatch(match, winner) {
        const aMatch = document.createElement("li");
        const player1 = document.createElement("span");
        player1.appendChild(renderWinnerLink(match.player1, winner === match.player1));
        const player2 = document.createElement("span");
        player2.appendChild(renderWinnerLink(match.player2, winner === match.player2));
        aMatch.appendChild(player1);
        aMatch.appendChild(document.createTextNode(" - "));
        aMatch.appendChild(player2);
        matches.appendChild(aMatch);
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
                    renderMatch(match, match.player1);
                });
                rankingDate.innerText = new Date(currentRankingDate).toLocaleDateString();
                rankingList.innerHTML = "";
                currentRanking.forEach(ranking => {
                    rankingList.innerHTML += "<li>" + ranking[1] + "</li>";
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

}();