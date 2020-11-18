$$ = window.$$ || {};

$$.Version = function () {

    const refName = "version";

    return {
        set: set,
        get: get,
        onValueChange: onValueChange,
    };

    function set(newVersion) {
        firebase.database().ref(refName).set(newVersion);
    }

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