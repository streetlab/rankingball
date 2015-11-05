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
            $('.amount_mini_ruby').html(uu_data.coin);
            $('.amount_mini_point').html(uu_data.points);
            
            console.log("data init");
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
        
        return {
            init: init,
            matchPlay: matchPlay,
            matchParticipating: matchParticipating,
            joinFeatured: joinFeatured,
            joinFF: joinFF,
            joinGuarateed: joinGuarateed
        };
    }());

    return contestProcess;
}());