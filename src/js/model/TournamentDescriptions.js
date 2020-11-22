$$ = window.$$ || {};

$$.TournamentDescriptions = function () {

    const refName = "tournamentDescriptions";

    return {
        onValueChange: onValueChange,
        add: add,
        start: start
    };

    function onValueChange(onValueChange) {
        const tournamentDescriptionsRef = firebase.database().ref(refName).orderByKey();
        tournamentDescriptionsRef.on("value", onValueChange);
        return tournamentDescriptionsRef;
    }

    function add(tournament, onFinally) {
        let tournamentsRef = firebase.database().ref(refName);
        const key = tournamentsRef.push().key;
        const newTournament = {};
        newTournament[key] = tournament;
        tournamentsRef.update(newTournament, onFinally);
        console.log("Persisted tournament with key " + key + " and name " + tournament.name);
    }

    function start(tournamentKey) {
        return firebase.database().ref(refName + "/" + tournamentKey + "/started").set(true);
    }

}();