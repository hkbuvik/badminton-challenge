$$ = window.$$ || {};

$$.NotificationController = function () {

    return {
        isNotificationSupported: isNotificationSupported,
        isNotificationGranted: isNotificationGranted,
        isNotificationDenied: isNotificationDenied,
        askForNotificationPermission: askForNotificationPermission
    };

    function isNotificationSupported() {
        return 'Notification' in window;
    }

    function isNotificationGranted() {
        return isNotificationSupported() && Notification.permission === "granted";
    }

    function isNotificationDenied() {
        return isNotificationSupported() && Notification.permission === "denied";
    }

    function askForNotificationPermission(onResultAvailable) {
        if (isNotificationSupported()) {
            // noinspection JSIgnoredPromiseFromCall
            Notification
                .requestPermission(function (result) {
                    // Whatever the user answers, we make sure the browser stores the information
                    if (!('permission' in Notification)) {
                        Notification.permission = result;
                    }
                    onResultAvailable();
                })
        } else {
            console.log("This browser does not support notifications.");
            return false;
        }
    }

}();