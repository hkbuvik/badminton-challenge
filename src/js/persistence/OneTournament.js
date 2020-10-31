$$ = window.$$ || {};

$$.OneTournament = function () {

    return {
        onValueChange: onValueChange
    };

    function onValueChange(key, onValueChange) {
        return firebase.database().ref("tournaments/" + key).on("value", onValueChange);
    }

}();