$$ = window.$$ || {};

$$.Version = function () {

    const refName = "version";

    return {
        get: get,
        onValueChange: onValueChange,
    };

    function get() {
        return firebase.database().ref(refName).once("value", snapshot => {
            return snapshot.val();
        });
    }

    function onValueChange(onValueChange) {
        const versionRef = firebase.database().ref(refName);
        versionRef.on("value", onValueChange);
        return versionRef;
    }

}();