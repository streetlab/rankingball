var init_data = {}, init_apps = {}, app_status = 1;
var temrsService, termsPersonal;
var uu_data = {};
var guest = false;
var registType = 2; // member join type ( normal: 1, guest: 2, sns: 3 )
var autoLogin = false;

var globalRequestTry = 0;
var salaryLimit = 0;
var slotSalary = 0;
var playerSlot = {};
var tmpReqSlot = "";

var editMatch = 0;

var contestListData = ""; // Total Game List
var contestPartList = [];
contestPartList['cf'] = "";
contestPartList['c5'] = "";
contestPartList['cg'] = "";

var contestMyPartList = [];
contestMyPartList['cf'] = "";
contestMyPartList['c5'] = "";
contestMyPartList['cg'] = "";

var featuredList = [];
var rtWeekList = [];

var myGames = "";
var myEntryByContest = {}; // 엔트리별 선수 등록 정보

var playerOnLeague = []; // 전체 선수 받아오기용
var playerData = []; // entry 설정용
var playerListData = [];

var entryAmount = 0;
var max_salarycap_amount = 35000;

var playerData4up = [];

var entryStatus = false;
var currentContestType = "";


var gameLife = 3; // 게임 Life
var gameLifeTimer = 180;
var gameCrush = 0; // success point
var gameRepo = [];
var laf;    // Language flag


var observableView = function() {
    $('.amount_mini_ruby').html(numberFormat(uu_data.cash));
    //$('.amount_mini_point').html(uu_data.points);
}


var openAppStore = function() {
    //var url = "market://details?id=com.streetlab.lb.soccer";
    var url = "https://play.google.com/store/apps/details?id=com.stlb.ffl";
    //window.open(url, '_blank');
    
    var location= window.location.href;
    iab = window.open(url, '_top', 'location=yes');
    iab.addEventListener('exit', function () {
        window.location.href=location;
    });
    
};

