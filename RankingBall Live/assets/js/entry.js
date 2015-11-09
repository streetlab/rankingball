/**
 * Entry Control view model
 */
var app = app || {};

app.Entry = (function () {
    'use strict';

    var entryProcess = (function () {
        
        var pb;
        var max_salarycap_amount = 30000;
        
        function init() {
            /*
            pb = $("#progressBar").kendoProgressBar({
                min: 30,
                max: max_salarycap_amount,
                type: "value",
                animation: { duration: 400 }
            }).data("kendoProgressBar");
            */         
            console.log("entry init");
            progressBar(5000, $('#progressBar'));
            
            var vw = $(window).width();
            var vh = $(window).height();
            console.log( vw + " : " + vh );
        }
        
        function progressBar(amount, $element) {
            var percent = amount / max_salarycap_amount * 100;
            var progressBarWidth = percent * $element.width() / 100;
            $element.find('div').animate({ width: progressBarWidth }, 500);
            $element.find('p').html("" + amount + "&nbsp; /&nbsp;" + max_salarycap_amount);
        }
        
        var setPbAmount = function(e) {
            pb.value( e );
        };
        
        var setPlayerEntry = function(e) {
            var data = e.button.data;
            console.log(data.rel);
            app.mobileApp.navigate('views/entryPlayerzView.html');
        }
        
        return {
            init: init,
            setPbAmount: setPbAmount,
            setPlayerEntry: setPlayerEntry
        };
    }());

    return entryProcess;
}());