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
        
        var ps = {};
        var playerFilter = [];
                
        function init(e) {
            
            var param = e.view.params;
            contestNo = param.contest;
            contestFee = param.fee;
            if(!contestNo) {
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            console.log(JSON.stringify(param));
            
            progressBar(entryAmount, $('#progressBar'));
            /*
            if(param.mode === "ed") {
                initEntryDataUpdate(contestNo);
            } else {
                initEntryData();
            }            
            
            
            */
        }
        
        function updateInit() {
           
            console.log(uu_data);
            var param = e.view.params;
            contestNo = param.contest;
            if(!contestNo) {
                app.showError("엔트리 수정을 위한 경기 정보를 확인할 수 없습니다.");
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if(param.mode === "ed") {
                
            } else {
                app.showError("잘못된 요청입니다.");
            }            
            
            progressBar(entryAmount, $('#progressBar'));
        }
        
        function initEntryData() {
            
            console.log("haha");
            
            observableView();
            
            entryAmount = 0;
            progressBar(entryAmount, $('.salarycap-gage'));
            
            /* reset entry view */
            $('.btn-slots').each(function() {
                $(this).prop('src','./assets/resource/btn_player_plus.png');
            });
            $('#img-slot4').prop('src','./assets/resource/btn_player_plus_02.png');
            $('#img-slot8').prop('src','./assets/resource/btn_player_plus_02.png');
            
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
        
        function initUpdateData() {
            
            observableView();
            entryAmount = myEntryByContest[contestNo]['mySalaryTotal'];
            progressBar(entryAmount, $('.salarycap-gage'));
            
            /* reset entry view */
            $('.btn-slots').each(function() {
                $(this).prop('src','./assets/resource/btn_player_change.png');
            });
            $('#img-slot4').prop('src','./assets/resource/btn_player_change_02.png');
            $('#img-slot8').prop('src','./assets/resource/btn_player_change_02.png');
            
            $('#update-player-slot1').html(playerFilter[ps.s1]);
            console.log(playerFilter[ps.s1]);
            $('#update-player-slot2').html(playerFilter[ps.s2]);
            $('#update-player-slot3').html(playerFilter[ps.s3]);
            $('#update-player-slot4').html(playerFilter[ps.s4]);
            $('#update-player-slot5').html(playerFilter[ps.s5]);
            $('#update-player-slot6').html(playerFilter[ps.s6]);
            $('#update-player-slot7').html(playerFilter[ps.s7]);
            $('#update-player-slot8').html(playerFilter[ps.s8]);
            console.log(playerFilter[ps.s8]);
            $('#entryUpdate').removeClass('disabled');
            
            /* reset player view */
            app.Playerz.clearVariables2Update();
            
        }
        
        function initEntryDataUpdate(c) {
            //console.log(c);
            if(!c) return false;
            
            entryStatus = true;
            contestNo = c;
            
            app.mobileApp.showLoading();
            $.each(playerOnLeague, function(n, p) {
                playerFilter[p.playerID] = p.playerName;
            });
            
            ps.s1 = myEntryByContest[c]['slot1'];
            ps.s2 = myEntryByContest[c]['slot2'];
            ps.s3 = myEntryByContest[c]['slot3'];
            ps.s4 = myEntryByContest[c]['slot4'];
            ps.s5 = myEntryByContest[c]['slot5'];
            ps.s6 = myEntryByContest[c]['slot6'];
            ps.s7 = myEntryByContest[c]['slot7'];
            ps.s8 = myEntryByContest[c]['slot8'];
            
            $.each(ps, function(id, val) {
                playerData4up.push(val); 
            });

            observableView();
            entryAmount = myEntryByContest[c]['mySalaryTotal'];
            progressBar(entryAmount, $('.salarycap-gage'));

            /* reset entry view */
            $('.btn-slots').each(function() {
                $(this).prop('src','./assets/resource/btn_player_change.png');
            });
            $('#img-slot4').prop('src','./assets/resource/btn_player_change_02.png');
            $('#img-slot8').prop('src','./assets/resource/btn_player_change_02.png');

            $('#update-player-slot1').html(playerFilter[ps.s1]);

            $('#update-player-slot2').html(playerFilter[ps.s2]);
            $('#update-player-slot3').html(playerFilter[ps.s3]);
            $('#update-player-slot4').html(playerFilter[ps.s4]);
            $('#update-player-slot5').html(playerFilter[ps.s5]);
            $('#update-player-slot6').html(playerFilter[ps.s6]);
            $('#update-player-slot7').html(playerFilter[ps.s7]);
            $('#update-player-slot8').html(playerFilter[ps.s8]);
            $('#entryUpdate').removeClass('disabled');
            
            app.Playerz.presetPlayer4up(ps);
            
            app.mobileApp.hideLoading();
        }
                
        function allClear() {
            navigator.notification.confirm("엔트리 등록을 초기화 할까요?", function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    initEntryData();          
               }
            }, '알림', ['확인', '취소']);
            return false;
        }
        
        function allClearUpdate() {
            navigator.notification.confirm("엔트리 수정을 초기화 할까요?", function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    initUpdateData();          
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
        
        function updateEntry() {
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
            
            navigator.notification.confirm("현재 지정된 선수로 엔트리를 수정하시겠습니까?", function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    app.Playerz.setFinalUpdateEntry(contestNo,contestFee);    
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
        };
        
        var setPlayerEntry4up = function(e) {
            var data = e.button.data();
            console.log(data);
            
            var url = 'views/entryUpdatePlayerView.html?pos=' + data.rel + "&slot=" + data.slot;
            app.mobileApp.navigate(url,'slide');
        };
        
        var returnContestPlay = function() {
            console.log("return : " + currentContestType);
            if(currentContestType === "F") {
                //app.Contests.joinFeatured;
                app.mobileApp.navigate('views/playListView.html?bar=F', 'slide:right');
            } else if(currentContestType === "5") {
                //app.Contests.joinFF;
                app.mobileApp.navigate('views/playListView.html?bar=5', 'slide:right');
            } else {
                //app.Contests.joinGuarateed;
                app.mobileApp.navigate('views/playListView.html?bar=G', 'slide:right');
            }
        };
        
        return {
            init: init,
            setPbAmount: setPbAmount,
            setPlayerEntry: setPlayerEntry,
            setPlayerEntry4up: setPlayerEntry4up,
            initEntryData: initEntryData,
            initEntryDataUpdate:initEntryDataUpdate,
            allClear: allClear,
            allClearUpdate: allClearUpdate,
            regEntry: regEntry,
            updateEntry: updateEntry,
            returnContestPlay: returnContestPlay
        };
    }());

    return entryProcess;
}());