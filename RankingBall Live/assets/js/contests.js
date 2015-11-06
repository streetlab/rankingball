/**
 * Object Control view model
 */
var app = app || {};

app.Contests = (function () {
    'use strict';

    var contestProcess = (function () {
        
        function init() {
            $('#tabstrip_live').removeClass('ts');
            $('#tabstrip_upcoming').addClass('ts');
            observableView();
            console.log("data init");
        }
        
        function playInit() {
            observableView();
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
        }
        
        var joinFeatured = function() {
            app.mobileApp.navigate('views/playListView.html', 'slide');
            $('#play-title').html('featured');
        }
        
        var joinFF = function() {
            app.mobileApp.navigate('views/playListView.html', 'slide');
            $('#play-title').html('50 / 50');
        }
        
        var joinGuarateed = function() {
            app.mobileApp.navigate('views/playListView.html', 'slide');
            $('#play-title').html('guaranteed to run');
        }
        
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
        }
        
        
        return {
            init: init,
            playInit: playInit,
            matchPlay: matchPlay,
            matchParticipating: matchParticipating,
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