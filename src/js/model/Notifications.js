$$ = window.$$ || {};

$$.Notifications = function () {

    return {
        onNotificationAdded: onNotificationAdded,
        setNotification: setNotification,
    };

    function onNotificationAdded(onAdded) {
        const notificationsRef = firebase.database().ref("notifications/");
        notificationsRef.on("child_added", snapshot => {
            onAdded(snapshot);
            firebase.database().ref("notifications/" + snapshot.key).set(null);
        });
        return notificationsRef
    }

    function setNotification(title, body) {
        const notificationsRef = firebase.database().ref("notifications/");
        const notificationKey = notificationsRef.push().key;
        const newNotification = {};
        newNotification[notificationKey] = {title, body};
        notificationsRef.update(newNotification);
    }

}();