$$ = window.$$ || {};

$$.Tournaments = function () {

    return {
        onValueChange: onValueChange,
        add: add
    };

    function onValueChange(onValueChange) {
        return firebase.database().ref("tournaments").orderByKey().on("value", onValueChange);
    }

    function add(name, onFinally) {
        const tournament = {
            "name": name
        };
        let tournaments = firebase.database().ref("tournaments");
        const key = tournaments.push().key;
        const newTournament = {};
        newTournament[key] = tournament;
        tournaments.update(newTournament, onFinally);
        console.log("Persisted tournament with key " + key + " and name " + tournament.name);
        return key;
    }

}();