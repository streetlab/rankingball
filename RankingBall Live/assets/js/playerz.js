/**
 * Player Control view model
 */
var app = app || {};

app.Playerz = (function () {
    'use strict';

    var playerProcess = (function () {
        
        var playerSlot = {};
        var requestPosition = "";
        var requestSlot = "";
       
        var sort_order = "";
        var selectedPlayer = "";
        var researchPlayer = "";
        var entryData = [];       
        
        $(document).on('click','.vwPlayer', function() {
            playerInfo( $(this) );
        });
        
        $(document).on('click','.addPlayer', function() {
            var player = parseInt($(this).attr('data-rel'));
            var salary = parseInt($(this).attr('data-salary'));
            addPlayer(player, salary); 
            
        });
        
        $(document).on('click','.removePlayer', function() {
            var player = parseInt($(this).attr('data-rel'));
            var salary = parseInt($(this).attr('data-salary'));
            removePlayer(player, salary); 
            
        });
        
        function init(e) {
            var param = e.view.params;
            requestPosition = param.pos;
            requestSlot = param.slot;
            
            sort_order = 1;
            
            entryData = [];
            progressBar(entryAmount, $('.salarycap-gage'));
            
            observableView();
            if(requestPosition) playerList(requestPosition);
        }

        function vwParam(e) {
            var param = e.view.params;
            requestSlot = param.slot;
            
            if(requestPosition !== param.pos) {
                requestPosition = param.pos;
                playerList(requestPosition);
            }
            
            console.log(playerSlot);
            console.log(entryData);
        }

        function clearVariables() {
            
            observableView();
            
            playerSlot = {};
            requestPosition = "";
            requestSlot = "";

            sort_order = "";
            selectedPlayer = "";
            researchPlayer = "";
            entryData = [];
        }
        
        function progressBar(amount, $element) {
            var percent = amount / max_salarycap_amount * 100;
            var progressBarWidth = percent * $element.width() / 100;
            $element.find('div').animate({ width: progressBarWidth }, 500);
            $element.find('p').html("$" + numberFormat(amount) + "&nbsp; /&nbsp;$" +numberFormat(max_salarycap_amount));
        }
         
        function playerInfo(e) {
            var rel = parseInt(e.attr('data-rel'));
            
            if(rel) {
                var vwURL = 'views/entryPlayerDataView.html?player=' + rel;
                app.mobileApp.navigate(vwURL); 
            } else {
                app.showError("잘못된 선수 정보요청입니다.");
            }
        }
        
        function detailView(e) {
            var param = e.view.params;
            selectedPlayer = param.player;
            $.each(playerData, function(i, v) {
                if (parseInt(v.playerID) === parseInt(selectedPlayer)) {
                    $('#player-info-number').html(v.posCode + " " + v.number);
                    $('#player-info-name').html(v.playerName);
                    $('#player-info-team').html(v.teamName);
                    $('#player-info-point').html("$" + v.salary + " " + "<span></span>");
                    $('.player-info').css('background-image','url(/assets/resource/jersey/' + uniform(v.team) + ')');
                    return;
                }
            });
        }
        
        var playerList = function(p) {
    
            var salaryLimit = max_salarycap_amount - entryAmount;            
            var requestPostion = (p) ? p : 1;
            
            if(init_data.auth === undefined) {
                app.showError("잘못된 요청입니다.");
                app.mobileApp.navigate('#landing');
            }
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","position":' + requestPostion + ',"organ":1}';
            var url = init_data.auth + "?callback=?";
            
            $('#players_list').empty();
            
            app.mobileApp.showLoading();
            
            var pl = new kendo.data.DataSource({
               transport: {
                   read: function(options) {
                        $.ajax({
                            url: url,
                            dataType: "jsonp",
                            jsonpCallback: "jsonCallback",
                            data: {
                                "type": "apps",
                                "id": "contestGetEntry",
                                "param":param
                            },
                            success: function(response) {
                                if (response.code === 0) {
                                                                                    
                                    playerData = [];
                                    
                                    console.log(response.data);
                                    
                                    $.each(response.data, function (i, p) {
                                        playerData.push({
                                            teamName: p.teamName,
                                            position: p.position,
                                            playerID: p.playerID,
                                            playerName: p.playerName,
                                            posDesc: p.posDesc,
                                            number: p.number,
                                            posId: p.posId,
                                            team: p.team,
                                            salary: p.salary,
                                            posCode: p.posCode,
                                            posType: p.posType
                                        });
                                    }); 
                                    
                                    playerData = playerData.sort(function(a, b) {
                                        //return a.playerID - b.playerID;
                                        if (sort_order) return (a.playerID - b.playerID);
                                        else return (b.playerID - a.playerID);
                                    });
                                    
                                    console.log(playerData);
                                    
                                    for(var i=0;i<playerData.length;i++) {
                                        
                                        var entryStatus = "";
                                        var entryImg = "btn_plus_02.png";
                                        var salaryColor = "";
                                        var controlClass = "addPlayer";
                                        
                                        if( entryData.indexOf(playerData[i].playerID) > -1 ) {
                                            entryStatus = "on";
                                            entryImg = "btn_minus_02.png";
                                            controlClass = "removePlayer";
                                        } else {
                                            salaryColor = (salaryLimit < playerData[i].salary) ? 'warning' : '';
                                        }
                                                                                
                                        var resp = '<li class="clearfix players"><div class="listitem_position">' + playerPosition(playerData[i].posType) + '</div>' +
                                            '<div class="listitem_name"><a data-role="button" data-rel="' + playerData[i].playerID + '" class="vwPlayer">' + playerData[i].playerName + '</a></div>' +
                                            '<div class="listitem_fppg">0</div><div class="listitem_salary ' + salaryColor + '">$' + numberFormat(playerData[i].salary) + '</div>' +
                                            '<div class="listitem_btns"><a data-role="button" data-salary="' + playerData[i].salary + '" data-rel="' + playerData[i].playerID + '" data-status="' + entryStatus + '" class="' + controlClass + '"><img id="entry-' + playerData[i].playerID + '" src="/assets/resource/' + entryImg + '"></a></div></li>';
                                        
                                        $('#players_list').append( resp );
                                    }
                                    
                                } else {
                                    console.log("error");
                                }
                            },
                            complete: function() {
                                app.mobileApp.hideLoading();
                            },
                            error: function(e) {
                                console.log(e);
                                app.showError("잘못된 요청입니다.");
                                app.mobileApp.navigate('#landing');
                            }
                        });  
                   }
               } 
            });
            
            pl.fetch();
                        
        }

        var playerPosition = function(pos) {
            switch(pos) {
                case 1:
                    return "F";
                    break;
                case 2:
                    return "M";
                    break;
                case 4:
                    return "D";
                    break;
                case 8:
                    return "G";
                    break;
                default:
                    return "";
            }
        } 
        
        var searchPlayerData = function(player, val) {
            $.each(playerData, function(i, v) {
                if (parseInt(v.playerID) === parseInt(player)) {
                    return v;
                }
            });
            
            return false;
        }
        
        var addPlayer = function(player, salary) {
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === player) {
                    console.log(playerSlot[requestSlot]);
                    app.showError("해당 슬롯에 이미 선수가 등록되어있습니다.\n\n먼저 등록된 선수를 등록취소하세요.");
                    return false;
                }
            }
            
            var tempAmount = entryAmount + salary;
       
            if(tempAmount > max_salarycap_amount) {
                app.showError("샐러리캡 한도를 벗어났습니다.");
            } else {
                playerSlot[requestSlot] = player;
                entryData.push(player);
                entryAmount += salary;
                
                $('#entry-' + player).prop('src','/assets/resource/btn_minus_02.png');
                $('#entry-' + player).parent('a')
                    .attr('data-status','on')
                    .removeClass('addPlayer')
                    .addClass('removePlayer');
                
                if(requestSlot === "slot4" || requestSlot === "slot8") {
                    $('#img-' + requestSlot).prop('src','/assets/resource/btn_player_change_02.png');
                } else {
                    $('#img-' + requestSlot).prop('src','/assets/resource/btn_player_change.png');
                }
                
                
                researchPlayer = playerData.filter(function ( obj ) {
                    return parseInt(obj.playerID) === parseInt(player);
                })[0];

                $('#player-' + requestSlot).html(researchPlayer.playerName);
                
                progressBar(entryAmount, $('.salarycap-gage'));
                
                checkSlot();
                app.mobileApp.navigate('#po_entry_registration','slide:right');
            }
        }
        
        var removePlayer = function(player, salary) {
            
            var tempAmount = entryAmount - salary;
     
            if(tempAmount < 0) {
                app.showError("샐러리캡 설정 범위가 잘못 되었습니다.");
            } else {
                                
                if( playerSlot[requestSlot] === "" || playerSlot[requestSlot] !== player) {
                    app.showError("엔트리 등록된 선수가 잘못 저장 되었습니다.\n\n동일한 포지션일 경우 선수를 확인해주세요.");
                } else {
                        
                    navigator.notification.confirm("선택한 엔트리 등록 선수를 취소할까요?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                          
                            playerSlot[requestSlot] = "";

                            var arr_index = entryData.indexOf(player);
                            if( arr_index >= 0 ) {
                               entryData.splice(arr_index, 1);
                            }

                            $('#entry-' + player).prop('src','/assets/resource/btn_plus_02.png');
                            $('#entry-' + player).parent('a')
                                .attr('data-status','')
                                .removeClass('removePlayer')
                                .addClass('addPlayer');

                            if(requestSlot === "slot4" || requestSlot === "slot8") {
                                $('#img-' + requestSlot).prop('src','/assets/resource/btn_player_plus_02.png');
                            } else {
                                $('#img-' + requestSlot).prop('src','/assets/resource/btn_player_plus.png');
                            }

                            $('#player-' + requestSlot).html(slotLabel(requestSlot));
                            
                            entryAmount -= salary;
                            progressBar(entryAmount, $('.salarycap-gage'));
                            checkSlot();
                            app.mobileApp.navigate('#po_entry_registration','slide:right');
                           
                       }
                    }, '알림', ['취소하기', '유지하기']);
                    return false;
                    
                }
            }
        }

        var slotLabel = function(slot){
            var returnLabe = "";
            switch(slot) {
                case "slot1":
                case "slot2":
                    returnLabe = "F";
                    break;
                case "slot3":
                case "slot5":
                    returnLabe = "M";
                    break;
                case "slot4":
                    returnLabe = "FLEX";
                    break;
                case "slot6":
                case "slot7":
                    returnLabe = "D";
                    break;
                case "slot8":
                    returnLabe = "GK";
                    break;
            }
            
            return returnLabe;
        };
        
        var addPlayerStatic = function() {
            $.each(playerData, function(i, v) {
                if (parseInt(v.playerID) === parseInt(selectedPlayer)) {
                    addPlayer(selectedPlayer,v.salary);
                    return;
                }
            });
        }
        
        var checkSlot = function() {
                      
            var key, count = 0;
            for(key in playerSlot) {
                if(playerSlot.hasOwnProperty(key)) {
                    if(playerSlot[key] !== "" || playerSlot[key] !== 0) {
                        count++;
                    }
                }
            }
                        
            if(count === 8) {
                $('a#entryRegBtn').removeClass('disabled');
                entryStatus = true;
            } else {
                $('a#entryRegBtn').addClass('disabled');
                entryStatus = false;
            }
        }
                
        var setFinalEntry = function(contest,fee) {

            if(contest === "") {
                console.log("no contst");
                return false;
            }
            
            var param = '{"osType":' + init_apps.osType + 
                ',"version":"' + init_apps.version + 
                '","memSeq":' + uu_data.memSeq + 
                ',"contestSeq":' + contest + 
                ',"slot1":' + playerSlot.slot1 + 
                ',"slot2":' + playerSlot.slot2 + 
                ',"slot3":' + playerSlot.slot3 + 
                ',"slot4":' + playerSlot.slot4 + 
                ',"slot5":' + playerSlot.slot5 + 
                ',"slot6":' + playerSlot.slot6 + 
                ',"slot7":' + playerSlot.slot7 + 
                ',"slot8":' + playerSlot.slot8 + 
                '}';
            
            var url = init_data.auth + "?callback=?";
            app.mobileApp.showLoading();
            
            $.ajax({
                url: url,
                type: "GET",
                async: false,
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                data: {
                    "type": "apps",
                    "id": "contestRegistEntry",
                    "param":param
                },
               success: function(response) {
                   
                    console.log(response);

                    if (response.code === 0) {
                        alert("엔트리가 등록되었습니다.");
                        uu_data.cash -= fee;
                        entryAmount = 0;
                        app.ObjControl.launchPlay();
                    } else {
                        app.showError(response.message);
                    }
               },
               complete: function() {
                   navigator.splashscreen.hide();
               },
               error: function(e) {
                   console.log(e);
               }
           });  
           
            return returnValue;
        };

        var uniform = function(js) {
            switch(js) {
                case 9825: 
                    return 'jersey_arsenal_fc.png';
                    break;
                case 10252:
                    return 'jersey_astonvilla_fc.png';
                    break;
                case 8455: 
                    return 'jersey_chelsea_fc.png';
                    break;
                case 9826: 
                    return 'jersey_crystal_pallace_fc.png';
                    break;
                case 8668: 
                    return 'jersey_everton_fc.png';
                    break;
                case 8197: 
                    return 'jersey_lelcester_city.png';
                    break;
                case 8650: 
                    return 'jersey_liverpool.png';
                    break;
                case 8456:
                    return 'jersey_manchester_city.png';
                    break;
                case 10260: 
                    return 'jersey_manchester_united.png';
                    break;
                case 10261:
                    return 'jersey_newcastle_united.png';
                    break;
                case 8466: 
                    return 'jersey_southampton.png';
                    break;
                case 10194:
                    return 'jersey_stoke_city.png';
                    break;
                case 8472: 
                    return 'jersey_sunderland_a.png';
                    break;
                case 10003:
                    return 'jersey_swansea_city.png';
                    break;
                case 8586: 
                    return 'jersey_tottenham_hotspur.png';
                    break;
                case 8659: 
                    return 'jersey_west_brom.png';
                    break;
                case 8654:
                    return 'jersey_west_ham.png';
                    break;
                default:
                    return 'jersey_queens_park_rangers';
            }
            
            // jersey_burnley_fc, jersey_hull_a_fc, jersey_queens_park_rangers
        }
        
        var record = function() {
            app.showAlert("안내","서버스 준비중입니다.");
        }
        
        var news = function() {
            app.showAlert("안내","서버스 준비중입니다.");    
        }
        
        return {
            init: init,
            playerInfo: playerInfo,
            playerList: playerList,
            detailView: detailView,
            clearVariables: clearVariables,
            addPlayerStatic: addPlayerStatic,
            vwParam: vwParam,
            record: record,
            news: news,
            setFinalEntry: setFinalEntry
        };
    }());

    return playerProcess;
}());