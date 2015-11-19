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
            var localData = getlocalStorage('appd');
            var storageObject;
            
            if (localData) {
                
                storageObject = $.parseJSON(localData);
            } else {
                storageObject = uu_data;
            }
                if (storageObject.status === 1) {    
                    var param, callerID, pushKey;
                    
                    pushKey = ( init_apps.memUID === undefined ||  init_apps.memUID === "" ) ? getlocalStorage('push_wiz') : init_apps.memUID;
                    
                    if(pushKey === "" ) {
                        init_apps.deviceID = device.uuid;
                        initAppService.initAppVersion();
                    } else {
                        
                        if (registType === 2) {
                            callerID = "memberLoginDevice";
                            
                            param = '{"osType":' + init_apps.osType + 
                                     ',"version":"' + init_apps.version + 
                                     '","name":"","memUID":"' + init_apps.memUID + 
                                     '","deviceID":"' + init_apps.deviceID + '"}';
                        } else {
                            callerID = "memberLogin";
                            param = '{"osType":' + init_apps.osType + 
                                     ',"version":"' + init_apps.version + 
                                     '","email":"' + storageObject.email + 
                                     '","memPwd":"' + passw + 
                                     '","registType":' + registType +
                                     ',"memUID":"' + init_apps.memUID + 
                                     '","deviceID":"' + init_apps.deviceID + '"}';
                        }
                        
                        var url = init_data.auth + "?callback=?";
                        
                        console.log(param);
                        
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
                               console.log(JSON.stringify(response));
                               if (response.code === 0) {
                                   uu_data = response.data;
                                   setlocalStorage('appd', JSON.stringify(uu_data));
                                   setlocalStorage('doLogin', true);
                            
                                   app.mobileApp.navigate('views/landingView.html', 'slide');
                               } else {
                                   
                                    app.showAlert('서비스 초기화에 실패하여 자동 종료됩니다.','로그인 안내',function() {
                                        navigator.app.exitApp();
                                    });
                               }
                               
                               console.log(JSON.stringify(uu_data));
                           },
                           error: function(e) {
                               console.log(e); 
                           },
                           complete: function() {
                               app.mobileApp.hideLoading();
                           }
                       });
                    }
                    
                } else {
                    console.log("not found");
                }

        }
        
        var joinGame = function() {
            
            if(app_status === 1) {
                app.mobileApp.navigate('views/simpleSignupView.html', 'slide');
            } else if(app_status === 2) {
                app.showAlert('서비스를 이용하시기 위해서는 업그레이드가 필요합니다.','안내',function() {
                    return false;
                });
            }
            
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