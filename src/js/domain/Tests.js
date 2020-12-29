$$ = window.$$ || {};
$$.domain = $$.domain || {};
$$.domain.Tests = $$.domain.Tests || {};

$$.domain.Tests.NewPlayersInStartedTournament1 = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4", "new1", "new2", "new3"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank2"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank3"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 3);
    console.assert(newMatches[0].player1 === "rank2");
    console.assert(newMatches[0].player2 === "rank3");
    console.assert(newMatches[1].player1 === "rank1");
    console.assert(newMatches[1].player2 === "new1");
    console.assert(newMatches[2].player1 === "rank4");
    console.assert(newMatches[2].player2 === "new2");
    console.assert(newRanking.length === 7);
    console.assert(newRanking[6] === "new3");
}();

$$.domain.Tests.NewPlayersInStartedTournament2 = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4", "new1", "new2", "new3"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank2"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank4"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 3);
    console.assert(newMatches[0].player1 === "rank2");
    console.assert(newMatches[0].player2 === "rank4");
    console.assert(newMatches[1].player1 === "rank1");
    console.assert(newMatches[1].player2 === "new1");
    console.assert(newMatches[2].player1 === "rank3");
    console.assert(newMatches[2].player2 === "new2");
    console.assert(newRanking.length === 7);
    console.assert(newRanking[6] === "new3");
}();

$$.domain.Tests.MixedWins1 = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4", "rank5"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank2"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank3"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 2);
    console.assert(newMatches[0].player1 === "rank2");
    console.assert(newMatches[0].player2 === "rank3");
    console.assert(newMatches[1].player1 === "rank1");
    console.assert(newMatches[1].player2 === "rank5");
}();

$$.domain.Tests.EvenNumberOfPlayersMixedWins1 = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank2"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank3"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 2);
    console.assert(newMatches[0].player1 === "rank2");
    console.assert(newMatches[0].player2 === "rank3");
    console.assert(newMatches[1].player1 === "rank1");
    console.assert(newMatches[1].player2 === "rank4");
}();

$$.domain.Tests.MixedWins2 = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4", "rank5"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank1"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank4"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 2);
    console.assert(newMatches[0].player1 === "rank1");
    console.assert(newMatches[0].player2 === "rank4");
    console.assert(newMatches[1].player1 === "rank2");
    console.assert(newMatches[1].player2 === "rank5");
}();

$$.domain.Tests.EvenNumberOfPlayersMixedWins2 = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank1"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank4"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 2);
    console.assert(newMatches[0].player1 === "rank1");
    console.assert(newMatches[0].player2 === "rank4");
    console.assert(newMatches[1].player1 === "rank2");
    console.assert(newMatches[1].player2 === "rank3");
}();

$$.domain.Tests.LowestRankedWins = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4", "rank5"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank2"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank4"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 2);
    console.assert(newMatches[0].player1 === "rank2");
    console.assert(newMatches[0].player2 === "rank4");
    console.assert(newMatches[1].player1 === "rank1");
    console.assert(newMatches[1].player2 === "rank5");
}();

$$.domain.Tests.EvenNumberOfPlayersLowestRankedWins = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank2"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank4"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches.length === 2);
    console.assert(newMatches[0].player1 === "rank2");
    console.assert(newMatches[0].player2 === "rank4");
    console.assert(newMatches[1].player1 === "rank1");
    console.assert(newMatches[1].player2 === "rank3");
}();

$$.domain.Tests.HighestRankedWins = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4", "rank5"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank1"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank3"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches[0].player1 === "rank1");
    console.assert(newMatches[0].player2 === "rank3");
    console.assert(newMatches[1].player1 === "rank2");
    console.assert(newMatches[1].player2 === "rank5");
}();

$$.domain.Tests.EvenNumberOfPlayersHighestRankedWins = function () {
    const currentRanking = ["rank1", "rank2", "rank3", "rank4"];
    const currentMatches = [{
        player1: "rank1",
        player2: "rank2",
        winner: "rank1"
    }, {
        player1: "rank3",
        player2: "rank4",
        winner: "rank3"
    }];
    const newRanking = new $$.domain.Ranking(currentRanking, currentMatches).calculate();
    const newMatches = new $$.domain.Matches(newRanking).setUp();

    console.assert(newMatches[0].player1 === "rank1");
    console.assert(newMatches[0].player2 === "rank3");
    console.assert(newMatches[1].player1 === "rank2");
    console.assert(newMatches[1].player2 === "rank4");
}();