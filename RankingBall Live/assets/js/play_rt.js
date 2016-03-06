
/**
 * Real Time Service model
 */
var app = app || {};

app.playRTS = (function () {
    'use strict';

    var playRealTime = (function () {
        
        var activePrediction = false;
        
        var maxTimeCount = 11;
        var maxCirclePosition = 200;
        
        var reactCLC;
        var swiper;       
        var rtSlider = true;
        var navWidth = [];
        var rtRowData = "";
        
  
        
        function langExchange() 
        {
            //console.log(laf);
            app.langExchange.exchangeLanguage(laf);    
        }
        
        function init() 
        {
            
            langExchange(); // 한영변환
            
            $('.sc_menus').removeClass('swipeNav');
            $('.rt-navigation').css('width',$(window).width());
            
            $('ul.sc_menu li').each(function () {
                navWidth.push($(this).outerWidth(true));
            });

            // 위젯 swipe
            swiper = new Swipe(document.getElementById('sliderz'), 
            {
                startSlide: 0,
                speed: 400,
                auto: 0,
                continuous: true,
                disableScroll: false,
                stopPropagation: true,
                callback: function(index, elem) {},
                transitionEnd: function(index, elem) {
                    
                    if(index < 2) {
                       // $('.sc_menus').removeClass('swipeNav');
                        
                        if(index === 0) {
                            if(!rtSlider) {
                                $('#rt_slider').slideDown();
                                rtSlider = true;
                                $('#rt_header__scoreboard').fadeOut();
                            }
                        } else {
                            if(rtSlider) {
                                $('#rt_slider').slideUp();
                                rtSlider = false;
                                $('#rt_header__scoreboard').fadeIn();
                            }
                        }
                        
                        $("#scrollnav").data("kendoMobileScroller").animatedScrollTo(0, 0);
                        
                    } else {
                        
                        if(index > 2) {

                            console.log("move index: " + index);
                            
                            var scrollLeft = 0;
                            for(var i = 2; i <= index; i++) {
                                scrollLeft += navWidth[i];  // Iterate over your first array and then grab the second element add the values up
                            }
                            
                            scrollLeft = scrollLeft * -1;
                            $("#scrollnav").data("kendoMobileScroller").animatedScrollTo(scrollLeft, 0);
                            
                        }
                        
                        if(rtSlider) {
                            $('#rt_slider').slideUp();
                            rtSlider = false;
                            $('#rt_header__scoreboard').fadeIn();
                        }
                    }
                    $('.wc_btn').removeClass('activate');
                    $('#swipeBtn' + index).addClass('activate');
                }
            });

            $('#meter_bar').css('width','0px');
            var mqruqeeStr = $.langScript[laf]['noti_056'] + "  " + $.langScript[laf]['noti_057'] + "  " + $.langScript[laf]['noti_058']  + "  " + $.langScript[laf]['noti_059'] + "  " + $.langScript[laf]['noti_060'] + "  " + $.langScript[laf]['noti_061'];
            $('#txt_message').html(mqruqeeStr);
            
        }

        
        function flipHeaderTitle() {
            if(rtSlider) {
                $('#rt_header__scoreboard').fadeOut();
            } else {
                $('#rt_header__scoreboard').fadeIn();
            }
        }
        
        function dispTitleShow() {
            //console.log("do callback first");
            $('#rt_header__title').show('slide');
        }

        function dispScoreboardShow() {
            //console.log("do callback another");
            $('#rt_header__scoreboard').show('slide');
        }
        
        function handleTouchEvent(e) {    
            if(e.direction === "left") {
                $('.sc_menus').addClass('swipeNav');
            } else {
                $('.sc_menus').removeClass('swipeNav');
            }
        }
        
        /* do RT match list generate */
        function rt_radar() 
        {
            $('#rtPreviewBox').css('display','block');
            app.mobileApp.showLoading();
            observableView();
            var url = "http://scv.rankingball.com/rt_fullfeed/soccer/" + laf;
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
                        
                        console.log("start rt bar");
                        
                        var rtGroup = Object.keys(response.groups);
                        
                        if(rtGroup.length > 0) {
                            var i=0;
                            var rtBarArray = [];
                            for(i=0;i<rtGroup.length;i++) {
                                var tmpArray = {
                                    'rt_id':response.groups[rtGroup[i]]['group_id'],
                                    'rt_len':response.groups[rtGroup[i]]['group_count'],
                                    'rt_title':response.groups[rtGroup[i]]['group_title']
                                };
                                rtBarArray.push(tmpArray);   
                            }
                            
                            $("#rtListBar").kendoMobileListView({
                                dataSource: rtBarArray,
                                template: $("#rtGroupListTemplate").html()
                            });
                            
                            rtRowData = response.data;
                            console.log(rtRowData);
                            var rtGroupData = Object.keys(rtRowData);
                            for(i=0;i<rtGroupData.length;i++) {
                                var rtData = rtRowData[rtGroupData[i]];
                                var rt_list = "#rt" + rtGroupData[i];
                                
                                $(rt_list).kendoMobileListView({
                                    dataSource: rtData,
                                    template: $("#rtDataListTemplate").html()
                                });
                            }

                            
                        }
                    }
                    
                    app.mobileApp.hideLoading();
                },
                error: function(e) {
                    app.mobileApp.hideLoading();
                }
            });
        }
        
        function rt_init() {
            langExchange();
            //$('.amount_mini_point').html(numberFormat(vr_point));
        }
        
        function init_result() {
            //$('.amount_mini_point').html(numberFormat(vr_point));
        }

        function swipeSlide(e) {
            var data = e.button.data();
            swiper.slide(data.rel, 300);
        }
        
        //$('#result_effect').one('webkitAnimationEnd animationend', markingStart);
        
        function markingStart() {
            
            $('#prediction_message')
                .empty()
                .addClass('hide'); 
            $('#position-box-yahoo').addClass('hide');
        }
        
        function prediction_process() {
            
            var randomNumber = Math.random() >= 0.5;
            if(randomNumber) {
                //predictDiv = '<div id="result_effect" class="animate zoomIn"><img src="./assets/resource/rt/great.png"></div>';

                app.showAlert(rtMessageSuccess,'예측 성공',function() {
                    uu_data.cash += 500;
                });

            } else {
                app.showAlert(rtMessageFail,'예측 실패',function() {});
            }
        }
        
        function reactResult() {
            window.clearInterval(reactCLC);
            //$('#meter_bar').css('width','0px');
            activePrediction = false;
            $('#rt_ball_btn').removeClass('clc_btn_spin').addClass('readyShoot');  
            $('#ball_label').show();
            $('#rt_message').html(rtMessageDef);
            prediction_process();
        }
        
        function predictionCheck() {
            if(activePrediction) return false;
            return true;
        }
        
        function rtProgressBar(barWidth, loop, pos, $element) {
            //console.log(barWidth, loop * pos);
            var progressBarWidth = barWidth * 10 + '%';
        	$element.animate({ width: progressBarWidth }, 500);
        }
        
        var rtCoolTimeBar = "";
        
        /* 챌린지 볼 대기 */
        function rtCoolTime() 
        {
            console.log("init cool time");
            window.clearInterval(rtCoolTimeBar);
            $('#rechargeTime').removeClass('recharge_hidden');
            rtCoolTimeBar = setInterval(function() {
                
                --gameLifeTimer;
                
                if(gameLifeTimer > 0) {
                    var cmm = parseInt( gameLifeTimer / 60 );
                    var chh = parseInt( gameLifeTimer % 60 );
                    $('#recoverLife').html(zeroFormat(cmm) + " : " + zeroFormat(chh));
                } else {
                    ++gameLife;
                    if(gameLife < 3) {
                        //console.log("GAME LIFE: " + gameLife);
                        gameLifeTimer = 180;
                    } else {
                        //console.log("GAME LIFE: " + gameLife);
                        $('#rechargeTime').addClass('recharge_hidden');
                        gameLifeTimer = 180;
                        window.clearInterval(rtCoolTimeBar);
                        $('#recoverLife').html("00:00");
                    }
                    dispGameLife();
                }
                
                var rtNowTime = new Date();
                
                setlocalStorage('rtLife',gameLife);
                setlocalStorage('rtRegen',gameLifeTimer);
                setlocalStorage('rtTimer',rtNowTime.getTime());
                
             }, 1000);
        }
        
        function rosa() {
            
            if(activePrediction) {
                app.showError("골 예측 중입니다.");
                return false;   
            }            
            
            activePrediction = true;
            var loop = 1;
            
            if(gameLife > 0) {

/*
                var rpm, rps;
                var rts = rtNowTime.getTime();
                
                rpm = rtNowTime % 3600 / 60;
                rps = rtNowTime % 3600 / 60;
                
                //$('.rt_click_time__start').html();
                //$('.rt_click_time__chance').html();
                //$('.rt_click_time__close').html();
*/
                --gameLife;
                $('#rt_message').html(rtMessageActivate);
                $('#ball_label').hide();
                $('#rt_ball_btn').removeClass('readyShoot').addClass('clc_btn_spin');  
                
                dispGameLife();
                rtCoolTime();
                reactCLC = setInterval(function() {
                    if( ++loop > maxTimeCount ) {
                        reactResult();
                    } else {
                        if(loop > 10) {
                            $('#rt_message').html(rtMessagePrediction);
                        }
                        rtProgressBar(maxCirclePosition, loop, 20, $('#meter_bar'));

                    }
                }, 1000);
            } else {
                app.showAlert('하트가 충전될 때까지 기다려주세요.','안내');
            }
                        
            
        }
        
        function zeroFormat(num) {
            return (parseInt(num) > 9) ? num : '0' + num; 
        }
        
        function getRandomArbitray(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        
        function playRTResult() {

            app.mobileApp.showLoading();
            setTimeout(function() {
                app.mobileApp.navigate('views/playRTresultVu.html', 'slide');
                app.mobileApp.hideLoading();
                }
                ,300);
        }
        
        function nowPlayRT(e) {
            
            var data = e.button.data();
            
            console.log(data.rel);
            console.log(data.gol);
            
            $("#moadl_loading").data("kendoMobileModalView").open();
            $("#moadl_loading").children('.km-content').addClass('opacity_zero');
                        
            setTimeout(function() {
                app.mobileApp.navigate('views/playRTVu.html?matchId=' + data.rel + '&group=' + data.gol + '&enet=' + data.rol + '&stat=' + data.stat, 'slide');
                $("#moadl_loading").data("kendoMobileModalView").close();
                }
            ,1000);
            
        }
        
        function dispGameLife() {
            $('.star').removeClass('full');
            
            if(gameLife === 3) {
                $('.star').addClass('full');
            } else {
                for(var i = 1; i <= gameLife; i++) {
                    $('#start_pos_' + i).addClass('full');
                }
            }
        }
        
        /* 실시간 경기 빠져나가기 => 소켓 끊기 */
        function confirmBack() {
            /*
            if(activePrediction) {
                app.showError("골 예측 중에는 나올 수 없습니다.");
                return false;   
            }
            */
            navigator.notification.confirm($.langScript[laf]['noti_008'], function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                    app.mobileApp.showLoading();
                    if(matchStatus !== "3") {
                       ws.close();
                    }
                    
                    var id = window.setInterval(function() {}, 0);
                    while (id--) {
                        console.log("window interval: " + id);
                        window.clearInterval(id); // will do nothing if no timeout with id is present
                    }
                    app.mobileApp.hideLoading();
                    //SRLive.removeWidget("widgets");
                    /*
                    SRLive.removeWidget("widgets.lmts",{"container": ".wc-widget.wc-10"});
                    SRLive.removeWidget("widgets.matchcommentary",{"container": ".wc-widget.wc-11"});
                    SRLive.removeWidget("widgets.matchlineups",{"container": ".wc-widget.wc-12"});
                    SRLive.removeWidget("widgets.matchstats",{"container": ".wc-widget.wc-13"});
                    SRLive.removeWidget("widgets.matchhead2head",{"container": ".wc-widget.wc-14"});
                    SRLive.removeWidget("widgets.livetable",{"container": ".wc-widget.wc-15"});
                    */
                    //$('#play_rt').data("kendoMobileView").destroy();
                    //$('#play_rt').remove();
                    swiper.stop();
                    //swiper = function(){};
                    app.mobileApp.navigate('#:back', 'slide');
                }
            }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
        }
        
        var collapseList = function(e) {
            var data = e.button.data();
            console.log(data.rel);
            var els_this = $('#accoList_rt_' + data.rel);
            var els_ul = $('#rtChild_' + data.rel);
            els_ul.slideToggle( "2500", "swing", function() {
                        if(els_ul.is(":visible")) {
                            els_this.find('span.collapse-btn').addClass('ico-open');
                        } else {
                            els_this.find('span.collapse-btn').removeClass('ico-open');
                        }
                    }
                );
        };
        
        
        var matchStatus = "";
        var predictionFollow = "";
        var enetId = "";
        var betCount = 0;
        
        var amblemHome = "";
        var amblemAway = "";
        
        /* prediction result */
        var predictionResultList = {
            appendList: function() {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"eventId":' + enetId + '}';
                var url = init_data.apps + "?callback=?";

                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps",
                        "id": "getGameIncidentResult",
                        "param":param
                    },
                   success: function(response) {

                       if (response.code === 0) {
                           
                           var rtData = response.data;
                           
                           $('#tryTotalCount').html(parseInt(rtData.totaljoin));
                           $('#trySuccessCount').html(parseInt(rtData.totalSuccess));
                           $('#trySuccessRate').html(parseInt(rtData.successRatio) + "%");
                           
                           var rtHistory = rtData.history;
                           var trData = "";
                           
                           for(var i=0;i<rtHistory.length;i++) {
                               trData = '<tr><td>' + that.exchangeTime(rtHistory[i]['gameTime']) + '</td><td>' + rtHistory[i]['teamName'] + '</td><td>' + that.exchangeStatus(rtHistory[i]['eventDesc']) + '</td><td>' + that.exchangeResult(rtHistory[i]['myPoint']) + '</td></tr>';
                               $('#myRTPredictionResult').append(trData);
                           }
                           
                       } else {
                           console.log("RT 결과 오류");
                       }  
                   },
                   error: function(e) {
                       
                   }
                });
            },
            exchangeTime: function(t) {
                var msec = t;
                var mm = Math.floor(msec / 60);
                msec -= mm * 60;
                var ss = Math.floor(msec);

                return zeroFormat(mm) + ":" + zeroFormat(ss);
            },
            exchangeStatus: function(t) {
                
                var statusType = "";
                if(t === "goal") {
                    statusType = "Goal";
                } else if(t === "shooton") {
                    statusType = "Shoot";
                } else {
                    statusType = "ShootOff";
                }
                
                return statusType;
            },
            exchangeResult: function(t) {               
                
                return (parseInt(t) > 0) ? '<span class="success">success</span>' : '<span class="fail">fail</span>';
            }
        }
        
        /* RT init!! */
        function sportRada(e) 
        {
            $('#rtPreviewBox').css('display','none');
            
            var param = e.view.params;
            // gameCrush : 예측 시도 중 획한득 포인트
            gameCrush = (getlocalStorage('rtGameCrush')) ? parseInt(getlocalStorage('rtGameCrush')) : 0;
            controlBar();
            
            window.clearInterval(elapsedTimer);
            enetId = param.enet; // 현재 경기 seq
            matchStatus = param.stat;
            
            // lastMatch : 유저가 마지막으로 조인한 경기 seq
            var lastMatchz = (getlocalStorage('lastMatch')) ? parseInt(getlocalStorage('lastMatch')) : 0;
            if(lastMatchz === parseInt(enetId)) {
                console.log("same match");
                // lastFlow : 유저가 마지막으로 예측한 팀
                var lastFlowz = (getlocalStorage('lastFlow')) ? parseInt(getlocalStorage('lastFlow')) : "";
                //rt_ws_feed.keepUx(lastFlowz);
            } else {
                console.log("no same match : " + lastMatchz + "=" + enetId);
                rt_ws_feed.initUX();
            }
            
            //gameRepo[enetId] = new Array();
            
            // height: 248
            var vuHeight = $(window).height() - 102;
            //$('.wc-widget').css('height',vuHeight);
            
            app.mobileApp.showLoading();
            
            $('.rt_pannel_bets').html('');
            $('.sc_menus').removeClass('swipeNav');
            $('.livescore').empty();
            
            SRLive.addWidget("widgets.lmts",{
                "height": vuHeight, "showScoreboard": false, "showMomentum": true, "showPitch": true, "showSidebar": false, "showGoalscorers": false, "sidebarLayout": "dynamic", "collapse_enabled": false, "collapse_startCollapsed": false, "matchId": param.matchId, "showTitle": false, "container": ".wc-widget.wc-10"
            });
            SRLive.addWidget("widgets.matchcommentary",{
              "matchId": param.matchId, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-11"
            });
            SRLive.addWidget("widgets.matchlineups",{
              "matchId": param.matchId, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-12"
            });
            SRLive.addWidget("widgets.matchstats",{
              "matchId": param.matchId, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-13"
            });
            SRLive.addWidget("widgets.matchhead2head",{
              "matchId": param.matchId, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-14"
            });
            SRLive.addWidget("widgets.livetable",{
              "tournamentId": false, "enableFeedPolling": true, "promotionLegend": true, "respondToSetMatchFocus": true, "matchId": param.matchId, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-15"
            });
            
            
            var groupObj = $.grep(rtRowData[param.group], function(e){ return e.match_id === param.matchId; });

            amblemHome = 'http://scv.rankingball.com/asset/contents/dfs_soccer/EPL_' + groupObj[0]['home_code'] + '.png';
            amblemAway = 'http://scv.rankingball.com/asset/contents/dfs_soccer/EPL_' + groupObj[0]['away_code'] + '.png';
            var playingTime = groupObj[0]['game_time'];
            
            $('.rt_home_emblem').attr('src',amblemHome);
            $('#rt_home_label').html(groupObj[0]['home_team']);
            $('.is_home_score').html(groupObj[0]['home_score']);
            $('.rt_away_emblem').attr('src',amblemAway);
            $('#rt_away_label').html(groupObj[0]['away_team']);
            $('.is_away_score').html(groupObj[0]['away_score']);

            if(matchStatus === "3") {
                console.log("Stoped Game : " + matchStatus);
                $('.rt_times').html("--:--");
                predictionResultList.appendList();
                $('.rt_times').addClass('game_end');
                $('#rtStatusStr').html($.langScript[laf]['noti_094']);
                //$('#rtStatusPannel').removeClass('hide');
                
            } else if(matchStatus === "0") {
                $('.rt_times').html("--:--");
                $('.rt_times').removeClass('game_end');
                $('#rtStatusStr').html($.langScript[laf]['noti_092']);
                //$('#rtStatusPannel').removeClass('hide');
                ws_init(enetId);
            } else {
                $('.rt_times').removeClass('game_end');
                $('#rtStatusPannel').addClass('hide');
                ws_init(enetId);
            }
            
            
            
            initLife();
            dispGameLife();
            
            //$('#txt_message').html($.langScript[laf]['noti_055']);
            
            setTimeout(function() {
                app.mobileApp.hideLoading();
            },1500);
            
            $('.rt_reward_card').kendoTouch({
                tap: handleCardTouchEvent,
                touchstart: handleCardTouchEvent,
                touchend: handleCardTouchEvent,
            });
            
            
        }

        var bonusGet = false;
        var bonusData = "";
        function handleCardTouchEvent(e) 
        {    
            var t = e.event.type;
            var ti = e.touch.currentTarget.id;
            if(t === "touchend") {
                console.log(ti);
                if(!bonusGet) {
                    bonusGet = true;
                    
                    $('#' + ti + '-bonus').html(bonusData);
                    $('#' + ti).addClass('rt_reward_crad__flipped');

                    setTimeout(function() {
                        $("#moadl_reward").data("kendoMobileModalView").close();
                        onRewardModalClose();
                        bonusTag = false;
                    },5000);
                    
                }
                
            }
        }
        
        function dragMoveListener (event) 
        {
            var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            if(x > 20) {
                predictionFollow = "away";
            } else if(x < -20) {
                predictionFollow = "home";
            }
            target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px)';
            target.setAttribute('data-x', x);
        }

        function initLife() 
        {
            
            gameLife = (getlocalStorage('rtLife')) ? parseInt(getlocalStorage('rtLife')) : 3;
            
            console.log("Game Life : " + gameLife);
            
            if(gameLife < 3) {
                
                var rtNowTime = new Date();
                var diff = Math.floor((rtNowTime.getTime() - parseInt(getlocalStorage('rtTimer'))) / 1000);
                console.log(rtNowTime.getTime() + " : " + getlocalStorage('rtTimer'));
                console.log("Diff : " + diff);
                if(gameLife === 2) {
                    if(diff >= 180) {
                        console.log("over cooltime");
                        gameLife = 3;
                        gameLifeTimer = 180;
                        setlocalStorage('rtRegen',180);
                        setlocalStorage('rtLife',3)
                        return true;
                    }
                } else if(gameLife === 1) {
                    if(diff >= 360) {
                        gameLife = 3;
                        gameLifeTimer = 180;
                        setlocalStorage('rtRegen',180);
                        setlocalStorage('rtLife',3)
                        return true;
                    } else if(diff >= 180) {
                        gameLife = 2;
                    } 
                } else {
                    console.log(diff);
                    if(diff >= 540) {
                        console.log("fill");
                        gameLife = 3;
                        gameLifeTimer = 180;
                        setlocalStorage('rtRegen',180);
                        setlocalStorage('rtLife',3);
                        return true;
                    } else if(diff >= 360) {
                        gameLife = 2;
                    } else if(diff >= 180) {
                        gameLife = 1;
                    }
                }
                                    
                gameLifeTimer = getlocalStorage('rtRegen');
                rtCoolTime();
            } else {
                console.log(gameLife);
                $('#rechargeTime').addClass('recharge_hidden');
                window.clearInterval(rtCoolTimeBar);
                
            }
        }
        
        function timerz(diff)
        {
            var msec = diff;
            var hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            var mm = Math.floor(msec / 1000 / 60);
            msec -= mm * 1000 * 60;
            var ss = Math.floor(msec / 1000);
            msec -= ss * 1000;
            
            console.log(msec);
            console.log(hh);
            console.log(mm);
            console.log(ss);
        }
        
        var preSec = 0;
        var preMin = 0;
        
        function elapseTimeFn(diff)
        {
            var msec = diff;
            preMin = Math.floor(msec / 60);
            msec -= preMin * 60;
            preSec = Math.floor(msec);
            
            if(preMin > 1) {
                $('#predctionTimeRew').html((preMin + 0) + "min");
                $('#predctionTimeNow').html((preMin + 1) + "min");
                $('#predctionTimePre').html((preMin + 2) + "min");
            } else {
                $('#predctionTimeRew').html("0min");
                $('#predctionTimeNow').html("1min");
                $('#predctionTimePre').html("2min");
            }            
            return zeroFormat(preMin) + ":" + zeroFormat(preSec);
        }

        
        var ws;
        var elapseTime = 0;
        var elapsedTimer; // 경기 진행시간 표시용
        var gamePlaying = false; // 경기 진행 유무
        var playType = 0;
        
        var predictionRound = 0;
        var nowPredictionFlow = "";
        var lastPredictionFlow = "";
        var predictionTimer = "";
        var predictionTimerBar = "";
        
        var bonusTag = false;
        
        /* web socket */
        function ws_init(match_id)
        {
            console.log("WS Start");
            
            var ws_address = "ws://" + init_data.extr +":" + init_data.port +"/websocket";
            var send_params = "{" + '"type":5001' + ',"id":"' + uu_data.memSeq + '"' + ',"game":"' + match_id + '"' + "}";
            
            if ("WebSocket" in window)
            {
               ws = new WebSocket(ws_address);           	
               ws.onopen = function()
               {
                  ws.send(send_params);
               };
            	
               ws.onmessage = function (evt) 
               { 
                    var received_msg = evt.data;
                    rt_ws_feed.wsParse(received_msg);
               };
            	
               ws.onclose = function()
               { 
                  // websocket is closed.
                  console.log("Connection is closed..."); 
               };
            }

            else
            {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }
        }

        function rtElapsedTime(t) 
        {
            elapseTime = t;
            elapsedTimer = setInterval(function() {
                ++elapseTime;
                $('.rt_times').html(elapseTimeFn(elapseTime));
                
             }, 1000);
        }
        
        var rt_ws_feed = {

            initUX: function() {
                console.log("INIT UX");
                
                //$('#card').removeClass('flipped');
                $('.front').removeClass('hide');
                $('.back').addClass('hide');
                
                $('#predictionTime').html('');
                $('#predictionTimeRemain').html('');
        
                window.clearInterval(predictionTimerBar);
                console.log(predictionTimerBar);
                $('#predictionTimeRemain').html('0');
            },
            keepUx: function(fw) {
                var that = this;
                if(predictionTimerBar) {
                    if(fw === "away") {
                        $('#predictionSelectedTeam').attr('src',amblemAway);                    
                    } else {
                        $('#predictionSelectedTeam').attr('src',amblemHome);
                    }
                    
                    
                } else {
                    that.initUX();
                }
            },
            wsParse: function(jdata) {
                console.log(jdata);
                var that = this;
                jdata = JSON.parse(jdata);
                switch(parseInt(jdata['type'])) {
                    case 5001:
                        that.initGameTime(jdata['data']);
                        break;
                    case 5003:
                        that.getPredictionResult(jdata['data']);
                        break;
                    case 5011:
                        // kick off, half time, game finished
                        that.initGameTime(jdata['data']);
                        break;
                    case 7000:
                        that.updateTime(jdata['data']);
                        break;
                    default:
                        //console.log("none type");
                        break;
                }
            },
            initGameTime: function(data) {
                console.log(data);
                var that = this;
                playType = parseInt(data['play']);
                console.log("Play Type : " + playType);
                if(playType === 1 || playType === 4) {
                    console.log("now playing");
                    rtElapsedTime(parseInt(data['elapsed']));
                    $('#rtStatusPannel').addClass('hide');
                    gamePlaying = true;
                } else if(playType === 0) {
                    console.log("not started");
                    gamePlaying = false;
                    $('#recoverLife').html("00:00");
                    $('.rt_times').html("--:--");
                    window.clearInterval(elapsedTimer);
                } else if(playType === 6) {
                    gamePlaying = false;
                    $('#rtStatusStr').html($.langScript[laf]['noti_094']);
                    predictionResultList.appendList();
                    that.stopGame();
                } else {
                    
                    if(playType === 3 || parseInt(data['injury']) > 0) {
                        $('#rtStatusStr').html($.langScript[laf]['noti_093']);
                    }
                    
                    gamePlaying = false;
                    $('#recoverLife').html("00:00");
                    that.stopGame();
                }
            },
            updateTime: function(data) {
                var that = this;
                
                playType = parseInt(data['play']);
                
                var hscore = (data['aScore']) ? data['aScore'] : 0;
                var ascore = (data['bScore']) ? data['bScore'] : 0;
                
                $('.is_home_score').html(parseInt(hscore));
                $('.is_away_score').html(parseInt(ascore));
                
                if(playType === 1 || playType === 4) {
                    
                    gamePlaying = true;
                    //rtElapsedTime(parseInt(data['elapsed']));
                    elapseTime = parseInt(data['elapsed']);
                    
                    
                } else {
                    console.log("Game Status : " + playType);
                    
                    if(playType === 3 || parseInt(data['injury']) > 0) {
                        $('#rtStatusStr').html($.langScript[laf]['noti_093']);
                    }
                    
                    if(playType === 6) {
                        $('#rtStatusStr').html($.langScript[laf]['noti_094']);
                        predictionResultList.appendList();
                    }
                    
                    that.stopGame();
                }
            },
            stopGame: function() {
                var nowTime= "";
                if(playType === 0) {
                    nowTime = "--:--";
                } else if(playType < 4) {
                    nowTime = "45:00";
                } else {
                    nowTime = "90:00";
                } 
                $('.rt_times').html(nowTime);
                window.clearInterval(predictionTimerBar);
                window.clearInterval(elapsedTimer);
                $('#rtStatusPannel').removeClass('hide');
            },
            switchUX: function(arr) {
                var that = this;
                if(arr === "home") {
                    $('#predictionHomeStage').addClass('bestanswer').removeClass('rt_arrow_animation_r2l');
                    $('#predictionHomeLabel').addClass('bestanswer').removeClass('IsBestAnswer');
                    that.myprediction(1);
                } else {
                    $('#predictionAwayStage').addClass('bestanswer').removeClass('rt_arrow_animation_l2r');
                    $('#predictionAwayLabel').addClass('bestanswer').removeClass('IsBestAnswer');
                    that.myprediction(2);
                }
            },
            myprediction: function(arr) {
                var that = this;
                nowPredictionFlow = arr;
                
                if(gameLife > 0) {
                    
                    ++betCount;
                    
                    if(preMin > 0 && preMin === predictionRound) 
                    {
                        console.log("동일한 시간에 예측 시도 - " + betCount + " ( " + preMin + " : " + predictionRound + " )");
                        return false;
                    }
                    else 
                    {

                        console.log("다른 예측시간 - " + preMin + " : " + predictionRound);
                        --gameLife;
                        that.resetGameLife();
                        that.setCoolTime();
                        //that.predictionProgress(preSec, nowPredictionFlow);
                        that.predictionProgress(nowPredictionFlow);
                        that.sendFeed(arr);                       
                        
                        betCount = 1;
                        predictionRound = preMin;
                        lastPredictionFlow = nowPredictionFlow;
                        
                        setlocalStorage('lastMatch',enetId);
                        setlocalStorage('lastFlow',nowPredictionFlow);
                        //$('#predictionTime').html(zeroFormat(predictionRound + 2) + 'min');

                        
                    }
                    
                    console.log("챌린지 볼: " + gameLife);
                    console.log("챌린지 횟수: " + betCount);
                    
                } else {

                    app.showAlert($.langScript[laf]['noti_049'],'Notice');
                }
            },            
            sendFeed: function(arr) {
                var hNaIS = (arr === "home") ? 1 : 2;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"eventId":' + enetId + ',"hNa":' + hNaIS + '}';
                var url = init_data.apps + "?callback=?";
                app.mobileApp.showLoading();
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps",
                        "id": "checkinEventIncident",
                        "param":param
                    },
                   success: function(response) {
                       console.log(param);
                       console.log(response);
                       if (response.code === 0) {
                           var data = response.data;
                           $('#predictionTime').html(data.elapsed + 'min');
                           //gameRepo[enetId].push(data.elapsed);
                           //console.log(gameRepo);
                           
                           //$('#card').addClass('flipped');
                            $('.front').addClass('hide');
                            $('.back').removeClass('hide');
                       } else {
                           //console.log("RT 참여 오류");
                       }  
                   },
                   error: function(e) {
                       
                   },
                   complete: function() {
                       app.mobileApp.hideLoading();
                   }
                });
            },
            predictionProgress: function(fw) {
                console.log(preSec);
                predictionTimer = 60 - preSec;
                var that = this;
                
                if(fw === "away") {
                    $('#predictionSelectedTeam').attr('src',amblemAway);                    
                } else {
                    $('#predictionSelectedTeam').attr('src',amblemHome);
                }
                                
                var fillData = "";
                predictionTimerBar = setInterval(function() {                        
                    --predictionTimer;
                    if(predictionTimer > 0) {
                        console.log(predictionTimer);
                        fillData = '<div>' + predictionTimer + '<span>sec</span></div>';
                        $('#predictionTimeRemain').html(fillData);
                        
                    } else {

                        
                        setlocalStorage('lastMatch','');
                        setlocalStorage('lastFlow','');
                        console.log(predictionTimer);
                        that.initUX();                        
                    }                     
                 }, 1000);
            },
            getPredictionResult: function(data) {
                console.log(data);
                /*
                console.log(gameRepo);
                var arr_index = gameRepo[data.eventId].indexOf(data.round);                
                if( arr_index >= 0 ) {
                   console.log("found round : " + data.round);
                } else {
                   console.log("not found round : " + data.round);
                }
                */
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"eventId":' + enetId + ',"round":' + data.round + '}';
                var url = init_data.apps + "?callback=?";
                app.mobileApp.showLoading();
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps",
                        "id": "getEventIncidentResult",
                        "param":param
                    },
                   success: function(response) {
                        console.log(response);
                        if (response.code === 0) {
                            var resData = response.data;
                            
                            if(parseInt(resData.checkIn) === 1) {
                                that.eventsOpen(resData);
                            } else {
                                console.log("참여하지 않음");
                            }
                            //that.eventsOpen(resData);
                           
                        } else {
                           //console.log("RT 결과 오류");
                        }  
                   },
                   error: function(e) {
                       
                   },
                   complete: function() {
                       app.mobileApp.hideLoading();
                   }
                });
            },
            eventsOpen: function(preData) {
                var that = this;
                                
                //preData.myPoint = 5;
                //if(bonusTag) return false;
                
                if(parseInt(preData.myPoint) > 0) {
                    gameCrush += parseInt(preData.myPoint);
                        
                    
                    $('#predictionResultTime').html(preData.round);
                    $('#predictionResultTeam').html(preData.teamName);
                    $('#predictionResultShot').html(preData.shotoff);
                    $('#predictionResultShotOn').html(preData.shoton);
                    $('#predictionResultGoal').html(preData.goal);
                    $('#predictionResultPoint').html(preData.myPoint);
                    
                    $(".rt_result_box__success").removeClass('hide');
                    $(".rt_result_box__fail").addClass('hide');
                    
                    that.myPointBar(preData);

                } else {
                    $(".rt_result_box__success").addClass('hide');
                    $(".rt_result_box__fail").removeClass('hide');
                }
                
                
                $("#moadl_rtResult").data("kendoMobileModalView").open();
                /*
                setTimeout(function() {
                    $("#moadl_rtResult").data("kendoMobileModalView").close();
                },5000);
                */
            },
            myPointBar: function(preData) {
                var that = this;
                var progressBarWidth = 0;
                console.log(gameCrush);
                if(gameCrush >= 10) {
                    if(gameCrush > 10) gameCrush -= 10;
                    that.bonus(preData);
                    progressBarWidth = $('#rtMeter').width();
                    gameCrush = 0;
                } else {
                    var percent = (gameCrush / 10) * 100;
                    progressBarWidth = percent * $('#rtMeter').width() / 100;
                }
                
                setlocalStorage('rtGameCrush',gameCrush);
                
                $('#predictionCount').html(gameCrush + " / 10");
                $('#meter_bar').animate({ width: progressBarWidth }, 500);
            },
            bonus: function(preData) {
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"eventId":' + enetId + ',"round":' + preData.round + '}';
                var url = init_data.apps + "?callback=?";
                app.mobileApp.showLoading();
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.rtime",
                        "id": "getEventIncidentReward",
                        "param":param
                    },
                   success: function(response) {
                        console.log(response);
                        if (response.code === 0) {
                            var resData = response.data;
                            bonusGet = false;
                            $.each(resData, function(i,v) {
                                if(parseInt(v.myValue) === 1) {
                                    bonusData = v.item_name;
                                    uu_data.cash += parseInt(v.item_value);
                                    return false;
                                }
                            });
                            bonusTag = true;
                            $("#moadl_reward").data("kendoMobileModalView").open();
                        } else {
                           //console.log("RT 보상 없음");
                        }  
                   },
                   complete: function() {
                       app.mobileApp.hideLoading();
                   }
                });
                
                
            },
            resetGameLife: function() {
                $('.star').removeClass('full');
                
                if(gameLife === 3) {
                    $('#rechargeTime').addClass('recharge_hidden');
                    $('.star').addClass('full');
                } else {
                    $('#rechargeTime').removeClass('recharge_hidden');
                    for(var i = 1; i <= gameLife; i++) {
                        $('#start_pos_' + i).addClass('full');
                    }
                }
            },
            setCoolTime: function() {

                var that = this;
                if(gameLife === 2) {
                    rtCoolTimeBar = setInterval(function() {
                        
                        --gameLifeTimer;
                        if(gameLifeTimer > 0) {
                            var cmm = parseInt( gameLifeTimer / 60 );
                            var chh = parseInt( gameLifeTimer % 60 );
                            $('#recoverLife').html(zeroFormat(cmm) + " : " + zeroFormat(chh));
                        } else {
                            ++gameLife;
                            if(gameLife < 3) {
                                gameLifeTimer = 180;
                            } else {
                                gameLifeTimer = 180;
                                window.clearInterval(rtCoolTimeBar);
                                $('#recoverLife').html("00:00");
                            }
                            that.resetGameLife();
                        }
                        
                        var rtNowTime = new Date();
                        
                        setlocalStorage('rtLife',gameLife);
                        setlocalStorage('rtRegen',gameLifeTimer);
                        setlocalStorage('rtTimer',rtNowTime.getTime());
                        
                     }, 1000);
                }
            },
            emptyUX: function() {
                    $('#predictionArrowBtn').addClass('ball_off');
                    $('#predictionHomeStage').addClass('rt_arrow_animation_r2l__reverse').removeClass('rt_arrow_animation_r2l');
                    $('#predictionHomeLabel').addClass('empty_life');
                    $('#predictionAwayStage').addClass('rt_arrow_animation_l2r__reverse').removeClass('rt_arrow_animation_l2r');
                    $('#predictionAwayLabel').addClass('empty_life');
            }
        };
        
        function onRewardModalClose()
        {
            console.log("bonus clear");
            $('#meter_bar').width(0);
        }
        
        function setPredictionByClick(e)
        {
            if(playType === 1 || playType === 4) {
                    
                var data = e.button.data();
                predictionFollow = data.rel;
                if(predictionFollow) rt_ws_feed.myprediction(predictionFollow);
            } else {
                
            }
        }
        
        function controlBar()
        {
            var percent = (gameCrush / 10) * 100;
            var progressBarWidth = percent * $('#rtMeter').width() / 100;

            $('#predictionCount').html(gameCrush + " / 10");
            $('#meter_bar').animate({ width: progressBarWidth }, 500);
        }
        
        
        /* modal messages */
        function rtOpenGuide()
        {
            $("#moadl_guide_rt").data("kendoMobileModalView").open();
        }
        function rtCloseModal()
        {
            $("#moadl_guide_rt").data("kendoMobileModalView").close();
        }
        function rtCloseModalResult()
        {
            $("#moadl_rtResult").data("kendoMobileModalView").close();
        }

        
        function rtResultSuccess()
        {
            var ratio = 1.144736842;
            var width = $("body").width();
            var resizeWidth = 456;
            var resizeHeight = 522;
            
            if(width < 456) {
                resizeWidth = width - (width * .3);
                resizeHeight = resizeWidth * ratio;
            }
            
            $('.rt_result_box__success').css('width',resizeWidth + 'px');
            $('.rt_result_box__success').css('height',resizeHeight + 'px');
            
            $('.rt_result_box__success').removeClass('hide');
            $('.rt_result_box__fail').addClass('hide');
            $('#moadl_rtResult').data("kendoMobileModalView").open();
        }
        
        function rtResultFail()
        {
            var ratio = 0.903508772;
            var width = $("body").width();
            var resizeWidth = 456;
            var resizeHeight = 412;
            
            if(width < 456) {
                resizeWidth = width - (width * .3);
                resizeHeight = resizeWidth * ratio;
            }
            
            $('.rt_result_box__fail').css('width',resizeWidth + 'px');
            $('.rt_result_box__fail').css('height',resizeHeight + 'px');
            $('.rt_result_box__fail').removeClass('hide');
            $('.rt_result_box__success').addClass('hide');
            $('#moadl_rtResult').data("kendoMobileModalView").open();
        }
        
        return {
            init: init,
            rt_radar: rt_radar,
            rt_init: rt_init,
            init_result: init_result,
            rosa: rosa,
            nowPlayRT: nowPlayRT,
            playRTResult: playRTResult,
            confirmBack: confirmBack,
            swipeSlide: swipeSlide,
            collapseList: collapseList,
            sportRada: sportRada,
            doPrediction: setPredictionByClick,
            rtGuide: rtOpenGuide,
            rtGuideX: rtCloseModal,
            rtResSX: rtCloseModalResult,
            rtResCX: rtCloseModalResult,
            onRewardModalClose: onRewardModalClose
        };
        
    }());

    return playRealTime;
}());