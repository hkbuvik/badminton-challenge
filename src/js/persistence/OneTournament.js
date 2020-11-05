$$ = window.$$ || {};

$$.OneTournament = function () {

    return {
        onTournamentValueChange: onTournamentValueChange,
        onPlayersValueChange: onPlayersValueChange,
        addPlayer: addPlayer,
        removePlayer: removePlayer
    };

    function onTournamentValueChange(tournamentKey, onValueChange) {
        return firebase.database().ref("tournaments/" + tournamentKey)
            .on("value", onValueChange);
    }

    function onPlayersValueChange(tournamentKey, onValueChange) {
        return firebase.database().ref("tournaments/" + tournamentKey + "/players/")
            .on("value", onValueChange);
    }

    function addPlayer(tournamentKey) {
        const player = {tournaments: {}};
        player.tournaments[tournamentKey] = true;
        const updates = {};
        updates["players/" + $$.CurrentUser.key()] = player;
        updates["tournaments/" + tournamentKey + "/players/" + $$.CurrentUser.key()] = $$.CurrentUser.displayName();
        firebase.database().ref().update(updates);
    }

    function removePlayer(tournamentKey) {
        const updates = {};
        updates["players/" + $$.CurrentUser.key()] = null;
        updates["tournaments/" + tournamentKey + "/players/" + $$.CurrentUser.key()] = null;
        firebase.database().ref().update(updates);
    }

}();