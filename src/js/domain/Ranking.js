$$ = window.$$ || {};
$$.domain = $$.domain || {};

$$.domain.Ranking = function (currentRanking, currentMatches) {

    return {
        calculate: calculate
    };

    function calculate() {

        let newRanking = new Array(currentRanking.length);
        const isOddNumberOfPlayers = newRanking.length % 2 !== 0;

        console.groupCollapsed("Calculating new ranking");

        for (let i = 0; i < newRanking.length; i++) {
            if (isOddNumberOfPlayers && i === (newRanking.length - 1)) {
                console.log("Odde antall spillere: Den lavest rankede går en opp");
                newRanking[i - 1] = currentRanking[i];
                continue;
            }

            const numberOfMatches = (isOddNumberOfPlayers ? newRanking.length - 1 : newRanking.length) / 2;

            let currentMatchNumber;
            if (i === 0 || i === 1) {
                currentMatchNumber = 0;
            } else if (i % 2 === 0) {
                currentMatchNumber = i - i / 2;
            } else {
                currentMatchNumber = i - (i - 1) / 2 - 1;
            }

            if (i % 2 === 0) {
                console.group("Den høyeste rankede i match " + currentMatchNumber + ":");
                // noinspection JSUnresolvedVariable
                if (currentRanking[i] === currentMatches[currentMatchNumber].winner) {
                    if (i === 0) {
                        // First match.
                        console.log("1. Vinner blir på førsteplass");
                        newRanking[i] = currentRanking[i];
                    } else {
                        // All other matches
                        console.log("2. Vinner går en opp");
                        newRanking[i - 1] = currentRanking[i];
                    }
                } else {
                    if (i === 0) {
                        // First match.
                        console.log("3. Taper på førsteplass går alltid to ned");
                        newRanking[i + 2] = currentRanking[i];
                    } else if (i === (numberOfMatches * 2) - 2) {
                        // Last match
                        if (isOddNumberOfPlayers) {
                            console.log("4. Taper går to ned til sisteplass");
                            newRanking[i + 2] = currentRanking[i];
                        } else {
                            console.log("5. Taper går en ned til sisteplass");
                            newRanking[i + 1] = currentRanking[i];
                        }
                    } else {
                        // All other matches
                        console.log("6. Taper går to ned");
                        newRanking[i + 2] = currentRanking[i];
                    }
                }
                console.groupEnd();
            } else {

                console.group("Den lavest rankede i match " + currentMatchNumber + ":");
                // noinspection JSUnresolvedVariable
                if (currentRanking[i] === currentMatches[currentMatchNumber].winner) {
                    if (i === 1) {
                        // First match.
                        console.log("7. Vinner går en opp til førsteplass");
                        newRanking[i - 1] = currentRanking[i]
                    } else {
                        // All other matches
                        console.log("8. Vinner går to opp");
                        newRanking[i - 2] = currentRanking[i]
                    }
                } else {
                    if (i === 1) {
                        // First match.
                        console.log("9. Taper går alltid en ned");
                        newRanking[i + 1] = currentRanking[i]
                    } else if (i === (numberOfMatches * 2) - 1) {
                        // Last match
                        if (isOddNumberOfPlayers) {
                            console.log("10. Taper går en ned til sisteplass");
                            newRanking[i + 1] = currentRanking[i]
                        } else {
                            console.log("11. Taper blir på sisteplass");
                            newRanking[i] = currentRanking[i]
                        }
                    } else {
                        // All other matches
                        console.log("12. Taper går en ned");
                        newRanking[i + 1] = currentRanking[i]
                    }
                }
                console.groupEnd();
            }
        }
        console.groupEnd();

        return newRanking;
    }
};