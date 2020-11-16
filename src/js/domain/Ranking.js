$$ = window.$$ || {};

$$.Ranking = function (currentRanking, currentMatches) {

    return {
        calculate: calculate
    };

    function calculate() {

        let newRanking = new Array(currentRanking.length);
        const isOddNumberOfPlayers = newRanking.length % 2 !== 0;

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
        return newRanking;
    }
};