$$ = window.$$ || {};

$$.NotificationController = function () {

    return {
        isNotificationSupported: isNotificationSupported,
        isNotificationGranted: isNotificationGranted,
        askForNotificationPermission: askForNotificationPermission
    };

    function isNotificationSupported() {
        return 'Notification' in window;
    }

    function isNotificationGranted() {
        return isNotificationSupported() && Notification.permission === "granted";
    }

    function askForNotificationPermission() {
        if (isNotificationSupported()) {
            return Notification.requestPermission()
                .then(grantedResult => {
                    storePermissionResult(grantedResult);
                });
        } else {
            console.log("This browser does not support notifications.");
            return false;
        }
    }

    /**
     * Handles the result of asking for notification permission.
     *
     * @param grantedResult Will be one of: "granted", "denied" or "default",
     * see https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission
     */
    function storePermissionResult(grantedResult) {
        // Whatever the user answers, we make sure the browser stores the information
        if (!('permission' in Notification)) {
            Notification.permission = grantedResult;
        }

        return Notification.permission === 'granted';
    }

}();