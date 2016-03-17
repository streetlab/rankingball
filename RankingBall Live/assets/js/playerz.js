/**
 * Player Control view model
 */
var app = app || {};

app.Playerz = (function () {
    'use strict';

    var playerProcess = (function () {
        
        var contestNo = "";
        
        var requestPosition = "";
        var requestSlot = "";
        //var globalPosition = "";
       
        var sort_field = "";
        var sort_order = "";
        var selectedPlayer = "";
        var researchPlayer = "";
        var entryData = [];
        
        var overflowSalary = 0;
        var paging = 1;
 
        var filteredList = [];
        var setPlayercard = 0;
        
        var playerGameLog = [];
        
        function langExchange() 
        {
            app.langExchange.exchangeLanguage(laf);    
        }
        
        function init(e) 
        {
            langExchange();
            
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = parseInt(param.pos);
            
            sort_order = "desc";
            sort_field = "salary";
            
            salaryLimit = 0;
            entryData = [];
            paging = 1;
                        
            progressBar(entryAmount, $('.salarycap-gage'));
            
            listup.preset();
        }

        /* Player Select - On Show*/
        function vwParam(e) 
        {

            e.view.options.title = $.langTitle[laf][5];
            
            //sort_order = "asc";
            //sort_field = "salary";
            paging = 1;
            
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = parseInt(param.pos);
            slotSalary = 0;
            
            tmpReqSlot = requestSlot;
            
            console.log(requestPosition + " : " + requestSlot);
                        
            observableView();
            updateGage($('#gae_salarycap_p'));
                        
            //playerList(requestPosition);
            listup.playercards();
        }
        
        function commonInit(pos) 
        {
            
            var preset = prePlayerList();
            
            if(preset) {
                if(pos) playerList(pos);
            } else {
                console.log("");
            }
        }
        
        function clearVariables() 
        {
            
            observableView();
            playerSlot = {};
            requestPosition = "";
            requestSlot = "";

            sort_order = "";
            selectedPlayer = "";
            researchPlayer = "";
            entryData = [];
        }

        function clearVariables2Update() 
        {
            
            observableView();
            
            requestPosition = "";
            requestSlot = "";

            sort_order = "";
            selectedPlayer = "";
            researchPlayer = "";
        }
        
        function progressBar(amount, $element) 
        {
            //console.log("Player set salary cap with " + amount);
            var percent = 0;
            var progressBarWidth = 0;
            console.log(amount + " : " + max_salarycap_amount);
            if(amount >= max_salarycap_amount) {
                progressBarWidth = $element.width();
                console.log(progressBarWidth);
            } else {
                percent = amount / max_salarycap_amount * 100;
                progressBarWidth = percent * $element.width() / 100;
            }

            
            //console.log($element);
            //console.log( $element.width() + " : " + progressBarWidth + " : " + percent );
            
            $element.find('div').animate({ width: progressBarWidth }, 500);
            //$element.find('div').width(progressBarWidth);
            $element.find('p').html("$" + numberFormat(amount) + "&nbsp; /&nbsp;$" +numberFormat(max_salarycap_amount));
        }
        
        /* Not Used */
        function playerInfo(e) 
        {
            var rel = parseInt(e.attr('data-rel'));
            
            if(rel) {
                var vwURL = 'views/entryPlayerDataView.html?player=' + rel;
                app.mobileApp.navigate(vwURL); 
            } else {
                app.showAlert($.langScript[laf]['noti_044'],"Notice");
            }
        }
        
        function playerInfo4Up(e) 
        {
            var rel = parseInt(e.attr('data-rel'));
            
            if(rel) {
                var vwURL = 'views/entryUpdatePlayerDataView.html?player=' + rel;
                app.mobileApp.navigate(vwURL); 
            } else {
                app.showAlert($.langScript[laf]['noti_044'],"Notice");
            }
        }
        
        
        function playerAddInfo(e) 
        {
            var data = e.button.data();
            app.mobileApp.showLoading();
            
            setPlayercard = parseInt(data.rel);
            
            $('#m-tabstripGameRecord').removeClass('ts');
            $('#m-tabstripCard').addClass('ts');
            $('#m-playerCardRecord').addClass('hide');
            $('#m-playerCardFeature').removeClass('hide');
            
            var info = JSLINQ(filteredList.items).Where(function(item){ return item.playerID === setPlayercard });
            
            $.each(info.items, function(i, v) {
                var emblem = "amblem__" + v.team;
                var stars = "";
                for(var i = 1;i<7;i++) {
                    //stars += (i <= v.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                    stars += '<span>*</span>';
                }
                v.dcRatio = 0;
                //var dcSalary = parseInt(v.salary) * (1.0 - parseFloat(v.dcRatio));
                var dcSalary = v.salary;
                
                $('#m-cardAmblem').addClass(emblem);
                $('#m-player-info-team').html(v.teamName);
                $('#m-player-info-name').html(v.playerName);
                $('#m-player-info-position').html(v.posCode);
                $('#m-player-info-number').html(v.number);
                $('#m-player-info-fppg').html(v.fppg);
                $('#m-player-info-salary').html('$' + numberFormat(dcSalary));
                
                $('#m-playercard-star').html(stars);
                
                $('#m-playercard-effect').html(parseInt(v.dcRatio * 100) + "%");
                if(parseFloat(v.dcRatio) > 0) {
                    $('#m-playercard-old').html('$' + numberFormat(v.salary)).removeClass('hide');
                } else {
                    $('#m-playercard-old').addClass('hide');
                }
                $('#m-playercard-discount').html('$' + numberFormat(dcSalary));
                
            });
            
            $("#moadlCardInfo").data("kendoMobileModalView").open();
            
            var bodyHeight = $('#moadlCardInfo').find('.km-content').height();
            $('.card_box__body').css({'min-height':bodyHeight + 'px'});
            
            app.mobileApp.hideLoading();
        }

        function playerAddInfo2(e) 
        {
            var data = e.button.data();
            app.mobileApp.showLoading();
            setPlayercard = parseInt(data.rel);
            
            $('#mu-tabstripGameRecord').removeClass('ts');
            $('#mu-tabstripCard').addClass('ts');
            $('#mu-playerCardRecord').addClass('hide');
            $('#mu-playerCardFeature').removeClass('hide');
            
            var info = JSLINQ(filteredList.items).Where(function(item){ return item.playerID === setPlayercard });
            
            $.each(info.items, function(i, v) {
                var emblem = "amblem__" + v.team;
                var stars = "";
                for(var i = 1;i<7;i++) {
                    //stars += (i <= v.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                    stars += '<span>*</span>';
                }
                v.dcRatio = 0;
                //var dcSalary = parseInt(v.salary) * (1.0 - parseFloat(v.dcRatio));
                var dcSalary = v.salary;
                
                $('#mu-cardAmblem').addClass(emblem);
                $('#mu-player-info-team').html(v.teamName);
                $('#mu-player-info-name').html(v.playerName);
                $('#mu-player-info-position').html(v.posCode);
                $('#mu-player-info-number').html(v.number);
                $('#mu-player-info-fppg').html(v.fppg);
                $('#mu-player-info-salary').html('$' + numberFormat(dcSalary));
                
                $('#mu-playercard-star').html(stars);
                
                $('#mu-playercard-effect').html(parseInt(v.dcRatio * 100) + "%");
                if(parseFloat(v.dcRatio) > 0) {
                    $('#mu-playercard-old').html('$' + numberFormat(v.salary)).removeClass('hide');
                } else {
                    $('#mu-playercard-old').addClass('hide');
                }
                $('#mu-playercard-discount').html('$' + numberFormat(dcSalary));
                
            });
            
            $("#moadlCardInfo2").data("kendoMobileModalView").open();
            var bodyHeight = $('#moadlCardInfo2').find('.km-content').height();
            $('.card_box__body').css({'min-height':bodyHeight + 'px'});
            app.mobileApp.hideLoading();
        }

        /* 선수 추가하기 */
        function addPlayercard()
        {
            if(!setPlayercard || setPlayercard === 0) {
                console.log("none playercard");
                return false;
            }
            
            var info = JSLINQ(filteredList.items).Where(function(item){ return item.playerID === setPlayercard });
            
            if(info.items[0].playerSelected === 2) {
                overPlayer();
                return false;
            }
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === setPlayercard) {
                    
                    //console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm($.langScript[laf]['noti_051'], function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayerProceed(setPlayercard,info.items[0].salary,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, 'Notice', [$.langScript[laf]['btn_substitute'], $.langScript[laf]['btn_maintain']]);
                    
                    return false;
                }
            } else {
                console.log("add more");
                addPlayerProceed(setPlayercard,info.items[0].salary,0,'');
            }
        }
        
        function addPlayercard2()
        {
            if(!setPlayercard || setPlayercard === 0) {
                console.log("none playercard");
                return false;
            }
            
            var info = JSLINQ(filteredList.items).Where(function(item){ return item.playerID === setPlayercard });
            
            if(info.items[0].playerSelected === 2) {
                overPlayer();
                return false;
            }
            console.log(info.items);
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === setPlayercard) {
                    
                    //console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm($.langScript[laf]['noti_051'], function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayer4UpProceed(setPlayercard,info.items[0].salary,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, 'Notice', [$.langScript[laf]['btn_substitute'], $.langScript[laf]['btn_maintain']]);
                    
                    return false;
                }
            } else {
                console.log("add more");
                addPlayer4UpProceed(setPlayercard,info.items[0].salary,0,'');
            }


        }
        
        

        function detailView(e) 
        {
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
        
        function detailViewUp(e)
        {
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
        
        
        function init4update(e) 
        {
            
            langExchange();
            
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = param.pos;
            contestNo = param.contest;
            
            sort_order = "desc";
            sort_field = "salary";
            paging = 1;
        }
        
        function vwParam4update(e) 
        {
            e.view.options.title = $.langTitle[laf][5];
            var param = e.view.params;
            requestSlot = param.slot;
            requestPosition = param.pos;
            contestNo = param.contest;
            
            tmpReqSlot = requestSlot;
            observableView();
            //progressBar(entryAmount, $('#gae_salarycap_update_p'));
            updateGage2($('#gae_salarycap_update_p'));
            //playerList4up(requestPosition);
            
            listup_ed.playercards();
        }
        
        
        /* 추가 - 16.03.10 선수카드 리스트 */
        var listup = {
            preset: function() {
                var that = this;
                
                //playerOnLeague['playerSelected'] = 1;
                that.playercards();
            },
            playercards: function() {
                var that = this;
                app.mobileApp.showLoading();
                paging = 1;
                console.log("List up " + requestPosition);
                
                slotCheck();
                salaryLimit = max_salarycap_amount - entryAmount;
                console.log("Amount : " + salaryLimit + " : " + max_salarycap_amount + " : " + entryAmount);
                
                if(requestPosition === 15) {
                    filteredList = JSLINQ(playerOnLeague);
                } else {
                    filteredList = JSLINQ(playerOnLeague).Where(function(item){ return item.posType === requestPosition });
                }
                filteredList.items['playerSelected'] = 1;
                that.sortCardList();
            },
            sortCardList: function() {
                var that = this;
                switch(sort_field) {
                    case "posType":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.posType });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.posType });
                        }
                        
                        break;
                    case "playerName":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.playerName });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.playerName });
                        }
                        break;
                    case "fppg":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.fppg });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.fppg });
                        }
                        break;
                    case "salary":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.salary });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.salary });
                        }
                        break;
                }
                
                var listview = $("#players_list").data("kendoMobileListView");
                listview.scroller().reset();
                
                //$('#players-box').empty();
                that.updateCardList();                
            },
            updateCardList: function() {
                var len = filteredList.items.length;
                var dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function(options) {
                            var data = [];
                            var i = 0;
                            var max = (len > 9) ? 10 : len;
                            for (; i < max; i ++) {
                                data.push(filteredList.items[i]);
                            }
                            options.success(data);
                        }
                    }
                });
                
                $("#players_list").kendoMobileListView({
                    template: $("#playerListTemplate").html(),
                    dataSource: dataSource,
                    change: function() {
                        console.log("change");
                    }
                });
                
                if(len > 9) {
                    $('#playercardsMoreBnt').removeClass('hide');
                } else {
                    $('#playercardsMoreBnt').addClass('hide');
                }
                app.mobileApp.hideLoading();
            }
        };
        var listup_ed = {
            playercards: function() {
                var that = this;
                app.mobileApp.showLoading();
                paging = 1;
                console.log("List up " + requestPosition);
                
                slotCheck();
                salaryLimit = max_salarycap_amount - entryAmount;
                console.log("Amount : " + salaryLimit + " : " + max_salarycap_amount + " : " + entryAmount);
                
                if(parseInt(requestPosition) === 15) {
                    filteredList = JSLINQ(playerOnLeague);
                } else {
                    filteredList = JSLINQ(playerOnLeague).Where(function(item){ return item.posType === parseInt(requestPosition) });
                }
                that.sortCardList();
            },
            sortCardList: function() {
                var that = this;
                switch(sort_field) {
                    case "posType":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.posType });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.posType });
                        }
                        
                        break;
                    case "playerName":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.playerName });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.playerName });
                        }
                        break;
                    case "fppg":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.fppg });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.fppg });
                        }
                        break;
                    case "salary":
                        if(sort_order === "asc") {
                            filteredList = JSLINQ(filteredList.items).OrderBy(function(item){ return item.salary });
                        } else {
                            filteredList = JSLINQ(filteredList.items).OrderByDescending(function(item){ return item.salary });
                        }
                        break;
                }
                console.log(filteredList);
                var listview2 = $("#players_list4update").data("kendoMobileListView");
                listview2.scroller().reset();
                that.updateCardList();                
            },
            updateCardList: function() {
                var len = filteredList.items.length;
                var dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function(options) {
                            var data = [];
                            var i = 0;
                            var max = (len > 9) ? 10 : len;
                            for (; i < max; i ++) {
                                data.push(filteredList.items[i]);
                            }
                            options.success(data);
                        }
                    }
                });
                
                $("#players_list4update").kendoMobileListView({
                    template: $("#playerListTemplate2").html(),
                    dataSource: dataSource,
                    change: function() {
                        console.log("change");
                    }
                });
                
                if(len > 9) {
                    $('#playercardsMoreBnt2').removeClass('hide');
                } else {
                    $('#playercardsMoreBnt2').addClass('hide');
                }
                app.mobileApp.hideLoading();
            }
        };
        
        function loadMoreList()
        {
            paging++;
            var dataRange = parseInt(filteredList.items.length / 10);
            var max;
            if(paging > dataRange) {
                $('#playercardsMoreBnt').addClass('hide');
            } else if(paging === dataRange) {
                max = filteredList.items.length;
            } else {
                max = paging * 10;
            }
            
            var i = (paging - 1) * 10;
            for (; i < max; i ++) {
                $("#players_list").data("kendoMobileListView").append([filteredList.items[i]]);
            }
            
            app.mobileApp.scroller().reset();
        }
        
        function loadMoreList2()
        {
            paging++;
            var dataRange = parseInt(filteredList.items.length / 10);
            var max;
            if(paging > dataRange) {
                $('#playercardsMoreBnt2').addClass('hide');
            } else if(paging === dataRange) {
                max = filteredList.items.length;
            } else {
                max = paging * 10;
            }
            
            var i = (paging - 1) * 10;
            for (; i < max; i ++) {
                $("#players_list4update").data("kendoMobileListView").append([filteredList.items[i]]);
            }
            
            app.mobileApp.scroller().reset();
        }
        
        function sortPlayercard(e)
        {
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
            
            if(data.orderby === "desc") {
                orderIco = "ic-triangle-n-on";
                data.orderby = "asc";
            } else {
                orderIco = "ic-triangle-s-on";
                data.orderby = "desc";
            }
            
            sort_order = data.orderby;
            console.log("sort : " + orderType + " : " + sort_order);
            switch(orderType) {
                case 1:
                    $('#sort-player-label').html($.langScript[laf]['label_position']);
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelPosition').addClass('sort-l');
                    $('#orderByPosition').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label').html($.langScript[laf]['label_name']);
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelPlayer').addClass('sort-l');                  
                    $('#orderByPlayer').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "playerName";
                    break;
                case 3:
                    $('#sort-player-label').html("FPPG");
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelFPPG').addClass('sort-l');  
                    $('#orderByFPPG').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "fppg";
                    break;
                case 4:
                    $('#sort-player-label').html($.langScript[laf]['label_salary']);
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelSalary').addClass('sort-l');
                    $('#orderBySalary').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "salary";
                    break;
            }
            
            listup.sortCardList();
            
        }
                
        function sortPlayercard2(e)
        {
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
            
            if(data.orderby === "desc") {
                orderIco = "ic-triangle-n-on";
                data.orderby = "asc";
            } else {
                orderIco = "ic-triangle-s-on";
                data.orderby = "desc";
            }
            
            sort_order = data.orderby;
            console.log("sort : " + orderType + " : " + sort_order);
            switch(orderType) {
                case 1:
                    $('#sort-player-label2').html($.langScript[laf]['label_position']);
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelPosition2').addClass('sort-l');
                    $('#orderByPosition2').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label2').html($.langScript[laf]['label_name']);
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelPlayer2').addClass('sort-l');                  
                    $('#orderByPlayer2').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "playerName";
                    break;
                case 3:
                    $('#sort-player-label2').html("FPPG");
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelFPPG2').addClass('sort-l');  
                    $('#orderByFPPG2').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "fppg";
                    break;
                case 4:
                    $('#sort-player-label2').html($.langScript[laf]['label_salary']);
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelSalary2').addClass('sort-l');
                    $('#orderBySalary2').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "salary";
                    break;
            }
            
            listup_ed.sortCardList();
            
        }
        
        
        /* Not Used */
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
            //console.log(data);
            switch(orderType) {
                case 1:
                    $('#sort-player-label2').html($.langScript[laf]['label_position']);
                    $('#sort-player-ico2').addClass(orderIco);
                    $('#orderLabelPosition2').addClass('sort-l');
                    $('#orderByPosition2').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label2').html($.langScript[laf]['label_name']);
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
                    $('#sort-player-label2').html($.langScript[laf]['label_salary']);
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
                    $('#sort-player-label').html($.langScript[laf]['label_position']);
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelPosition').addClass('sort-l');
                    $('#orderByPosition').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label').html($.langScript[laf]['label_name']);
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
                    $('#sort-player-label').html($.langScript[laf]['label_salary']);
                    $('#sort-player-ico').addClass(orderIco);
                    $('#orderLabelSalary').addClass('sort-l');
                    $('#orderBySalary').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sort_field = "salary";
                    break;
            }
            
            playerList(requestPosition);
        }

        var filterdArray = "";
        var sortData = "";
        var playerList4up = function(p) {
            
            
            //var salaryLimit = max_salarycap_amount - entryAmount;         
            salaryLimit = max_salarycap_amount - entryAmount;         
            if(init_data.auth === undefined) {
                app.showAlert($.langScript[laf]['noti_045'],"Notice");
                app.mobileApp.navigate('#landing');
            }
           
            //app.mobileApp.showLoading();
           
            $('#players_list4update').empty();              
                
            sort_field = (sort_field) ? sort_field : "salary";
    
            sortData = "";
            console.log(sortData);
            if(parseInt(requestPosition) === 15) {
                globalPosition = "A";
                filterdArray = playerData['F'].concat(playerData['M'], playerData['D']);
                sortData = filterdArray.sort(function(a, b) {
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
              
            //console.log(v.playerID);
            $.each(playerSlot, function(k, p) {
                console.log(k + " : " + p);
                $.each(sortData, function(i, v) {                    
                    if (parseInt(v.playerID) === parseInt(p)) {
                        v.playerSelected = 2;
                        console.log(" : eq");
                        return;
                    }
                });
            });
            
            var dataRange = parseInt(sortData.length / 10);
            var end;
            
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        
                        //console.log(dataRange + " : " + paging);
                        
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
                        //console.log(sliceFirst + " ~ " + end + " : " + paging);
                        
                        options.success(newArr);                        
                    }
                }
            });
            
            // selected player filter
            // ,filter: { field: "playerSelected", operator: "eq", value: 1}
            
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
            console.log("Amount : " + salaryLimit + " : " + max_salarycap_amount + " : " + entryAmount);
            
            if(init_data.auth === undefined) {
                app.showAlert($.langScript[laf]['noti_045'],"Notice");
                app.mobileApp.navigate('#landing');
            }
            
            slotCheck();
            console.log("Slot Salary : " + slotSalary + "/" + entryAmount);
            //$('#players_list').empty();
            
            sort_field = (sort_field) ? sort_field : "salary";
            //console.log(sort_field);
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
                        
                        //console.log(dataRange + " : " + paging);
                        
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
                        //console.log(sliceFirst + " ~ " + end + " : " + paging);
                        
                        options.success(newArr);                        
                    }
                }
            });
            
            // selected player filter
            // ,filter: { field: "playerSelected", operator: "eq", value: 1}
            
            $('.km-flat .km-scroller-pull .km-template').html('');
            
            $("#players_list").empty();
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
            //console.log(playerOnLeague);
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
        
        function entryPlayer(obj, player,val) {
            $.each(obj, function(i, v) {
                $.each(player, function(k, p) {
                    if (parseInt(v.playerID) === parseInt(p)) {
                        v.playerSelected = val;
                    }
                });
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
                    //console.log(v);
                    entryAmount -= parseInt(v.salary);
                    return;
                }
            });
        }
        
        /* 선수 엔트리지정 */
        var addPlayer = function(e) 
        {
            var data = e.button.data();
            
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "" || playerSlot[requestSlot] === data.rel) {
                    
                    //console.log(playerSlot[requestSlot]);
                    navigator.notification.confirm($.langScript[laf]['noti_051'], function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayerProceed(data.rel,data.salary,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, 'Notice', [$.langScript[laf]['btn_substitute'], $.langScript[laf]['btn_maintain']]);
                    
                    return false;
                }
            } else {
                console.log("add more");
                addPlayerProceed(data.rel,data.salary,0,'');
            }
        };
        
        function addPlayerProceed(player,salary,oldPlayer,oldSlot) {

            app.mobileApp.showLoading();
            
            if(parseInt(oldPlayer) > 0 && oldSlot !== "") {
                
                var arr_index = entryData.indexOf(oldPlayer);                
                if( arr_index >= 0 ) {
                   entryData.splice(arr_index, 1);
                }
                
                resetPlayerSalary(playerOnLeague,oldPlayer);
                hideOnOffPlayerData(playerOnLeague,oldPlayer,1);
            }            
            
            var tempAmount = entryAmount + parseInt(salary);
            
            // 샐러리캡 max 체크 루틴 변경
            if(tempAmount > max_salarycap_amount) {
                //app.showAlert($.langScript[laf]['noti_018'],"Notice");
                overflowSalary = parseInt(tempAmount - max_salarycap_amount);
                $('#gae_salarycap_p').find('div').addClass('salary_over');
                $('#gae_salarycap').find('div').addClass('salary_over');
                $('.salarycap-overflow').html('+' + numberFormat(overflowSalary) + ' salary over').removeClass('hide');
            } else {
                $('#gae_salarycap_p').find('div').removeClass('salary_over');
                $('#gae_salarycap').find('div').removeClass('salary_over');
                $('.salarycap-overflow').addClass('hide');
            }
            
            playerSlot[requestSlot] = player;
            entryData.push(player);
            entryAmount += parseInt(salary);
                        
            $('#img-' + requestSlot).removeClass('player_plus').addClass('player_change');
 
            researchPlayer = playerOnLeague.filter(function ( obj ) {
                return parseInt(obj.playerID) === parseInt(player);
            })[0];
            
            hideOnOffPlayerData(playerOnLeague,player,2);
            
            $('#player-' + requestSlot).html(researchPlayer.playerName);
            $('#player-salary-' + requestSlot).html('$' + numberFormat(salary));
            
            progressBar(entryAmount, $('#gae_salarycap_p'));
            updateGage($('#gae_salarycap'));
            checkSlot();
            
            setTimeout(function() {
                app.mobileApp.navigate('#:back');
                app.mobileApp.hideLoading();
            },500);

        }
        
        function updateGage($element) {
            
            var salarycapWidth = $('#gae_salarycap_p').width();
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
        
        var removePlayer = function(player, salary) {
            
            var tempAmount = entryAmount - salary;
     
            if(tempAmount < 0) {
                app.showError($.langScript[laf]['noti_017']);
            } else {
                                
                if( playerSlot[requestSlot] === "" || playerSlot[requestSlot] !== player) {
                    app.showAlert($.langScript[laf]['noti_026'],"Notice");
                } else {
                        
                    navigator.notification.confirm($.langScript[laf]['noti_023'], function (confirmed) {
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
                    }, 'Notice', [$.langScript[laf]['btn_cancel'], $.langScript[laf]['btn_maintain']]);
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
                    navigator.notification.confirm($.langScript[laf]['noti_050'], function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                             

                            //resetPlayerSalary(playerListData,oldPlayer, function() {addPlayer4UpProceed(data.rel, data.salary);});   
                            addPlayer4UpProceed(data.rel, data.salary,oldPlayer,requestSlot);
                            
                       } else {
                           return false;
                       }
                    }, 'Notice', [$.langScript[laf]['btn_substitute'], $.langScript[laf]['btn_maintain']]);
                    
                    return false;
                }
            } else {
                addPlayer4UpProceed(data.rel, data.salary,0,'');
            }
        }
        
        var addPlayer4UpProceed = function(player, salary,oldPlayer,oldSlot) {

             var tempAmount = 0;
            
            console.log(entryAmount);
            
            if(parseInt(oldPlayer) > 0 && oldSlot !== "") {
                
                var salaryTable = playerOnLeague.filter(function ( obj ) {
                    return parseInt(obj.playerID) === parseInt(oldPlayer);
                })[0];
                var oldPlayerSalary = salaryTable['salary'];
                var arr_index = entryData.indexOf(oldPlayer);                
                if( arr_index >= 0 ) {
                   entryData.splice(arr_index, 1);
                }
                
                entryAmount -= parseInt(oldPlayerSalary);
                
            } else {
                console.log("no change");
                //tempAmount = entryAmount + parseInt(salary);
            }
            
            playerSlot[requestSlot] = player;
            entryData.push(player);
            entryAmount += parseInt(salary);
            
            if(entryAmount > max_salarycap_amount) {
                //app.showAlert($.langScript[laf]['noti_018'],"Notice");
                overflowSalary = parseInt(entryAmount - max_salarycap_amount);
                $('#gae_salarycap_update_p').find('div').addClass('salary_over');
                $('#gae_salarycap_update').find('div').addClass('salary_over');
                $('.salarycap-update-overflow').html('+' + numberFormat(overflowSalary) + ' salary over').removeClass('hide');
            } else {
                $('#gae_salarycap_update_p').find('div').removeClass('salary_over');
                $('#gae_salarycap_update').find('div').removeClass('salary_over');
                $('.salarycap-update-overflow').addClass('hide');
            }
                       
            hideOnOffPlayerData(playerOnLeague,player,2);
            
            researchPlayer = playerOnLeague.filter(function ( obj ) {
                return parseInt(obj.playerID) === parseInt(player);
            })[0];
            
            $('#update-img-' + requestSlot).removeClass('player_plus').addClass('player_change');
            $('#update-player-' + requestSlot).html(researchPlayer.playerName);
            $('#update-player-salary-' + requestSlot).html('$' + numberFormat(salary));
                        
            progressBar(entryAmount, $('#gae_salarycap_update_p'));
            updateGage2($('#gae_salarycap_update'));
                        
            checkSlot4up();
            //app.mobileApp.navigate('#po_entry_update','slide:right');

            setTimeout(function() {
                app.mobileApp.navigate('#:back');
                app.mobileApp.hideLoading();
            },500);
        }
        
        var removePlayer4Up = function(player, salary) {
           
            var tempAmount = entryAmount - salary;
     
            console.log(entryAmount + " : " + salary);
            
            if(tempAmount < 0) {
                app.showError($.langScript[laf]['noti_017']);
            } else {
                                
                if( playerSlot[requestSlot] === "" || playerSlot[requestSlot] !== player) {
                    app.showError($.langScript[laf]['noti_026']);
                } else {
                        
                    navigator.notification.confirm($.langScript[laf]['noti_023'], function (confirmed) {
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
                    }, 'Notice', [$.langScript[laf]['btn_cancel'], $.langScript[laf]['btn_maintain']]);
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
                    navigator.notification.confirm($.langScript[laf]['noti_051'], function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];
                           addPlayerProceed(player,salary,oldPlayer,requestSlot);
                       } else {
                           return false;
                       }
                    }, 'Notice', [$.langScript[laf]['btn_substitute'], $.langScript[laf]['btn_maintain']]);
                    
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
                    navigator.notification.confirm($.langScript[laf]['noti_050'], function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           var oldPlayer = playerSlot[requestSlot];

                            addPlayer4UpProceed(player, salary, oldPlayer, requestSlot);
                       }
                    }, 'Notice', [$.langScript[laf]['btn_substitute'], $.langScript[laf]['btn_maintain']]);
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
        
       
        /* 엔트리 수정 시 엔트리 슬롯 사전 저장 */ 
        var presetPlayer4up = function(slot) {
            
            $.each(slot, function(i,v){
                //console.log(i + " : " + v);
                entryData.push(v);
                playerSlot[i] = v;
            });
            
            console.log(playerSlot);
        }
        
        /* 엔트리 등록 처리하기 */   
        var setFinalEntry = function(contest,fee) {

            if(contest === "") {
                console.log("no contest");
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
                        app.showAlert($.langScript[laf]['noti_032'],"Notice");
                        uu_data.cash -= fee;
                        entryAmount = 0;
                        //app.ObjControl.reloadContest('#po_entry_registration','views/playListView.html?bar=' + currentContestType);
                        app.ObjControl.reloadContest('#po_entry_registration','views/playView.html?tab=m');
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
                        app.showAlert($.langScript[laf]['noti_033'],"Notice");
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
            app.showAlert($.langScript[laf]['noti_019'],"Notice");
        }
        
        var news = function() {
            app.showAlert($.langScript[laf]['noti_019'], "Notice");    
        }
        
        var overPlayer = function() {
            app.showAlert($.langScript[laf]['noti_088'], "Notice"); 
        }
        
        /* 슬롯 체크해서 샐러리 상태 변경 */
        function slotCheck() {
            console.log("Now Slot : " + requestSlot + " - " + playerSlot[requestSlot]);
            if(playerSlot[requestSlot] !== undefined) {
                if( playerSlot[requestSlot] !== "") {
                    $.each(playerOnLeague, function(i, v) {
                        if (parseInt(v.playerID) === parseInt(playerSlot[requestSlot])) {
                            
                            slotSalary = v.salary;
                            console.log(slotSalary);
                            return;
                        }
                    });
                } else {
                    slotSalary = 0;
                }
            } else {
                slotSalary = 0;
            }
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
                app.showAlert($.langScript[laf]['noti_022'], "Notice");
                return false;
            } else {
                return true;
            }
        }
        
        
        /* Modal Close */
        function closeModal(e)
        {
            var data = e.button.data();
            var element = $('#' + data.rel );
            playerGameLog = [];
            element.data("kendoMobileModalView").close();
            setPlayercard = 0;
        }
        
        /* Main Tabstrip */
        function tapStriper(e)
        {
            var data = e.button.data();
            
            switch(data.rel) {
                case "m-log":
                    changeTap.tapModalLog();
                    break;
                case "m-card":
                    changeTap.tapModalCard();
                    break;
                case "m-log2":
                    changeTap.tapModalLog2();
                    break;
                case "m-card2":
                    changeTap.tapModalCard2();
                    break;
            }
        }
        var changeTap = {
            tapInit: function()
            {
                app.mobileApp.showLoading();
            },
            tapModalLog: function() {
                var that = this;
                that.tapInit();
                
                
                if(typeof playerGameLog.seq !== 'undefined') {
                    console.log("complete");
                    that.tapComplete();
                } else {
                    console.log("recall " + setPlayercard);
                    if(setPlayercard) that.getGameLog(setPlayercard,$('#m_LOG'),$('#m_RECENT'));
                }
                                
                $('#m-tabstripGameRecord').addClass('ts');
                $('#m-tabstripCard').removeClass('ts');
                $('#m-playerCardRecord').removeClass('hide');
                $('#m-playerCardFeature').addClass('hide');
            },
            getGameLog: function(id, obj, obj2)
            {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"playerId":' + id + '}';
                var url = init_data.auth + "?callback=?";
                $.ajax({
                    url: url,
                    type: "GET",
                    async: true,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "getFieldPlayerInfo",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            
                            playerGameLog = response.data;
                            console.log(playerGameLog);
                            var htmlData = "";
                            if(playerGameLog.position === 8) {
                                htmlData = '<tr><th>MP</th><th>MIN</th><th>CS</th><th>SAV</th><th>GA</th><th>GAA</th></tr>' +
                                       '<tr><td>' + playerGameLog.MP + '</td><td>' + playerGameLog.MIN + '</td><td>' + playerGameLog.CS + '</td><td>' + playerGameLog.SAV + 
                                       '</td><td>' + playerGameLog.GA_GK + '</td><td>' + playerGameLog.GAA + '</td></tr>' +
                                       '<tr><th>TA</th><th>FC</th><th>YC</th><th>RC</th><th></th><th></th></tr>' +
                                       '<tr><td>' + playerGameLog.TA + '</td><td>' + playerGameLog.FC + '</td><td>' + playerGameLog.YC + '</td><td>' + playerGameLog.RC + '</td><td></td><td></td></tr>';
                            } else {
                                htmlData = '<tr><th>MP</th><th>MIN</th><th>G</th><th>GA</th><th>SHO(SOG)</th><th>PAS%</th></tr>' +
                                       '<tr><td>' + playerGameLog.MP + '</td><td>' + playerGameLog.MIN + '</td><td>' + playerGameLog.G + '</td><td>' + playerGameLog.GA + 
                                       '</td><td>' + playerGameLog.SHO + '</td><td>' + playerGameLog.PAS + '</td></tr>';
                                       '<tr><th>FC</th><th>YC</th><th>RC</th><th></th><th></th><th></th></tr>' +
                                       '<tr><td>' + playerGameLog.FC + '</td><td>' + playerGameLog.TC + '</td><td>' + playerGameLog.RC + '</td><td></td><td></td><td></td></tr>';
                            }

                            obj.html(htmlData);
                            
                            var htmlData2 = "";
                            obj2.empty();
                            $.each(playerGameLog.recentData, function(i, v) {
                                var dataTitle = that.timeFormat(v.startdate) + " VS " + v.vsTeamName;
                                if(playerGameLog.position === 8) {
                                    htmlData2 = '<tr><td colspan="11" class="likeH4">' + dataTitle + '</td></tr>' +
                                               '<tr><th>G</th><th>GA</th><th>SHO</th><th>CR</th><th>SAV</th><th>SAVPK</th><th>FC</th><th>FS</th><th>YC</th><th>RC</th></tr><tr>' +
                                               '<td>' + v.G + '</td><td>' + v.GA + '</td><td>' + v.SHO + '</td>' +
                                               '<td>' + v.CR + '</td><td>' + v.SAV + '</td><td>' + v.SAVPK + '</td><td>' + v.FC + '</td>' +
                                               '<td>' + v.FS + '</td><td>' + v.YC + '</td><td>' + v.RC + '</td></tr>';
                                } else {
                                    htmlData2 = '<tr><td colspan="11" class="likeH4">' + dataTitle + '</td></tr>' +
                                               '<tr><th>G</th><th>GA</th><th>SHO</th><th>CR</th><th>FC</th><th>FS</th><th>YC</th><th>RC</th></tr><tr>' +
                                               '<td>' + v.G + '</td><td>' + v.GA + '</td><td>' + v.SHO + '</td>' +
                                               '<td>' + v.CR + '</td><td>' + v.FC + '</td>' +
                                               '<td>' + v.FS + '</td><td>' + v.YC + '</td><td>' + v.RC + '</td></tr>';
                                }
                                obj2.append(htmlData2);
                            });
                            
                            that.tapComplete();
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error : " + JSON.stringify(e));
                    }
                });
            },
            timeFormat: function(t)
            {
                return t.substring(4,6) + "." + t.substring(6,8);
            },
            tapModalCard: function() {
                var that = this;
                that.tapInit();
                $('#m-tabstripGameRecord').removeClass('ts');
                $('#m-tabstripCard').addClass('ts');
                $('#m-playerCardRecord').addClass('hide');
                $('#m-playerCardFeature').removeClass('hide');
                that.tapComplete();
            },
            tapModalLog2: function() {
                var that = this;
                that.tapInit();
                if(typeof playerGameLog.seq !== 'undefined') {
                    that.tapComplete();
                } else {
                    if(setPlayercard) that.getGameLog(setPlayercard,$('#m2_LOG'),$('#m2_RECENT'));
                }
                $('#mu-tabstripGameRecord').addClass('ts');
                $('#mu-tabstripCard').removeClass('ts');
                $('#mu-playerCardRecord').removeClass('hide');
                $('#mu-playerCardFeature').addClass('hide');
            },
            tapModalCard2: function() {
                var that = this;
                that.tapInit();
                $('#mu-tabstripGameRecord').removeClass('ts');
                $('#mu-tabstripCard').addClass('ts');
                $('#mu-playerCardRecord').addClass('hide');
                $('#mu-playerCardFeature').removeClass('hide');
                that.tapComplete();
            },
            tapComplete: function() {
                $('.km-scroll-container').css('-webkit-transform','');
                setTimeout(function() {
                    app.mobileApp.hideLoading();
                }, 300);
            }
        };
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
            playerAddInfo: playerAddInfo,
            playerAddInfo2: playerAddInfo2,
            closeModaler:closeModal,
            loadMoreList: loadMoreList,
            sortPlayercard: sortPlayercard,
            sortPlayercard2: sortPlayercard2,
            tapStriper: tapStriper,
            addPlayercard: addPlayercard,
            addPlayercard2: addPlayercard2,
            loadMoreList2: loadMoreList2,
        };
    }());

    return playerProcess;
}());