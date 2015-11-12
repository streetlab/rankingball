/**
 * Result Control view model
 * Ranking, Recent Records
 */
var app = app || {};

app.Resnrnk = (function () {
    'use strict';
    
    var ResnrnkProcess = (function () {
        
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejean) / 86400000) + onejan.getDay() + 1) / 7);
        }
        
        function init() {
            console.log(uu_data);
            //var weekNumber = (new Date()).getWeek();
            
            $('.rnk-name').html(decodeURI(decodeURIComponent(uu_data.nick)));
            
            var point = Math.floor((Math.random() * 50));
            $('.rnk-point').html(point);
            
        }
        
        var rankSeason = function() {
            $('#tabstrip_header_week').removeClass('ts');
            $('#tabstrip_header_season').addClass('ts');
            $('#tabstrip_week').addClass('hide');
            $('#tabstrip_season').removeClass('hide');
        };
        
        var rankWeekly = function() {
            $('#tabstrip_header_season').removeClass('ts');
            $('#tabstrip_header_week').addClass('ts');
            $('#tabstrip_season').addClass('hide');
            $('#tabstrip_week').removeClass('hide');
        };
        
        return {
            init: init,
            rankSeason: rankSeason,
            rankWeekly: rankWeekly
        };
    }());

    return ResnrnkProcess;
}());
