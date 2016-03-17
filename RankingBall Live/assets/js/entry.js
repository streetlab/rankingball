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
        function init(e) 
        {
            
            var param = e.view.params;
            
            langExchange();
            gageWidth = $('.salarycap-gage').width();
            
            var ratio = 1.15556;
            var h = $(window).height();
            var bh = h - 133.594;
            $('.entry_outline').css({'height': bh + 'px'});
            
            var eh = bh - 55;
            $('.entry-box-all').css({'height': eh + 'px'});
            
            var ph = ( eh / 4 ) * 0.85;
            $('.player_box').css({'height': ph + 'px'});
            
            
                        
            if(param.contest === "") {
                app.showAlert($.langScript[laf]['noti_027'],"Notice");
                return false;
            }

            contestNo = param.contest;
            contestFee = param.fee;
            entryMode = param.mode;
            
            if(entryMode === "ed") {
                console.log("mode : edit " + entryMode);
                //initEntryDataUpdate(contestNo);
            } else {
                console.log("mode : reg " + entryMode);
                initEntryData();
            }
            
            //prePlayerList();
        }
        
        function onShowUp(e)
        {
            var param = e.view.params;
            console.log(param);
            
            contestNo = param.contest;
            contestFee = param.fee;
            entryMode = param.mode;
            
            if(editMatch === 0) {
                console.log("mode : edit " + entryMode);
                initEntryDataUpdate(contestNo);
                editMatch = contestNo;
            }
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
            $('.slot_btn').removeClass('player_change').addClass('player_plus');
            $('.slot_pn_f').html('FW');
            $('.slot_pn_m').html('MF');
            $('.slot_pn_d').html('DF');
            $('.slot_pn_g').html('GK');
            
            $('#player-slot4').html("FLEX");
            
            $('.slot_ps').html('$0');
            
            $('#entryRegBtn')
                .attr('data-rel','disabled')
                .addClass('disabled')
            /* reset player view */
            $.each(playerOnLeague, function(i, v) {
                v.playerSelected = 1;
            });
            app.Playerz.clearVariables();
            
        }
        
        function initUpdateData() {

            observableView();
            
            entryAmount = 0;
            progressBar(entryAmount, $('.salarycap-gage'));
            $('.salarycap-overflow').addClass('hide');
            /* reset entry view */
            $('.ed_slot_btn').removeClass('player_change').addClass('player_plus');
            $('.ed_slot_pn_f').html('FW');
            $('.ed_slot_pn_m').html('MF');
            $('.ed_slot_pn_d').html('DF');
            $('.ed_slot_pn_g').html('GK');
            
            $('#update-player-slot4').html("FLEX");
            
            $('.ed_slot_ps').html('$0');
        
            $('#entryRegBtn')
                .attr('data-rel','disabled')
                .addClass('disabled')
            /* reset player view */
            //app.Playerz.playerSlot = "";
            playerSlot = {};
            $.each(playerOnLeague, function(i, v) {
                v.playerSelected = 1;
            });
            app.Playerz.clearVariables();
        }

        /* 엔트리 수정 */
        function initEntryDataUpdate(c) {

            entryStatus = true;
            contestNo = c;
            
            app.mobileApp.showLoading();
            
            ps.slot1 = parseInt(myEntryByContest[c]['slot1']);
            ps.slot2 = parseInt(myEntryByContest[c]['slot2']);
            ps.slot3 = parseInt(myEntryByContest[c]['slot3']);
            ps.slot4 = parseInt(myEntryByContest[c]['slot4']);
            ps.slot5 = parseInt(myEntryByContest[c]['slot5']);
            ps.slot6 = parseInt(myEntryByContest[c]['slot6']);
            ps.slot7 = parseInt(myEntryByContest[c]['slot7']);
            ps.slot8 = parseInt(myEntryByContest[c]['slot8']);
            
            entryNo = myEntryByContest[c]['entrySeq'];
            
            //playerOnLeague['playerSelected'] = 1;
            
            $.each(playerOnLeague, function(i, v) {
                $.each(ps, function(n, p) {
                    if (parseInt(v.playerID) === parseInt(p)) {
                        playerOnLeague[i].playerSelected = 2;
                        playerFilterSalary[p] = v.salary;
                        $('#update-player-' + n ).html(v.playerName);
                        $('#update-player-salary-' + n ).html('$' + numberFormat(v.salary));
                        return;
                    }
                });
            });
            
            observableView();
            entryAmount = myEntryByContest[c]['mySalaryTotal'];
            console.log("init : " + entryAmount);
            
        
            $('#gae_salarycap_update_p').find('div').removeClass('salary_over');
            $('#gae_salarycap_update').find('div').removeClass('salary_over');
            $('.salarycap-update-overflow').addClass('hide');
            
            progressBar(entryAmount, $('#gae_salarycap_update'));
    
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
            
            if(entryAmount > max_salarycap_amount) {
                app.showAlert($.langScript[laf]['noti_018'], "Notice");
                return false;
            }
            
            if( parseInt(contestFee) > parseInt(uu_data.cash) ) {
                console.log(contestFee + " : " + uu_data.cash);
                app.showAlert("You don't have enough game cash to enter.", "Notice");
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
            
            if(entryAmount > max_salarycap_amount) {
                app.showAlert($.langScript[laf]['noti_018'], "Notice");
                return false;
            }
            
            //var chkPlayerSlot = app.Playerz.playerSlot;

            console.log(playerSlot);
            
            var key, count = 0;
            for(key in playerSlot) {
                if(playerSlot.hasOwnProperty(key)) {
                    if(playerSlot[key] !== "" || playerSlot[key] !== 0) {
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

            
            //console.log($element);
            //console.log( $element.width() + " : " + progressBarWidth + " : " + percent );
            
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
                console.log("New Entry");
                //var url = 'views/entryPlayerzView.html?pos=' + data.rel + "&slot=" + data.slot;
                var url = 'views/entryzCVu.html?pos=' + data.rel + "&slot=" + data.slot;
                app.mobileApp.navigate(url,'slide');    
            }, 500);

        };
        /* 엔트리 선수 리스트 보기 - 수정 시 */
        var setPlayerEntry4up = function(e) {
            var data = e.button.data();

            app.mobileApp.showLoading();
            setTimeout(function() {
                console.log("Update Entry");
                var url = 'views/entryzUVu.html?pos=' + data.rel + "&slot=" + data.slot + "&contest=" + contestNo;
                app.mobileApp.navigate(url,'slide');  
            }, 500);
            
        };
        
        var returnContestPlay = function(e) {
            var data = e.button.data();
            console.log("return : " + data.rel);
            if(data.rel === "live") {
                
                
                
                //$("#po_entry_update").data("kendoMobileView").destroy();
                //$("#main").empty();
                kendo.unbind($("#po_entry_update"));
                //kendo.unbind($("#po_entry_registration"));
                initUpdateData();
                editMatch = 0;
                app.mobileApp.navigate('views/playView.html?tab=m', 'slide:right');
            } else {
                
                navigator.notification.confirm($.langScript[laf]['noti_007'], function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        initEntryData(); 
                        app.mobileApp.navigate('views/playView.html?tab=dfs', 'slide:right');
                        //$("#po_entry_registration").data("kendoMobileView").destroy();
                        //$('#po_entry_players').data("kendoMobileView").destroy();
                        //$("#po_entry_registration").remove();
                        //$("#po_entry_players").remove();
                        //kendo.unbind($("#po_entry_update"));
                        kendo.unbind($("#po_entry_registration"));
                    }
                    
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
                
            }
        };
        
        return {
            init: init,
            onShowUp: onShowUp,
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