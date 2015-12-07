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
            $('#clc_txt').html('GO');
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
                                $('#clc_txt').html("...");
                            } else {
                                $('#clc_txt').html(clooTime);
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
                            $('#clc_txt').html(loop);
                        });
                    }
                }
            }, 1000);
        }
        
        function rosa2() {
            clc.animate(1, opts);
        }


        
        function nowPlayRT() {
            app.mobileApp.navigate('views/playRTVu.html', 'slide');
        }
        
        
        return {
            init: init,
            rosa: rosa,
            nowPlayRT: nowPlayRT
        };
        
    }());

    return playRealTime;
}());