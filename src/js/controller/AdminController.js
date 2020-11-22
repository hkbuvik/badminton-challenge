$$ = window.$$ || {};

$$.AdminController = function () {

    const adminPanel = document.getElementById("admin-panel");
    const versionUpgradeLink = document.getElementById("upgrade-version");

    return {
        init: init
    };

    function init() {
        if ($$.CurrentUser.isAdmin()) {
            adminPanel.className = "sub-fieldset";
            versionUpgradeLink.onclick = $$.VersionController.upgradeVersion;
        }
    }

}();
