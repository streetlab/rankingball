/**
 * Entry Control view model
 */
var app = app || {};

app.Entry = (function () {
    'use strict';

    var entryProcess = (function () {
        
        //var entryProcess = "nowon";
        
        var entryMode = "";
        var contestNo = "";
        var entryNo = "";
        var contestFee = 0;
        var pb;
        
        var ps = {};
        var playerFilter = [];
        var playerFilterSalary = [];
                
        function init(e) {
            
            console.log(JSON.stringify(myEntryByContest));
            
            var param = e.view.params;
                        
            if(param.contest === "") {
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                return false;
            }

            contestNo = param.contest;
            contestFee = param.fee;
            entryMode = param.mode;
          
            if(entryMode === "ed") {
                initEntryDataUpdate(contestNo);
            } else {
                initEntryData();
            }
            //initEntryData();
            //updateBar();
        }
        
        function updateInit(e) {
 
            var param = e.view.params;
            console.log(param);
            contestNo = param.contest;
            if(!contestNo) {
                app.showError("엔트리 수정을 위한 경기 정보를 확인할 수 없습니다.");
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if(param.mode === "ed") {
                //initEntryDataUpdate(contestNo);
            } else {
                app.showError("잘못된 요청입니다.");
            }            
            
            //progressBar(entryAmount, $('.salarycap-gage'));
        }
        
        function updateBar() {
            observableView();
            progressBar(entryAmount, $('.salarycap-gage'));
        }
        
        function return2playList() {
            
        }
        
        function initEntryData() {
                        
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
/*
            observableView();
            entryAmount = myEntryByContest[contestNo]['mySalaryTotal'];
            progressBar(entryAmount, $('.salarycap-gage'));
            
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
            
            app.Playerz.clearVariables2Update();
*/
            observableView();
            
            entryAmount = 0;
            progressBar(entryAmount, $('.salarycap-gage'));
            
            /* reset entry view */
            $('.btn-slots').each(function() {
                $(this).prop('src','./assets/resource/btn_player_plus.png');
            });
            $('#update-img-slot4').prop('src','./assets/resource/btn_player_plus_02.png');
            $('#update-img-slot8').prop('src','./assets/resource/btn_player_plus_02.png');
            
            $(".update-player-slots-f").each(function() {
                $(this).html("F");
            });
            $('.update-player-slots-m').each(function() {
                $(this).html("M");
            });
            $('.update-player-slots-d').each(function() {
                $(this).html("D");
            });
            
            $('#update-player-slot4').html("FLEX");
            $('#update-player-slot8').html("GK");
        
            $('#entryRegBtn')
                .attr('data-rel','disabled')
                .addClass('disabled')
            /* reset player view */
            app.Playerz.playerSlot = "";
            app.Playerz.clearVariables();
        }
        
        function initEntryDataUpdate(c) {
            //console.log(c);
            //if(!c) return false;
            
            entryStatus = true;
            contestNo = c;
            
            app.mobileApp.showLoading();
            
            ps.s1 = myEntryByContest[c]['slot1'];
            ps.s2 = myEntryByContest[c]['slot2'];
            ps.s3 = myEntryByContest[c]['slot3'];
            ps.s4 = myEntryByContest[c]['slot4'];
            ps.s5 = myEntryByContest[c]['slot5'];
            ps.s6 = myEntryByContest[c]['slot6'];
            ps.s7 = myEntryByContest[c]['slot7'];
            ps.s8 = myEntryByContest[c]['slot8'];
            
            entryNo = myEntryByContest[c]['entrySeq'];
            
            $.each(playerOnLeague, function(n, p) {
                playerFilter[p.playerID] = p.playerName;
                playerFilterSalary[p.playerID] = p.salary;
            });
            
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
        
        function cloeShopModal() {
            $("#moadl_shop").data("kendoMobileModalView").close();
        }
        
        function regEntry() {
            
            if(entryStatus === false) {
                app.showError("엔트리에 등록되는 선수들을 확인해주세요.");
                return false;
            }
            
            if(!contestNo) {
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                return false;
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if( parseInt(contestFee) > parseInt(uu_data.cash) ) {
                    navigator.notification.confirm("입장료가 부족해서 참가하실 수 없습니다.\n\n캐쉬를 구매하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                            app.Shop.init();
                            $("#moadl_shop").data("kendoMobileModalView").open();
                       } else {
                           closeModal();
                       }
                    }, '알림', ['충전하기', '취소']);

            } else {
            
                navigator.notification.confirm("현재 지정된 선수로 엔트리를 등록하시겠습니까?", function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                        app.Playerz.setFinalEntry(contestNo,contestFee);    
                   }
                }, '알림', ['확인', '취소']);
            }
            return false;
        }
        
        function updateEntry() {
            if(entryStatus === false) {
                app.showError("엔트리에 등록되는 선수들을 확인해주세요.");
                return false;
            }
            
            if(!contestNo) {
                app.showError("엔트리 등록을 위한 경기 정보를 확인할 수 없습니다.");
                return false;
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            var chkPlayerSlot = app.Playerz.playerSlot;

            var key, count = 0;
            for(key in chkPlayerSlot) {
                if(chkPlayerSlot.hasOwnProperty(key)) {
                    if(chkPlayerSlot[key] !== "" || chkPlayerSlot[key] !== 0) {
                        count++;
                    }
                }
            }
                        
            if(count !== 8) {
                app.showError("선수 엔트리 등록 상태를 확인해주세요.");
                return false;
            } else {
                navigator.notification.confirm("현재 지정된 선수로 엔트리를 수정하시겠습니까?", function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                        app.Playerz.setFinalUpdateEntry(contestNo,entryNo);    
                   }
                }, '알림', ['확인', '취소']);
            }
            
        }
        
        function progressBar(amount, $element) {
           console.log("Entry set salary cap with " + amount);
            var percent = 0;
            var progressBarWidth = 0;
            
            if(amount >= max_salarycap_amount) {
                progressBarWidth = $element.width();
            } else {
                percent = amount / max_salarycap_amount * 100;
                progressBarWidth = percent * $element.width() / 100;
            }

            
            console.log($element);
            console.log( $element.width() + " : " + progressBarWidth + " : " + percent );
            
            $element.find('div').animate({ width: progressBarWidth }, 500);
            $element.find('p').html("$" + numberFormat(amount) + "&nbsp; /&nbsp;$" +numberFormat(max_salarycap_amount));
        }
        
        var setPbAmount = function(e) {
            pb.value( e );
        };
        
        var setPlayerEntry = function(e) {
            var data = e.button.data();
            app.mobileApp.showLoading();
            setTimeout(function() {
                var url = 'views/entryPlayerzView.html?pos=' + data.rel + "&slot=" + data.slot;
                app.mobileApp.navigate(url,'slide');    
            }, 500);

        };
        
        var setPlayerEntry4up = function(e) {
            var data = e.button.data();

            app.mobileApp.showLoading();
            setTimeout(function() {
                var url = 'views/entryUpdatePlayerView.html?pos=' + data.rel + "&slot=" + data.slot;
                app.mobileApp.navigate(url,'slide');  
            }, 500);
            
        };
        
        var returnContestPlay = function() {
            
            if(entryMode === "ed") {
                
                app.mobileApp.navigate('views/playView.html?tab=m', 'slide:right');
                
                $("#po_entry_update").data("kendoMobileView").destroy();
                $("#po_entry_update").remove();
            } else {
                
                navigator.notification.confirm("경기 참여를 취소하시겠습니까?", function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        app.mobileApp.navigate('views/playView.html', 'slide:right');
                        $("#po_entry_registration").data("kendoMobileView").destroy();
                        $("#po_entry_registration").remove();
                    }
                    
                }, '알림', ['확인', '취소']);
                
            }
        };
        
        return {
            init: init,
            updateBar: updateBar,
            setPbAmount: setPbAmount,
            setPlayerEntry: setPlayerEntry,
            setPlayerEntry4up: setPlayerEntry4up,
            initEntryData: initEntryData,
            initEntryDataUpdate:initEntryDataUpdate,
            allClear: allClear,
            allClearUpdate: allClearUpdate,
            regEntry: regEntry,
            updateEntry: updateEntry,
            returnContestPlay: returnContestPlay,
            playerFilterSalary: playerFilterSalary,
            cloeShopModal: cloeShopModal
        };
    }());

    return entryProcess;
}());