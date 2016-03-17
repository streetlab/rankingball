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
            
            loginProcess.autoLogin();
        };
        
        var loginProcess = {
            
            autoLogin: function() 
            {
                if (uu_data.status === 1) 
                {
                    app.mobileApp.showLoading();
                    
                    var that = this;
                    var param, callerID, pushKey;
                    pushKey = ( typeof (init_apps.memUID) === undefined ||  init_apps.memUID === "" ) ? getlocalStorage('push_wiz') : init_apps.memUID;
                    
                    if(pushKey === "" ) {
                        init_apps.deviceID = device.uuid;
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
                               //app.mobileApp.navigate('views/landing2Vu.html', 'slide');
                               that.getRT();
                           } else {
                               
                                app.showAlert('[101] ' + $.langScript[laf]['noti_020'],'Notice',function() {
                                    navigator.app.exitApp();
                                });
                           }
                           
                       },
                       error: function(e) {
                            app.showAlert('[102] ' + $.langScript[laf]['noti_020'],'Notice',function() {
                                navigator.app.exitApp();
                            });
                       },
                       complete: function() {
                           app.mobileApp.hideLoading();
                       }
                   });

                    
                } 
                else 
                {
                    app.showAlert('[103] ' + $.langScript[laf]['noti_020'],'Notice',function() {
                        navigator.app.exitApp();
                    });
                }
            },
            getRT: function()
            {
                var that = this;
                var url = "http://scv.rankingball.com/rt_fullfeed/soccer_recent/" + laf;
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "id": "getRadar"
                    },
                    success: function(response) {
                        //console.log(response);
                        if (response.result === 200) {
                            rtWeekList = response.data;
                        }
                        that.getPlayer();
                    },
                    error: function(e) {
                        that.getPlayer();
                    }
                });
            },
            getPlayer: function()
            {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","position":15,"organ":1}';
                var url = init_data.auth + "?callback=?";
                
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps",
                        "id": "contestGetEntry",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                      
                            $.each(response.data, function (i, p) {
                                playerOnLeague.push({
                                    teamName: p.teamName,
                                    position: p.position,
                                    fppg: parseFloat(p.fppg),
                                    playerID: p.playerID,
                                    playerName: p.playerName,
                                    posDesc: p.posDesc,
                                    number: p.number,
                                    posId: p.posId,
                                    team: p.team,
                                    salary: p.salary,
                                    posCode: p.posCode,
                                    posType: p.posType,
                                    playerSelected:1
                                });
                            });

                        }
                        that.getDFS();
                    },
                    error: function(e) {
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                        that.getDFS();
                    }
                });
            },
            getDFS: function() 
            {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"organ":1}';
                var url = init_data.auth + "?callback=?";

                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps",
                        "id": "contestGetList",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            contestListData = response.data;
                            contestListData  = contestListData.sort(function(a, b) {
                                return (b.rewardValue - a.rewardValue);
                            });
                                                    
                            that.resetDFSList(contestListData);
                        }
                        else
                        {
                            console.log("no match data");
                        }
                    },
                    error: function(e) {
                        console.log("error - requestContestList Contest : " + JSON.stringify(e));
                    }
                });  
            },
            resetDFSList: function(dfsData)
            {
                var that = this;
                
                contestPartList['cf'] = new Array();
                contestPartList['c5'] = new Array();
                contestPartList['cg'] = new Array();
                contestMyPartList['cf'] = new Array();
                contestMyPartList['c5'] = new Array();
                contestMyPartList['cg'] = new Array();
                                
                for (var i=0 ; i < dfsData.length ; i++)
                {
                    
                    dfsData[i]['timeRew'] = that.timeGenerate(dfsData[i]['startTime']);
                    if(dfsData[i]['myEntry'] > 0) 
                    {
                                            
                        if (dfsData[i]['featured'] === 1) {
                            contestMyPartList['cf'].push(dfsData[i]);
                            featuredList.push(dfsData[i]);
                        } else if (parseInt(dfsData[i]['contestType']) === 1) {
                            contestMyPartList['c5'].push(dfsData[i]);
                        } else if (parseInt(dfsData[i]['contestType']) === 2) {
                            contestMyPartList['cg'].push(dfsData[i]);
                        }
                        
                        if(dfsData[i]['entryData'] !== null) {
                            var $tmpSlots = [];
                            $.each(dfsData[i]['entryData'],function(k,x) {
                                $tmpSlots[k] = x;
                            });

                            myEntryByContest[dfsData[i]['contestSeq']] = $tmpSlots;
                        }

                    } else {
                        
                        if(dfsData[i]['contestStatus'] === 1) {
                            
                            if (dfsData[i]['featured'] === 1) {
                                contestPartList['cf'].push(dfsData[i]);
                                featuredList.push(dfsData[i]);
                            } else if (parseInt(dfsData[i]['contestType']) === 1) {
                                contestPartList['c5'].push(dfsData[i]);
                            } else if (parseInt(dfsData[i]['contestType']) === 2) {
                                contestPartList['cg'].push(dfsData[i]);
                            }                        
                        }
                    }
                }
                    
                setTimeout(function() {
                    app.mobileApp.navigate('views/landing2Vu.html', 'slide');
                    app.mobileApp.hideLoading();   
                },500);
            },
            timeGenerate: function(timeValue)
            {
                var today = new Date();
                var weekDay = new Array("Sun.","Mon.","Tue.","Wed.","Thu.","Fri.","Sat.");
                
                var yy = timeValue.substring(0,4);
                var mm = timeValue.substring(4,6);
                var dd = timeValue.substring(6,8);
                var h = timeValue.substring(8,10);
                var m = timeValue.substring(10,12);
                var s = timeValue.substring(12,14);
                
                
                var startDate = new Date(yy,Number(mm)-1,dd,h,m,s);
                var dateLabel = "";
                var timeLabel = "";
                
                var dateDiff = Math.round( (startDate.getTime() - today.getTime())  / (1000*60*60*24) );
                
                timeLabel = h + ":" + m;
                
                if(dateDiff > 0) {
                                    
                    if(dateDiff === 1) {
                        dateLabel = "tommorow " + timeLabel;
                    }
                    else
                    {
                        dateLabel = weekDay[startDate.getDay()] + " " + timeLabel;
                    }   
                }
                else
                {
                    if(dateDiff === 0) {
                        dateLabel = "today " + timeLabel;
                    } else {
                        dateLabel = Math.abs(dateDiff) + " days ago ";
                    }   
                }
                
                return dateLabel;
            }
            
        };
        
        /* 본인인증 유무 */
        var autosetAuth = "success";
        var aw;
        
        var joinGame = function() {
            
            if(app_status === 1) {
                
                if(autosetAuth === "success") {
                    app.mobileApp.showLoading();
                    app.mobileApp.navigate('views/simpleSignupView.html', 'slide');

                } else {
                    //var auth_url = "http://scv.rankingball.com/auth/cert_frames?client=" + init_apps.deviceID;
                    var auth_url = "http://scv.rankingball.com/auth/kmcert?client=" + init_apps.deviceID;
                    
                    app.showAlert($.langScript[laf]['noti_046'],"Notice",function() {
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
                app.showAlert($.langScript[laf]['noti_021'],'Notice',function() {
                    return false;
                });
            }
        }
        
        var closeConfrim = function(pathname) {
            if(pathname !== "") {
                if(pathname === "/auth/kmcert_result_s/200") {
                    autosetAuth = "success";
                    app.showAlert($.langScript[laf]['noti_002'],'Notice',function() { aw.close(); });
                } else {
                    var pathParam = pathname.split("/");
                    if(pathParam.length > 3 && pathParam[2] === "kmcert_result_f") {
                        console.log(pathParam[3])
                        if(pathParam[3] === "100") {
                            app.showAlert($.langScript[laf]['noti_024'],'Notice',function() { aw.close(); });
                        } else if(pathParam[3] === "101") {
                            app.showAlert($.langScript[laf]['noti_016'],'Notice',function() { aw.close(); });
                        } else if(pathParam[3] === "102") {
                            app.showAlert($.langScript[laf]['noti_047'],'Notice',function() { aw.close(); });
                        } else if(pathParam[3] === "103") {
                            app.showAlert($.langScript[laf]['noti_001'],'Notice',function() { aw.close(); });
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
                        app.showAlert(response.str,'Notice');
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