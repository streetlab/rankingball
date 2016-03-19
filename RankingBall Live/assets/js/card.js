/**
 * Card Control view model
 */
var app = app || {};

app.Card = (function () {
    'use strict';
   
    var cardModel = (function () {

        var tapLast = "";
        var subTapLast = "ALL";
        var addTabLast = "FW";
        
        var myCardList = [];
        var filterData = [];
        var activateList = [];
        var cardPosition = 0;
        
        var nowActivate = "";
        var enhanceList = [];
        var composeList = 0;
        
        var paging = 1;
        var setPlayercard = 0;
        var setPlayercardClass = 0;
        var setPlayercardLevel = 0;
        
        var masterTemplate = "";
        var victimsTemplate = [];
        
        var sort_order = "desc";
        var sort_field = "salary";
        
        /* Page Init - Only First time */
        function init() {

        }
        
        /* Page Init - When Page display */
        function onShow()
        {
            observableView();
            myPlayerCards.init();
            
        }
      
        function langExchange() 
        {
            //console.log(laf);
            app.langExchange.exchangeLanguage(laf);    
        }
        
        /* Main Tabstrip */
        function tapStriper(e)
        {
            var data = e.button.data();
            if(tapLast === data.rel) return false;
            
            switch(data.rel) {
                case "CH":
                    changeTap.tapClubHouse();
                    break;
                case "SK":
                    changeTap.tapSkill();
                    break;
                case "m-log":
                    changeTap.tapModalLog();
                    break;
                case "m-card":
                    changeTap.tapModalCard();
                    break;
            }
            
            myPlayerCards.tapLast = data.rel;
        }
        
        /* Main Tabstrip - sub tab */
        function tapSubStriper(e)
        {
            var data = e.button.data();
            if(subTapLast === data.rel) return false;
            subTapLast = data.rel;
            myPlayerCards.resetCardList(subTapLast);
        }
        
        var changeTap = {
            tapInit: function()
            {
                app.mobileApp.showLoading();
            },
            tapClubHouse: function() {
                var that = this;
                that.tapInit();
                $('#tabstripClubHouse').addClass('ts');
                $('#tabstripSkills').removeClass('ts');
                $('.group_clubhouse').removeClass('hide');
                $('.group_skill').addClass('hide');
                that.tapComplete();
            },
            tapSkill: function() {
                var that = this;
                that.tapInit();
                $('#tabstripClubHouse').removeClass('ts');
                $('#tabstripSkills').addClass('ts');
                $('.group_clubhouse').addClass('hide');
                $('.group_skill').removeClass('hide');
                that.tapComplete();
            },
            tapModalLog: function() {
                var that = this;
                that.tapInit();
                $('#tabstripGameRecord').addClass('ts');
                $('#tabstripCard').removeClass('ts');
                $('#playerCardRecord').removeClass('hide');
                $('#playerCardFeature').addClass('hide');
                that.tapComplete();
            },
            tapModalCard: function() {
                var that = this;
                that.tapInit();
                $('#tabstripGameRecord').removeClass('ts');
                $('#tabstripCard').addClass('ts');
                $('#playerCardRecord').addClass('hide');
                $('#playerCardFeature').removeClass('hide');
                that.tapComplete();
            },
            tapComplete: function() {
                setTimeout(function() {
                    app.mobileApp.hideLoading();
                }, 300);
            }
        };
        
        var myPlayerCards = {
            init: function() {
                var that = this;
                app.mobileApp.showLoading();
                paging = 1;
                sort_field = "salary";
                sort_order = "desc";
                
                that.requestCardList();
            },
            requestCardList: function() {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"category":1}';
                var url = init_data.auth + "?callback=?";
                console.log(init_data);
                $.ajax({
                    url: url,
                    type: "GET",
                    async: true,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "getMemberInvenCard",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            myCardList = response.data;
                            //that.updateCardList();
                            that.resetCardList();
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error : " + JSON.stringify(e));
                    }
                });
            },
            resetCardList: function() {
                var that = this;
                app.mobileApp.showLoading();
                paging = 1;
                filterData = "";
                
                var count = JSLINQ(myCardList).Count();
                $('#playerCardNums').html(count);
                
                switch(subTapLast) {
                    case "ALL":
                        filterData = JSLINQ(myCardList).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "FW":
                        filterData = JSLINQ(myCardList).Where(function(item){ return item.position === 1 }).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "MF":
                        filterData = JSLINQ(myCardList).Where(function(item){ return item.position === 2 }).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "DF":
                        filterData = JSLINQ(myCardList).Where(function(item){ return item.position === 4 }).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "GK":
                        filterData = JSLINQ(myCardList).Where(function(item){ return item.position === 8 }).OrderByDescending(function(item){ return item.salary });
                        break;
                }
                                
                $('.card_tab_sub').removeClass('ts');
                $('#subTab-' + subTapLast).addClass('ts');
                
                var listview = $("#playercardList").data("kendoMobileListView");
                listview.scroller().reset();
                that.updateCardList();
                console.log(filterData);
            },
            sortCardList: function() {
                var that = this;
                switch(sort_field) {
                    case "posType":
                        if(sort_order === "asc") {
                            filterData = JSLINQ(filterData.items).OrderBy(function(item){ return item.posType });
                        } else {
                            filterData = JSLINQ(filterData.items).OrderByDescending(function(item){ return item.posType });
                        }
                        
                        break;
                    case "playerName":
                        if(sort_order === "asc") {
                            filterData = JSLINQ(filterData.items).OrderBy(function(item){ return item.playerName });
                        } else {
                            filterData = JSLINQ(filterData.items).OrderByDescending(function(item){ return item.playerName });
                        }
                        break;
                    case "fppg":
                        if(sort_order === "asc") {
                            filterData = JSLINQ(filterData.items).OrderBy(function(item){ return item.fppg });
                        } else {
                            filterData = JSLINQ(filterData.items).OrderByDescending(function(item){ return item.fppg });
                        }
                        break;
                    case "salary":
                        if(sort_order === "asc") {
                            filterData = JSLINQ(filterData.items).OrderBy(function(item){ return item.salary });
                        } else {
                            filterData = JSLINQ(filterData.items).OrderByDescending(function(item){ return item.salary });
                        }
                        break;
                }
                //console.log(filterData);
                var listview2 = $("#playercardList").data("kendoMobileListView");
                listview2.scroller().reset();
                that.updateCardList();
            },
            updateCardList: function() {
                var len = filterData.items.length;
                
                
                var dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function(options) {
                            var data = [];
                            var i = 0;
                            var max = (len > 9) ? 10 : len;
                            for (; i < max; i ++) {
                                data.push(filterData.items[i]);
                            }
                            options.success(data);
                        }
                    }
                });
                
                $("#playercardList").kendoMobileListView({
                    template: $("#playerCardListTemplate").html(),
                    dataSource: dataSource,
                    change: function() {
                        console.log("change");
                    }
                });
                
                if(len > 9) {
                    $('#playercardListMoreBnt').removeClass('hide');
                } else {
                    $('#playercardListMoreBnt').addClass('hide');
                }
                app.mobileApp.hideLoading();
            }
            
        }
        
        function playerListSort(e)
        {
            var data = e.button.data();
            
            console.log(data);
            
            var orderType = parseInt(data.val);
            var orderIco;
            
            $('.sortClass3').removeClass('sort-l');

            $('#popover-playcard span').removeClass( function(index, css) {
                return (css.match(/(^|\s)ic-\S+/g) || []).join(' ');
            }).addClass('ic-triangle-n');

            $('#sort-player-ico3').removeClass( function(index, css) {
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
                    $('#sort-player-label3').html($.langScript[laf]['label_position']);
                    $('#sort-player-ico3').addClass(orderIco);
                    $('#orderLabelPosition3').addClass('sort-l');
                    $('#orderByPosition3').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "posType";
                    break;
                case 2:
                    $('#sort-player-label3').html($.langScript[laf]['label_name']);
                    $('#sort-player-ico3').addClass(orderIco);
                    $('#orderLabelPlayer3').addClass('sort-l');                  
                    $('#orderByPlayer3').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "playerName";
                    break;
                case 3:
                    $('#sort-player-label3').html("FPPG");
                    $('#sort-player-ico3').addClass(orderIco);
                    $('#orderLabelFPPG3').addClass('sort-l');  
                    $('#orderByFPPG3').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "fppg";
                    break;
                case 4:
                    $('#sort-player-label3').html($.langScript[laf]['label_salary']);
                    $('#sort-player-ico3').addClass(orderIco);
                    $('#orderLabelSalary3').addClass('sort-l');
                    $('#orderBySalary3').attr('data-orderby',sort_order).find('span').removeClass('ic-triangle-s').addClass(orderIco);
                    sort_field = "salary";
                    break;
            }
            
            myPlayerCards.sortCardList();
        }
        
        function loadMoreList()
        {
            paging++;
            var dataRange = parseInt(filterData.items.length / 10);
            var max;
            if(paging > dataRange) {
                $('#playercardListMoreBnt').addClass('hide');
            } else if(paging === dataRange) {
                max = filterData.items.length;
            } else {
                max = paging * 10;
            }
            
            var i = (paging - 1) * 10;
            for (; i < max; i ++) {
                $("#playercardList").data("kendoMobileListView").append([filterData.items[i]]);
            }
            app.mobileApp.scroller().reset();
        }
        
        function playerCard(e)
        {
            var data = e.button.data();
            //app.mobileApp.showLoading();
            
            setPlayercard = parseInt(data.rel);
            enhanceList = [];
            composeList = 0;
            cardPosition = 0;
            
            var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === setPlayercard });
            var defFilter = JSLINQ(myCardList).Where(function(item){ return item.itemSeq !== setPlayercard });
            activateList = defFilter.items;
            $.each(info.items, function(i, v) {
                var emblem = "amblem__" + v.team;
                //var positionTag = v.posCode.slice(0,1);
                var stars = "";
                for(var i = 1;i<7;i++) {
                    stars += (i <= v.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }
                //var lv_bg = 'bordercolor_by_rating__' + v.cardLevel;
                setPlayercardClass = v.cardClass;
                setPlayercardLevel = v.cardLevel;
                //var dcSalary = parseInt(v.salary) * (1.0 - parseFloat(v.dcRatio));
                
                $('#cardAmblem').addClass(emblem);
                $('#player-info-team').html(v.teamName);
                $('#player-info-name').html('<span>+' + v.cardLevel + '</span> ' + v.playerName);
                $('#player-info-position').html(v.posCode);
                $('#player-info-number').html(v.shirt_number);
                $('#player-info-fppg').html(v.fppg);
                $('#player-info-salary').html('$' + numberFormat(v.salary));
                
                $('#playercard-star').html(stars);
                
                $('#playercard-effect').html(parseInt(v.dcRatio * 100) + "%");
                if(parseFloat(v.dcRatio) > 0) {
                    $('#playercard-old').html('$' + numberFormat(v.salary)).removeClass('hide');
                } else {
                    $('#playercard-old').addClass('hide');
                }
                $('#playercard-discount').html('$' + numberFormat(v.salary));
                
            });
                        
            $('#modalPlayerCard').data("kendoMobileModalView").open();
            
            var bodyHeight = $('#modalPlayerCard').find('.km-content').height();
            $('.card_box__body').css({'min-height':bodyHeight + 'px'});
            
        }
        
        function addSkill() {
            app.showAlert("Add-skill function is not available in free version.", "Notice");
        }
        
        /* Playercard =>> Enhance */
        function cardEnhance()
        {
            if(setPlayercard) {
                
                if(setPlayercardLevel === 5) {
                    app.showAlert("You can cannot enhance anymore because it has already reached maximum +5 enhancement.", "Notice");
                    return false;
                }
                
                addTabLast = "FW";
                nowActivate = "enhance";
                enhanceList = [];
                composeList = 0;
                cardPosition = 0;
                $('#selectedPlayercard').empty().addClass('hide');
                $('#masterPlayercardBtn').removeClass('hide');
                //$('.inner_feedingcard').empty();
                $('.inner_feedingcard').empty().addClass('hide');
                $('.feeding_box_inner').removeClass('hide');
                $('.ehance_rate').html('0%');
                
                var ratio = 1.5;
                $('#modalPlayerCardEnhance').data("kendoMobileModalView").open();
                
                var w = $('#masterPlayercard').width();
                $('#masterPlayercard').css({'height': w * ratio +'px','margin-top':'15%'});
                var ws = $('#feedingPlayercard0').width();
                $('.feeding_box').css({'height': ws * ratio +'px'});
                
                //$('.card_pack_activate').css({'width': + 'px','height': + 'px'});
                
                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === setPlayercard });
                var card = info.items[0];
                
                console.log(card);
                
                var pack = (card.cardClass === 6) ? 'gold_pack' : '';
                var emblem = "amblem__" + card.team;
                var purchaseItems = '<div class="card_pack_activate"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + card.cardLevel + '</div>' +
                    '<div class="playercard__no">' + card.shirt_number + '</div></div><div class="playercard_name">' + card.playerName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">';
                for(var i = 1;i<7;i++) {
                    purchaseItems += (i <= card.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }
                
                purchaseItems += '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_' + card.cardLevel + '"><div class="card_pack_pattern"></div></div></div></div>';
                
                $('#selectedPlayercard').append(purchaseItems).removeClass('hide');
                $('#masterPlayercardBtn').addClass('hide');
                
            }
        }
        /* Playercard =>> Compose */
        function cardCompose()
        {
            if(setPlayercard) {
                
                if(setPlayercardClass === 6) {
                    app.showAlert("Your Player Card are max star grade", "Notice");
                    return false;
                } else {
                    if(setPlayercardLevel < 5) {
                        app.showAlert("You can compose onl with the same star grade and maximum enhanced(+5) cards together.", "Notice");
                        return false;
                    }
                }
                
                
                addTabLast = "FW";
                nowActivate = "compose";
                composeList = 0;
                
                var ratio = 1.5;
                $('#modalPlayerCardCompose').data("kendoMobileModalView").open();
                
                var ws = $('#composeMasterPlayercard').width();
                $('.compose_ins_box').css({'height': ws * ratio +'px'});
                
                $('#selectedComposePlayercard').empty().addClass('hide');
                $('#composePlayercardBtn').removeClass('hide');
                
                $('#selectedComposeVictim').empty().addClass('hide');
                $('#composeVictimBtn').removeClass('hide');
                
                $('.inner_feedingcard').empty().addClass('hide');
                $('.feeding_box_inner').removeClass('hide');
                
                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === setPlayercard });
                var card = info.items[0];
                
                var pack = (card.cardClass === 6) ? 'gold_pack' : '';
                var emblem = "amblem__" + card.team;
                var purchaseItems = '<div class="card_pack_activate"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + card.cardLevel + '</div>' +
                    '<div class="playercard__no">' + card.shirt_number + '</div></div><div class="playercard_name">' + card.playerName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">';
                for(var i = 1;i<7;i++) {
                    purchaseItems += (i <= card.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }
                
                purchaseItems += '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_' + card.cardLevel + '"><div class="card_pack_pattern"></div></div></div></div>';
                
                $('#selectedComposePlayercard').append(purchaseItems).removeClass('hide');
                $('#composePlayercardBtn').addClass('hide');
            }
        }
        
        /* Modal Tabstrip */
        function modalTabstrip(e)
        {
            var data = e.button.data();            
            if(addTabLast === data.rel) return false;
            
            addTabLast = data.rel;
            addCardList.filterList();
        }
        
        /* Enhance => Add Playercard */
        function enhanceAddBtn(e)
        {
            var data = e.button.data();
            cardPosition = parseInt(data.rel);
            
            $('#modalPlayerCardList').data("kendoMobileModalView").open();
            
            addCardList.filterList(cardPosition);
        }
        /* Compose => Add Playercard */
        function composeAddBtn()
        {
            $('#modalPlayerCardList').data("kendoMobileModalView").open();            
            addCardList.filterList();
        }
        
        /* Playercard List for Insert Victim slot */
        var addCardList = {
            
            filterList: function() {
                
                var that = this;
                app.mobileApp.showLoading();
                var data = "";
                switch(addTabLast) {
                    case "FW":
                        data = JSLINQ(activateList).Where(function(item){ return item.position === 1 }).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "MF":
                        data = JSLINQ(activateList).Where(function(item){ return item.position === 2 }).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "DF":
                        data = JSLINQ(activateList).Where(function(item){ return item.position === 4 }).OrderByDescending(function(item){ return item.salary });
                        break;
                    case "GK":
                        data = JSLINQ(activateList).Where(function(item){ return item.position === 8 }).OrderByDescending(function(item){ return item.salary });
                        break;
                }
                                
                $('.card_tab_added').removeClass('ts');
                $('#modalTab-' + addTabLast).addClass('ts');
                that.updateList(data);
            },
            updateList: function(listData) {
                /*
                var dataSource = new kendo.data.DataSource({
                    data: listData.items
                });
                */
                playerCardSource.data(listData.items);
                
               setTimeout(function() {
                    app.mobileApp.hideLoading();
                }, 300);
            }
        };
        
        var playerCardSource = new kendo.data.DataSource();
        /*
        //var dataSource;
        $("#addPlayercardList").kendoMobileListView({
            dataSource: dataSource,
            template: $("#addPlayerCardListTemplate").html()
        });
        */
        /* Playercard => Select playercard to victim slot */
        function addOnVictim(e) {
            var data = e.button.data();
            victimProceed.init(parseInt(data.rel));
        }
        var victimProceed = {
            init: function(card) {
                var that = this;
                if(nowActivate === "enhance") {
                    console.log("card slot : " + cardPosition);
                    enhanceList[cardPosition] = card;
                    console.log(enhanceList);
                    that.insertCard(card);
                } else {
                    composeList = card;
                    that.insertComposeCard(card);
                }
            },
            insertCard: function(card) {
                var that = this;
                var cardSlot = $('#selectedPlayercard' + cardPosition);
                var dispBtn = $('#victimsPlayercardBtn' + cardPosition);
                
                //$('.card_pack_activate').css({'width': + 'px','height': + 'px'});

                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === card });

                var pack = (info.items[0].cardClass === 6) ? 'gold_pack' : '';
                var emblem = "amblem__" + info.items[0].team;
                var purchaseItems = '<div class="card_pack_victim"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + info.items[0].cardLevel + '</div>' +
                    '<div class="playercard__no">' + info.items[0].shirt_number + '</div></div><div class="playercard_name">' + info.items[0].playerName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">';
                for(var i = 1;i<7;i++) {
                    purchaseItems += (i <= info.items[0].cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }

                purchaseItems += '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_' + info.items[0].cardLevel + '"><div class="card_pack_pattern"></div></div></div></div>';
                
                that.enhanceRate(info.items[0].cardClass);
                
                
                var addSolotItem = '<a id="slotBtn' + cardPosition + '" data-rel="' + card + '" data-ral="' + cardPosition + '">' + purchaseItems + '</a>';
                cardSlot.html(addSolotItem).removeClass('hide');
                $('#slotBtn' + cardPosition).kendoMobileButton({click: function(event) {app.Card.enhanceRemoveBtn(event); return false; }});
                
                //cardSlot.append(purchaseItems).attr('data-re    l',card).removeClass('hide');
                //$('#slotBtn' + cardPosition).append(purchaseItems).attr('data-rel',card);
                dispBtn.addClass('hide');
                
                var defFilter = JSLINQ(activateList).Where(function(item){ return item.itemSeq !== card });
                activateList = defFilter.items;
                
                $('#modalPlayerCardList').data("kendoMobileModalView").close();
            },
            insertComposeCard: function(card) {

                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === card });
                if(info.items[0].cardClass !== setPlayercardClass) {
                    app.showAlert("You can compose onl with the same star grade and maximum enhanced(+5) cards together.", "Notice");
                    return false;
                }
                
                if(info.items[0].cardLevel < 5) {
                    app.showAlert("You can compose onl with the same star grade and maximum enhanced(+5) cards together.", "Notice");
                    return false;
                }
                
                
                var pack = (info.items[0].cardClass === 6) ? 'gold_pack' : '';
                var emblem = "amblem__" + info.items[0].team;
                var purchaseItems = '<div class="card_pack_activate"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + info.items[0].cardLevel + '</div>' +
                    '<div class="playercard__no">' + info.items[0].shirt_number + '</div></div><div class="playercard_name">' + info.items[0].playerName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">';
                for(var i = 1;i<7;i++) {
                    purchaseItems += (i <= info.items[0].cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }

                purchaseItems += '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_' + info.items[0].cardLevel + '"><div class="card_pack_pattern"></div></div></div></div>';

                $('#selectedComposeVictim').append(purchaseItems).removeClass('hide');
                $('#composeVictimBtn').addClass('hide');
                
                var defFilter = JSLINQ(activateList).Where(function(item){ return item.itemSeq !== card });
                activateList = defFilter.items;
                $('#modalPlayerCardList').data("kendoMobileModalView").close();
            },
            enhanceRate: function(victimClass)
            {
                var rate = 0;
                var classDiff = setPlayercardClass - victimClass;
                switch(classDiff) {
                    case 0:
                        rate = 100;
                        break;
                    case 1:
                        rate = 50;
                        break;
                    case 2:
                        rate = 25;
                        break;
                    case 3:
                        rate = 10;
                        break;
                    case 4:
                        rate = 1;
                        break;
                    case 5:
                        rate = 0;
                        break;
                    default:
                        rate = 100;
                }
                
                $('#enhanceCard' + cardPosition).html(rate + '%');
            }
        };
        
        
        /* Remove to Slot */
        function enhanceRemoveBtn(e)
        {
            var data = e.button.data();
            var card = data.rel;
            var slot = data.ral;
            
            var defFilter = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === card });

            activateList.push(defFilter.items[0]);

            var arr_index = enhanceList.indexOf(card);                
            if( arr_index >= 0 ) {
               enhanceList.splice(arr_index, 1);
            }
            
            console.log(enhanceList);
            $('#selectedPlayercard' + slot).addClass('hide');
            $('#victimsPlayercardBtn' + slot).removeClass('hide');
        }
        
        
        /* Do It! Enhance */
        function activeEnhance()
        {
            if(enhanceList.length > 0) {
                navigator.notification.confirm('Are you sure you want to proceed enhancement? Material cards will disappear.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        activateWithVictims.reqEnhanceProceed();                        
                    }
                }, 'Notice', ['Enhance','Cancel']);
            } else {
                app.showAlert("No card was found to enhance.", "Notice");
            }
        }
        /* Do It! Compose */
        function activeCompose()
        {
            if(composeList > 0) {
                navigator.notification.confirm('Are you sure you want to proceed composition? Material cards will disappear.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        activateWithVictims.reqComposeProceed();
                    }
                }, 'Notice', ['Compose','Cancel']);
            } else {
                app.showAlert("No card was found to compose.", "Notice");
            }
        }
        function moveSprite() {
            var ratio = 1.6510;
            var wh = $(window).height();
            $('.card_enhanced').css({'height':wh});
            var count = 0;
            var numImgs = 10;
            var img = $('#effect_bg');
            img.css('height',wh);
            var iw = wh * ratio;
            
            $('#enhanceEffect').removeClass('hide');
            var animation = setInterval(function() {
                img.css('margin-left', -1 * (count*iw));
                console.log( count + " : " + iw + " : " + (-1 * (count*iw)) );
                count++;
                if(count === numImgs) {
                    clearInterval(animation);
                }
            },5000);
            
            //$('.card_enhanced').css({'width':$(window).width(),'height':$(window).height()});
            //$('.background_effect').css({'width':$(window).width(),'height':$(window).height()});
        }
        
        var enhanceProceedVar = "";
        
        function cleanArray(actual) {
            var newArray = new Array();
            for(var i=0; i < actual.length; i++) {
                if(actual[i]) {
                    this.splice(i, 1);
                    i--;
                }
                i--;
            }
            return this;
        }
        
        var activateWithVictims = {
            reqEnhanceProceed: function() {
                var that = this;
                
                if(!setPlayercard) return false;
                
                $('#cardPackPos').html('');
                
                var enhanceArray = [];
                for(var i=0; i < enhanceList.length; i++) {
                    if(enhanceList[i]) enhanceArray.push(enhanceList[i]);
                }
                
                var ehnaceData = enhanceArray.join(',');

                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"itemMain":' + setPlayercard + ',"itemSub":"' + ehnaceData + '"}';
                var url = init_data.auth + "?callback=?";
                console.log(param);
                //app.mobileApp.showLoading();
                
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "procItemStrengthen",
                        "param":param
                    },
                    success: function(response) {
                        console.log(response);
                        if (response.code === 0) {
                            var data = response.data;
                            that.enhanceDramatic(data);
                        } else {
                            
                        }
                        //that.reloadCardList();
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    }
                });
            },
            reqComposeProceed: function() {
                var that = this;
                
                if(!setPlayercard) return false;
                if(!composeList) return false;
                
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"itemMain":' + setPlayercard + ',"itemSub":"' + composeList + '"}';
                var url = init_data.auth + "?callback=?";
                
                //app.mobileApp.showLoading();
                
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "procItemCompose",
                        "param":param
                    },
                    success: function(response) {
                        console.log(response);
                        if (response.code === 0) {
                            var data = response.data;
                            setPlayercard = data.itemSeq;
                            that.composeDramatic(data);
                        } else {
                            
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    }
                });
            },
            enhanceDramatic: function(data) {
                var that = this;
                
                $('#cardPackEffectStr').css({'display':'none'});
                $('#cardPackEffect').css({'display':'none'});
                $('#cardPackPos').css({'display':'none'});
                $('#cardPackrResult').css({'display':'none'});
                $('#activateConfirmBox').addClass('hide');
                $('#modal_enhanceDramatic').data("kendoMobileModalView").open();
                
                setTimeout(function() {
                    //app.mobileApp.hideLoading();
                    that.cardGenerateEnhance(data);
                },300);
            },
            cardGenerateEnhance: function(data) {
                var that = this;
                var purchaseItems = "";
                var pack = "";
                var emblem = "";
                var successEnhance = 0;
                var masterStar = "";

                $('.card_dramatic_box').css({'height': $(window).height() + 'px'});

                var subResult = "";
                $('#cardPackrResult').html('');
                $.each(data, function(i, v) {
                    console.log(v.resultValue);
                    if(v.resultValue === 1) {
                        successEnhance += 1;
                        subResult = "success";
                    } else {
                        subResult = "failure";
                    }
                    
                    var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === v.itemSub });
                    var subCard = info.items[0];
                    var subpack = (subCard.cardClass === 6) ? 'gold_pack' : '';
                    
                    
                    var template = '<div class="card_pack_cols ' + subResult + '"><div class="card_pack_activate"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard2"><div class="playercard__lv">+' + subCard.cardLevel + '</div>' +
                        '<div class="playercard__no">' + subCard.shirt_number + '</div></div><div class="playercard_name">' + subCard.playerName + '</div></div><div class="card_pack__husks ' + subpack + '"></div>' +
                        '<div class="card_pack__stat"><div class="playercard__grade2">';
                    for(var i = 1;i<7;i++) {
                        template += (i <= subCard.cardClass) ? '<span class="sub_star star-on">*</span>' : '<span class="sub_star">*</span>';
                    }
                    
                    template += '</div><div class="playercard__emblem amblem__' + subCard.team + '"></div></div><div class="card_pack__back card_grade_' + subCard.cardClass + '"><div class="card_pack_pattern"></div></div></div></div><div class="res_str">' + subResult + '</div></div>';
                    $('#cardPackrResult').append(template);
                });
                
                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === setPlayercard });
                var mainCard = info.items[0];
                console.log(mainCard);
                pack = (mainCard.cardClass === 6) ? 'gold_pack' : '';
                
                //successEnhance += mainCard.cardLevel;
                emblem = "amblem__" + mainCard.team;
                
                for(var i = 1;i<7;i++) {
                    masterStar += (i <= mainCard.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }
                                
                masterTemplate = '<div class="card_pack"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + (successEnhance + mainCard.cardLevel) + '</div>' +
                    '<div class="playercard__no">' + mainCard.shirt_number + '</div></div><div class="playercard_name">' + mainCard.playerName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">' + masterStar + '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_' + mainCard.cardClass + '"><div class="card_pack_pattern"></div></div></div></div>';                        
                
                $('#cardPackPos').html(masterTemplate);
                
                
                $('#cardPackEffect').fadeIn(500, function() {
                    
                    setTimeout(function() {
                        $('#cardPackEffect').fadeOut(1000);
                        $('#cardPackrResult').fadeIn(1000, function() {
                            $('#cardPackPos').fadeIn(1000);
                            that.ehanceStatusMessage(successEnhance);
                            $('#activateConfirmBox').removeClass('hide');
                        });
                        
                    }, 1000);
                });
            },
            ehanceProceed: function(victim, result, lv, len)
            {
                var that = this;
                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === victim });
                var subCard = info.items[0];
                var subpack = (subCard.cardClass === 6) ? 'gold_pack' : '';
                var template = '<div class="card_pack"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + subCard.cardLevel + '</div>' +
                    '<div class="playercard__no">' + subCard.shirt_number + '</div></div><div class="playercard_name">' + subCard.playerName + '</div></div><div class="card_pack__husks ' + subpack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">';
                for(var i = 1;i<7;i++) {
                    template += (i <= subCard.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }
                
                template += '</div><div class="playercard__emblem amblem__' + subCard.team + '"></div></div><div class="card_pack__back card_grade_' + subCard.cardClass + '"><div class="card_pack_pattern"></div></div></div></div>';
                
                $('#cardPackPos').fadeOut(1500, function() {
                    that.ehanceStatusMessage("Material");
                    $('#cardPackPos').html(template).fadeIn(1500, function() {
                        setTimeout(function() {    
                            $('#cardPackPos').fadeOut(1500);
                            
                            that.ehanceStatusMessage("Enhancement..");
                            $('#cardPackEffect').fadeIn(1500,function() {
                                setTimeout(function() {
                                    $('#cardPackEffect').fadeOut(1500);
                                    var resultStr = (result === 1) ? "Ehancement Success" : "Ehancement Failure";
                                    that.ehanceStatusMessage(resultStr);
                                    $('#cardPackPos').html(masterTemplate).fadeIn(1500, function() {
                                        console.log(lv, len);
                                        if(parseInt(lv) === parseInt(len - 1)) { $('#activateConfirmBox').removeClass('hide'); }
                                    });
                                }, 3000);
                            });
                            //$('#modal_purchaseEffect').data("kendoMobileModalView").open();
                        },2000);
                    });
                });
                
                
            },
            ehanceStatusMessage: function(bool)
            {
                if(bool > 0) {
                    $('#ehanceResultSubject').removeClass('do_failure').addClass('do_success');
                } else {
                    $('#ehanceResultSubject').removeClass('do_success').addClass('do_failure');
                }
                $('#cardPackEffectStr').fadeIn(100);
            },
            composeDramatic: function(data) {
                var that = this;
                
                $('#cardPackEffectStr2Compose').css({'display':'none'});
                $('#cardPackEffect2Compose').css({'display':'none'});
                $('#cardPackPos2Compose').css({'display':'none'});
                $('#activateConfirmBox2Compose').addClass('hide');
                $('#modal_composeDramatic').data("kendoMobileModalView").open();
                
                setTimeout(function() {
                    //app.mobileApp.hideLoading();
                    that.cardGenerateCompose(data);
                },300);
            },
            cardGenerateCompose: function(data) {
                var pack = "";
                var emblem = "";
                var successEnhance = 0;
                var masterStar = "";
                $('.card_dramatic_box').css({'height': $(window).height() + 'px'});

                pack = (data.cardClass === 6) ? 'gold_pack' : '';
                
                successEnhance += data.cardLevel;
                emblem = "amblem__" + data.team;
                
                for(var i = 1;i<7;i++) {
                    masterStar += (i <= data.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                }
                                
                masterTemplate = '<div class="card_pack"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+' + data.cardLevel + '</div>' +
                    '<div class="playercard__no">' + data.shirt_number + '</div></div><div class="playercard_name">' + data.playerName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                    '<div class="card_pack__stat"><div class="playercard__grade">' + masterStar + '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_' + data.cardClass + '"><div class="card_pack_pattern"></div></div></div></div>';                        
                
                $('#cardPackPos2Compose').html(masterTemplate);
                
                
                $('#cardPackEffect2Compose').fadeIn(500, function() {
                    
                    setTimeout(function() {

                        $('#cardPackEffect2Compose').fadeOut(1000);
                        $('#cardPackPos2Compose').fadeIn(1000, function() {
                            $('#cardPackEffectStr2Compose').fadeIn(100);
                            $('#activateConfirmBox2Compose').removeClass('hide');
                        });
                        
                    }, 1000);
                });
            }
        };
        
        function restoreCard(e)
        {
            var data = e.button.data();
            completeAtivage.reloadCardList(data.rel);
        }
        var completeAtivage = {
            reloadCardList: function(modal) {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"category":1}';
                var url = init_data.auth + "?callback=?";
                console.log(init_data);
                $.ajax({
                    url: url,
                    type: "GET",
                    async: true,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "getMemberInvenCard",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            myCardList = response.data;
                            that.resetCard(modal);
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error : " + JSON.stringify(e));
                    }
                });
            },
            resetCard: function(modal) {
                enhanceList = [];
                composeList = 0;
                cardPosition = 0;
                
                var info = JSLINQ(myCardList).Where(function(item){ return item.itemSeq === setPlayercard });
                var defFilter = JSLINQ(myCardList).Where(function(item){ return item.itemSeq !== setPlayercard });
                activateList = defFilter.items;
                $.each(info.items, function(i, v) {
                    var emblem = "amblem__" + v.team;
                    //var positionTag = v.posCode.slice(0,1);
                    var stars = "";
                    for(var i = 1;i<7;i++) {
                        stars += (i <= v.cardClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                    }
                    console.log(v.cardClass);
                    console.log(stars);
                    //var lv_bg = 'bordercolor_by_rating__' + v.cardLevel;
                    setPlayercardClass = v.cardClass;
                    setPlayercardLevel = v.cardLevel;
                    var dcSalary = parseInt(v.salary) * (1.0 - parseFloat(v.dcRatio));
                    
                    $('#cardAmblem').addClass(emblem);
                    $('#player-info-team').html(v.teamName);
                    //$('#player-info-name').html(v.playerName);
                    $('#player-info-name').html('<span>+' + v.cardLevel + '</span> ' + v.playerName);
                    $('#player-info-position').html(v.posCode);
                    $('#player-info-number').html(v.shirt_number);
                    $('#player-info-fppg').html(v.fppg);
                    $('#player-info-salary').html('$' + numberFormat(dcSalary));
                    
                    $('#playercard-star').html(stars);
                    
                    $('#playercard-effect').html(parseInt(v.dcRatio * 100) + "%");
                    if(parseFloat(v.dcRatio) > 0) {
                        $('#playercard-old').html('$' + numberFormat(v.salary)).removeClass('hide');
                    } else {
                        $('#playercard-old').addClass('hide');
                    }
                    $('#playercard-discount').html('$' + numberFormat(dcSalary));
                    
                });
                
                myPlayerCards.resetCardList();
                console.log(modal);
                 $('#modal_' + modal).data("kendoMobileModalView").close();
                if(modal === "enhanceDramatic") {
                    $('#modalPlayerCardEnhance').data("kendoMobileModalView").close();
                } else {
                    $('#modalPlayerCardCompose').data("kendoMobileModalView").close();
                }
                

            }
        }
        
        function closeModaler()
        {
            activateList = [];
            setPlayercard = 0;
            setPlayercardClass = 0;
            setPlayercardLevel = 0;
            $('#modalPlayerCard').data("kendoMobileModalView").close();
        }
        
        function closeMisc(e)
        {
            var data = e.button.data();
            
            if(data.dp === "player") {
                console.log(data.dp);
                var defFilter = JSLINQ(myCardList).Where(function(item){ return item.itemSeq !== setPlayercard });
                activateList = defFilter.items;
            }
            $('#' + data.rel).data("kendoMobileModalView").close();
        }
        
        return {
            init: init,
            onShow: onShow,
            langExchange: langExchange,
            tapStriper: tapStriper,
            tapSubStriper: tapSubStriper,
            playerListSort:playerListSort,
            playerCard: playerCard,
            loadMoreList: loadMoreList,
            addSkill: addSkill,
            cardEnhance: cardEnhance,
            cardCompose: cardCompose,
            closeModaler: closeModaler,
            closeMisc: closeMisc,
            enhanceAddBtn: enhanceAddBtn,
            composeAddBtn: composeAddBtn,
            modalTabstrip: modalTabstrip,
            addOnVictim: addOnVictim,
            activeEnhance: activeEnhance,
            activeCompose: activeCompose,
            restoreCard: restoreCard,
            enhanceRemoveBtn: enhanceRemoveBtn,
            playerCardSource: playerCardSource
        };
    }());

    return cardModel;
}());