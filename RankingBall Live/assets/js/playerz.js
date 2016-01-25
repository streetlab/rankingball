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
 
        
        function init(e) {
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = param.pos;
            
            sort_order = "asc";
            salaryLimit = 0;
            entryData = [];
            paging = 1;
            
            progressBar(entryAmount, $('.salarycap-gage'));
            
            prePlayerList();
/*
            if(preset) {
                if(requestPosition) playerList(requestPosition);
                else
                console.log("Error : Request postion.");
            } else {
                console.log("Error : Player preset fail.");
            }
*/
        }

        function vwParam(e) {
                        
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = param.pos;
            
            console.log(requestPosition + " : " + requestSlot);
                        
            observableView();
            //progressBar(entryAmount, $('.salarycap-gage'));
            
            //app.mobileApp.showLoading();
            console.log(playerSlot);
            console.log(entryData);
            
            playerList(requestPosition);
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
            console.log("Player set salary cap with " + amount);
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
        
        
        function playerAddInfo(e) {
            /*  
            * 연동 일시 중지 
            var data = e.button.data();
                       
            app.mobileApp.showLoading();
            if(data.rel) {
                console.log(data.rel);

                app.mobileApp.navigate('views/entryPlayerDataView.html?player=' + data.rel, 'slide'); 
                app.mobileApp.hideLoading();
            } else {
                app.showError("잘못된 선수 정보요청입니다.");
            }
            */
        }

        function playerAddInfo2(e) {
            /*  
            * 연동 일시 중지 
            var data = e.button.data();
                       
            app.mobileApp.showLoading();
            if(data.rel) {
                console.log(data.rel);

                app.mobileApp.navigate('views/entryUpdatePlayerDataView.html?player=' + data.rel, 'slide'); 
                app.mobileApp.hideLoading();
            } else {
                app.showError("잘못된 선수 정보요청입니다.");
            }
            */
        }


        function detailView(e) {
            var param = e.view.params;
            selectedPlayer = param.player;
                $.each(playerOnLeague, function(i, v) {
                    if (parseInt(v.playerID) === parseInt(selectedPlayer)) {
                        console.log(v);
                        $('#player-info-number').html(v.posCode + " " + v.number);
                        $('#player-info-name').html(v.playerName);
                        $('#player-info-team').html(v.teamName);
                        $('#player-info-point').html("$" + v.salary + " " + v.fppg + "<span>fppg</span>");
                        $('.player-info').css('background-image','url(./assets/resource/jersey/' + uniform(v.team) + ')');
                        
                        $('#playerAddSolotBtn').attr('data-rel',v.playerID);
                        $('#playerAddSolotBtn').attr('data-salary',v.salary);
                        return;
                    }
                });
        }
        
        function detailViewUp(e) {
            var param = e.view.params;
            selectedPlayer = param.player;
                $.each(playerOnLeague, function(i, v) {
                    if (parseInt(v.playerID) === parseInt(selectedPlayer)) {
                        console.log(v);
                        $('#player-upinfo-number').html(v.posCode + " " + v.number);
                        $('#player-upinfo-name').html(v.playerName);
                        $('#player-upinfo-team').html(v.teamName);
                        $('#player-upinfo-point').html("$" + v.salary + " " + v.fppg + "<span>fppg</span>");
                        $('.player-upinfo').css('background-image','url(./assets/resource/jersey/' + uniform(v.team) + ')');
                        
                        $('#playerAddSolotBtn2').attr('data-rel',v.playerID);
                        $('#playerAddSolotBtn2').attr('data-salary',v.salary);
                        return;
                    }
                });
        }
        
        
        function init4update(e) {
            
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = param.pos;
            
            sort_order = "asc";
            paging = 1;
            
            var preset = prePlayerList();
            
            if(preset) {
                if(requestPosition) playerList4up(requestPosition);
                else
                console.log("Error : Request postion.");
            } else {
                console.log("Error : Player preset fail.");
            }
        }
        
        function vwParam4update(e) {
            var param = e.view.params;
            requestSlot = param.slot;
            console.log(requestSlot);
            //if(requestPosition !== param.pos) {
                requestPosition = param.pos;
                //commonInit(requestPosition);
                console.log(requestPosition);
                playerList4up(requestPosition);
            //}
            
            console.log(playerSlot);
            console.log(entryData);
            
            console.log(entryAmount);
            progressBar(entryAmount, $('.salarycap-gage'));
        }
        
        
        
        function playerListSort4up(e) {
             app.mobileApp.showLoading();
            
            var data = e.button.data();
            var orderType = parseInt(data.val);
            var orderIco;
                        
            $('.sortClass2').removeClass('sort-l');
            $('#popover-play-vw2 span').removeClass( function(index, css) {
                return (css.match(/(^|\s)ic-\S+/g) || []).join(' ');
            }).addClass('ic-triangle-n');

            $('#sort-player-ico2').removeClass( function(index, css) {
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
                    $('#sort-player-label2').html("포지션");
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelPosition2').addClass('sort-l');
                    $('#orderByPosition2').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label2').html("네임");
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelPlayer2').addClass('sort-l');                  
                    $('#orderByPlayer2').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "playerName";
                    break;
                case 3:
                    $('#sort-player-label2').html("FPPG");
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelFPPG2').addClass('sort-l');  
                    $('#orderByFPPG2').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "fppg";
                    break;
                case 4:
                    $('#sort-player-label2').html("샐러리");
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelSalary2').addClass('sort-l');
                    $('#orderBySalary2').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "salary";
                    break;
            }
            
            playerList4up(requestPosition);
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

        
        var playerList4up = function(p) {
            
            
            var salaryLimit = max_salarycap_amount - entryAmount;         

            if(init_data.auth === undefined) {
                app.showError("잘못된 요청입니다.");
                app.mobileApp.navigate('#landing');
            }
           
            //app.mobileApp.showLoading();
           
            $('#players_list4update').empty();              
                
            sort_field = (sort_field) ? sort_field : "salary";

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
                            
            console.log(entryStatus, salaryLimit);
            
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
            
            $('.km-flat .km-scroller-pull .km-template').html('');
            
            $("#players_list4update").kendoMobileListView({
                dataSource: dataSource,
                pullToRefresh: true,
                template: $("#playerListUpdateTemplate").html(),
                pullParameters: function(item) {
                    console.log(item); // the last item currently displayed
                    paging++;
                    return { since_id: item.playerID };
                }
            });

            //$('#do-popover-hint01').data("kendoMobilePopOver").open("#player_list_header_label");
            app.mobileApp.hideLoading();                        
        }
        
        var playerList = function(p) {
            
            console.log("postion: " + p);
            salaryLimit = max_salarycap_amount - entryAmount;
                        
            if(init_data.auth === undefined) {
                app.showError("잘못된 요청입니다.");
                app.mobileApp.navigate('#landing');
            }
            
            //$('#players_list').empty();
            
            sort_field = (sort_field) ? sort_field : "salary";
            console.log(sort_field);
            var sortData;            
            if(parseInt(requestPosition) === 15) {
                globalPosition = "A";
                
                var filterdArray = playerData['F'].concat(playerData['M'], playerData['D']);
                sortData = filterdArray.sort(function(a, b) {
                    if (sort_order === "asc") return (a[sort_field] - b[sort_field]);
                    else return (b[sort_field] - a[sort_field]);
                });
                filterdArray = [];
                //delete filterdArray;
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
            
            $('.km-flat .km-scroller-pull .km-template').html('');
            
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

            //$('#do-popover-hint01').data("kendoMobilePopOver").open("#player_list_header_label");
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
                } else if (parseInt(playerOnLeague[i]['posType']) === 8) {
                    playerData['G'].push(playerOnLeague[i]);
                } else {
                    console.log("Error: none position type"); 
                    console.log(playerOnLeague[i]);
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
            
            console.log(data);
            console.log("position: " + globalPosition);
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === data.rel) {
                    
                    console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm("해당 슬롯에 이미 선수가 등록되어있습니다.\n\n선수를 교체하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayerProceed(data.rel,data.salary,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, '알림', ['교체하기', '유지하기']);
                    
                    return false;
                }
            } else {
                console.log("add more");
                addPlayerProceed(data.rel,data.salary,0,'');
            }
        };
        
        function addPlayerProceed(player,salary,oldPlayer,oldSlot) {
            console.log(player + " : " + salary);
            console.log("1");
            
            if(parseInt(oldPlayer) > 0 && oldSlot !== "") {
                
                console.log(oldPlayer + " : " + oldSlot);
                
                var arr_index = entryData.indexOf(oldPlayer);                
                if( arr_index >= 0 ) {
                   entryData.splice(arr_index, 1);
                }
                
                if(globalPosition === "A") {
                    resetPlayerSalary(playerOnLeague,oldPlayer);
                    hideOnOffPlayerData(playerData,oldPlayer,1);
                } else {
                    resetPlayerSalary(playerData[globalPosition],oldPlayer);
                    hideOnOffPlayerData(playerData[globalPosition],oldPlayer,1);
                }
 
            }            
            
            var tempAmount = entryAmount + parseInt(salary);
            
            console.log("2");
            
            if(tempAmount > max_salarycap_amount) {
                app.showError("샐러리캡 한도를 벗어났습니다.");
            } else {
                
                console.log(player + " : " + salary);
                
                playerSlot[requestSlot] = player;
                entryData.push(player);
                entryAmount += parseInt(salary);
                
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
                    
                    hideOnOffPlayerData(playerData,player,2);
                    
                } else {
                                        
                    researchPlayer = playerData[globalPosition].filter(function ( obj ) {
                        return parseInt(obj.playerID) === parseInt(player);
                    })[0];
                    
                    hideOnOffPlayerData(playerData[globalPosition],player,2);
                }
                
                $('#player-' + requestSlot).html(researchPlayer.playerName);
                
                progressBar(entryAmount, $('.salarycap-gage'));
                app.Entry.updateBar();
                checkSlot();
                //app.mobileApp.navigate('#po_entry_registration','slide:right');
                app.mobileApp.navigate('#:back');
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

        var addPlayer4Up = function(e) {
           var data = e.button.data();
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === data.rel) {
                    //var playerOnslot = searchPlayerName(playerData[globalPosition],player);
                    console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm("해당 슬롯에 등록된 선수를 교체하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                             

                            //resetPlayerSalary(playerListData,oldPlayer, function() {addPlayer4UpProceed(data.rel, data.salary);});   
                            addPlayer4UpProceed(data.rel, data.salary,oldPlayer,requestSlot);
                            
                       } else {
                           return false;
                       }
                    }, '알림', ['교체하기', '유지하기']);
                    
                    return false;
                }
            } else {
                addPlayer4UpProceed(data.rel, data.salary,0,'');
            }
        }
        
        var addPlayer4UpProceed = function(player, salary,oldPlayer,oldSlot) {

             var tempAmount = 0;
            
            console.log("OLD : " + entryAmount);
            if(parseInt(oldPlayer) > 0 && oldSlot !== "") {
                
                console.log(oldPlayer + " : " + oldSlot);
                

                
                /*
                if(globalPosition === "A") {
                    resetPlayerSalary(playerOnLeague,oldPlayer);   
                } else {
                    resetPlayerSalary(playerData[globalPosition],oldPlayer);   
                }
                */
                
                var salaryTable = app.Entry.playerFilterSalary;
                var oldPlayerSalary = salaryTable[oldPlayer];
                var tmpEntryAmount = entryAmount;
                console.log("salary : " + oldPlayerSalary);
                tmpEntryAmount -= parseInt(oldPlayerSalary);
                
                tempAmount = tmpEntryAmount + parseInt(salary);
                
                console.log(tmpEntryAmount + " : "  + salary + " : " + tempAmount + " : "  + max_salarycap_amount);
                
                if(tempAmount > max_salarycap_amount) {
                    app.showError("샐러리캡 한도를 벗어났습니다.");
                    return false;                    
                } else {
                    var arr_index = entryData.indexOf(oldPlayer);                
                    if( arr_index >= 0 ) {
                       entryData.splice(arr_index, 1);
                    }
                    
                    entryAmount -= parseInt(oldPlayerSalary);
                }
            } else {
                console.log("no change");
                tempAmount = entryAmount + parseInt(salary);
            }         
            
            if(tempAmount > max_salarycap_amount) {
                app.showError("샐러리캡 한도를 벗어났습니다.");
            } else {
                playerSlot[requestSlot] = player;
                entryData.push(player);
                entryAmount += parseInt(salary);
                
                //$('#up-entry-' + player).prop('src','./assets/resource/btn_minus_02.png');
                $('#up-entry-' + player).parent('a').attr('data-status','on');
                
                if(requestSlot === "slot4" || requestSlot === "slot8") {
                    $('#update-img-' + requestSlot).prop('src','./assets/resource/btn_player_change_02.png');
                } else {
                    $('#update-img-' + requestSlot).prop('src','./assets/resource/btn_player_change.png');
                }
                
                
                console.log(entryAmount);
                
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

                $('#update-player-' + requestSlot).html(researchPlayer.playerName);
                
                progressBar(entryAmount, $('.salarycap-gage'));
                app.Entry.updateBar();
                
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
            var player = $('#playerAddSolotBtn').attr('data-rel');
            var salary = $('#playerAddSolotBtn').attr('data-salary');
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === player) {
                    
                    console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm("해당 슬롯에 이미 선수가 등록되어있습니다.\n\n선수를 교체하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayerProceed(player,salary,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, '알림', ['교체하기', '유지하기']);
                    
                    return false;
                }
            } else {
                console.log("add more");
                addPlayerProceed(player,salary,0,'');
            }
        }
        
        var addPlayerStaticUp = function() {
            var player = $('#playerAddSolotBtn2').attr('data-rel');
            var salary = $('#playerAddSolotBtn2').attr('data-salary');
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === player) {
                    
                    console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm("해당 슬롯에 등록된 선수를 교체하시겠습니까?", function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];

                            addPlayer4UpProceed(player, salary, oldPlayer, requestSlot);
                       }
                    }, '알림', ['교체하기', '유지하기']);
                }
            } else {
                console.log("add more");
                addPlayer4UpProceed(player,salary,0,'');
            }
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
            
            console.log(count);
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
            
            app.mobileApp.showLoading();
            
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
            
            console.log(param);
            
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
                   
                    if (response.code === 0) {
                        alert("엔트리가 등록되었습니다.");
                        uu_data.cash -= fee;
                        entryAmount = 0;
                        //app.ObjControl.reloadContest('#po_entry_registration','views/playListView.html?bar=' + currentContestType);
                        app.ObjControl.reloadContest('#po_entry_registration','views/playView.html');
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

        var setFinalUpdateEntry = function(contest, entry) {

            if(contest === "") {
                console.log("no contst");
                return false;
            }
            
            if(entry === "") {
                console.log("no entry");
                return false;
            }
            
            var param = '{"osType":' + init_apps.osType + 
                ',"version":"' + init_apps.version + 
                '","memSeq":' + uu_data.memSeq + 
                ',"entrySeq":' + entry + 
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
                dataType: "jsonp",
                timeout: 3000,
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
                        app.ObjControl.reloadContest('#po_entry_update','views/playView.html?tab=m');
                    } else {
                        app.showError(response.message);
                    }
                },
                error: function(e) {
                    console.log(e);
                }
           });  
           
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
                    return 'jersey_queens_park_rangers.png';
            }
            
            // jersey_burnley_fc, jersey_hull_a_fc, jersey_queens_park_rangers
        }
        
        var record = function() {
            app.showAlert("서버스 준비중입니다.","안내");
        }
        
        var news = function() {
            app.showAlert("서버스 준비중입니다.", "안내");    
        }
        
        var overPlayer = function() {
            app.showAlert("이 선수는 사용할 수 없습니다.", "안내"); 
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
            init4update: init4update,
            playerInfo: playerInfo,
            playerList: playerList,
            detailView: detailView,
            detailViewUp: detailViewUp,
            clearVariables: clearVariables,
            clearVariables2Update: clearVariables2Update,
            addPlayer:addPlayer,
            addPlayer4Up: addPlayer4Up,
            addPlayerStatic: addPlayerStatic,
            addPlayerStaticUp: addPlayerStaticUp,
            vwParam: vwParam,
            vwParam4update: vwParam4update,
            record: record,
            news: news,
            setFinalEntry: setFinalEntry,
            setFinalUpdateEntry: setFinalUpdateEntry,
            presetPlayer4up: presetPlayer4up,
            overPlayer:overPlayer,
            playerListSort: playerListSort,
            playerListSort4up: playerListSort4up,
            tempCheckup: tempCheckup,
            playerSlot: playerSlot,
            playerAddInfo: playerAddInfo,
            playerAddInfo2: playerAddInfo2
        };
    }());

    return playerProcess;
}());