var initAppService = {
    _app_version: "0.0.0",
    initAppVersion: function() {
        var that = this;                        
        if (window.navigator.simulator === true) {
            that._app_version = "1.1.5";
            that.ajaxVersionCheck(that._app_version);
        } else {
            that.pluginGetVersion();
        }
    },
    pluginGetVersion: function() {
        var that = this;
        cordova.getAppVersion(function(value ){ 
            that._app_version = value;
            $waitUntil(
                function () {
                  return that._app_version !== "";
                },
                function () {
                    that.ajaxVersionCheck(that._app_version);
                }
            );
            
        });
    },
    ajaxVersionCheck: function(version) {

        init_apps.version = version;
        
        var that = this;
        var param = '{"osType":' + init_apps.osType + ',"version":"' + version + '"}';
        
        $.ajax({
            url: "http://m3.liveball.kr:8080/rankBall/query.frz?callback=?",
            type: "GET",
            dataType: "jsonp",
            timeout: 1500,
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
                                        
                    var tmpVersion = parseInt(version.replace(/\./g, ""));
                    
                    if (tmpVersion < parseInt(init_data.sp.replace(/\./g, ""))) {
                        
                        navigator.notification.confirm($.langScript[laf]['noti_091'], function (confirmed) {
                            if (confirmed === true || confirmed === 1) {
                                openAppStore();
                            } else {
                                navigator.app.exitApp();
                                app_status = 2;
                            }
                        }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
                    } else if (tmpVersion === 0) {
                        ++globalRequestTry;
                        if(globalRequestTry > 3) {
                            app.showAlert('[111] ' + $.langScript[laf]['noti_020'],'Notice',function() {
                                navigator.app.exitApp();
                            });
                        }
                        else 
                        {
                            console.log("ajax recall initAppVersion : 111");
                            that.initAppVersion();    
                        }
                    } else {
                        globalRequestTry = 0;
                        that.appDeviceCheck();
                    }
                } else {
                    ++globalRequestTry;
                    if(globalRequestTry > 3) {
                        app.showAlert('[112] ' + $.langScript[laf]['noti_020'],'Notice',function() {
                            navigator.app.exitApp();
                        });
                    }
                    else 
                    {
                        console.log("ajax recall initAppVersion : 112");
                        that.initAppVersion();    
                    }
                }
            },
            error: function(e) {
                ++globalRequestTry;
                if(globalRequestTry > 3) {
                    app.showAlert('[113] ' + $.langScript[laf]['noti_020'],'Notice',function() {
                        navigator.app.exitApp();
                    });
                }
                else 
                {
                    console.log("ajax recall initAppVersion : 113");
                    that.initAppVersion();
                }
            }
        });
    },
    appDeviceCheck: function() {
        if (init_data.status === 1) {
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","deviceID":"' + init_apps.deviceID + '"}';
            var url = init_data.auth + "?callback=?";
            $.ajax({
                url: url,
                type: "GET",
                timeout: 3000,
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                data: {
                    "type": "apps",
                    "id": "checkMemberDevice",
                    "param":param
                },
               success: function(response) {

                   if (response.code === 0) {
                       globalRequestTry = 0;
                                              
                       uu_data = response.data;
                                              
                       setlocalStorage('push_wiz',init_apps.memUID);
                       $('#start-game').addClass('hide');
                       $('#processing-message').removeClass('hide');
                       navigator.splashscreen.hide();

                       app.Login.loginAutoim('');
                       
                   } else {
                       navigator.splashscreen.hide();
                       
                   }

               },
               error: function(e) {
                   var that = this;
                    ++globalRequestTry;
                    if(globalRequestTry > 3) {
                        app.showAlert($.langScript[laf]['noti_020'],'Notice',function() {
                            navigator.app.exitApp();
                        });
                    }
                    else 
                    {
                        that.initAppVersion();    
                    }
               }
           });  
        } else {
            ++globalRequestTry;
            if(globalRequestTry > 3) {
                app.showAlert($.langScript[laf]['noti_020'],'Notice',function() {
                    navigator.app.exitApp();
                });
            }
            else 
            {
                that.initAppVersion();    
            }
        }
    }
};

var afterShowTerms = function() {
    if (temrsService && termsPersonal) {
        $('#termOfUse').html(temrsService);
        $('#termOfPersonal').html(termsPersonal);
    } else {
        app.mobileApp.showLoading();
        
        console.log("temrs");
        $.ajax({
           url: "http://scv.rankingball.com/terms_rnkb/". laf,
           type: "GET",
           dataType: "json",
           success: function(response) {
               console.log(response);
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

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
              this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
              this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length)
        {
             enc1 = this._keyStr.indexOf(input.charAt(i++));
             enc2 = this._keyStr.indexOf(input.charAt(i++));
             enc3 = this._keyStr.indexOf(input.charAt(i++));
             enc4 = this._keyStr.indexOf(input.charAt(i++));

             chr1 = (enc1 << 2) | (enc2 >> 4);
             chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
             chr3 = ((enc3 & 3) << 6) | enc4;

             output = output + String.fromCharCode(chr1);

             if (enc3 != 64) {
                 output = output + String.fromCharCode(chr2);
             }
             if (enc4 != 64) {
                 output = output + String.fromCharCode(chr3);
             }
        }

        return output;
    }
}

function $waitUntil(check,onComplete,delay,timeout) {
    // if the check returns true, execute onComplete immediately
    if (check()) {
        onComplete();
        return;
    }

    if (!delay) delay=100;

    var timeoutPointer;
    var intervalPointer=setInterval(function () {
        if (!check()) return; // if check didn't return true, means we need another check in the next interval

        // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
        clearInterval(intervalPointer);
        if (timeoutPointer) clearTimeout(timeoutPointer);
            onComplete();
    },delay);
    // if after timeout milliseconds function doesn't return true, abort
    if (timeout) timeoutPointer=setTimeout(function () {
        clearInterval(intervalPointer);
    },timeout);
}