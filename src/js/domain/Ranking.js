$$ = window.$$ || {};
$$.domain = $$.domain || {};

$$.domain.Ranking = function (currentRanking, currentMatches) {

    return {
        calculate: calculate,
    };

    function calculate() {

        let newRanking = [];

        /*
            Calculate from played matches.
         */
        const lastMatchNumber = currentMatches.length - 1;
        const lowestRankedInLastMatch = lastMatchNumber * 2 + 1;
        const lowestRankedOverall = currentRanking.length - 1;
        for (let matchNumber = 0; matchNumber < currentMatches.length; matchNumber++) {
            const highestRankingInMatch = matchNumber * 2;
            const winnerRanking = matchNumber === 0
                // First match, winner is ranked as 0.
                ? highestRankingInMatch
                // Other matches, winner goes one match up.
                : highestRankingInMatch - 1;
            const looserRanking = (matchNumber === lastMatchNumber && lowestRankedInLastMatch === lowestRankedOverall)
                // Last match, with even number of players and no newly registered players, stay at current match.
                ? highestRankingInMatch + 1
                // Other matches, or last match with odd number of players or newly registered players, go one match down.
                : highestRankingInMatch + 2;

            const highestRankedPlayer = currentRanking[highestRankingInMatch];
            const lowestRankedPlayer = currentRanking[highestRankingInMatch + 1];

            // noinspection JSUnresolvedVariable
            if (currentMatches[matchNumber].winner === highestRankedPlayer) {
                newRanking[winnerRanking] = highestRankedPlayer;
                newRanking[looserRanking] = lowestRankedPlayer;
            } else {
                newRanking[winnerRanking] = lowestRankedPlayer;
                newRanking[looserRanking] = highestRankedPlayer;
            }
        }

        /*
            Add players that has not played in this round (odd number or newly registered).
         */
        if (lowestRankedOverall > lowestRankedInLastMatch) {
            // First player goes one match up (the looser went one match down).
            newRanking[lowestRankedInLastMatch] = currentRanking[lowestRankedInLastMatch + 1];
            // The rest is added at the end.
            currentRanking.splice(lowestRankedInLastMatch + 2)
                .forEach(ranking => newRanking.push(ranking));
        }

        return newRanking;
    }
};