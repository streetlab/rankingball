/**
 * Entry Control view model
 */
var app = app || {};

app.Entry = (function () {
    'use strict';

    var entryProcess = (function () {
        
        var contestNo = "";
        var contestFee = 0;
        var pb;
        var max_salarycap_amount = 30000;
        
        function init(e) {
            
            console.log(uu_data);
            
            var param = e.view.params;
            contestNo = param.contest;
            contestFee = param.fee;
            if(!contestNo) {
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if(param.mode === "ed") {
                
            } else {
                initEntryData();
            }            
            
            progressBar(entryAmount, $('#progressBar'));
        }
        
        function initEntryData() {
            
            observableView();
            
            entryAmount = 0;
            progressBar(entryAmount, $('.salarycap-gage'));
            
            /* reset entry view */
            $('.btn-slots').each(function() {
                $(this).prop('src','/assets/resource/btn_player_plus.png');
            });
            $('#img-slot4').prop('src','/assets/resource/btn_player_plus_02.png');
            $('#img-slot8').prop('src','/assets/resource/btn_player_plus_02.png');
            
            $(".player-slots-f").each(function() {
                $(this).html("F");
            });
            $('.player-slots-m').each(function() {
                $(this).html("M");
            });
            $('.player-slots-d').each(function() {
                $(this).html("D");
            });
            
            $('#player-slot4').html("FLEX");
            $('#player-slot8').html("GK");
        
            $('#entryRegBtn')
                .attr('data-rel','disabled')
                .addClass('disabled')
            /* reset player view */
            app.Playerz.clearVariables();
            
        }
        
        function allClear() {
            navigator.notification.confirm("엔트리 등록을 초기화 할까요?", function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    initEntryData();          
               }
            }, '알림', ['확인', '취소']);
            return false;
        }
        
        function regEntry() {
            
            if(entryStatus === false) {
                console.log("error : " + entryStatus);
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                return false;
            }
            
            if(!contestNo) {
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                return false;
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            navigator.notification.confirm("현재 지정된 선수로 엔트리를 등록하시겠습니까?", function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    app.Playerz.setFinalEntry(contestNo,contestFee);    
               }
            }, '알림', ['확인', '취소']);
            return false;
        }
        
        function progressBar(amount, $element) {
            var percent = amount / max_salarycap_amount * 100;
            var progressBarWidth = percent * $element.width() / 100;
            $element.find('div').animate({ width: progressBarWidth }, 500);
            $element.find('p').html("$" + numberFormat(amount) + "&nbsp; /&nbsp;$" +numberFormat(max_salarycap_amount));
        }
        
        var setPbAmount = function(e) {
            pb.value( e );
        };
        
        var setPlayerEntry = function(e) {
            var data = e.button.data();
            console.log(data);
            
            var url = 'views/entryPlayerzView.html?pos=' + data.rel + "&slot=" + data.slot;
            app.mobileApp.navigate(url,'slide');
        }
        
        return {
            init: init,
            setPbAmount: setPbAmount,
            setPlayerEntry: setPlayerEntry,
            initEntryData: initEntryData,
            allClear: allClear,
            regEntry: regEntry
        };
    }());

    return entryProcess;
}());