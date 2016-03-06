/**
 * Card Control view model
 */
var app = app || {};

app.Card = (function () {
    'use strict';
   
    var cardModel = (function () {

        var tapLast = "";
        
        /* Page Init - Only First time */
        function init() {

        }
        
        /* Page Init - When Page display */
        function onShow()
        {
            observableView();
        }
      
        function langExchange() 
        {
            //console.log(laf);
            app.langExchange.exchangeLanguage(laf);    
        }
        
        function tapStriper(e)
        {
            var data = e.button.data();
            if(tapLast === data.rel) return false;           
            if(data.rel === "CH") {    
                changeTap.tapClubHouse();
            } else {
                changeTap.tapSkill();
            }
            tapLast = data.rel;
        }
        
        function tapSubStriper(e)
        {
           var data = e.button.data();         

        }
        
        var changeTap = {
            tapInit: function()
            {
                app.mobileApp.showLoading();
            },
            tapClubHouse: function() {
                var that = this;
                that.tapInit();
                $('#tabstripClubHouse').find('a').addClass('ts');
                $('#tapClubHouse').find('a').removeClass('ts');
                $('.group_clubhouse').removeClass('hide');
                $('.group_skill').addClass('hide');
                that.tapComplete();
            },
            tapSkill: function() {
                var that = this;
                that.tapInit();
                $('#tabstripClubHouse').find('a').removeClass('ts');
                $('#tapClubHouse').find('a').addClass('ts');
                $('.group_clubhouse').addClass('hide');
                $('.group_skill').removeClass('hide');
                that.tapComplete();
            },
            tapComplete: function() {
                setTimeout(function() {
                    app.mobileApp.hideLoading();
                }, 300);
            }
        };
        
        
        return {
            init: init,
            onShow: onShow,
            langExchange: langExchange,
            tapStriper: tapStriper,
            tapSubStriper: tapSubStriper
        };
    }());

    return cardModel;
}());