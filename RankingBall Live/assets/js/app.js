
var app = (function (win) {
    'use strict';
    
    var timeInMs = Date.now();    
    document.write("<script type='text/javascript' src='http://scv.rankingball.com/asset/js/rankingball.js?'" + timeInMs + "><"+"/script>");

    
    // Global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };

    var showError = function(message) {
        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function(message, title, callback) {
        navigator.notification.confirm(message, callback || function () {
        }, title, ['확인', '취소']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    // Handle device back button tap
    var onBackKeyDown = function(e) {
        e.preventDefault();

        navigator.notification.confirm('랭킹볼을 종료하시겠습니까?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
               //AppHelper.logout().then(exit, exit);
                exit();
            }
        }, '종료', ['확인', '취소']);
    };

    var onOffline = function(e) {
        e.preventDefault();

        navigator.notification.confirm('네트워크 접속이 끊어졌습니다.\n\n랭킹볼을 종료하시겠습니까?', function (confirmed) {
            if (confirmed === true || confirmed === 1) {
                navigator.app.exitApp();
            }
        }, '종료', ['확인', '취소']);
    }
    
    var onDeviceReady = function() {
        
        navigator.splashscreen.show();
        
        var init_process = initService();
        if(!init_process) {
            showError('init Error');
        }
        
        setTimeout(function() {
            navigator.splashscreen.hide();    
        }, 2000);
       

        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);
        document.addEventListener("offline", onOffline, false);
               
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    var everliveOptions = {
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    };

    if(appSettings.everlive.url){
        everliveOptions.url = appSettings.everlive.url;
    }

    // Initialize Everlive SDK
    //var el = new Everlive(everliveOptions);
    var el = new Everlive('rMFp1tqhIxWOMyKT');
    
    var emptyGuid = '00000000-0000-0000-0000-000000000000';
 
    var AppHelper = {

        showAppVersion: function() {
          cordova.getAppVersion(function(version) {
            alert("Current App Version: " + version);
          });
        },
        
        // Return user profile picture url
        resolveProfilePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/avatar.png';
            }
        },

        // Return current activity picture url
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            return kendo.toString(new Date(dateString), 'MMM d, yyyy');
        },

        // Current user logout
        logout: function () {
              //return el.Users.logout();
            return true;
        },

        autoSizeTextarea: function () {
            var rows = $(this).val().split('\n');
            $(this).prop('rows', rows.length + 1);
        }
    };

    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';
    init_apps.osType = (os.ios) ? 2 : 1;
    
    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
                                                     initial: "landing",
                                                     layout: "main-layout",
                                                     statusBarStyle: statusBarStyle,
                                                     skin: "flat"
                                                 });
   
    return {
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        everlive: el
    };
}(window));
