/**
 * Real Time Service model
 */
var app = app || {};

app.Hambugerz = (function () {
    'use strict';

    var funcz = (function () {
        
        function init() {
            
                var docHeight = $(document).height() - 78.75;
                $('.contents-profile-view').css('height', docHeight + 'px');
                //$('.contents-profile-view').addClass('blank-top');
                //$('.profile-info').addClass('blank-mrg-top');
                //$('.profile-box').addClass('blank-pad-top');
                
               // setTimeout(function() {$('#profile-div').removeClass('hide');},500);
                
                        
            observableView();
            
            $('.card-face__name').html(uu_data.nick);
            $('.card-face__pincode').html(uu_data.pinValue);
        }
        
        function initGNB() {
            observableView();
        }
        
        
        
        function gnbSetting() {
            
            app.mobileApp.navigate('views/gnbSettingView.html');
        }
        
        
        
        return {
            init: init,
            initGNB: initGNB,
            gnbSetting: gnbSetting
        };
        
    }());

    return funcz;
}());