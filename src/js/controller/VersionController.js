$$ = window.$$ || {};

$$.VersionController = function () {

    const versionLabel = document.getElementById("version");

    let currentVersion = 0;

    return {
        init: init,
        upgradeVersion: upgradeVersion
    };

    function init() {
        $$.Version.get()
            .then(version => {
                if (version.exists()) {
                    currentVersion = version.val();
                    versionLabel.innerText = currentVersion;
                }
                console.log("Current version is: " + currentVersion);
                $$.Version.onValueChange(version => {
                    if (version.exists() && version.val() !== currentVersion) {
                        window.location.reload(true);
                    }
                });
            });
    }

    function upgradeVersion(event) {
        event && event.preventDefault();
        $$.Version.set(new Date().toISOString());
    }

}();
