var init_data = {}, init_apps = {}, app_status = true;
var temrsService, termsPersonal;
var uu_data = {};
var guest = false;
var registType = 2; // member join type ( normal: 1, guest: 2, sns: 3 )

var contestListData = ""; // Total Game List
var contestFtypeData = ""; // Game Group - Featured
var contest5typeData = ""; // Game Group - 50 / 50
var contestGtypeData = ""; // Game Group - GuaranteedtmpData
var muContestF = ""; // my Game Featured
var muContest5 = ""; // my Game 50 / 50
var muContestG = ""; // my Game Guaranteed

var myGames = "";

var playerData = [];
var entryAmount = 0;
var max_salarycap_amount = 30000;

var currentContestType = "";

var errorMessage = {
    game_param: "경기 정보를 확인할 수 없습니다.",
    game_empty: "참가할 수 있는 경기가 없습니다.",
    game_time: "게임 진행 중에는 입장하실 수 없습니다.",
    game_started: "게임 진행 중에는 입장하실 수 없습니다.",
    game_closed: "게임 결과를 확인 하시겠습니까?",
    game_cash: "입장료가 부족해서 참가하실 수 없습니다.\n\n캐쉬를 구매하시겠습니까?"
};



var routine_version_check = function(device, version) {
    var returnValue = true;
    var param = '{"osType":' + device + ',"version":"' + version + '"}';
    $.ajax({
               url: "http://m3.liveball.kr:8080/rankBall/query.frz?callback=?",
               type: "GET",
               async: false,
               dataType: "jsonp",
               jsonpCallback: "jsonCallback",
               data: {
            "type": "apps",
            "id": "checkVersion",
            "param":param
        },
               success: function(response) {
                   if (response.code === 0) {
                       var inits = response.data;
                       init_data = {
                           status: inits.serviceStatus,
                           apps: inits.APPS,
                           auth: inits.AUTH,
                           extr: inits.EXTR,
                           file: inits.FILE,
                           note: inits.NOTE,
                           path: inits.PATH,
                           port: inits.PORT,
                           sp: inits.supportVer
                       };
                       var tmpVersion = version.replace(/\./g, "");
                
                       if (tmpVersion < init_data.sp.replace(/\./g, "")) {
                           app_status = false;
                           navigator.notification.confirm('신규 버전으로 업데이트하셔야 합니다.\n\n지금 업데이트하시겠습니까?', function (confirmed) {
                               if (confirmed === true || confirmed === 1) {
                                   openAppStore();
                               }
                           }, '종료', ['확인', '취소']);
                           //app.showConfirm('신규 버전으로 업데이트하셔야 합니다.\n\n지금 업데이트하시겠습니까?','업데이트 안내',openAppStore());
                       } else {
                           routine_device_check();
                       }
                   } else {
                       app_status = false;
                       returnValue = false;
                   }
               },
               complete: function() {
                   //navigator.splashscreen.hide();
               },
               error: function(e) {
                   console.log(e);
               }
           });  
   
    return returnValue;
};

var routine_device_check = function() {
    if (!app_status) {
        alert("error status");
        return false;
    }
    
    // Not use yet!!
    //var guest = getlocalStorage('strusm');
    
    var localData = getlocalStorage('appd');
    var localPass = getlocalStorage('doStrip');
    
    if (localData && registType === 1) {
        var storageObject = $.parseJSON(localData);
        if (storageObject.status === 1) {    
            if (localPass) {
                app.Login.loginAutoim(localPass);
            }
        }
    } else {
        if (init_data.status === 1) {
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","deviceID":"' + init_apps.deviceID + '"}';
            var url = init_data.auth + "?callback=?";
            
            $.ajax({
                       url: url,
                       type: "GET",
                       async: false,
                       dataType: "jsonp",
                       jsonpCallback: "jsonCallback",
                       data: {
                    "type": "apps",
                    "id": "checkMemberDevice",
                    "param":param
                },
                       success: function(response) {
                           if (response.code === 0) {
                               uu_data = response.data;
                               //setlocalStorage('appd',JSON.stringify(uu_data));
                               $('#start-game').addClass('hide');
                               $('#processing-message').removeClass('hide');
                               navigator.splashscreen.hide();
                               app.Login.loginAutoim('');
                           }
                       },
                       complete: function() {
                           //navigator.splashscreen.hide();  
                       },
                       error: function(e) {
                           console.log(e); 
                       }
                   });  
        } else {
            app.showError("앱 초기화 실패");
        }
    }  
};

