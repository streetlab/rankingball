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
        var globalPosition = "";
       
        var sort_field = "";
        var sort_order = "";
        var selectedPlayer = "";
        var researchPlayer = "";
        var entryData = [];
        
        var paging = 0;
        
        $(document).on('click','.vwPlayer', function() {
            playerInfo( $(this) );
        });
        
        $(document).on('click','.vwPlayer4up', function() {
            playerInfo4Up( $(this) );
        });
        $(document).on('click','.addPlayer4up', function() {
            var player = parseInt($(this).attr('data-rel'));
            var salary = parseInt($(this).attr('data-salary'));
            addPlayer4Up(player, salary); 
            
        });
        
        $(document).on('click','.removePlayer4up', function() {
            var player = parseInt($(this).attr('data-rel'));
            var salary = parseInt($(this).attr('data-salary'));
            removePlayer4Up(player, salary); 
            
        });
        
        function init() {
            
            sort_order = 1;
            salaryLimit = 0;
            entryData = [];
            
            progressBar(entryAmount, $('.salarycap-gage'));
        }

        function vwParam(e) {
                        
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = param.pos;
            
            console.log(requestPosition + " : " + requestSlot);
                        
            observableView();
            progressBar(entryAmount, $('.salarycap-gage'));
            
            app.mobileApp.showLoading();
            console.log(playerSlot);
            console.log(entryData);
            
            commonInit(requestPosition);
        }
        
        function commonInit(pos) {
            
            var preset = prePlayerList();
            
            if(preset) {
                if(pos) playerList(pos);
            } else {
                console.log("");
            }
        }
        
        function clearVariables() {
            
            observableView();
            playerSlot = "";
            playerSlot = {};
            requestPosition = "";
            requestSlot = "";

            sort_order = "";
            selectedPlayer = "";
            researchPlayer = "";
            entryData = [];
        }

        function clearVariables2Update() {
            
            observableView();
            
            requestPosition = "";
            requestSlot = "";

            sort_order = "";
            selectedPlayer = "";
            researchPlayer = "";
        }
        
        function progressBar(amount, $element) {
            var percent = amount / max_salarycap_amount * 100;
            var elementWidth = $('#checkElementWidth').offsetParent().width();
            var progressBarWidth = percent * elementWidth / 100;
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
        
        function playerInfo4Up(e) {
            var rel = parseInt(e.attr('data-rel'));
            
            if(rel) {
                var vwURL = 'views/entryUpdatePlayerDataView.html?player=' + rel;
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
                    $('.player-info').css('background-image','url(./assets/resource/jersey/' + uniform(v.team) + ')');
                    return;
                }
            });
        }
        
        function vwParam4update(e) {
            var param = e.view.params;
            requestSlot = param.slot;
            console.log(requestSlot);
            if(requestPosition !== param.pos) {
                requestPosition = param.pos;
                console.log(requestPosition);
                playerList4up(requestPosition);
            }
            
            console.log(playerSlot);
            console.log(entryData);
        }
        
        function playerListSort(e) {
             app.mobileApp.showLoading();
            
            var data = e.button.data();
            var orderType = parseInt(data.val);
            var orderIco;
                        
            $('.sortClass2').removeClass('sort-l');
            $('#popover-play-vw span').removeClass( function(index, css) {
                return (css.match(/(^|\s)ic-\S+/g) || []).join(' ');
            }).addClass('ic-triangle-n');

            $('#sort-player-ico').removeClass( function(index, css) {
                return (css.match(/(^|\s)ic-\S+/g) || []).join(' ');
            });            
            
            if(data.order === "desc") {
                orderIco = "ic-triangle-n-on";
                data.order = "asc";
            } else {
                orderIco = "ic-triangle-s-on";
                data.order = "desc";
            }
            
            sort_order = data.order;
            console.log(data);
            switch(orderType) {
                case 1:
                    $('#sort-player-label').html("포지션");
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelPosition').addClass('sort-l');
                    $('#orderByPosition').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label').html("네임");
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelPlayer').addClass('sort-l');                  
                    $('#orderByPlayer').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "playerName";
                    break;
                case 3:
                    $('#sort-player-label').html("FPPG");
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelFPPG').addClass('sort-l');  
                    $('#orderByFPPG').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "fppg";
                    break;
                case 4:
                    $('#sort-player-label').html("샐러리");
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelSalary').addClass('sort-l');
                    $('#orderBySalary').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "salary";
                    break;
            }
            
            playerList(requestPosition);
        }
        
        var playerList4up = function() {
        
            var salaryLimit = max_salarycap_amount - entryAmount;         

            if(init_data.auth === undefined) {
                app.showError("잘못된 요청입니다.");
                app.mobileApp.navigate('#landing');
            }
           
            app.mobileApp.showLoading();
           
            $('#players_list4update').empty();           

            playerListData = [];
            
            console.log("pos : " + requestPosition);
            if(parseInt(requestPosition) === 15) {
                playerListData = playerOnLeague.sort(function(a, b) {
                    if (sort_order) return (a.salary - b.salary);
                    else return (b.salary - a.salary);
                });
            } else {
                $.each(playerOnLeague, function(i, v) {
                    if(parseInt(v.posType) === parseInt(requestPosition)) {
                        playerListData.push(v);
                    }
                });
            }
           
            var tmpAmount = 0;
    
           console.log(JSON.stringify(playerListData));
           
            for(var i=0;i<playerListData.length;i++) {

                var entryStatus = "";
                var entryImg = "btn_plus_02.png";
                var salaryColor = "";
                var controlClass = "addPlayer4up";
                
                console.log("id : " + playerListData[i].playerID);
                
                if( entryData.indexOf(playerListData[i].playerID) > -1 ) {
                    //entryStatus = "on";
                    //entryImg = "btn_minus_02.png";
                    //controlClass = "removePlayer4up";
                    tmpAmount += playerListData[i].salary;
                } else {
                    salaryColor = (salaryLimit < playerListData[i].salary) ? 'warning' : '';
                }
                
                
                
                var resp = '<li class="clearfix players"><div class="listitem_position">' + playerPosition(playerListData[i].posType) + '</div>' +
                    '<div class="listitem_name"><a data-role="button" data-rel="' + playerListData[i].playerID + '" class="vwPlayer4up">' + playerListData[i].playerName + '<br><span>' + playerListData[i].teamName + '</span></a></div>' +
                    '<div class="listitem_fppg">' + playerListData[i].fppg + '</div><div class="listitem_salary ' + salaryColor + '">$' + numberFormat(playerListData[i].salary) + '</div>' +
                    '<div class="listitem_btns"><a data-role="button" data-salary="' + playerListData[i].salary + '" data-rel="' + playerListData[i].playerID + '" data-status="' + entryStatus + '" class="' + controlClass + '"><img id="up-entry-' + playerListData[i].playerID + '" src="./assets/resource/' + entryImg + '"></a></div></li>';

                $('#players_list4update').append( resp );
            }
            entryAmount = (entryAmount === 0) ? tmpAmount : entryAmount;
            progressBar(entryAmount, $('.salarycap-gage'));
            app.mobileApp.hideLoading();
                        
        }
        
        var playerList = function(p) {
            
            console.log("postion: " + p);
            salaryLimit = max_salarycap_amount - entryAmount;
                        
            if(init_data.auth === undefined) {
                app.showError("잘못된 요청입니다.");
                app.mobileApp.navigate('#landing');
            }
            
            $('#players_list').empty();
            
            sort_field = (sort_field) ? sort_field : "salary";
            console.log(sort_field);
            var sortData;            
            if(parseInt(requestPosition) === 15) {
                globalPosition = "A";
                 sortData = playerOnLeague.sort(function(a, b) {
                    if (sort_order === "asc") return (a[sort_field] - b[sort_field]);
                    else return (b[sort_field] - a[sort_field]);
                });
            } else {
                if(parseInt(requestPosition) === 1) {
                   globalPosition = "F";
                    sortData = playerData['F'].sort(function(a, b) {
                        if (sort_order === "asc") return (a[sort_field] - b[sort_field]);
                        else return (b[sort_field] - a[sort_field]);
                    });
                } else if(parseInt(requestPosition) === 2) {
                   globalPosition = "M";
                    sortData = playerData['M'].sort(function(a, b) {
                        if (sort_order === "asc") return (a[sort_field] - b[sort_field]);
                        else return (b[sort_field] - a[sort_field]);
                    });
                } else if(parseInt(requestPosition) === 4) {
                   globalPosition = "D";
                    sortData = playerData['D'].sort(function(a, b) {
                        if (sort_order === "asc") return (a[sort_field] - b[sort_field]);
                        else return (b[sort_field] - a[sort_field]);
                    });
                } else if(parseInt(requestPosition) === 8) {
                    globalPosition = "G";                    
                    sortData = playerData['G'].sort(function(a, b) {
                        if (sort_order) return (a[sort_field] - b[sort_field]);
                        else return (b[sort_field] - a[sort_field]);
                    });
                } else {
                    console.log("ERROR :");  
                }
            }
    
            //console.log(JSON.stringify(sortData ));
            
            paging = 1;
            
            var dataRange = parseInt(sortData.length / 10);
            var end;
            
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        
                        console.log(dataRange + " : " + paging);
                        
                        if(paging > dataRange) {
                            paging = 1;
                            end = (paging * 10) - 1;
                        } else if(paging === dataRange) {
                            end = sortData.length;
                        } else {
                            end = (paging * 10) - 1;
                        }
                        
                        var sliceFirst = (paging - 1) * 10;                        
                        var newArr = sortData.slice(sliceFirst, end);
                        console.log(sliceFirst + " ~ " + end + " : " + paging);
                        
                        options.success(newArr);                        
                    }
                },

                filter: { field: "playerSelected", operator: "eq", value: 1}
            });
            
            //dataSource.read();
            
            $("#players_list").kendoMobileListView({
                dataSource: dataSource,
                pullToRefresh: true,
                template: $("#playerListTemplate").html(),
                pullParameters: function(item) {
                    console.log(item); // the last item currently displayed
                    paging++;
                    return { since_id: item.playerID };
                }
            });

            app.mobileApp.hideLoading();
      
        }    

        
        
        function playerPosition(pos) {
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
        
        function prePlayerList() {
            console.log("preset array");
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
                } else {
                    playerData['G'].push(playerOnLeague[i]);
                }
            }
            
            return true;
        }
        
        function hideOnOffPlayerData(obj, player,val) {
            $.each(obj, function(i, v) {
                if (parseInt(v.playerID) === parseInt(player)) {
                    v.playerSelected = val;
                    return;
                }
            });
        }
        
        function searchPlayerName(obj, player) {
            $.each(obj, function(i, v) {
                if (parseInt(v.playerID) === parseInt(player)) {
                    return v.playerName;
                }
            });
        }
        
        function resetPlayerSalary(obj, player) {
            $.each(obj, function(i, v) {
                if (parseInt(v.playerID) === parseInt(player)) {
                    console.log(v);
                    entryAmount -= parseInt(v.salary);
                    return;
                }
            });
        }
        
        
        var addPlayer = function(e) {
            var data = e.button.data();
            var player = data.rel;
            
            console.log("position: " + globalPosition);
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === player) {
                    //var playerOnslot = searchPlayerName(playerData[globalPosition],player);
                    console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm("해당 슬롯에 이미 선수가 등록되어있습니다.\n\n선수를 교체하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayerProceed(e,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, '알림', ['교체하기', '유지하기']);
                    
                    return false;
                }
            } else {
                addPlayerProceed(e,0,'');
            }
        };
        
        function addPlayerProceed(e,oldPlayer,oldSlot) {
            var data = e.button.data();
            var player = data.rel;
            var salary = data.salary;
            
            if(parseInt(oldPlayer) > 0 && oldSlot !== "") {
                
                console.log(oldPlayer + " : " + oldSlot);
                
                var arr_index = entryData.indexOf(oldPlayer);                
                if( arr_index >= 0 ) {
                   entryData.splice(arr_index, 1);
                }
                
                if(globalPosition === "A") {
                    resetPlayerSalary(playerOnLeague,oldPlayer);   
                } else {
                    resetPlayerSalary(playerData[globalPosition],oldPlayer);   
                }
                             
            }            
            
            var tempAmount = entryAmount + salary;
            
            if(tempAmount > max_salarycap_amount) {
                app.showError("샐러리캡 한도를 벗어났습니다.");
            } else {
                playerSlot[requestSlot] = player;
                entryData.push(player);
                entryAmount += salary;
                
                //$('#entry-' + player).prop('src','./assets/resource/btn_minus_02.png');
                //$('#entry-' + player).parent('a').attr('data-status','on');
                
                if(requestSlot === "slot4" || requestSlot === "slot8") {
                    $('#img-' + requestSlot).prop('src','./assets/resource/btn_player_change_02.png');
                } else {
                    $('#img-' + requestSlot).prop('src','./assets/resource/btn_player_change.png');
                }
                
                
                
                if(globalPosition === "A") {
                    researchPlayer = playerOnLeague.filter(function ( obj ) {
                        return parseInt(obj.playerID) === parseInt(player);
                    })[0];
                    
                } else {
                                        
                    researchPlayer = playerData[globalPosition].filter(function ( obj ) {
                        return parseInt(obj.playerID) === parseInt(player);
                    })[0];
                    
                    hideOnOffPlayerData(playerData[globalPosition],player,2);
                }
                
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

                            $('#entry-' + player).prop('src','./assets/resource/btn_plus_02.png');
                            $('#entry-' + player).parent('a')
                                .attr('data-status','')
                                .removeClass('removePlayer')
                                .addClass('addPlayer');

                            if(requestSlot === "slot4" || requestSlot === "slot8") {
                                $('#img-' + requestSlot).prop('src','./assets/resource/btn_player_plus_02.png');
                            } else {
                                $('#img-' + requestSlot).prop('src','./assets/resource/btn_player_plus.png');
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

        var addPlayer4Up = function(player, salary) {
           
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === player) {
                    //var playerOnslot = searchPlayerName(playerData[globalPosition],player);
                    console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm("해당 슬롯에 이미 선수가 등록되어있습니다.\n\n선수를 교체하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                                       
                            var arr_index = entryData.indexOf(oldPlayer);                
                            if( arr_index >= 0 ) {
                               entryData.splice(arr_index, 1);
                            }

                            resetPlayerSalary(playerListData,oldPlayer);   
                           
                            addPlayer4UpProceed(player, salary);
                       } else {
                           return false;
                       }
                    }, '알림', ['교체하기', '유지하기']);
                    
                    return false;
                }
            } else {
                addPlayer4UpProceed(player, salary);
            }
        }
        
        var addPlayer4UpProceed = function(player, salary) {
            var tempAmount = entryAmount + salary;
       
            if(tempAmount > max_salarycap_amount) {
                app.showError("샐러리캡 한도를 벗어났습니다.");
            } else {
                playerSlot[requestSlot] = player;
                entryData.push(player);
                entryAmount += salary;
                
                //$('#up-entry-' + player).prop('src','./assets/resource/btn_minus_02.png');
                $('#up-entry-' + player).parent('a').attr('data-status','on');
                
                if(requestSlot === "slot4" || requestSlot === "slot8") {
                    $('#update-img-' + requestSlot).prop('src','./assets/resource/btn_player_change_02.png');
                } else {
                    $('#update-img-' + requestSlot).prop('src','./assets/resource/btn_player_change.png');
                }
                
                
                researchPlayer = playerListData.filter(function ( obj ) {
                    return parseInt(obj.playerID) === parseInt(player);
                })[0];

                $('#update-player-' + requestSlot).html(researchPlayer.playerName);
                
                progressBar(entryAmount, $('.salarycap-gage'));
                
                checkSlot4up();
                app.mobileApp.navigate('#po_entry_update','slide:right');
           }
        }
        
        var removePlayer4Up = function(player, salary) {
           
            var tempAmount = entryAmount - salary;
     
            console.log(entryAmount + " : " + salary);
            
            if(tempAmount < 0) {
                app.showError("샐러리캡 설정 범위가 잘못 되었습니다.");
            } else {
                                
                if( playerSlot[requestSlot] === "" || playerSlot[requestSlot] !== player) {
                    app.showError("엔트리 등록된 선수를 잘못 선핵하셨습니다.\n\n동일한 포지션일 경우 선수 이름을 확인해주세요.");
                } else {
                        
                    navigator.notification.confirm("선택한 엔트리 등록 선수를 취소할까요?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                          
                            playerSlot[requestSlot] = "";

                            var arr_index = entryData.indexOf(player);
                            if( arr_index >= 0 ) {
                               entryData.splice(arr_index, 1);
                            }

                            $('#up-entry-' + player).prop('src','./assets/resource/btn_plus_02.png');
                            $('#up-entry-' + player).parent('a')
                                .attr('data-status','')
                                .removeClass('removePlayer4up')
                                .addClass('addPlayer4up');

                            if(requestSlot === "slot4" || requestSlot === "slot8") {
                                $('#update-img-' + requestSlot).prop('src','./assets/resource/btn_player_plus_02.png');
                            } else {
                                $('#update-img-' + requestSlot).prop('src','./assets/resource/btn_player_plus.png');
                            }

                            $('#update-player-' + requestSlot).html(slotLabel(requestSlot));
                            
                            entryAmount -= salary;
                            progressBar(entryAmount, $('.salarycap-gage'));
                            checkSlot4up();
                            app.mobileApp.navigate('#po_entry_update','slide:right');
                           
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
                $("#entryRegBtn").attr('data-rel','enable');
                $('a#entryRegBtn').removeClass('disabled');
                entryStatus = true;
            } else {
                $("#entryRegBtn").attr('data-rel','disabled');
                $('a#entryRegBtn').addClass('disabled');
                entryStatus = false;
            }
        }

        var checkSlot4up = function() {
                      
            var key, count = 0;
            for(key in playerSlot) {
                if(playerSlot.hasOwnProperty(key)) {
                    if(playerSlot[key] !== "" || playerSlot[key] !== 0) {
                        count++;
                    }
                }
            }
                        
            if(count === 8) {
                $('a#entryUpdate').removeClass('disabled');
                entryStatus = true;
            } else {
                $('a#entryUpdate').addClass('disabled');
                entryStatus = false;
            }
        }
        
       
        
        var presetPlayer4up = function(slot) {
            $.each(playerData4up, function(id, val) {
                entryData.push(val); 
            });
            playerSlot.slot1 = slot.s1;
            playerSlot.slot2 = slot.s2;
            playerSlot.slot3 = slot.s3;
            playerSlot.slot4 = slot.s4;
            playerSlot.slot5 = slot.s5;
            playerSlot.slot6 = slot.s6;
            playerSlot.slot7 = slot.s1;
            playerSlot.slot8 = slot.s8;
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
                        app.ObjControl.reloadContest('#po_entry_registration','views/playListView.html?bar=' + currentContestType);
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

        var setFinalUpdateEntry = function(contest, fee) {

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
                    "id": "contestUpdateEntry",
                    "param":param
                },
               success: function(response) {
                   
                    console.log(response);

                    if (response.code === 0) {
                        alert("엔트리가 수정되었습니다.");
                        //uu_data.cash -= fee;
                        entryAmount = 0;
                        app.ObjControl.reloadContest('#po_entry_update','views/playView.html?tab=2');
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
        
        var overPlayer = function() {
            app.showAlert("안내","이 선수는 사용할 수 없습니다."); 
        }
        
        function tempCheckup() {
            var key, count = 0;
            for(key in playerSlot) {
                if(playerSlot.hasOwnProperty(key)) {
                    if(playerSlot[key] !== "" || playerSlot[key] !== 0) {
                        count++;
                    }
                }
            }
            
            console.log(playerSlot);
            console.log(count);
                        
            if(count !== 8) {
                app.showError("선수 엔트리 등록 상태를 확인해주세요.");
                return false;
            } else {
                return true;
            }
        }
        
        return {
            init: init,
            playerInfo: playerInfo,
            playerList: playerList,
            detailView: detailView,
            clearVariables: clearVariables,
            clearVariables2Update: clearVariables2Update,
            addPlayer:addPlayer,
            addPlayerStatic: addPlayerStatic,
            vwParam: vwParam,
            vwParam4update: vwParam4update,
            record: record,
            news: news,
            setFinalEntry: setFinalEntry,
            setFinalUpdateEntry: setFinalUpdateEntry,
            presetPlayer4up: presetPlayer4up,
            overPlayer:overPlayer,
            playerListSort: playerListSort,
            tempCheckup: tempCheckup,
            playerSlot: playerSlot
        };
    }());

    return playerProcess;
}());