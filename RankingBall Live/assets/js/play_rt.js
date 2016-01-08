
/**
 * Real Time Service model
 */
var app = app || {};

app.playRTS = (function () {
    'use strict';

    var playRealTime = (function () {
        
        var activePrediction = false;
        
        var maxTimeCount = 45;
        var maxCirclePosition = 216;
        
        var reactCLC;
        var swiper;       
        var rtSlider = true;
   
        var rtRowData = "";
        
        function init() {
            
            observableView();
            
            $('.sc_menus').removeClass('swipeNav');
            $('.rt-navigation').css('width',$(window).width());
            
            swiper = new Swipe(document.getElementById('sliderz'), {
                startSlide: 0,
                speed: 400,
                auto: 0,
                continuous: false,
                disableScroll: false,
                stopPropagation: true,
                callback: function(index, elem) {},
                transitionEnd: function(index, elem) {
                    
                    if(index < 2) {
                        $('.sc_menus').removeClass('swipeNav');
                        
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
                    } else {
                        
                        if(index > 3) {
                            $('.sc_menus').addClass('swipeNav');
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
                        
            $('.sc_menus').kendoTouch({
                enableSwipe: true,
                swipe: function (e) {
                    console.log("User swiped the element");
                    console.log(e);
                    handleTouchEvent(e);
                    
                }
            });
            
        }
        
        function flipHeaderTitle() {
            if(rtSlider) {
                $('#rt_header__scoreboard').fadeOut();
            } else {
                $('#rt_header__scoreboard').fadeIn();
            }
        }
        
        function dispTitleShow() {
            console.log("do callback first");
            $('#rt_header__title').show('slide');
        }

        function dispScoreboardShow() {
            console.log("do callback another");
            $('#rt_header__scoreboard').show('slide');
        }
        
        function handleTouchEvent(e) {    
            if(e.direction === "left") {
                $('.sc_menus').addClass('swipeNav');
            } else {
                $('.sc_menus').removeClass('swipeNav');
            }
        }
        
        function rt_radar() {
            
            app.mobileApp.showLoading();
            
            observableView();
            
            var url = "http://scv.rankingball.com/rt_fullfeed/soccer";
            $.ajax({
                url: url,
                type: "GET",
                timeout: 1000,
                dataType: "jsonp",
                data: {
                    "id": "getRadar"
                },
                success: function(response) {
                    console.log(response);
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
            observableView();
            //$('.amount_mini_point').html(numberFormat(vr_point));
        }
        
        function init_result() {
            observableView();
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
                    observableView();
                });

            } else {
                app.showAlert(rtMessageFail,'예측 실패',function() {});
            }
        }
        
        function reactResult() {
            window.clearInterval(reactCLC);
            $('#meter_bar').css('width','216px');
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
            console.log(barWidth, loop * pos);
        	var progressBarWidth = barWidth - ( loop * pos ) + 'px';
        	$element.animate({ width: progressBarWidth }, 500);
        }
        
        var rtCoolTimeBar = "";
        var rtNowTime = "";
        var rtPredictTimeStart = "";
        var rtPredictTimeEnd = "";
        var rtPredictTimeQA = "";
        
        function rtCoolTime() {
            rtCoolTimeBar = setInterval(function() {
                
                --gameLifeTimer;
                console.log(gameLifeTimer);
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
                    }
                    dispGameLife();
                }
                
             }, 1000);
        }
        
        function rosa() {
            
            if(activePrediction) {
                app.showError("골 예측 중입니다.");
                return false;   
            }            
            
            activePrediction = true;
            var loop = 0;
            
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
                        if(loop > 15) {
                            $('#rt_message').html(rtMessagePrediction);
                        }
                        rtProgressBar(maxCirclePosition, loop, 4.8, $('#meter_bar'));
                        /*
                        if(loop > 15) {
                            $('#rt_message').html(rtMessagePrediction);
                            rtProgressBar(96, (loop - 15), 3.2, $('#meter_bar'));
                        } else {
                            rtProgressBar(maxCirclePosition, loop, 5.4, $('#meter_bar'));
                        }
                        */
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
                app.mobileApp.navigate('views/playRTVu.html?matchId=' + data.rel + '&group=' + data.gol, 'slide');
                $("#moadl_loading").data("kendoMobileModalView").close();
                }
                ,1000);
            
        }
        
        function dispGameLife() {
            $('.star').removeClass('full');
            
            if(gameLife === 3) {
                
                $('.star').addClass('full');
                $('#lifeCoolTime').hide();
                
            } else {
                
                $('#lifeCoolTime').removeClass('hide');
                $('#lifeCoolTime').show();
                for(var i = 1; i <= gameLife; i++) {
                    $('#start_pos_' + i).addClass('full');
                }
            }
            
            $('#rtLife').html('x' + gameLife);
        }
        
        function confirmBack() {
            
            if(activePrediction) {
                app.showError("골 예측 중에는 나올 수 없습니다.");
                return false;   
            }
            
            navigator.notification.confirm("경기를 나오시겠습니까?", function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                   app.mobileApp.navigate('#:back', 'slide');
               }
            }, '알림', ['확인', '취소']);
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
        
        function sportRada(e) {
            var param = e.view.params;
            
            rtNowTime = new Date();
            
            var vuHeight = $(window).height() - 248;          
            //$('.wc-widget').css('height',vuHeight);

            app.mobileApp.showLoading();
            $('.sc_menus').removeClass('swipeNav');
            $('.wc-widget').empty();
            
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
            });z
            
            
            var groupObj = $.grep(rtRowData[param.group], function(e){ return e.match_id === param.matchId; });
            
            var home_img = 'http://scv.rankingball.com/asset/contents/dfs_soccer/EPL_' + groupObj[0]['home_code'] + '.png';
            var away_img = 'http://scv.rankingball.com/asset/contents/dfs_soccer/EPL_' + groupObj[0]['away_code'] + '.png';
            var playingTime = groupObj[0]['game_time'];
            
            $('.rt_home_emblem').attr('src',home_img);
            $('#rt_home_label').html(groupObj[0]['home_team']);
            $('.is_home_score').html(groupObj[0]['home_score']);
            $('.rt_away_emblem').attr('src',away_img);
            $('#rt_away_label').html(groupObj[0]['away_team']);
            $('.is_away_score').html(groupObj[0]['away_score']);
            
            dispGameLife();
            
            $('#rt_message').html(rtMessageDef);
            
            setTimeout(function() {
                app.mobileApp.hideLoading();
                //$('.subwidgeht').removeClass('hide');
            },1500);
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
            sportRada: sportRada
        };
        
    }());

    return playRealTime;
}());