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
        
        var goodsCode = "";
        var goodsBundle = "";
        var goodsPrice = 0;
        
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
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"cateogry":' + category + '}';
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
                                    that.appendPackageList();
                                } else if(data.category === 2) {
                                    storePackageData['card'].push(data);
                                } else if(data.category === 3) {
                                    storePackageData['skill'].push(data);
                                } else if(data.category === 4) {
                                    storePackageData['opt'].push(data);
                                }
                            });
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
                    dataSource: storePackageData['pack'],
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
            goodsDetail.parseParam(parseInt(param.pid),parseInt(param.category));
        }
        
        var goodsDetail = {
            parseParam: function(id,category) {
                var that = this;
                switch(category) {
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
                    if(data[0].component !== undefined) {
                        $.each(data[0].component, function(i, v) {
                            $('#goodsOptions').append('<li>' + v.componentName + '</li>');
                        });
                    }
                    
                    goodsCode = data[0].productCode;
                    goodsBundle = data[0].bundle;
                    goodsPrice = parseInt(data[0].price);
                }
            }
        };
        
        function purchasGoods()
        {
            if(goodsCode === "") {
                console.log("None Product code");
                return false;
            }
/*            
            navigator.notification.confirm('Do you want to buy these products?', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                    productPurchaseProcess.requestPurchase(goodsCode);
                }
            }, 'Notice', 'Cancel', 'Purchase');
*/
            if(uu_data.cash >= goodsPrice) {
                productPurchaseProcess.requestPurchase(goodsCode, goodsBundle);
            } else {
                app.showAlert("You don't have enough gold to purchase.","Notice");
            }
        }
        
        var productPurchaseProcess = {
            requestPurchase: function(gcode, gbundle) {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"productCode":"' + gcode + '","bundle":"' + gbundle + '","token":"0"}';
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
                            

                        } else {
                            
                        }
                        that.purchaseResult();
                    },
                    error: function(e) {
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    },
                    complete: function() {
                         app.mobileApp.hideLoading();
                    }
                });
            },
            purchaseResult: function() {
                
                $('.purchase_box__card').css({'height': $(window).height() + 'px'});
                $('#moadl_purchaseEffect').data("kendoMobileModalView").open();
            }
        };
        
                
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
            app.mobileApp.navigate('#:back', 'slide');
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
            backToMenu: backToMenu
        };
    }());
    return shopProcess;
}());