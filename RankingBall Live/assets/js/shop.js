/**
 * Shop
 */
var app = app || {};

app.Shop = (function () {
    'use strict';
    
    var shopProcess = (function () {        
        
        var storePackageData = new Array();
        storePackageData['pack'] = [];
        storePackageData['card'] = [];
        storePackageData['skill'] = [];
        storePackageData['opt'] = [];
        storePackageData['reco'] = [];
        
        var goodsCode = "";
        var goodsBundle = 0;
        var goodsPrice = 0;
        var goodsType = 0;
        var goodsCategory = 0;
        
        var swiper;
        var swipe_num = 0;
        var swipe_position = 0;

        
        function init() 
        {
            observableView();
            var deviceHeight = parseInt($(window).height());
            var dHeight = deviceHeight - 178;
            
            $('#shopMainBox').height(dHeight);
            setShopBanner();
            goodsInStore.goodsData();
        }
        
        function setShopBanner()
        {
            $('<img/>').attr('src', 'http://scv.rankingball.com/asset/contents/banner/banner.png').load(function() {
                $(this).remove();
                $('#shopBanner').css('background-image', 'url(http://scv.rankingball.com/asset/contents/banner/banner.png)');
            });
        }
        
        function backToMenu()
        {
            app.mobileApp.navigate('views/landing2Vu.html', 'slide');
        }
        
        function createList()
        {
        }
        
        
        function initRegen()
        {
            
        }
        
        var goodsInStore = {
            goodsData: function() {
                var that = this;
                var category = 0;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"category":' + category + '}';
                var url = init_data.auth + "?callback=?";
                
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.product",
                        "id": "getStoreProductList",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            console.log(response.data);
                            $.each(response.data, function(i, data) {
                                if(data.category === 1) {
                                    storePackageData['pack'].push(data);
                                    
                                } else if(data.category === 2) {
                                    storePackageData['card'].push(data);
                                } else if(data.category === 3) {
                                    storePackageData['skill'].push(data);
                                } else if(data.category === 4) {
                                    storePackageData['opt'].push(data);
                                }
                                
                                if(data.recommend === 1) {
                                    storePackageData['reco'].push(data);
                                }
                            });
                            
                            that.appendPackageList();
                        }
                    },
                    error: function(e) {
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                        app.mobileApp.hideLoading();
                    }
                });
            },
            appendPackageList: function()
            {
                $("#shopItems").kendoMobileListView({
                    dataSource: storePackageData['reco'],
                    template: $("#goodsListTemplate").html()
                });
            }
        };
               
        function initPurchase()
        {
            var dHeight = parseInt($(window).height()) - 78;
            $('.shop_pak').height(dHeight); 
            if (window.navigator.simulator === true) {
            } else {
                // Enable maximum logging level
                store.verbosity = store.INFO;

                // Inform the store of your products
                         
                store.register({
                                   id:    'com.streetlab.cash5000',
                                   alias: "cash5000",
                                   type:   store.CONSUMABLE
                               });
                
                store.register({
                                   id:    "com.streetlab.cash10000",
                                   alias: "cash10000",
                                   type:   store.CONSUMABLE
                               });                
              
                store.register({
                                   id:    'com.streetlab.cash20000',
                                   alias: 'cash20000',
                                   type:   store.CONSUMABLE
                               });
                
                store.register({
                                   id:    'com.streetlab.cash30000',
                                   alias: 'cash30000',
                                   type:   store.CONSUMABLE
                               });      

                store.register({
                                   id:    'com.streetlab.cash50000',
                                   alias: 'cash50000',
                                   type:   store.CONSUMABLE
                               });      

                // When any product gets updated, refresh the HTML
                store.when("product").updated(function (p) {
                    if (!p.loaded) {
                        console.log("load failed");
                    } else if (!p.valid) {
                        console.log("invalid : " + p.alias);
                    } else if (p.valid) {
                    }
                });

                // When purchase of 100 coins is approved, show an alert
                store.when("cash5000").approved(function (order) {
                    console.log(order.alias + 'approved!');
                    order.finish();
                    console.log(JSON.stringify(order));
                    purchaseAlert('com.streetlab.cash5000', order.transaction);
                });
                
                store.when("cash5000").finished(function (order) {
                    console.log(order.alias + 'finished!');
                });
                
                store.when("cash5000").cancelled(function (order) {
                    console.log(order.alias + 'cancelled!');
                });
                
                store.when("cash10000").approved(function (order) {
                    console.log(order.alias + 'approved!');                     
                    order.finish();
                    purchaseAlert('com.streetlab.cash10000', order.transaction);
                });
                
                store.when("cash10000").finished(function (order) {
                    console.log(order.alias + 'finished!');
                });
                
                store.when("cash10000").cancelled(function (order) {
                    console.log(order.alias + 'cancelled!');
                });
                
                store.when("cash20000").approved(function (order) {
                    console.log(order.alias + 'approved!');                     
                    order.finish();
                    purchaseAlert('com.streetlab.cash20000', order.transaction);
                });
                
                store.when("cash20000").finished(function (order) {
                    console.log(order.alias + 'finished!');
                    order.finish();
                });
                
                store.when("cash20000").cancelled(function (order) {
                    console.log(order.alias + 'cancelled!');
                });
                
                store.when("cash30000").approved(function (order) {
                    console.log(order.alias + 'approved!');                    
                    order.finish();
                    purchaseAlert('com.streetlab.cash30000', order.transaction);
                });
                
                store.when("cash30000").finished(function (order) {
                    console.log(order.alias + 'finished!');
                });
                
                store.when("cash30000").cancelled(function (order) {
                    console.log(order.alias + 'cancelled!');
                });
                
                store.when("cash50000").approved(function (order) {
                    console.log(order.alias + 'approved!');                    
                    order.finish();
                    purchaseAlert('com.streetlab.cash50000', order.transaction);
                });
                store.when("cash50000").finished(function (order) {
                    console.log(order.alias + 'finished!');
                });
                
                store.when("cash50000").cancelled(function (order) {
                    console.log(order.alias + 'cancelled!');
                });
                //store.when("루비100개").verified(function (order) {
                //                                  alert(order.alias + 'verified!');
                //                                  order.finish();
                //                                });
                
                //store.when("루비100개").unverified(function (order) {
                //                                  alert(order.alias + 'unverified!');
                //                                });
                
                // When the store is ready all products are loaded and in their "final" state.
                // Note that the "ready" function will be called immediately if the store is already ready.
                // When the store is ready, activate the "refresh" button;
                store.ready(function() {
                    console.log("The store is ready");
                    //alert("store is ready");
                });

                // Refresh the store.
                // This will contact the server to check all registered products validity and ownership status.
                // It's fine to do this only at application startup, as it could be pretty expensive.
                store.refresh();
                
                // Deal with errors
                store.error(function(error) {
                    alert('ERROR ' + error.code + ': ' + error.message);
                });
            }      
        }
        
        function showCategory(e)
        {
            observableView();
            pageHeader.parseParam(e);
        }
        
        function showPurchase(e)
        {
            observableView();
            var param = e.view.params;
            console.log(param);
            goodsBundle = 0;
            goodsCategory = parseInt(param.category);
            goodsDetail.parseParam(parseInt(param.pid), goodsCategory);
        }
        
        var goodsDetail = {
            parseParam: function(id) {
                var that = this;
                switch(goodsCategory) {
                    case 1:
                        that.parseMeta($.grep(storePackageData['pack'], function(a){ return a.productFK === id; }));
                        break;
                    case 2:
                        that.parseMeta($.grep(storePackageData['card'], function(a){ return a.productFK === id; }));
                        break;
                    case 3:
                        that.parseMeta($.grep(storePackageData['skill'], function(a){ return a.productFK === id; }));
                        break;
                    case 4:
                        that.parseMeta($.grep(storePackageData['opt'], function(a){ return a.productFK === id; }));
                        break;
                }         
            },
            parseMeta: function(data) {
                $('#goodsOptions').empty();
                if(data) {
                    var imgSrc = init_data.path + data[0].path + data[0].image;

                    $('#goodsImg').attr('src',imgSrc);
                    $('.goods_title').html(data[0].productName);
                    $('#goodsPrice').html(data[0].priceDesc);
                    $('#goodsDesc').html(data[0].productDesc);
                    if(data[0].component !== undefined) {
                        $.each(data[0].component, function(i, v) {
                            $('#goodsOptions').append('<li>' + v.componentName + '</li>');
                        });
                    }
                    
                    goodsCode = data[0].productCode;
                    //goodsBundle = data[0].bundle;
                    goodsPrice = parseInt(data[0].price);
                    goodsType = data[0].itemType;
                }
            }
        };
        
        function purchasGoods()
        {
            if(goodsCode === "") {
                console.log("None Product code");
                return false;
            }
            
            if(goodsType === 2 || goodsType === 6 || goodsType === 8) {
/*            
            navigator.notification.confirm('Do you want to buy these products?', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                    productPurchaseProcess.requestPurchase(goodsCode);
                }
            }, 'Notice', 'Cancel', 'Purchase');
*/
                if(uu_data.cash >= goodsPrice) {
                    productPurchaseProcess.requestPurchase(goodsCode);
                    //productPurchaseProcess.purchaseSuccess(sampleData);
                    //productPurchaseProcess.purchaseGuide(1);
                } else {
                    app.showAlert("You don't have enough gold to purchase.","Notice");
                }
            } else {
                app.showAlert("This item cannot be purchased in the free version.", "Notice");
                //productPurchaseProcess.requestPurchase(goodsCode);
            }
        }
        
        function purchaseClose()
        {
            observableView();
            $('#moadl_purchaseEffect').data("kendoMobileModalView").close();
            $('.swipe_control').addClass('hide');
            
            //$('#goodsSlider').fadeOut();
            //$('#noneSlider').fadeOut();
            
            if(goodsBundle === 2) {
                console.log(swiper);
                if(swiper !== undefined) {
                    
                    swiper.stop();
                    swiper = function(){};
                    $('#purchasedCardList').empty();
                }
            } else {
                $('#purchasedCardPack').empty();
            }
            
            return2List();
        }
        
        var productPurchaseProcess = {
            requestPurchase: function(gcode) {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"productCode":"' + gcode + '"}';
                var url = init_data.auth + "?callback=?";
                
                app.mobileApp.showLoading();
                
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.product",
                        "id": "payStorePurchase",
                        "param":param
                    },
                    success: function(response) {
                        console.log(response);
                        if (response.code === 0) {
                            var data = response.data;
                            
                            //if(data.itemType === 2 || data.itemType === 6 || data.itemType === 8) {
                            goodsBundle = data.bundle;
                            if(data.bundle === 1 || data.bundle === 2) {
                                that.purchaseSuccess(data.item,data.bundle);
                            } else {
                                that.purchaseGuide(1);
                            }

                        } else {
                            that.purchaseGuide(0);
                        }
                        
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    }
                });
            },
            purchaseGuide: function(r) {
                var message = [];
                message[0] = "An error has occurred in the purchasing process.";
                message[1] = "The purchase request has been processed successfully.\nPurchased items can be found in the mailbox.";
                app.showAlert(message[r], "Notice",purchaseClose);
            },
            purchaseSuccess: function(data, bundle) {
                var that = this;
                var purchaseItems = "";
                var pack = "";
                var emblem = "";
                $('.purchase_box__card').css({'height': $(window).height() + 'px'});
                
                

                if(bundle === 1) {
                    console.log(bundle);
                    $('#noneSlider').css({'visibility':'visible'});
                    $('.swipe_control').addClass('hide');
                    $('#purchasedCardPack').empty();
                    $('#moadl_purchaseEffect').data("kendoMobileModalView").open();
                
                    pack = (data.itemClass === 6) ? 'gold_pack' : '';
                    emblem = "amblem__" + data.team;
                    purchaseItems = '<div class="swipe_boxs"><div class="card_pack"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+0</div>' +
                        '<div class="playercard__no">' + data.shirtNumber + '</div></div><div class="playercard_name">' + data.itemName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                        '<div class="card_pack__stat"><div class="playercard__grade">';
                    for(var i = 1;i<7;i++) {
                        purchaseItems += (i <= data.itemClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                    }
                    
                    purchaseItems += '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_0"><div class="card_pack_pattern"></div></div></div></div></div>';
                    $('#purchasedCardPack').append(purchaseItems);
                    $('#noneSlider').fadeIn(500);
                    that.purchaseResult();
                } else {
                    console.log("package : " + bundle);
                    $('#noneSlider').css({'visibility':'hidden'});
                    $('#moadl_purchaseEffect').data("kendoMobileModalView").open();
                    //$('#purchasedCardList').empty();
                                        
                    swipe_num = (Object.keys(data).length) - 1;

                    setTimeout(function() {
                        
                        $.each(data, function(i,v) {
                            pack = (v.itemClass === 6) ? 'gold_pack' : '';
                            emblem = "amblem__" + v.team;
                            purchaseItems = '<div class="swipe_boxs"><div class="card_pack"><div class="card_pack_pos"><div class="card_pack__label"><div class="playercard"><div class="playercard__lv">+0</div>' +
                                '<div class="playercard__no">' + v.shirtNumber + '</div></div><div class="playercard_name">' + v.itemName + '</div></div><div class="card_pack__husks ' + pack + '"></div>' +
                                '<div class="card_pack__stat"><div class="playercard__grade">';
                            for(var i = 1;i<7;i++) {
                                purchaseItems += (i <= v.itemClass) ? '<span class="star-on">*</span>' : '<span>*</span>';
                            }
                            
                            purchaseItems += '</div><div class="playercard__emblem '+ emblem + '"></div></div><div class="card_pack__back card_grade_0"><div class="card_pack_pattern"></div></div></div></div></div>';
                            $('#purchasedCardList').append(purchaseItems);
                            
                        });
                        
                        app.mobileApp.hideLoading();
                        
                        swiper = new Swipe(document.getElementById('goodsSlider'), 
                        {
                            startSlide: 0,
                            speed: 400,
                            auto: 5000,
                            continuous: false,
                            disableScroll: false,
                            stopPropagation: true,
                            callback: function(index, elem) {},
                            transitionEnd: function(index, elem) {
                                swipe_position = index;
                                if(index === swipe_num) {
                                    swiper.stop();
                                    $('.swipe_control').addClass('hide');
                                }
                            }
                        });
                        $('.swipe_control').removeClass('hide');
                        //$('#goodsSlider').fadeIn(500);
                    },500);
                    //that.purchaseResult();
                }
            },
            purchaseResult: function() {
                setTimeout(function() {
                    app.mobileApp.hideLoading();
                    //$('#moadl_purchaseEffect').data("kendoMobileModalView").open();
                },500);
            }
        };
        
        function swipeItems(e) 
        {
            var data = e.button.data();
            
            if(data.rel === "prev") {
                if(swipe_position === 0) {
                    return false;
                }
                swipe_position = (swipe_position === 0) ? swipe_num : swipe_position - 1;
            } else {
                swipe_position = (swipe_position === swipe_num) ? 0 : swipe_position + 1;
            }
            swiper.slide(swipe_position, 300);
        }        
        
        
        function buyItems(e)
        {
            var data = e.button.data();
            app.mobileApp.showLoading();
            setTimeout(function() {
                app.mobileApp.navigate('views/shopPurchaseVu.html?pid=' + data.inf + '&category=' + data.sep, 'slide');
                app.mobileApp.hideLoading();
            },300);
        }
        
        function staticMenu(e)
        {
            var data = e.button.data();
            moveShopPage.menuDefine(data.rel);
        }
        
        var moveShopPage = {
            menuDefine: function(el) {
                var that = this;
                $('#box-' + el).addClass('custom_box_touch_events');
                setTimeout(function() {
                    that.pageSlide(el);
                    $('#box-' + el).removeClass('custom_box_touch_events');
                }, 100);
            },
            pageSlide: function(el) {
                app.mobileApp.showLoading();
                setTimeout(function() {
                    app.mobileApp.navigate('views/shopCategoryVu.html?str=' + el, 'slide');
                    app.mobileApp.hideLoading();
                },300);                
            }
        };
        
        var pageHeader = {
            parseParam: function(e) {
                app.mobileApp.showLoading();
                var that = this;
                var param = e.view.params;
                switch(param.str) {
                    case 'touchCard':
                        that.setNavTitle(e,'RECRUIT');
                        that.appendCardList();
                        break;
                    case 'touchJem':
                        that.setNavTitle(e,'SKILL GEM');
                        that.appendSkillList();
                        break;
                    case 'touchAdd':
                        that.setNavTitle(e,'MISCELLANY');
                        that.appendMiscList();
                        break;
                    case 'touchGold':
                        that.setNavTitle(e,'GOLD RECHARGE');
                        break;
                }
            },
            setNavTitle: function(e, t) {
                e.view.options.title = t;
            },
            appendCardList: function()
            {
                console.log(storePackageData['card']);
                $("#shopCategoryItems").kendoMobileListView({
                    dataSource: storePackageData['card'],
                    template: $("#categoryGoodsListTemplate").html()
                });
                app.mobileApp.hideLoading();
            },
            appendSkillList: function()
            {
                console.log(storePackageData['skill']);
                $("#shopCategoryItems").kendoMobileListView({
                    dataSource: storePackageData['skill'],
                    template: $("#categoryGoodsListTemplate").html()
                });
                app.mobileApp.hideLoading();
            },
            appendMiscList: function()
            {
                console.log(storePackageData['opt']);
                $("#shopCategoryItems").kendoMobileListView({
                    dataSource: storePackageData['opt'],
                    template: $("#categoryGoodsListTemplate").html()
                });
                app.mobileApp.hideLoading();
            }
        };
        
        function resetViewTitle(e,t) {
            var navbar = e.view
                .header
                .find(".km-navbar")
                .data("kendoMobileNavBar");

            navbar.title(t);
        }


        
        function purchaseAlert(si, transaction) 
        {
            if (uu_data.memSeq !== "") {
                var keyz = Base64.encode(JSON.stringify(transaction));
                var token = Base64.encode(transaction.signature);
                
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + 
                            ',"productCode":"' + si +
                            '","purchaseKey":"' + keyz + 
                            '","token":"' + token + '"}';
                
                var url = init_data.auth + "?callback=?";               
                
                $.ajax({
                           url: url,
                           type: "GET",
                           dataType: "jsonp",
                           jsonpCallback: "jsonCallback",
                           data: {
                        "type": "apps",
                        "id": "paymentInAppPurchase",
                        "param":param
                    },
                           success: function(response) {
                               //console.log( JSON.stringify(response));
                               if (response.code === 0) {
                                   var purchase = response.data;
                                   if (purchase.cash > 0) {
                                       uu_data.cash = purchase.cash;
                                       observableView();
                                       app.showAlert("캐시 구입이 완료되었습니다.", "안내");
                                   } else {
                                   }
                               }
                           },
                           error: function(e) {
                               console.log(e); 
                           }
                       });  
            } else {
                app.showError("앱 초기화 실패");
            }
        }
        
        function buy(e) 
        {
            var data = e.button.data();
            
            app.showAlert($.enScript.alert_rtPurchaseBeta, "Notice");
            
            //bizPurchaseRuleCheck(data.rel, data.pid);
            
            //store.order('' + data.pid);
            
        }
        
        function warn()
        {
            app.showAlert("Item purchase are not available in free version.\n(Player Card purchase is available)", "Notice");
        }
        
        var bizPurchaseRuleCheck = function(price, pid) 
        {
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
                   
                   app.mobileApp.hideLoading();
                   
                   if (response.code === 0) {
                       
                       var resp = response.data;
                       var mothlyAmount = parseInt(resp.accrdIapM) + parseInt(price); // 월결제
                       
                       if(parseInt(mothlyAmount) <= parseInt(resp.lmtIapM)) {
                           store.order('' + pid);
                       } else {
                           var errorMessage = "계정당 월 결제 한도는 " + numberFormat(resp.lmtIapM) + "원 입니다.\n" + 
                           "\n이번달 결제한도 : " + numberFormat(parseInt(resp.lmtIapM) - parseInt(resp.accrdIapM));
                           app.showAlert(errorMessage, "안내", function() {
                               return false;
                           });
                       }
                       
                   } else {
                       app.showAlert('결제정보 초기화 중 오류가 발생하였습니다.', '안내', function() { 
                           return false; 
                       });
                   }
                  
               },
               error: function(e) {
                   console.log(JSON.stringify(e));
                   app.mobileApp.hideLoading();
               }
           });  
        }
        
        function return2List()
        {
            console.log("back");
            kendo.unbind($("#shop_vu"));
            app.mobileApp.navigate('#shop_main', 'slide');
            //app.mobileApp.navigate('views/landing2Vu.html', 'slide');
        }

        return {
            init : init,
            initRegen: initRegen,
            initPurchase: initPurchase,
            showCategory: showCategory,
            showPurchase: showPurchase,
            buy : buy,
            buyItems: buyItems,
            purchasGoods: purchasGoods,
            staticMenu: staticMenu,
            return2List: return2List,
            backToMenu: backToMenu,
            purchaseClose: purchaseClose,
            swipeItems: swipeItems,
            warn: warn
        };
    }());
    return shopProcess;
}());