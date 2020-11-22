$$ = window.$$ || {};

$$.StartedTournamentController = function () {

    const winnerTexts = [
        "🥇 VINNER! 🥇",
        "🏅 GRATTIS! 🏅",
        "🏵 JIPPI! 🏵",
        "🎗 KONGE! 🎗 ",
        "🎖 JUHUU! 🎖",
        "🏆 HURRA! 🏆",
        "🔱 SEIER! 🔱",
        "⭐️ STJERNE! ⭐️",
        "💥 KANON! 💥",
        "🏸 GULL! 🏸"
    ];

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
                        currentTournamentName = tournament.name;
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

        let newRanking = [];

        if (currentRoundNumber === 0) {
            // Set up random ranking.
            Array.from(currentPlayers).forEach(idAndPlayer => newRanking.push(idAndPlayer[0]));
            randomize(newRanking);
        } else {
            // Calculate new ranking.
            newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
        }

        // Persist new ranking.
        const newRoundNumber = currentRoundNumber + 1;
        $$.Tournament.setRanking(currentTournamentKey, newRanking, newRoundNumber)
            .then(() => {

                renderRankingsPanel();

                // Setup new matches
                let newMatches = new $$.domain.Matches(currentRanking).setUp();

                // Persist new matches.
                $$.Tournament.setMatches(currentTournamentKey, newMatches)
                    .then(() => {
                        renderMatches();
                        $$.NotificationController.sendNotification(
                            "Badminton Challenge: Ny kamprunde!",
                            "En ny runde i turneringen'" + currentTournamentName + "' er klar. God kamp!");
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
        const player1Name = playerNameFromId(match.player1);
        // noinspection JSUnresolvedVariable
        const isPlayer1WinnerAlready = match.winner === match.player1;
        const winnerLink1 = renderWinnerLink(matchIndex, match.player1, player1Name, isPlayer1WinnerAlready);
        const player1 = document.createElement("span");
        player1.appendChild(winnerLink1);
        if (isPlayer1WinnerAlready) {
            player1.className = "winner";
        }

        const player2Name = playerNameFromId(match.player2);
        // noinspection JSUnresolvedVariable
        const isPlayer2WinnerAlready = match.winner === match.player2;
        const player2 = document.createElement("span");
        const winnerLink2 = renderWinnerLink(matchIndex, match.player2, player2Name, isPlayer2WinnerAlready);
        player2.appendChild(winnerLink2);
        if (isPlayer2WinnerAlready) {
            player2.className = "winner";
        }

        const aMatch = document.createElement("li");
        aMatch.appendChild(player1);
        aMatch.appendChild(document.createTextNode(" - "));
        aMatch.appendChild(player2);
        matches.appendChild(aMatch);
    }

    function renderWinnerLink(matchIndex, playerId, playerName, isPlayerWinnerAlready) {
        const a = document.createElement("a");
        a.innerHTML = playerName;
        if ($$.CurrentUser.isAdmin() || $$.CurrentUser.key() === playerId) {
            a.setAttribute("href", "");
            a.onclick = (event) => {
                event && event.preventDefault();
                a.disabled = true;
                if (!isPlayerWinnerAlready) {
                    event.target.innerHTML = winnerTexts[Math.floor(Math.random() * 10)];
                    setTimeout(() => {
                            $$.Tournament.setWinner(currentTournamentKey, matchIndex, playerId)
                                .then(() => {
                                    // The view is refreshed by the listener.
                                });
                        },
                        1000)
                } else {
                    $$.Tournament.deleteWinner(currentTournamentKey, matchIndex)
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