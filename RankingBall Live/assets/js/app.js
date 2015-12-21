
var app = (function (win) {
    'use strict';
    
    // Remote Server Used
    //var timeInMs = Date.now();    
    //document.write("<script type='text/javascript' src='http://scv.rankingball.com/asset/js/rankingball.js?'" + timeInMs + "><"+"/script>");

    
    // Global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };

    var showError = function(message) {
        showAlert(message, '이용안내');
    };

    win.addEventListener('error', function (e) {
        e.preventDefault();
        
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        if(e.message === undefined || e.message === "undefined") {
            console.log("Error occured : undefined " + e);
        } else {
            showAlert(message, 'Error occured');
        }  
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

        navigator.notification.confirm('라이브볼-사커를 종료하시겠습니까?', function (confirmed) {
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

        navigator.notification.confirm('네트워크 접속이 끊어졌습니다.\n\n라이브볼-사커를 종료하시겠습니까?', function (confirmed) {
            if (confirmed === true || confirmed === 1) {
                navigator.app.exitApp();
            }
        }, '종료', ['확인', '취소']);
    }
    
    var onDeviceReady = function() {
        //StatusBar.overlaysWebView(false);
                
        
        console.log("device check strat");
        
        navigator.splashscreen.show();
        
        StatusBar.hide();
        
        var locUID = getlocalStorage('push_wiz');
        if( locUID && locUID !== 'undefined' ) {
            init_apps.memUID = locUID; 
            console.log("push load from localstorage : " + init_apps.memUID);  
        } else {
            app.PushRegistrar.enablePushNotifications();
            console.log("push init!");
        }
        
        
        init_apps.deviceID = device.uuid;
        initAppService.initAppVersion();
        
        
        
        /*
        setTimeout(function() {
            navigator.splashscreen.hide();    
        }, 2000);
        */

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

    //black
    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'balck';

    init_apps.osType = (os.ios) ? 2 : 1;
    
    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
                                                     initial: "landing",
                                                     layout: "main-layout",
                                                     statusBarStyle: 'hidden',
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
