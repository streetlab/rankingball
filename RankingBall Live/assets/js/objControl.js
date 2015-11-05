/**
 * Object Control view model
 */
var app = app || {};

app.ObjControl = (function () {
    'use strict';

    var $blocks;
    
    var objModel = (function () {
        
        
        function init() {
            
            setTimeout(setMenuAnimate,300);
            
            $('.animBlock').kendoTouch({
                tap: handleTouchEvent,
                touchstart: handleTouchEvent,
                touchend: handleTouchEvent,
                doubletap: handleTouchEvent,
                hold: handleTouchEvent,
                dragstart: handleTouchEvent,
                dragend: handleTouchEvent
            });
        }
        
        function setMenuAnimate() {
            $blocks = $('.animBlock.notViewed');
            $blocks.each(function(i, elem) {
                if( $(this).hasClass('viewed') )
                    return;    
                isScrolledIntoView($(this));
            });
        }
         
        function isScrolledIntoView(elem) {
            //var docViewTop = $(window).scrollTop();
            //var docViewBottom = docViewTop + $(window).height();
            //var elemOffset = 0;
            
            if(elem.data('offset') !== undefined) {
                elemOffset = elem.data('offset');
            }
            
            $(elem).removeClass('notViewed').addClass('viewed');
        }
        
        function handleTouchEvent(e) {
            
            var te = e.event.type;
            var el_id = e.touch.currentTarget.id;
            if(te === "touchstart") {
                $('#' + el_id + ' .touch-filter').addClass('box-touch-oh');
            } else {
                $('#' + el_id).find('.touch-filter').removeClass('box-touch-oh');
            }
        }

        return {
            init: init
        };
    }());

    return objModel;
}());