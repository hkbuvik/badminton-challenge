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
    let currentRoundNumber = 0;
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
        $$.Tournament.oncePlayers(tournamentKey, snapshot => {
            if (snapshot.exists()) {
                currentPlayers = [];
                snapshot.forEach(playerSnapshot => {
                    const player = [playerSnapshot.key, playerSnapshot.val()];
                    currentPlayers.unshift(player)
                });
                listeners.push(
                    $$.TournamentDescriptions.onValueChange(snapshot => {
                        const tournament = snapshot.val()[tournamentKey];
                        renderTournamentName(tournament.name);
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
                        renderRankingsPanel();
                        renderMatches();
                        renderTournamentPanel(true);
                    }),
                    $$.CurrentUser.onIsAdminValueChange(isAdmin =>
                        setupNextMatchesButton.className = isAdmin ? "fullWidth" : "hidden"));
            } else {
                console.error("Failed to find players!")
            }
        });
    }

    function hide() {
        renderTournamentPanel(false);
        listeners.forEach(listener => {
            listener.off();
        });
        listeners = [];
        currentPlayers = [];
        currentMatches = [];
        currentRanking = [];
        currentRoundNumber = 0;
        currentTournamentKey = null;
    }

    function setupNextMatches() {

        let newRanking = new Array(currentRanking.length);
        const isOddNumberOfPlayers = newRanking.length % 2 !== 0;

        if (currentRoundNumber === 0) {
            // Set up random ranking.
            Array.from(currentPlayers).forEach(idAndPlayer => newRanking.push(idAndPlayer[0]));
            randomize(newRanking);
        } else {
            // Calculate new ranking.
            for (let i = 0; i < newRanking.length; i++) {

                if (isOddNumberOfPlayers && i === (newRanking.length - 1)) {
                    console.log("Odde antall spillere: Den lavest rankede går en opp");
                    newRanking[i - 1] = currentRanking[i];
                    continue;
                }

                let matchNumber;
                if (i === 0 || i === 1) {
                    matchNumber = 0;
                } else if (i % 2 === 0) {
                    matchNumber = i - i / 2;
                } else {
                    matchNumber = i - (i - 1) / 2 - 1;
                }

                // NB! Only these are tested: 1,2,3,4,7,8,9,10
                if (i % 2 === 0) {
                    console.log("Den høyeste rankede i match " + matchNumber + ":");
                    // noinspection JSUnresolvedVariable
                    if (currentRanking[i] === currentMatches[matchNumber].winner) {
                        if (i === 0) {
                            console.log("1. Blir på førsteplass");
                            newRanking[i] = currentRanking[i];
                        } else {
                            console.log("2. Går en opp");
                            newRanking[i - 1] = currentRanking[i];
                        }
                    } else {
                        if (i === 0) {
                            console.log("3. Førsteplass går alltid to ned");
                            newRanking[i + 2] = currentRanking[i];
                        } else if (i === matchNumber * 2) {
                            if (isOddNumberOfPlayers) {
                                console.log("4. Går to ned til sisteplass");
                                newRanking[i + 2] = currentRanking[i];
                            } else {
                                console.log("5. Går en ned til sisteplass");
                                newRanking[i + 1] = currentRanking[i];
                            }
                        } else {
                            console.log("6. Går to ned");
                            newRanking[i + 2] = currentRanking[i];
                        }
                    }

                } else {
                    console.log("Den lavest rankede i match " + matchNumber + ":");
                    // noinspection JSUnresolvedVariable
                    if (currentRanking[i] === currentMatches[matchNumber].winner) {
                        if (i === 1) {
                            console.log("7. Går en opp til førsteplass");
                            newRanking[i - 1] = currentRanking[i]
                        } else {
                            console.log("8. Går to opp");
                            newRanking[i - 2] = currentRanking[i]
                        }
                    } else {
                        if (i === 1) {
                            console.log("9. Nummer to går alltid en ned");
                            newRanking[i + 1] = currentRanking[i]
                        } else if (i === matchNumber * 2 + 1) {
                            if (isOddNumberOfPlayers) {
                                console.log("10. Går en ned fra sisteplass");
                                newRanking[i + 1] = currentRanking[i]
                            } else {
                                console.log("11. Blir på sisteplass");
                                newRanking[i] = currentRanking[i]
                            }
                        } else {
                            console.log("12. Går en ned");
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

                renderRankingsPanel();

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
                        renderMatches();
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

    function renderRankingsPanel() {
        if (currentRoundNumber > 1) {
            rankingPanel.className = "";
            rankingDate.innerText = new Date(currentRankingDate).toLocaleDateString();
            rankingList.innerHTML = "";
            currentRanking.forEach(ranking => {
                rankingList.innerHTML += "<li>" + playerNameFromId(ranking) + "</li>";
            });
        } else {
            rankingPanel.className = "hidden";
        }
    }

    function renderMatches() {
        if (currentRoundNumber > 0) {
            // noinspection JSUnresolvedVariable
            setupNextMatchesButton.disabled = currentMatches.filter(match => match.winner)
                .length !== currentMatches.length;
            matches.className = "";
            matches.innerHTML = "";
            for (let i = 0; i < currentMatches.length; i++) {
                renderMatch(i, currentMatches[i]);
            }
        } else {
            setupNextMatchesButton.disabled = false;
        }
    }

    function renderTournamentName(theTournamentName) {
        tournamentName.innerText = theTournamentName;
    }

    function renderTournamentPanel(show) {
        tournamentPanel.className = show ? "" : "hidden";
        if (show) {
            roundNumber.innerText = "" + currentRoundNumber;
        }
    }

    function renderMatch(matchIndex, match) {
        const player1 = document.createElement("span");
        const player1Name = playerNameFromId(match.player1);
        // noinspection JSUnresolvedVariable
        const isPlayer1Winner = match.winner === match.player1;
        player1.appendChild(renderWinnerLink(matchIndex, match.player1, player1Name, isPlayer1Winner));
        if (isPlayer1Winner) {
            player1.className = "winner";
        }

        const player2 = document.createElement("span");
        const player2Name = playerNameFromId(match.player2);
        // noinspection JSUnresolvedVariable
        const isPlayer2Winner = match.winner === match.player2;
        player2.appendChild(renderWinnerLink(matchIndex, match.player2, player2Name));
        if (isPlayer2Winner) {
            player2.className = "winner";
        }

        const aMatch = document.createElement("li");
        aMatch.appendChild(player1);
        aMatch.appendChild(document.createTextNode(" - "));
        aMatch.appendChild(player2);
        matches.appendChild(aMatch);
    }

    function renderWinnerLink(matchIndex, playerId, playerName, isPlayerWinner) {
        const a = document.createElement("a");
        a.innerHTML = playerName;
        if ($$.CurrentUser.isAdmin() || $$.CurrentUser.key() === playerId) {
            a.setAttribute("href", "");
            a.onclick = (event) => {
                event && event.preventDefault();
                if (isPlayerWinner) {
                    $$.Tournament.deleteWinner(currentTournamentKey, matchIndex)
                        .then(() => {
                            // The view is refreshed by the listener.
                        });
                } else {
                    $$.Tournament.setWinner(currentTournamentKey, matchIndex, playerId)
                        .then(() => {
                            // The view is refreshed by the listener.
                        });
                }
            };
        }
        return a;
    }

    function playerNameFromId(playerId) {
        return currentPlayers.filter(player => player[0] === playerId)[0][1]
    }

}();