$$ = window.$$ || {};

$$.OneTournament = function () {

    return {
        onTournamentValueChange: onTournamentValueChange,
        onPlayersValueChange: onPlayersValueChange,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        start: start
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

    function start(tournamentKey) {
        return firebase.database().ref("tournaments/" + tournamentKey + "/started").set(true);
    }
}();