/**
 * Shop
 */
var app = app || {};

app.Shop = (function () {
    'use strict';
    
    var shopProcess = (function () {        
               
        function init(){
            console.log('init shop!');
            
            if (window.navigator.simulator === true) {
                
            } else{
              // Enable maximum logging level
              store.verbosity = store.INFO;

              // Inform the store of your products
                         
              store.register({
                               id:    'com.streetlab.cash5500',
                               alias: "cash5500",
                               type:   store.CONSUMABLE
                             });
                
              store.register({
                               id:    "com.streetlab.cash11000",
                               alias: "cash11000",
                               type:   store.CONSUMABLE
                             });                
              
              store.register({
                               id:    'com.streetlab.cash22000',
                               alias: 'cash22000',
                               type:   store.CONSUMABLE
                             });
                
              store.register({
                               id:    'com.streetlab.cash33000',
                               alias: 'cash33000',
                               type:   store.CONSUMABLE
                             });      
              store.register({
                               id:    'com.streetlab.cash55000',
                               alias: 'cash55000',
                               type:   store.CONSUMABLE
                             });      
                
              
              //store.register({
              //                 id:    'com.telerik.demoproduct.subscription1',
              //                 alias: 'subscription1',
              //                 type:  store.PAID_SUBSCRIPTION
              //               });

              // When any product gets updated, refresh the HTML
              store.when("product").updated(function (p) {
                //var container = document.getElementById('productContainer');
                //var elId = p.id.split(".")[3];
                //var el = document.getElementById(elId);
                //if (!el) {
                //  //container.innerHTML += '<div id="'+elId+'"></div>';
                //  el = document.getElementById(elId);
                //}
                
                if (!p.loaded) {
                  console.log("load failed");
                } else if (!p.valid) {
                    console.log("invalid : "+p.alias);
                } else if (p.valid) {
                  //var product =   store.get(p.id);
                    
                  //if(product.canpurchase){
                  //    alert(product.alias + " can purchase");
                  //} else{
                  //     alert(product.alias + " can\'t purchase");
                  //}
                    //if(product.owned){
                        //alert(product.alias + " is " + product.state);
                        //product.finish();
                    //}
                    //product.transaction = null;
                    //store.inappbilling.consumePurchase(function() {
                    //    store.log.debug("plugin -> consumable consumed");
                    //    product.set("state", store.VALID);
                    //}, function(err, code) {
                    //    store.error({
                    //        code: code || store.ERR_UNKNOWN,
                    //        message: err
                    //    });
                    //}, p.id);
                    
                }
              });

              // handle subscription events                
              //store.when("subscription1").approved(function(p) {
              //                           alert("verify subscription");
              //                           p.verify();
              //                         });

              //store.when("subscription1").verified(function(p) {
              //                                       alert("subscription verified");
              //                                       p.finish();
              //                                     });

              //store.when("subscription1").unverified(function(p) {
              //                                         alert("subscription unverified");
              //                                       });

              //store.when("subscription1").updated(function(p) {
              //                                      if (p.owned) {
              //                                        console.log('You have a subscription');
              //                                        //document.getElementById('subscriber-info').innerHTML = 'You are a lucky subscriber!';
              //                                      } else {
              //                                        console.log('You don\'t have a subscription');
              //                                        //document.getElementById('subscriber-info').innerHTML = 'You are not subscribed';
              //                                      }
              //                                    });
  
              // When purchase of 100 coins is approved, show an alert
              store.when("cash5500").approved(function (order) {
                                                  console.log(order.alias + 'approved!');
                                                  //order.verify();
                                                  order.finish();
                                                });
                
                //store.when("test2").verified(function (order) {
                //                                  alert(order.alias + 'verified!');
                //                                  order.finish();
                //                                });
                
                //store.when("test2").unverified(function (order) {
                //                                  alert(order.alias + 'unverified!');
                //                                });
                
                store.when("cash5500").finished(function (order) {
                                                  console.log(order.alias + 'finished!');
                                                });
                
                store.when("cash5500").cancelled(function (order) {
                                                  console.log(order.alias + 'cancelled!');
                                                });
                
                 store.when("cash11000").approved(function (order) {
                                                  console.log(order.alias + 'approved!');                     
                                                  order.finish();
                                                });
                
                store.when("cash11000").finished(function (order) {
                                                  console.log(order.alias + 'finished!');
                                                });
                
                 store.when("cash11000").cancelled(function (order) {
                                                  console.log(order.alias + 'cancelled!');
                                                });
                
                 store.when("cash22000").approved(function (order) {
                                                  console.log(order.alias + 'approved!');                     
                                                  order.finish();
                                                });
                
                store.when("cash22000").finished(function (order) {
                                                  console.log(order.alias + 'finished!');
                                                });
                
                store.when("cash22000").cancelled(function (order) {
                                                  console.log(order.alias + 'cancelled!');
                                                });
                
                store.when("cash33000").approved(function (order) {
                                                  console.log(order.alias + 'approved!');                    
                                                  //order.verify();
                                                  order.finish();
                                                });
                
                store.when("cash33000").finished(function (order) {
                                                  console.log(order.alias + 'finished!');
                                                });
                
                store.when("cash33000").cancelled(function (order) {
                                                  console.log(order.alias + 'cancelled!');
                                                });
                
                store.when("cash55000").approved(function (order) {
                                                  console.log(order.alias + 'approved!');                    
                                                  //order.verify();
                                                  order.finish();
                                                });
                
                store.when("cash55000").finished(function (order) {
                                                  console.log(order.alias + 'finished!');
                                                });
                
                store.when("cash55000").cancelled(function (order) {
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
        
        function buy(e){
            var data = e.button.data();
            console.log(data.pid);
            store.order(''+data.pid);                         
        }
        
        return {
            init : init,
            buy : buy
        };
    }());
    return shopProcess;
}());
