

var app = app || {};

app.PushRegistrar = (function () {

    'use strict';

    var _onPushErrorOccurred = function (message) {
        alert("Error: " + message, true);
    };

    var _processPushMessage = function (message, date) {
        //alert(date + " : " + message);
        console.log(date+""+message);
    };

    var onAndroidPushReceived = function (e) {
        var message = e.message;
        //var dateCreated = app.helper.formatDate(e.payload.customData.dateCreated);
        var dateCreated = '';
        //alert(message);
        _processPushMessage(message, dateCreated);
    };

    var onIosPushReceived = function (e) {
        var message = e.alert;
        var dateCreated = app.formatDate(e.dateCreated);

        _processPushMessage(message, dateCreated);
    };

    var pushSettings = {
        android: {
            senderID: appSettings.androidPIN.androidProjectNumber
        },
        iOS: {
            badge: "true",
            sound: "true",
            alert: "true"
        },
        notificationCallbackAndroid: onAndroidPushReceived,
        notificationCallbackIOS: onIosPushReceived,
    };

    var enablePushNotifications = function () {
        //var devicePlatform = device.platform; // get the device platform from the Cordova Device API
        //console.log("Initializing push notifications for " + devicePlatform + '...');

        var currentDevice = app.everlive.push.currentDevice(appSettings.constants.EMULATOR_MODE);

        var customDeviceParameters = {
            "LastLoginDate": new Date()
        };

        currentDevice.enableNotifications(pushSettings)
            .then(
                function (initResult) {
                    //_onDeviceIsSuccessfullyInitialized();
                    init_apps.memUID = initResult.token;
                    return currentDevice.getRegistration();
                },
                function (err) {
                    _onPushErrorOccurred(err.message);
                }
                ).then(
                    function (registration) {
                        //_onDeviceIsAlreadyRegistered();

                        currentDevice
                            .updateRegistration(customDeviceParameters)
                            .then(function () {
                               // _onDeviceRegistrationUpdated();
                            }, function (err) {
                                _onPushErrorOccurred(err.message);
                            });
                    },
                    function (err) {
                        if (err.code === 801) {
                            //_onDeviceIsNotRegistered();

                            currentDevice.register(customDeviceParameters)
                                .then(function (regData) {
                                    init_apps.memUID = regData.token;
                                    //_onDeviceIsSuccessfullyRegistered();
                                }, function (err) {
                                    _onPushErrorOccurred(err.message);
                                });
                        }
                        else {
                            _onPushErrorOccurred(err.message);
                        }
                    }
                    );
    };

    return {
        enablePushNotifications : enablePushNotifications
    }
}());
