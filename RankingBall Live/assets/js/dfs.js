/**
 * Users model
 */

var app = app || {};

app.Dfs = (function () {
    'use strict';
    
    var controlDfs = (function () {
        
        var contestCreate = function() {
            app.showAlert('Comming Soon!', 'Notice');
        }
        
        var appLogout = function() {
            navigator.notification.confirm('Do you really want to Log-out?', function (confirmed) {
                var moveLanding = function () {
                    app.mobileApp.navigate('#landing');
                };

                if (confirmed === true || confirmed === 1) {
                    app.helper.logout().then(moveLanding);
                }
            }, 'Log Out', ['OK', 'Cancel']);
        }
        
        var doSetLineup = function(e) {
            e.preventDefault();
            var returnPlayer = e.touch.target[0].textContent;
            $('#player-lf').html(returnPlayer);
            console.log(returnPlayer);
            back();
        }
        
        var setPlayer = function () {
           $('#player-lf').text('ayukawa');
           $('#player-rf').text('qwerty');
        };
        
        var contestInfo = function() {
            app.mobileApp.navigate('views/contestView.html', 'overlay:up');
        }
        
        var contestInfoAll = function() {
            app.mobileApp.navigate('views/contestAllView.html', 'slide');
        }
        
        var contestEnter = function() {
            app.mobileApp.navigate('views/contestEnter.html', 'overlay:up');
        }
        var contestEnterSkip = function() {
            app.mobileApp.navigate('views/contestSetup.html', 'overlay:up');
        }
        var contestLive = function() {
            app.mobileApp.navigate('views/contestLive.html', 'overlay:up');
        }
        var setLineup = function() {
            app.mobileApp.navigate('views/contestSetup.html', 'slide');
        }
        var contestSetLineup = function() {
            app.mobileApp.navigate('views/contestLineup.html', 'overlay');
        }
        var contestEnterReject = function() {
            app.showAlert('Basketball is not yet active.', 'Notice');
        }
        var contestInfoAllNBA = function() {
            app.mobileApp.navigate('views/contestAllViewNBA.html', 'overlay');
        }
        var completeEnter = function() {
            $('#1st-confirm').show();
            $('#2nd-confirm').hide();
            $("#confirm-modal").data("kendoMobileModalView").open();
        }
        
        var confirmEntry = function() {
            app.mobileApp.showLoading();
            setTimeout(function() {
                $('#1st-confirm').hide();
                $('#2nd-confirm').show();
                app.mobileApp.hideLoading();
            }, 3000);
        }
        var done = function() {
            $("#confirm-modal").data("kendoMobileModalView").close();
            app.mobileApp.navigate("#:back");
        }        
        
        var closeModal = function() {
            $("#confirm-modal").data("kendoMobileModalView").close();
        }
        
        var quizPlz = function() {
            var quiz = new Array('Goal in 5min?','Free Kick in 5 min?','Red Card in 5 min?');
            var rnd = Math.floor(Math.random() * 3);
            $('#quiz-label').text(quiz[rnd]);
            
            $('#1st-quiz').show();
            $('#2nd-quiz').hide();
            $("#quiz-modal").data("kendoMobileModalView").open();
        }
        var quizReplyS = function() {
             var rnd = Math.round(Math.random()) ? "yes" : "no";
            quizReset(rnd);
        }
        var quizReplyF = function() {
             var rnd = Math.round(Math.random()) ? "yes" : "no";
            quizReset(rnd);
        }
        var quizClose = function() {
            $("#quiz-modal").data("kendoMobileModalView").close();
        }
        
        
        var quizReset = function(r) {
            app.mobileApp.showLoading();
            setTimeout(function() {
                if(r === "yes") {
                    $('#quiz_success').hide();
                    $('#quiz_fail').show();
                } else {
                    $('#quiz_success').show();
                    $('#quiz_fail').hide();
                }
                $('#1st-quiz').hide();
                $('#2nd-quiz').show();
                app.mobileApp.hideLoading();
            }, 1000);
        }
        
        var back = function() {
            app.mobileApp.navigate("#:back");
        }
        var destory = function() {
            clearInterval(exid);
            app.mobileApp.navigate('views/tabContests.html');
            
            $("#contest-live").data("kendoMobileView").destroy();
            $("#contest-live").remove();
        }

        var tabStrip = function(e) {
            console.log("clicked!");
            console.log(e);
        }
 
        
        return {
            contestCreate: contestCreate,
            appLogout: appLogout,
            contestInfo: contestInfo,
            contestInfoAll: contestInfoAll,
            back: back,
            contestEnter: contestEnter,
            contestEnterSkip: contestEnterSkip,
            setLineup: setLineup,
            doSetLineup: doSetLineup,
            completeEnter: completeEnter,
            contestSetLineup: contestSetLineup,
            closeModal: closeModal,
            confirmEntry: confirmEntry,
            done: done,
            setPlayer: setPlayer,
            tabStriper: tabStrip,
            contestEnterReject:contestEnterReject,
            contestInfoAllNBA: contestInfoAllNBA,
            contestLive: contestLive,
            destory: destory,
            quizReplyS: quizReplyS,
            quizReplyF: quizReplyF,
            quizClose: quizClose,
            quizPlz: quizPlz
        };
    }());

    
    return controlDfs;
}());