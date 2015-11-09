/**
 * Object Control view model
 */
var app = app || {};

app.Contests = (function () {
    'use strict';

    var contestListData = "";
    
    var contestProcess = (function () {
        
        function init() {
            $('#tabstrip_live').removeClass('ts');
            $('#tabstrip_upcoming').addClass('ts');
            loadContestData();
            observableView();
            console.log("data init");
        }
        
        function playInit() {
            loadContestData();
            observableView();
        }
        
        
        function resultInit() {

        }
        
        var loadContestData = function() {
            if( uu_data.memSeq === "" ) {
                console.log("User seq is null");
            } else {
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"organ":1}';
                var url = init_data.auth + "?callback=?";
                console.log(url);
                navigator.splashscreen.show();
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
                        console.log(response);
                        if (response.code === 0) {
                            contestListData = response.data;
                        
                        } else {
                            
                        }
                    },
                    complete: function() {
                        navigator.splashscreen.hide();
                    },
                    error: function(e) {
                        console.log(e);
                    }
                });  
            }
        }
        
        var observableView = function() {
            $('.amount_mini_ruby').html(uu_data.coin);
            $('.amount_mini_point').html(uu_data.points);
        }
        
        var matchPlay = function() {
            $('#tabstrip_live').removeClass('ts');
            $('#tabstrip_upcoming').addClass('ts');
            $('#tab_live').addClass('hide');
            $('#tab_upcomming').removeClass('hide');
        };
        
        var matchParticipating = function() {
            $('#tabstrip_upcoming').removeClass('ts');
            $('#tabstrip_live').addClass('ts');
            $('#tab_upcomming').addClass('hide');
            $('#tab_live').removeClass('hide');
        };
        
        
        var joinMatchConfirm = function(e) {
            //var data = e.button.data();
            closeModal();
            app.mobileApp.navigate('views/entryRegistrationView.html');
        }
        
        var joinMatch = function(e) {
            e.preventDefault();
            var data = e.button.data();
            console.log( data.rel );
            
            $("#join-match").data("kendoMobileModalView").open();
        };
        
        var closeModal = function(e) {
            $("#join-match").data("kendoMobileModalView").close();
        };
        
        var joinFeatured = function() {
            app.mobileApp.navigate('views/playListView.html', 'slide');
            $('#play-title').html('featured');
        };
        
        var joinFF = function() {
            app.mobileApp.navigate('views/playListView.html', 'slide');
            $('#play-title').html('50 / 50');
        };
        
        var joinGuarateed = function() {
            app.mobileApp.navigate('views/playListView.html', 'slide');
            $('#play-title').html('guaranteed to run');
        };
        
        var customAccordon = function(e) {
            var data = e.button.data();
            var els_this = $('#acco_' + data.rel);
            var els_ul = $('#' + data.rel);
            els_ul.slideToggle( "2500", "swing", function() {
                        if(els_ul.is(":visible")) {
                            els_this.find('span.collapse-btn').addClass('ico-open');
                        } else {
                            els_this.find('span.collapse-btn').removeClass('ico-open');
                        }
                    }
                );
        };
        
        
        var playResultTotal = function() {
            $('#tabstrip_live_result').removeClass('ts');
            $('#tabstrip_upcoming_result').addClass('ts');
            $('#result_role_record').addClass('hide');
            $('#tab_live_result').addClass('hide');
            $('#result_role_rank').removeClass('hide');
            $('#tab_upcomming_result').removeClass('hide');
        };
        
        var playResultTeam = function() {
            $('#tabstrip_upcoming_result').removeClass('ts');
            $('#tabstrip_live_result').addClass('ts');
            $('#tab_upcomming_result').addClass('hide');
            $('#result_role_rank').addClass('hide');
            $('#tab_live_result').removeClass('hide');
            $('#result_role_record').removeClass('hide');
        };
        
        var playResult = function(e) {
            var data = e.button.data();
            
            app.mobileApp.navigate('views/playResultView.html', 'slide');
        };
        
        var playEdit = function(e) {
            var data = e.button.data();
        };
        
        var recordInfo = function(e) {
            app.mobileApp.navigate('views/playResultRecordView.html', 'slide');
        }
        
        return {
            init: init,
            playInit: playInit,
            resultInit: resultInit,
            matchPlay: matchPlay,
            matchParticipating: matchParticipating,
            playResultTotal: playResultTotal,
            playResultTeam: playResultTeam,
            playResult: playResult,
            recordInfo: recordInfo,
            playEdit: playEdit,
            joinFeatured: joinFeatured,
            joinFF: joinFF,
            joinGuarateed: joinGuarateed,
            customAccordon: customAccordon,
            closeModal: closeModal,
            joinMatch: joinMatch,
            joinMatchConfirm: joinMatchConfirm
        };
    }());

    return contestProcess;
}());