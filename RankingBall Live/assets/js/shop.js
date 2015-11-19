/**
 * Shop
 */
var app = app || {};

app.Shop = (function () {
    'use strict';
    
    var shopProcess = (function () {        
               
        function init(){
            console.log('init shop!');
            observableView();
            if (window.navigator.simulator === true) {
                
            } else{
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
                    console.log("invalid : "+p.alias);
                } else if (p.valid) {
                  
                    
                }
              });
  
              // When purchase of 100 coins is approved, show an alert
              store.when("cash5000").approved(function (order) {
                                                  console.log(order.alias + 'approved!');
                                                  order.finish();
                                                  console.log(JSON.stringify(order));
                                                  purchaseAlert('com.streetlab.cash5000',order.transaction);
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
                                                  purchaseAlert('com.streetlab.cash10000',order.transaction);
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
                                                 purchaseAlert('com.streetlab.cash20000',order.transaction);
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
                                                purchaseAlert('com.streetlab.cash30000',order.transaction);
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
                                                    purchaseAlert('com.streetlab.cash50000',order.transaction);
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
        
        function purchaseAlert(si,transaction) {
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
                   async: false,
                   dataType: "jsonp",
                   jsonpCallback: "jsonCallback",
                   data: {
                        "type": "apps",
                        "id": "paymentInAppPurchase",
                        "param":param
                    },
                   success: function(response) {
                       console.log( JSON.stringify(response));
                       if (response.code === 0) {
                           var purchase = response.data;
                           if(purchase.cash > 0) {
                               uu_data.cash = purchase.cash;
                               observableView();
                               app.showAlert("캐시 구입이 완료되었습니다.","안내");
                           }
                           else
                           {
                               
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
        
        function buy(e){
            var data = e.button.data();
            store.order(''+data.pid);                         
        }

        return {
            init : init,
            buy : buy
        };
    }());
    return shopProcess;
}());
