$$ = window.$$ || {};

$$.Tournament = function () {

    return {
        onTournamentValueChange: onTournamentValueChange,
        onPlayersValueChange: onPlayersValueChange,
        oncePlayers: oncePlayers,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        setRanking: setRanking,
        setMatches: setMatches,
        setWinner: setWinner
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

    function oncePlayers(tournamentKey, oncePlayers) {
        const playersRef = firebase.database().ref("tournaments/" + tournamentKey + "/players/");
        playersRef.once("value", snapshot => {
            oncePlayers(snapshot);
            playersRef.off();
        });
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
        updates["tournaments/" + tournamentKey + "/rankingsCreatedAt"] = new Date().getTime();
        for (let index = 0; index < newRankings.length; index++) {
            updates["tournaments/" + tournamentKey + "/rankings/" + index] = newRankings[index];
        }
        updates["tournaments/" + tournamentKey + "/currentRoundNumber"] = newRoundNumber;
        return firebase.database().ref().update(updates);
    }

    function setMatches(tournamentKey, newMatches) {
        return firebase.database().ref("tournaments/" + tournamentKey + "/matches").set(newMatches);
    }

    function setWinner(tournamentKey, matchIndex, playerId) {
        return firebase.database().ref("tournaments/" + tournamentKey + "/matches/" + matchIndex + "/winner").set(playerId);
    }

}();