var openAppStore = function() {
    window.open('http://streetlab.co.kr', '_blank', 'location=no');
};

var jsonp_request = function(url, request) {
    var params = {};
    if (request)
        params = $.param(request);
    
    $.ajax({
               url: url,
               dataType: "jsonp",
               jsonpCallback: "jsonCallback",
               data: params,
               success: function(response) {
                   console.log(response); // server response
               }
           });  
};

var initService = function() {
    var app_version = "1.0.1";
    
    if (window.navigator.simulator === true) {
        console.log('This plugin is not available in the simulator.');
        //return true;
    } else if (cordova.getAppVersion === undefined) {
        console.log('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
        //return true;
    } else {
        cordova.getAppVersion.getVersionNumber(function(value) {
            app_version = value;
        });
    }
    
    var version_check = routine_version_check(init_apps.osType, app_version);

    if (!version_check)
        return false;
    
    var device_uuid = device.uuid;
    //console.log(device_uuid);

    if ((!appSettings.androidPIN.androidProjectNumber || !appSettings.androidPIN.androidProjectNumber === "655705940082") && device.platform.toLowerCase() === "android") {
        console.log('Please enter an Android project number in order to receive notifications on Android device.');
        console.log('appSettings.androidPIN.androidProjectNumber: ' + appSettings.androidPIN.androidProjectNumber);
        console.log('device.platform.toLowerCase: ' + device.platform.toLowerCase());
    }
    
    app.PushRegistrar.enablePushNotifications();
    
    init_apps.version = app_version;
    init_apps.deviceID = device_uuid;
    
    /*
    
    el.push.register(
    pushSettings, 
    function successCallback(data) {
    // This function will be called once the device is successfully registered
    console.log(data);
    },
    function errorCallback(error) {
    // This callback will be called any errors occurred during the device
    // registration process
    console.log(error);
    }
    );
    
    */
    
    //var device_check = routine_device_check();
    //if(!device_check) return false;
    
    return true;
};

var afterShowTerms = function() {
    if (temrsService && termsPersonal) {
        $('#termOfUse').html(temrsService);
        $('#termOfPersonal').html(termsPersonal);
    } else {
        app.mobileApp.showLoading();
        $.ajax({
                   url: "http://liveball.friize.com/terms_rnkb",
                   type: "GET",
                   dataType: "json",
                   success: function(response) {
                       temrsService = response.service;
                       termsPersonal = response.personal;
                       $('#termOfUse').html(temrsService);
                       $('#termOfPersonal').html(termsPersonal);
                   },
                   complete: function() {
                       app.mobileApp.hideLoading();
                   }
               });   
    }
};

function afterShow(e) {
    console.log(e.view);
}

function localStorageApp() {
}

function setlocalStorage(p, v) {
    if (typeof(localStorage) === 'undefined') {
        console.log('not supported browser!!');
        return false;
    } else {
        try {
            localStorage.setItem(p, v);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        } 
    }
}
function getlocalStorage(p) {
    var return_storage = "";
    if (typeof(localStorage) === 'undefined') {
        console.log('not supported browser!!');
    } else {
        try {
            return_storage = localStorage.getItem(p);
        } catch (e) {
            console.log(e);
        } 
    }
    
    return return_storage;
}
function clearStorage(p) {
    localStorage.removeItem(p);
}


function numberFormat(num) {
    if(num === 0) return 0;

    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (num + '');

    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

    return n;
}

