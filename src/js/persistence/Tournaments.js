$$ = window.$$ || {};

$$.Tournaments = (() => {

    const tournaments = firebase.database().ref("tournaments");

    return {
        add: add
    };

    function add(name) {
        const tournament = {
            "name": name
        }
        const key = tournaments.push().key;
        const newTournament = {};
        newTournament[key] = tournament;
        tournaments.update(newTournament);
        console.log("Persisted tournament with key " + key + " and name " + tournament.name);
        return key;
    }

});