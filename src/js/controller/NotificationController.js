$$ = window.$$ || {};

$$.NotificationController = function () {

    return {
        init: init,
        isNotificationSupported: isNotificationSupported,
        isNotificationGranted: isNotificationGranted,
        isNotificationDenied: isNotificationDenied,
        askForNotificationPermission: askForNotificationPermission,
        sendNotification: sendNotification
    };

    function init() {
        console.log("Notifications is " + (isNotificationSupported() ? "" : "not") + " supported");
        if (isNotificationGranted()) {
            console.log("Notifications is " + (isNotificationGranted() ? "" : "not") + " granted");
        }
        $$.Notifications.onNotificationAdded(snapshot => {
                if (snapshot.exists()) {
                    const notification = snapshot.val();
                    notify(notification.body, notification.title)
                }
            }
        );
    }

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

    function sendNotification(title, body) {
        $$.Notifications.setNotification(title, body);
    }

    function notify(title, body) {
        if (isNotificationSupported() && isNotificationGranted()) {
            new Notification(title, {body: body});
        }
    }

}();