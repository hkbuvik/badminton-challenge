$$ = window.$$ || {};

$$.Tournament = function () {

    return {
        onTournamentValueChange: onTournamentValueChange,
        onPlayersValueChange: onPlayersValueChange,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        setRanking: setRanking,
        setMatches: setMatches
    };

    function onTournamentValueChange(tournamentKey, onValueChange) {
        const tournamentRef = firebase.database().ref("tournaments/" + tournamentKey);
        tournamentRef.on("value", onValueChange);
        return tournamentRef
    }

    function onPlayersValueChange(tournamentKey, onValueChange) {
        const playerRef = firebase.database().ref("tournaments/" + tournamentKey + "/players/");
        playerRef.on("value", onValueChange);
        return playerRef;
    }

    function addPlayer(tournamentKey) {
        const updates = {};
        updates["players/" + $$.CurrentUser.key() + "/tournaments/" + tournamentKey] = true;
        updates["tournaments/" + tournamentKey + "/players/" + $$.CurrentUser.key()] = $$.CurrentUser.displayName();
        firebase.database().ref().update(updates);
    }

    function removePlayer(tournamentKey) {
        const updates = {};
        updates["players/" + $$.CurrentUser.key() + "/tournaments/" + tournamentKey] = null;
        updates["tournaments/" + tournamentKey + "/players/" + $$.CurrentUser.key()] = null;
        firebase.database().ref().update(updates);
    }

    function setRanking(tournamentKey, newRankings, newRoundNumber) {
        const updates = {};
        for (let index = 0; index < newRankings.length; index++) {
            const ranking = {};
            ranking[newRankings[index][0]] = newRankings[index][1];
            updates["tournaments/" + tournamentKey + "/rankings/" + index] = ranking;

        }
        updates["tournaments/" + tournamentKey + "/currentRoundNumber"] = newRoundNumber;
        return firebase.database().ref().update(updates);
    }

    function setMatches(tournamentKey, newMatches) {
        return firebase.database().ref("tournaments/" + tournamentKey + "/matches").set(newMatches);
    }

}();