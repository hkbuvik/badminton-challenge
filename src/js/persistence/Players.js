$$ = window.$$ || {};

$$.Players = function () {

    const players = firebase.database().ref("players");

    return {
        add: add
    };

    function add(player) {
        const key = players.push().key;
        const newPlayer = {};
        newPlayer[key] = player;
        players.update(newPlayer);
        console.log("Persisted player with key " + key + " and name " + player.name);
        return key;
    }

};