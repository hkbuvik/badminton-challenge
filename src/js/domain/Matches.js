$$ = window.$$ || {};

$$.Matches = function (currentRanking) {

    return {
        setUp: setUp
    };

    function setUp() {
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
        return newMatches;
    }
};