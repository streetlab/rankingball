/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };       
    
    var loginViewModel = (function () {
        var isInMistSimulator = (location.host.indexOf('icenium.com') > -1);

        var $loginUsername;
        var $loginPassword;

        var isFacebookLogin = isKeySet(appSettings.facebook.appId) && isKeySet(appSettings.facebook.redirectUri);
        var isGoogleLogin = isKeySet(appSettings.google.clientId) && isKeySet(appSettings.google.redirectUri);
        var isLiveIdLogin = isKeySet(appSettings.liveId.clientId) && isKeySet(appSettings.liveId.redirectUri);
        var isAdfsLogin = isKeySet(appSettings.adfs.adfsRealm) && isKeySet(appSettings.adfs.adfsEndpoint);
        
        var init = function () {
            if (!isKeySet(appSettings.everlive.apiKey)) {
                app.mobileApp.navigate('views/noApiKey.html', 'fade');
            }

            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');

            if (!isFacebookLogin) {
                $('#loginWithFacebook').addClass('disabled');
                console.log('Facebook App ID and/or Redirect URI not set. You cannot use Facebook login.');
            }
            if (!isGoogleLogin) {
                $('#loginWithGoogle').addClass('disabled');
                console.log('Google Client ID and/or Redirect URI not set. You cannot use Google login.');
            }
            if (!isLiveIdLogin) {
                $('#loginWithLiveID').addClass('disabled');
                console.log('LiveID Client ID and/or Redirect URI not set. You cannot use LiveID login.');
            }
            if (!isAdfsLogin) {
                $('#loginWithADSF').addClass('disabled');
                console.log('ADFS Realm and/or Endpoint not set. You cannot use ADFS login.');
            }
        };

        var show = function () {
            var userMail = "";
            var localData = $.parseJSON(getlocalStorage('appd'));
            if (localData) {
                userMail = localData.email;
            }
            
            $loginUsername.val(userMail);
            $loginPassword.val('');
        };
        
        // Authenticate to use Backend Services as a particular user
        var login = function () {
            if (registType === 2) {
                app.mobileApp.navigate('views/landingView.html');
                return false;
            }
            
            var useremail = $loginUsername.val();
            var password = $loginPassword.val();

            app.mobileApp.showLoading();

            var autoLogin = $("input:checkbox[id='keep-login']").is(":checked");
            
            var param = '{"osType":' + init_apps.osType + 
                        ',"version":"' + init_apps.version + 
                        '","email":"' + useremail + 
                        '","memPwd":"' + password + 
                        '","registType":' + registType +
                        ',"memUID":"' + init_apps.memUID + 
                        '","deviceID":"' + init_apps.deviceID + '"}';
            
            var url = init_data.auth + "?callback=?";
            
            $.ajax({
                       url: url,
                       type: "GET",
                       async: false,
                       dataType: "jsonp",
                       jsonpCallback: "jsonCallback",
                       data: {
                    "type": "apps",
                    "id": "memberLogin",
                    "param":param
                },
                       success: function(response) {
                           if (response.code === 0) {
                               uu_data = response.data;
                               uu_data.osType = init_apps.osType;
                               uu_data.version = init_apps.version;
                               uu_data.memUID = init_apps.memUID;
                               uu_data.deviceID = init_apps.deviceID;                       
                        
                               setlocalStorage('appd', JSON.stringify(uu_data));
                               setlocalStorage('doLogin', autoLogin);
                               setlocalStorage('doStrip', password);
                        
                               app.mobileApp.navigate('views/landingView.html', 'slide');
                           } else {
                               uu_data = {
                                   status: 0
                               };                        
                               setlocalStorage('doLogin', false);
                               app.showError(response.message);
                           }
                       },
                       error: function(e) {
                           console.log(JSON.stringify(e)); 
                       },
                       complete: function() {
                           app.mobileApp.hideLoading();
                       }
                   });
        };

        var loginAutoim = function (passw) {
            
            /*
            var localData = getlocalStorage('appd');
            var storageObject;
            console.log( JSON.stringify(uu_data));
            if (localData && localData !== 'undefined') {
                
                storageObject = $.parseJSON(localData);
                console.log("use local data");
            } else {
                console.log("use uu_data");
                storageObject = uu_data;
            }
            */
                if (uu_data.status === 1) {    
                    var param, callerID, pushKey;
                    
                    pushKey = ( typeof (init_apps.memUID) === undefined ||  init_apps.memUID === "" ) ? getlocalStorage('push_wiz') : init_apps.memUID;
                    
                    if(pushKey === "" ) {
                        init_apps.deviceID = device.uuid;
                        //console.log("pushkey call");
                        //initAppService.initAppVersion();
                    } else {
                        
                    }
                    
                    if (registType === 2) {
                        callerID = "memberLoginDevice";
                        
                        param = '{"osType":' + init_apps.osType + 
                                 ',"version":"' + init_apps.version + 
                                 '","name":"","memUID":"' + pushKey + 
                                 '","deviceID":"' + init_apps.deviceID + '"}';
                    } else {
                        callerID = "memberLogin";
                        param = '{"osType":' + init_apps.osType + 
                                 ',"version":"' + init_apps.version + 
                                 '","email":"' + uu_data.email + 
                                 '","memPwd":"' + passw + 
                                 '","registType":' + registType +
                                 ',"memUID":"' + pushKey + 
                                 '","deviceID":"' + init_apps.deviceID + '"}';
                    }
                    
                    var url = init_data.auth + "?callback=?";
                    
                    app.mobileApp.showLoading();
                    $.ajax({
                               url: url,
                               type: "GET",
                               async: false,
                               dataType: "jsonp",
                               jsonpCallback: "jsonCallback",
                               data: {
                            "type": "apps",
                            "id": callerID,
                            "param":param
                        },
                       success: function(response) {
                           if (response.code === 0) {
                               uu_data = response.data;
                               setlocalStorage('appd', JSON.stringify(uu_data));
                               setlocalStorage('doLogin', true);
                                setlocalStorage('push_wiz', init_apps.memUID);
                               app.mobileApp.navigate('views/landingVu.html', 'slide');
                           } else {
                               
                                app.showAlert('[101] 서비스 초기화에 실패하여 자동 종료됩니다.','로그인 안내',function() {
                                    navigator.app.exitApp();
                                });
                           }
                           
                       },
                       error: function(e) {
                            app.showAlert('[102] 서비스 초기화에 실패하여 자동 종료됩니다.','로그인 안내',function() {
                                navigator.app.exitApp();
                            });
                       },
                       complete: function() {
                           app.mobileApp.hideLoading();
                       }
                   });

                    
                } else {
                    app.showAlert('[103] 서비스 초기화에 실패하여 자동 종료됩니다.','로그인 안내',function() {
                        navigator.app.exitApp();
                    });
                }

        }
        
        var autosetAuth = "";
        var aw;
        
        var joinGame = function() {
            
            if(app_status === 1) {
                
                if(autosetAuth === "success") {
                    app.mobileApp.navigate('views/simpleSignupView.html', 'slide');
                } else {
                    //var auth_url = "http://scv.rankingball.com/auth/cert_frames?client=" + init_apps.deviceID;
                    var auth_url = "http://scv.rankingball.com/auth/kmcert?client=" + init_apps.deviceID;
                    
                    app.showAlert("정보통신망 이용촉진법, 청소년 보호법 등의 규정에 의하여 성인인증 절차를 거쳐야합니다.","안내",function() {
                        aw = window.open(auth_url, '_blank', 'location=yes');
                        aw.addEventListener('loadstop', function(event) {
                            //console.log(event.type + ' - ' + event.url);
                            var l = getLocation(event.url);
                            //console.log(l.pathname);
                            closeConfrim(l.pathname);

                        });
                        aw.addEventListener('exit', function(event) {
                            authCheck();
                        });
                    });
                }
                
            } else if(app_status === 2) {
                app.showAlert('서비스를 이용하시기 위해서는 업그레이드가 필요합니다.','안내',function() {
                    return false;
                });
            }
        }
        
        var closeConfrim = function(pathname) {
            if(pathname !== "") {
                if(pathname === "/auth/kmcert_result_s/200") {
                    autosetAuth = "success";
                    app.showAlert('감사합니다.\n성인인증이 완료되었습니다.','안내',function() { aw.close(); });
                } else {
                    var pathParam = pathname.split("/");
                    if(pathParam.length > 3 && pathParam[2] === "kmcert_result_f") {
                        console.log(pathParam[3])
                        if(pathParam[3] === "100") {
                            app.showAlert('암호화모듈 호출이 정상적으로 실행되지 않았습니다.','안내',function() { aw.close(); });
                        } else if(pathParam[3] === "101") {
                            app.showAlert('비정상적인 접근입니다.','안내',function() { aw.close(); });
                        } else if(pathParam[3] === "102") {
                            app.showAlert('중복된 정보를 요청하셨습니다.','안내',function() { aw.close(); });
                        } else if(pathParam[3] === "103") {
                            app.showAlert('18세 이상만 서비스 이용가능합니다.','안내',function() { aw.close(); });
                        }
                        autosetAuth = "fail";
                    }

                }
            }
            
            console.log(autosetAuth);
        }
        
        var getLocation = function(href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        };
        
        var authCheck = function() {
            app.mobileApp.showLoading();
            $.ajax({
                url: "http://scv.rankingball.com/auth/cert_check",
                type: "GET",
                data: {'client':init_apps.deviceID},
                dataType: "json",
                success: function(response) {
                    console.log(JSON.stringify(response));
                    if(response.result === 200) {
                        app.mobileApp.navigate('views/simpleSignupView.html', 'slide');
                    } else {
                        app.showAlert(response.str,'안내');
                    }
                },
                error: function(e) {
                    console.log(JSON.stringify(e));
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });  
        }
        
        // Authenticate using Facebook credentials
        var loginWithFacebook = function() {
            if (!isFacebookLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var facebookConfig = {
                name: 'Facebook',
                loginMethodName: 'loginWithFacebook',
                endpoint: 'https://www.facebook.com/dialog/oauth',
                response_type: 'token',
                client_id: appSettings.facebook.appId,
                redirect_uri: appSettings.facebook.redirectUri,
                access_type: 'online',
                scope: 'email',
                display: 'touch'
            };
            var facebook = new IdentityProvider(facebookConfig);
            //app.mobileApp.showLoading();

            facebook.getAccessToken(function(token) {
                app.everlive.Users.loginWithFacebook(token)
                    .then(function () {
                        // EQATEC analytics monitor - track login type
                        if (isAnalytics) {
                            analytics.TrackFeature('Login.Facebook');
                        }
                        return app.Users.load();
                    })
                    .then(function () {
                        app.mobileApp.hideLoading();
                        app.mobileApp.navigate('views/lobbyTabView.html');
                    })
                    .then(null, function (err) {
                        app.mobileApp.hideLoading();
                        if (err.code === 214) {
                            app.showError('The specified identity provider is not enabled in the backend portal.');
                        } else {
                            app.showError(err.message);
                        }
                    });
            });
        };

        var loginWithGoogle = function () {
            if (!isGoogleLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var googleConfig = {
                name: 'Google',
                loginMethodName: 'loginWithGoogle',
                endpoint: 'https://accounts.google.com/o/oauth2/auth',
                response_type: 'token',
                client_id: appSettings.google.clientId,
                redirect_uri: appSettings.google.redirectUri,
                scope: 'https://www.googleapis.com/auth/userinfo.profile',
                access_type: 'online',
                display: 'touch'
            };
            var google = new IdentityProvider(googleConfig);
            app.mobileApp.showLoading();

            google.getAccessToken(function(token) {
                app.everlive.Users.loginWithGoogle(token)
                    .then(function () {
                        // EQATEC analytics monitor - track login type
                        if (isAnalytics) {
                            analytics.TrackFeature('Login.Google');
                        }
                        return app.Users.load();
                    })
                    .then(function () {
                        app.mobileApp.hideLoading();
                        app.mobileApp.navigate('views/activitiesView.html');
                    })
                    .then(null, function (err) {
                        app.mobileApp.hideLoading();
                        if (err.code === 214) {
                            app.showError('The specified identity provider is not enabled in the backend portal.');
                        } else {
                            app.showError(err.message);
                        }
                    });
            });
        };

        var loginWithLiveID = function () {
            if (!isLiveIdLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var liveIdConfig = {
                name: 'LiveID',
                loginMethodName: 'loginWithLiveID',
                endpoint: 'https://login.live.com/oauth20_authorize.srf',
                response_type: 'token',
                client_id: appSettings.liveId.clientId,
                redirect_uri: appSettings.liveId.redirectUri,
                scope: 'wl.basic',
                access_type: 'online',
                display: 'touch'
            };
            var liveId = new IdentityProvider(liveIdConfig);
            app.mobileApp.showLoading();

            liveId.getAccessToken(function(token) {
                app.everlive.Users.loginWithLiveID(token)
                    .then(function () {
                        // EQATEC analytics monitor - track login type
                        if (isAnalytics) {
                            analytics.TrackFeature('Login.LiveID');
                        }
                        return app.Users.load();
                    })
                    .then(function () {
                        app.mobileApp.hideLoading();
                        app.mobileApp.navigate('views/activitiesView.html');
                    })
                    .then(null, function (err) {
                        app.mobileApp.hideLoading();
                        if (err.code === 214) {
                            app.showError('The specified identity provider is not enabled in the backend portal.');
                        } else {
                            app.showError(err.message);
                        }
                    });
            });
        };

        var loginWithADSF = function () {
            if (!isAdfsLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var adfsConfig = {
                name: 'ADFS',
                loginMethodName: 'loginWithADFS',
                endpoint: appSettings.adfs.adfsEndpoint,
                wa: 'wsignin1.0',
                wtrealm: appSettings.adfs.adfsRealm
            };
            var adfs = new IdentityProvider(adfsConfig);
            app.mobileApp.showLoading();

            adfs.getAccessToken(function(token) {
                app.everlive.Users.loginWithADFS(token)
                    .then(function () {
                        // EQATEC analytics monitor - track login type
                        if (isAnalytics) {
                            analytics.TrackFeature('Login.ADFS');
                        }
                        return app.Users.load();
                    })
                    .then(function () {
                        app.mobileApp.hideLoading();
                        app.mobileApp.navigate('views/activitiesView.html');
                    })
                    .then(null, function (err) {
                        app.mobileApp.hideLoading();
                        if (err.code === 214) {
                            app.showError('The specified identity provider is not enabled in the backend portal.');
                        } else {
                            app.showError(err.message);
                        }
                    });
            });
        };

        var showMistAlert = function () {
            alert(appSettings.messages.mistSimulatorAlert);
        };

        return {
            init: init,
            show: show,
            getYear: app.getYear,
            login: login,
            joinGame: joinGame,
            loginWithFacebook: loginWithFacebook,
            loginWithGoogle: loginWithGoogle,
            loginWithLiveID: loginWithLiveID,
            loginWithADSF: loginWithADSF,
            loginAutoim: loginAutoim,
        };
    }());

    return loginViewModel;
}());