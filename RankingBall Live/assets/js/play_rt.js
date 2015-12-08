/**
 * Real Time Service model
 */
var app = app || {};

app.playRTS = (function () {
    'use strict';

    var playRealTime = (function () {
        
        var activePrediction = false;
        
        var maxCirclePosition = 135;
        var circlePosition = 0;
        var circleReadyRange = 0.005166666;
        
        var startColor = '#2a6044';
        var endColor = '#f2f20a';
        var coolTimeColor = '#11a75b';
        var opts = {
            from: { color: startColor },
            to: { color: startColor }
        };
        
        var clc, reactCLC;
                
        function init() {
            
            var element = document.getElementById('progress_bar');
            $('.clc_btn').append('<span id="clc_txt">GO</span>');
            clc = new ProgressBar.Circle(element, {
                color: startColor,
                duration: 100,
                trailColor: "#454545",
                strokeWidth: 20,
                easing: 'easeOut',
                step: function(state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                }
            });
        }

        function reactResult() {
            window.clearInterval(reactCLC);
            clc.animate(0, opts);
            circlePosition = 0;
            opts = {
                from: { color: startColor },
                to: { color: startColor }
            };
            
            $('.clc_btn').empty();
            $('.clc_btn').append('<span id="clc_txt">GO</span>');
            //$('#clc_txt').html('GO');
            $('.clc_marker').hide();
            activePrediction = false;
        }
        
        function predictionCheck() {
            if(activePrediction) return false;
            return true;
        }
        
        function rosa() {
            
            if(activePrediction) {
                app.showError("골 예측 중입니다.");
                return false;   
            }
            
            activePrediction = true;
            var loop = 0;
            
            $('.clc_btn').empty();
            $('.clc_btn').append('<span id="clc_number" class="animated infinite tada"></span>');
            
            reactCLC = setInterval(function() {
                //var second = new Date().getSeconds();
                
                if( ++loop > maxCirclePosition ) {
                    reactResult();
                } else {
                    if(loop > 15) {
                        $('#svg2').show();
                        //circlePosition = loop / maxCirclePosition;
                        circlePosition += circleReadyRange;
                        clc.animate(circlePosition, { 
                            from: {color : coolTimeColor}, to :{color : coolTimeColor}
                            }, function() {
                            console.log( loop + " : " + circlePosition );
                            //clc.setText('');
                            var clooTime = maxCirclePosition - loop;
                            if(clooTime > 10) {
                                $('#clc_number').html("...");
                            } else {
                                $('#clc_number').html(clooTime);
                            }
                            
                        });
                    } else {
                        if(loop > 5) {
                            $('#svg1').show();
                            opts= {
                                from: { color: endColor },
                                to: { color: endColor }
                            };
                            
                        }
                        
                        circlePosition += 0.025333333;
                        clc.animate(circlePosition, opts, function() {
                            console.log( loop + " : " + circlePosition );
                            //clc.setText(loop);
                            $('#clc_number').html(loop);
                        });
                    }
                }
            }, 1000);
        }
        
        function rosa2() {
            clc.animate(1, opts);
        }


        function playRTResult() {
            app.mobileApp.navigate('views/playRTResultVu.html', 'slide');
        }
        
        function nowPlayRT() {
            app.mobileApp.navigate('views/playRTVu.html', 'slide');
        }
        
        function ani() {
            $("#ya").data("kendoMobileModalView").open();
            $("#ya").children('.km-content').addClass('opacity_zero');
            
            $("#ya").sparkleh({
                count: 80,
                color: ["#ff0080","#ff0080","#0000FF"]
            });
                      
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
                var sparkle = new Sparkle( $this, settings );
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
            $("#ya").data("kendoMobileModalView").close();
        }
        
        return {
            init: init,
            rosa: rosa,
            nowPlayRT: nowPlayRT,
            ani: ani,
            playRTResult: playRTResult,
            onTap: onTap
        };
        
    }());

    return playRealTime;
}());