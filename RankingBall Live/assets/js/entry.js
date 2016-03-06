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
        
        var gageWidth = 0; // 샐러리캡 영역 너비
        
        /* 한-영 변환 */
        function langExchange() 
        {
            app.langExchange.exchangeLanguage(laf);    
        }
        
        /* 엔트리 초기화 */
        function init(e) {
            
            langExchange();
            console.log(JSON.stringify(myEntryByContest));
            
            gageWidth = $('.salarycap-gage').width();
            console.log(gageWidth);
            
            var param = e.view.params;
                        
            if(param.contest === "") {
                app.showAlert($.langScript[laf]['noti_027'],"Notice");
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
            
            prePlayerList();
        }
        
        function prePlayerList() {
            console.log("preset array");
            console.log(playerOnLeague);
            playerData['F'] = new Array();
            playerData['M'] = new Array();    
            playerData['D'] = new Array();
            playerData['G'] = new Array();
            
            for (var i=0 ; i < playerOnLeague.length ; i++) {
                if (parseInt(playerOnLeague[i]['posType']) === 1) {
                    playerData['F'].push(playerOnLeague[i]);
                } else if (parseInt(playerOnLeague[i]['posType']) === 2) {
                    playerData['M'].push(playerOnLeague[i]);
                } else if (parseInt(playerOnLeague[i]['posType']) === 4) {
                    playerData['D'].push(playerOnLeague[i]);
                } else if (parseInt(playerOnLeague[i]['posType']) === 8) {
                    playerData['G'].push(playerOnLeague[i]);
                } else {
                    console.log("Error: none position type"); 
                    console.log(playerOnLeague[i]);
                }
            }
        }
        
        function updateInit(e) {
 
            var param = e.view.params;
            console.log(param);
            contestNo = param.contest;
            if(!contestNo) {
                app.showAlert($.langScript[laf]['noti_029'],"Notice");
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if(param.mode === "ed") {
                //initEntryDataUpdate(contestNo);
            } else {
                app.showAlert($.langScript[laf]['noti_045'],"Notice");
            }            
            
            //progressBar(entryAmount, $('.salarycap-gage'));
        }
        
        /* 등록 화면 타이틀 변경 */
        function updateBar(e) {
            console.log("On Show :" + $.langTitle[laf][4]);
            e.view.options.title = $.langTitle[laf][4];
        }
        /* 수정 화면 타이틀 변경 */
        function updateBarEd(e) {
            e.view.options.title = $.langTitle[laf][13];
        }
        
        function updateGage(el) {
            observableView();
            console.log(entryAmount);
            progressBar(entryAmount, $('#' + el));
        }
        function updateGage2($element) {
            
            var salarycapWidth = $('#gae_salarycap_update_p').width();
            var progressBarWidth = 0;
            
            if(entryAmount >= max_salarycap_amount) {
                progressBarWidth = salarycapWidth;
            } else {
                var percent = entryAmount / max_salarycap_amount * 100;
                progressBarWidth = percent * salarycapWidth / 100;
            }
            
            $element.find('div').width(progressBarWidth);
            $element.find('p').html("$" + numberFormat(entryAmount) + "&nbsp; /&nbsp;$" +numberFormat(max_salarycap_amount));
        }
        
        function return2playList() {
            
        }
        
        /* 선수 리스트업 */
        function initEntryData() {
                        
            observableView();
            
            entryAmount = 0;
            progressBar(entryAmount, $('.salarycap-gage'));
            $('.salarycap-overflow').addClass('hide');
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
            
            entryAmount = 0;
            progressBar(entryAmount, $('.salarycap-gage'));
            $('.salarycap-overflow').addClass('hide');
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
            progressBar(entryAmount, $('#gae_salarycap_update'));
            //updateGage2($('#gae_salarycap_update_p'));

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
            navigator.notification.confirm($.langScript[laf]['noti_028'], function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    initEntryData();          
               }
            }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
            return false;
        }
        
        function allClearUpdate() {
            navigator.notification.confirm($.langScript[laf]['noti_030'], function (confirmed) {
               if (confirmed === true || confirmed === 1) {
                    initUpdateData();          
               }
            }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
            return false;
        }
        
        function cloeShopModal() {
            $("#moadl_shop").data("kendoMobileModalView").close();
        }
        
        /* 엔트리 등록하기 */        
        function regEntry() {
            
            if(entryStatus === false) {
                app.showError($.langScript[laf]['noti_035']);
                return false;
            }
            
            if(!contestNo) {
                app.showError($.langScript[laf]['noti_027']);
                return false;
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if(entryAmount >= max_salarycap_amount) {
                app.showAlert($.langScript[laf]['noti_018'], "Notice");
                return false;
            }
            
            if( parseInt(contestFee) > parseInt(uu_data.cash) ) {
                
                app.showAlert($.enScript.alert_caughtShort, "Notice");
                /*
                    navigator.notification.confirm("입장료가 부족해서 참가하실 수 없습니다.\n\n캐쉬를 구매하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                            app.Shop.init();
                            $("#moadl_shop").data("kendoMobileModalView").open();
                       } else {
                           closeModal();
                       }
                    }, '알림', ['충전하기', '취소']);
                */

            } else {
                
                
                
                navigator.notification.confirm($.langScript[laf]['noti_052'], function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                        app.Playerz.setFinalEntry(contestNo, contestFee);
                   }
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
                
                //bizJoinRuleCheck(contestNo, contestFee);

            }
            return false;
        }
        
        
        var bizJoinRuleCheck = function(contest, fee) {
            app.mobileApp.showLoading();
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + '}';
            var url = init_data.auth + "?callback=?";
            
            $.ajax({
                url: url,
                type: "GET",
                timeout: 1500,
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                data: {
                    "type": "apps",
                    "id": "memberProfileGetSimple",
                    "param":param
                },
               success: function(response) {
                   console.log(JSON.stringify(response));
                   if (response.code === 0) {
                       
                       var resp = response.data;
                       var purchaseAmount = parseInt(resp.accrdJoinD) + parseInt(fee);
                       if(parseInt(purchaseAmount) <= parseInt(resp.lmtJoinD)) {
                           
                            navigator.notification.confirm($.langScript[laf]['noti_052'], function (confirmed) {
                               if (confirmed === true || confirmed === 1) {
                                    app.Playerz.setFinalEntry(contest, fee);    
                               }
                            }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
                           
                       } else {
                           

                           var errorMessage = $.langScript[laf]['noti_042'] +
                               "\n" + $.langScript[laf]['noti_038'] + " : " + numberFormat(parseInt(resp.accrdJoinD)) + " cash" +
                               "\n" + $.langScript[laf]['noti_039'] + " : " + numberFormat(parseInt(resp.lmtJoinD) - parseInt(resp.accrdJoinD));
                           app.showAlert(errorMessage, "Notice", function() {
                               return false;
                           });
                       }
                       
                   } else {
                       app.showAlert($.langScript[laf]['noti_031'], 'Notice', function() { return false; });
                   }
                   app.mobileApp.hideLoading();
                },
                error: function(e) {
                    console.log(JSON.stringify(e));
                    app.mobileApp.hideLoading();
                }
            });  
        }
        
        
        function updateEntry() {
            if(entryStatus === false) {
                app.showError($.langScript[laf]['noti_035']);
                return false;
            }
            
            if(!contestNo) {
                app.showError($.langScript[laf]['noti_029']);
                return false;
                //app.mobileApp.navigate('views/entryPlayerzView.html');
            }
            
            if(entryAmount >= max_salarycap_amount) {
                app.showAlert($.langScript[laf]['noti_018'], "Notice");
                return false;
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
                app.showError($.langScript[laf]['noti_022']);
                return false;
            } else {
                navigator.notification.confirm($.langScript[laf]['noti_053'], function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                        app.Playerz.setFinalUpdateEntry(contestNo,entryNo);    
                   }
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
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
                //progressBarWidth = percent * gageWidth / 100;
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
        
        /* 엔트리 선수 리스트 보기 */
        var setPlayerEntry = function(e) {
            var data = e.button.data();
            app.mobileApp.showLoading();
            setTimeout(function() {
                //var url = 'views/entryPlayerzView.html?pos=' + data.rel + "&slot=" + data.slot;
                var url = 'views/entryzCVu.html?pos=' + data.rel + "&slot=" + data.slot;
                app.mobileApp.navigate(url,'slide');    
            }, 500);

        };
        
        var setPlayerEntry4up = function(e) {
            var data = e.button.data();

            app.mobileApp.showLoading();
            setTimeout(function() {
                var url = 'views/entryUpdatePlayerView.html?pos=' + data.rel + "&slot=" + data.slot + "&contest=" + contestNo;
                app.mobileApp.navigate(url,'slide');  
            }, 500);
            
        };
        
        var returnContestPlay = function() {
            
            if(entryMode === "ed") {
                
                app.mobileApp.navigate('views/playView.html?tab=m', 'slide:right');
                
                $("#po_entry_update").data("kendoMobileView").destroy();
                $("#po_entry_update").remove();
            } else {
                
                navigator.notification.confirm($.langScript[laf]['noti_007'], function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        app.mobileApp.navigate('views/playView.html', 'slide:right');
                        $("#po_entry_registration").data("kendoMobileView").destroy();
                        $("#po_entry_registration").remove();
                    }
                    
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
                
            }
        };
        
        return {
            init: init,
            updateBar: updateBar,
            updateBarEd: updateBarEd,
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
            cloeShopModal: cloeShopModal,
            updateGage: updateGage
        };
    }());

    return entryProcess;
}());