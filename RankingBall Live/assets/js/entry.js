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
            
            pb = $("#progressBar").kendoProgressBar({
                min: 30,
                max: max_salarycap_amount,
                type: "value",
                animation: { duration: 400 }
            }).data("kendoProgressBar");
                        
            console.log("entry init");
            
             pb.value(55);
        }
        
        var setPbAmount = function(e) {
            pb.value( e );
        };
        
        return {
            init: init,
            setPbAmount: setPbAmount    
        };
    }());

    return entryProcess;
}());