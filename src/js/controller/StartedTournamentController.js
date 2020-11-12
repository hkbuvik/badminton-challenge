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
        let newRanking = new Array(currentRanking.length);
        if (currentRoundNumber === 0) {
            Array.from(currentPlayers).forEach(idAndPlayer => newRanking.push(idAndPlayer[0]));
            randomize(newRanking);
        } else {
            for (let i = 0; i < newRanking.length; i++) {
                if (currentRanking.length % 2 !== 0 && i === (currentRanking.length - 1)) {
                    // Odd number of players: The lowest ranked stays put.
                    console.log("Odde antall spillere: Den lavest rankede går en opp");
                    newRanking[i - 1] = currentRanking[i];
                    continue;
                }
                // TODO: Only 1, 4, 5, 6, 8, 9 are tested.
                if (i % 2 === 0) {
                    console.log("Den høyeste rankede i matchen:");
                    if (currentRanking[i] === currentMatches[i].winner) {
                        if (i === 0) {
                            console.log("1. Blir på 1. plass");
                            newRanking[i] = currentRanking[i];
                        } else {
                            console.log("2. Går en opp");
                            newRanking[i - 1] = currentRanking[i];
                        }
                    } else {
                        if (i === newRanking.length - 1) {
                            console.log("3. Blir på sisteplass");
                            newRanking[i] = currentRanking[i];
                        } else if (i === newRanking.length - 2) {
                            console.log("4. Går en ned til sisteplass");
                            newRanking[i + 1] = currentRanking[i];
                        } else {
                            console.log("5. Går to ned til sisteplass");
                            newRanking[i + 2] = currentRanking[i];
                        }
                    }
                } else {
                    console.log("Den lavest rankede i matchen:");
                    if (currentRanking[i] === currentMatches[i - 1].winner) {
                        if (i === 1) {
                            console.log("6. Går en opp til førsteplass");
                            newRanking[i - 1] = currentRanking[i]
                        } else {
                            console.log("7. Går to opp til førsteplass");
                            newRanking[i - 2] = currentRanking[i]
                        }
                    } else {
                        if (i === newRanking.length - 1) {
                            console.log("8. Blir på sisteplass");
                            newRanking[i] = currentRanking[i]
                        } else {
                            console.log("9. Går en ned");
                            newRanking[i + 1] = currentRanking[i]
                        }
                    }
                }
            }
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
                        continue;
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

    function setMatchWinner(matchIndex, playerId) {
        $$.Tournament.setWinner(currentTournamentKey, matchIndex, playerId)
            .then(() => {
                // The view is refreshed by the listener.
            });
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
                for (let i = 0; i < currentMatches.length; i++) {
                    renderMatch(i, currentMatches[i]);
                }
                rankingDate.innerText = new Date(currentRankingDate).toLocaleDateString();
                rankingList.innerHTML = "";
                currentRanking.forEach(ranking => {
                    rankingList.innerHTML += "<li>" + playerNameFromId(ranking) + "</li>";
                });
            }
        }
    }

    function renderMatch(matchIndex, match) {
        const aMatch = document.createElement("li");
        const player1 = document.createElement("span");
        const player1Name = playerNameFromId(match.player1);
        player1.appendChild(renderWinnerLink(matchIndex, match.player1, player1Name, match.winner === match.player1));
        const player2 = document.createElement("span");
        const player2Name = playerNameFromId(match.player2);
        player2.appendChild(renderWinnerLink(matchIndex, match.player2, player2Name, match.winner === match.player2));
        aMatch.appendChild(player1);
        aMatch.appendChild(document.createTextNode(" - "));
        aMatch.appendChild(player2);
        matches.appendChild(aMatch);
    }

    function renderWinnerLink(matchIndex, playerId, playerName, won) {
        const a = document.createElement("a");
        a.setAttribute("href", "");
        a.innerHTML = playerName + " " + (won ? "😎" : "");
        a.onclick = (event) => {
            event && event.preventDefault();
            setMatchWinner(matchIndex, playerId);
        };
        return a;
    }

    function playerNameFromId(playerId) {
        return currentPlayers.filter(player => player[0] === playerId)[0][1]
    }

}();