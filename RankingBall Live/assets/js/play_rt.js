
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
        
        var startColor = '#2a6044';
        var endColor = '#f2f20a';
        var coolTimeColor = '#11a75b';
        var opts = {
            from: { color: startColor },
            to: { color: startColor }
        };
        
        var clc, reactCLC, sparkle;
        
        var swiper;
        var vr_timer;
        var vr_point = 1000;
        var vr_minutes = 900000;
        var vr_minute_val = 0;
        var vr_predict_count = 0;
        var vr_predict_right = 0;
        var vr_star = 0;
        
        var rtSlider = true;
                
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
        
        function rt_init() {
            console.log(uu_data);
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
                            //rtProgressBar(loop, 3, $('#meter_bar'));
                            $('#rt_message').html(rtMessagePrediction);
                            rtProgressBar(96, (loop - 15), 3.2, $('#meter_bar'));
                        } else {
                            //rtProgressBar(loop, 8, $('#meter_bar'));
                            rtProgressBar(maxCirclePosition, loop, 8, $('#meter_bar'));
                        }
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
        
        function nowPlayRT() {
            
            $("#moadl_loading").data("kendoMobileModalView").open();
            $("#moadl_loading").children('.km-content').addClass('opacity_zero');
                        
            setTimeout(function() {
                app.mobileApp.navigate('views/playRTVu.html', 'slide');
                $("#moadl_loading").data("kendoMobileModalView").close();
                }
                ,1000);
            
        }
        
        function ani() {
            $("#ya").data("kendoMobileModalView").open();
            $("#ya").children('.km-content').addClass('opacity_zero');
            
            $("#ya").sparkleh({
                count: 80,
                color: ["#ff0080","#ff0080","#0000FF"]
            });
            
            setTimeout(onTap,8000);
        }        

        $.fn.sparkleh = function( options ) {
            return this.each( function(k,v) {
                var $this = $(v).css("position","relative");
                var settings = $.extend({
                    width: $this.outerWidth(),
                    height: $this.outerHeight(),
                    color: "#FFFFFF",
                    count: 30,
                    overlap: 0,
                    speed: 1
                    }, options );
                sparkle = new Sparkle( $this, settings );
                sparkle.over();
            });
        }

        function Sparkle( $parent, options ) {
            this.options = options;
            this.init( $parent );
        }

        Sparkle.prototype = {
            "init" : function( $parent ) {
                var _this = this;
                this.$canvas = 
                $("<canvas>")
                    .addClass("sparkle-canvas")
                    .css({
                        position: "absolute",
                        top: "-"+_this.options.overlap+"px",
                        left: "-"+_this.options.overlap+"px",
                        "pointer-events": "none"
                    })
                    .appendTo($parent);

                this.canvas = this.$canvas[0];
                this.context = this.canvas.getContext("2d");

                this.sprite = new Image();
                this.sprites = [0,6,13,20];
                this.sprite.src = this.datauri;

                this.canvas.width = this.options.width + ( this.options.overlap * 2);
                this.canvas.height = this.options.height + ( this.options.overlap * 2);
                this.particles = this.createSparkles( this.canvas.width , this.canvas.height );
                this.anim = null;
                this.fade = false;
            },
            "createSparkles" : function( w , h ) {
                var holder = [];
                for( var i = 0; i < this.options.count; i++ ) {
                    var color = this.options.color;
                    if( this.options.color == "rainbow" ) {
                        color = '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
                    } else if( $.type(this.options.color) === "array" ) {
                        color = this.options.color[ Math.floor(Math.random()*this.options.color.length) ];
                    }
                    holder[i] = {
                        position: {
                            x: Math.floor(Math.random()*w),
                            y: Math.floor(Math.random()*h)
                        },
                        style: this.sprites[ Math.floor(Math.random()*4) ],
                        delta: {
                            x: Math.floor(Math.random() * 1000) - 500,
                            y: Math.floor(Math.random() * 1000) - 500
                        },
                        size: parseFloat((Math.random()*2).toFixed(2)),
                        color: color
                    };
                }
                return holder;
            },
            "draw" : function( time, fade ) {
                var ctx = this.context;
                ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
                for( var i = 0; i < this.options.count; i++ ) {
                    var derpicle = this.particles[i];
                    var modulus = Math.floor(Math.random()*7);
                    if( Math.floor(time) % modulus === 0 ) {
                        derpicle.style = this.sprites[ Math.floor(Math.random()*4) ];
                    }
                    ctx.save();
                    ctx.globalAlpha = derpicle.opacity;
                    ctx.drawImage(this.sprite, derpicle.style, 0, 7, 7, derpicle.position.x, derpicle.position.y, 7, 7);
                    if( this.options.color ) {  
                        ctx.globalCompositeOperation = "source-atop";
                        ctx.globalAlpha = 0.5;
                        ctx.fillStyle = derpicle.color;
                        ctx.fillRect(derpicle.position.x, derpicle.position.y, 7, 7);
                    }
                    ctx.restore();
                }
            },
            "update" : function() {
                var _this = this;
                this.anim = window.requestAnimationFrame( function(time) {
                    for( var i = 0; i < _this.options.count; i++ ) {
                        var u = _this.particles[i];
                        var randX = ( Math.random() > Math.random()*2 );
                        var randY = ( Math.random() > Math.random()*3 );
                        if( randX ) {
                            u.position.x += ((u.delta.x * _this.options.speed) / 1500); 
                        }
                        if( !randY ) {
                            u.position.y -= ((u.delta.y * _this.options.speed) / 800);
                        }
                        if( u.position.x > _this.canvas.width ) {
                            u.position.x = -7;
                        } else if ( u.position.x < -7 ) {
                            u.position.x = _this.canvas.width; 
                        }
                        if( u.position.y > _this.canvas.height ) {
                            u.position.y = -7;
                            u.position.x = Math.floor(Math.random()*_this.canvas.width);
                            } else if ( u.position.y < -7 ) {
                            u.position.y = _this.canvas.height; 
                            u.position.x = Math.floor(Math.random()*_this.canvas.width);
                        }
                        if( _this.fade ) {
                            u.opacity -= 0.02;
                        } else {
                            u.opacity -= 0.005;
                        }
                        if( u.opacity <= 0 ) {
                            u.opacity = ( _this.fade ) ? 0 : 1;
                        }
                    }
                    _this.draw( time );
                    if( _this.fade ) {
                        _this.fadeCount -= 1;
                        if( _this.fadeCount < 0 ) {
                            window.cancelAnimationFrame( _this.anim );
                        } else {
                            _this.update(); 
                        }
                    } else {
                        _this.update();
                    }
                });
            },
            "cancel" : function() {
                this.fadeCount = 100;
            },
            "over" : function() {
                window.cancelAnimationFrame( this.anim );
                for( var i = 0; i < this.options.count; i++ ) {
                    this.particles[i].opacity = Math.random();
                }
                this.fade = false;
                this.update();
            },
            "out" : function() {
                this.fade = true;
                this.cancel();
            },
            "datauri" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg=="
        };        
    
        
        function onTap() {
            sparkle.out();
            $("#ya").data("kendoMobileModalView").close();
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
            var els_ul = $('#rt' + data.rel);
            els_ul.slideToggle( "2500", "swing", function() {
                        if(els_ul.is(":visible")) {
                            els_this.find('span.collapse-btn').addClass('ico-open');
                        } else {
                            els_this.find('span.collapse-btn').removeClass('ico-open');
                        }
                    }
                );
        };
        
        function sportRada() {
            
            rtNowTime = new Date();
            
            var vuHeight = $(window).height() - 248;          
            //$('.wc-widget').css('height',vuHeight);

            app.mobileApp.showLoading();
            $('.sc_menus').removeClass('swipeNav');
            $('.wc-widget').empty();
            
            SRLive.addWidget("widgets.lmts",{
                "height": vuHeight, "showScoreboard": false, "showMomentum": true, "showPitch": true, "showSidebar": false, "showGoalscorers": false, "sidebarLayout": "dynamic", "collapse_enabled": false, "collapse_startCollapsed": false, "matchId": 7464774, "showTitle": false, "container": ".wc-widget.wc-10"
            });
            SRLive.addWidget("widgets.matchcommentary",{
              "matchId": 7464774, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-11"
            });
            SRLive.addWidget("widgets.matchlineups",{
              "matchId": 7464774, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-12"
            });
            SRLive.addWidget("widgets.matchstats",{
              "matchId": 7464774, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-13"
            });
            SRLive.addWidget("widgets.matchhead2head",{
              "matchId": 7464774, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-14"
            });
            SRLive.addWidget("widgets.livetable",{
              "tournamentId": false, "enableFeedPolling": true, "promotionLegend": true, "respondToSetMatchFocus": true, "matchId": 7464774, "height": vuHeight, "showTitle": false, "container": ".wc-widget.wc-15"
            });
            
            dispGameLife();
            
            $('#rt_message').html(rtMessageDef);
            
            setTimeout(function() {
                app.mobileApp.hideLoading();
                //$('.subwidgeht').removeClass('hide');
            },1500);
        }
        
        return {
            init: init,
            rt_init: rt_init,
            init_result: init_result,
            rosa: rosa,
            nowPlayRT: nowPlayRT,
            ani: ani,
            playRTResult: playRTResult,
            onTap: onTap,
            confirmBack: confirmBack,
            swipeSlide: swipeSlide,
            collapseList: collapseList,
            sportRada: sportRada
        };
        
    }());

    return playRealTime;
}());