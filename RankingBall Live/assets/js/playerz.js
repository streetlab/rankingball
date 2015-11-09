/**
 * Player Control view model
 */
var app = app || {};

app.Playerz = (function () {
    'use strict';

    var playerProcess = (function () {
        
    
        function init() {

        }

        function playerInfo() {
            app.mobileApp.navigate('views/entryPlayerDataView.html');
        }
        
        return {
            init: init,
            playerInfo: playerInfo
        };
    }());

    return playerProcess;
}());