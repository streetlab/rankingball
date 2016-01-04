/**
 * Object Control view model
 */
var app = app || {};

app.ObjControl = (function () {
    'use strict';

    var $blocks;
    
    var objModel = (function () {
         
        function init() {
            
            //setTimeout(setMenuAnimate,500);
            //setMenuAnimate();

            //setTimeout(setMenuDecoration,700);

            //$('#m_profile').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', setMenuDecoration);
            
            $('.animBlock').kendoTouch({
                tap: handleTouchEvent,
                touchstart: handleTouchEvent,
                touchend: handleTouchEvent,
                doubletap: handleTouchEvent,
                hold: handleTouchEvent,
                dragstart: handleTouchEvent,
                dragend: handleTouchEvent
            });
        }
     
        function setMenuAnimate() {
            $blocks = $('.animBlocks.notViewed');
            $blocks.each(function(i, elem) {
                if( $(this).hasClass('notViewed') ) {
                    //$(this).addClass('animated bounceOutLeft');
                }
                //isScrolledIntoView($(this));
                //setTimeout(isScrolledIntoView($(this)),1500);
            });
        }
        
        function setMenuDecoration() {
            var menuGlu = $('.touch-filter');
            menuGlu.each(function(i, elem) {
                var deco = '<div class="masker mask_' + $(this).attr('data-rel') + '"></div>';
                $(this).append(deco);
            });
        }
        
        function isScrolledIntoView(elem) {
            //var docViewTop = $(window).scrollTop();
            //var docViewBottom = docViewTop + $(window).height();
            //var elemOffset = 0;
            
            if(elem.data('offset') !== undefined) {
                elemOffset = elem.data('offset');
            }
            
            $(elem).removeClass('notViewed').addClass('viewed');
        }
        
        function handleTouchEvent(e) {
            
            var te = e.event.type;
            var el_id = e.touch.currentTarget.id;
            if(te === "touchstart") {
                $('#' + el_id + ' .touch-filter').addClass('box-touch-oh');
            } else {
                $('#' + el_id).find('.touch-filter').removeClass('box-touch-oh');
            }
        }
        
        function launchPlay() {
           if( uu_data.memSeq === "" ) {
                app.showAlert('서비스 초기화에 실패하여 자동 종료됩니다.','안내',function() {
                    navigator.app.exitApp();
                });
            } else {
                app.mobileApp.showLoading();
                setupPlayerOnLeague();
            }
        }
        
        function launchRanking() {
            app.mobileApp.navigate('views/rankingView.html', 'slide');
        }
        
        function launchRecord() {
            app.mobileApp.navigate('views/recordView.html', 'slide');
        }
        
        function launchShop() {
            app.mobileApp.navigate('views/shopView.html', 'slide');
        }
        
        function launchProfile() {
            app.mobileApp.navigate('views/profileView.html', 'slide');
        }
        
        function launchRT() {
            app.mobileApp.navigate('views/playRTListVu.html', 'slide');
        }

        
        function setupPlayerOnLeague() {
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","position":15,"organ":1}';
            var url = init_data.auth + "?callback=?";
            
            $.ajax({
                url: url,
                type: "GET",
                async: false,
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                data: {
                    "type": "apps",
                    "id": "contestGetEntry",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                  
                        $.each(response.data, function (i, p) {
                            playerOnLeague.push({
                                teamName: p.teamName,
                                position: p.position,
                                fppg: p.fppg,
                                playerID: p.playerID,
                                playerName: p.playerName,
                                posDesc: p.posDesc,
                                number: p.number,
                                posId: p.posId,
                                team: p.team,
                                salary: p.salary,
                                posCode: p.posCode,
                                posType: p.posType,
                                playerSelected:1
                            });
                        });

                    }
                    requestContestList();
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    app.mobileApp.hideLoading();
                }
            });
        }        
                
        function requestContestList() {
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"organ":1}';
            var url = init_data.auth + "?callback=?";

            $.ajax({
                url: url,
                type: "GET",
                async: false,
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                data: {
                    "type": "apps",
                    "id": "contestGetList",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                        contestListData = response.data;
                        
                        contestListData  = contestListData.sort(function(a, b) {
                            return (b.rewardValue - a.rewardValue);
                        });
                                                
                        generateContestList();
                    }
                    else
                    {
                        console.log("no match data");
                        app.mobileApp.navigate('views/playView.html', 'slide');
                        app.mobileApp.hideLoading();
                    }
                },
                error: function(e) {
                    console.log("error - requestContestList Contest : " + JSON.stringify(e));
                }
            });  
        }
        
        function generateContestList() {
            contestPartList['cf'] = new Array();
            contestPartList['c5'] = new Array();
            contestPartList['cg'] = new Array();
            contestMyPartList['cf'] = new Array();
            contestMyPartList['c5'] = new Array();
            contestMyPartList['cg'] = new Array();
            
            for (var i=0 ; i < contestListData.length ; i++)
            {
                
                contestListData[i]['timeRew'] = timeGenerate(contestListData[i]['startTime']);
                
                if(contestListData[i]['myEntry'] === 1) 
                {
                                        
                    if (contestListData[i]['featured'] === 1) {
                        contestMyPartList['cf'].push(contestListData[i]);
                    } else if (parseInt(contestListData[i]['contestType']) === 1) {
                        contestMyPartList['c5'].push(contestListData[i]);
                    } else if (parseInt(contestListData[i]['contestType']) === 2) {
                        contestMyPartList['cg'].push(contestListData[i]);
                    }
                    
                    if(contestListData[i]['entryData'] !== null) {
                        var $tmpSlots = [];
                        $.each(contestListData[i]['entryData'],function(k,x) {
                            $tmpSlots[k] = x;
                        });

                        myEntryByContest[contestListData[i]['contestSeq']] = $tmpSlots;
                    }

                } else {
                    
                    if(contestListData[i]['contestStatus'] === 1) {
                        
                        if (contestListData[i]['featured'] === 1) {
                            contestPartList['cf'].push(contestListData[i]);
                        } else if (parseInt(contestListData[i]['contestType']) === 1) {
                            contestPartList['c5'].push(contestListData[i]);
                        } else if (parseInt(contestListData[i]['contestType']) === 2) {
                            contestPartList['cg'].push(contestListData[i]);
                        }                        
                    }
                    
                }
            }
                        
            setTimeout(function() {
                app.mobileApp.navigate('views/playView.html', 'slide:left');
                app.mobileApp.hideLoading();   
            },500);
        }
        
        var weekDay = new Array("Sun.","Mon.","Tue.","Wed.","Thu.","Fri.","Sat.");
        
        var timeGenerate = function(timeValue) {
            var today = new Date();
                        
            var yy = timeValue.substring(0,4);
            var mm = timeValue.substring(4,6);
            var dd = timeValue.substring(6,8);
            var h = timeValue.substring(8,10);
            var m = timeValue.substring(10,12);
            var s = timeValue.substring(12,14);
            
            
            var startDate = new Date(yy,Number(mm)-1,dd,h,m,s);
            var dateLabel = "";
            var timeLabel = "";
            
            var dateDiff = Math.round( (startDate.getTime() - today.getTime())  / (1000*60*60*24) );
            
            if(parseInt(h) > 11) {
                timeLabel = h + ":" + m + " PM";
            } else {
                timeLabel = h + ":" + m + " AM";
            }
            if(dateDiff > 0) {
                                
                if(dateDiff === 1) {
                    dateLabel = "tommorow " + timeLabel;
                }
                else
                {
                    dateLabel = weekDay[startDate.getDay()] + " " + timeLabel;
                }   
            }
            else
            {
                if(dateDiff === 0) {
                    dateLabel = "today " + timeLabel;
                } else {
                    dateLabel = Math.abs(dateDiff) + " days ago ";
                }   
            }
            
            return dateLabel;
        };
        
        function reloadContest(killView, moveto) {
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"organ":1}';
            var url = init_data.auth + "?callback=?";
            console.log(JSON.stringify(param));
            $.ajax({
                url: url,
                type: "GET",
                async: false,
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                data: {
                    "type": "apps",
                    "id": "contestGetList",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                        contestListData = response.data;
                        
                        contestListData  = contestListData.sort(function(a, b) {
                            return (b.rewardValue - a.rewardValue);
                        });
                        
                        resetContestList(killView, moveto);
                    }
                    else
                    {
                        console.log("no match data");
                        app.mobileApp.hideLoading();
                        app.mobileApp.navigate('views/playView.html', 'slide');

                    }
                },
                error: function(e) {
                    console.log("error - requestContestList Contest : " + JSON.stringify(e));
                }
            });  
        }
        
        function resetContestList(v, m) {
            contestPartList['cf'] = new Array();
            contestPartList['c5'] = new Array();
            contestPartList['cg'] = new Array();
            contestMyPartList['cf'] = new Array();
            contestMyPartList['c5'] = new Array();
            contestMyPartList['cg'] = new Array();
            
            for (var i=0 ; i < contestListData.length ; i++)
            {
                
                contestListData[i]['timeRew'] = timeGenerate(contestListData[i]['startTime']);
                
                if(contestListData[i]['myEntry'] === 1) 
                {
                    
                    if (contestListData[i]['featured'] === 1) {
                        contestMyPartList['cf'].push(contestListData[i]);
                    } else if (parseInt(contestListData[i]['contestType']) === 1) {
                        contestMyPartList['c5'].push(contestListData[i]);
                    } else if (parseInt(contestListData[i]['contestType']) === 2) {
                        contestMyPartList['cg'].push(contestListData[i]);
                    }
                    
                    if(contestListData[i]['entryData'] !== null) {
                        var $tmpSlots = [];
                        $.each(contestListData[i]['entryData'],function(k,x) {
                            $tmpSlots[k] = x;
                        });

                        myEntryByContest[contestListData[i]['contestSeq']] = $tmpSlots;
                    }

                } else {
                    
                    if(contestListData[i]['contestStatus'] === 1) {
                        
                        if (contestListData[i]['featured'] === 1) {
                            contestPartList['cf'].push(contestListData[i]);
                        } else if (parseInt(contestListData[i]['contestType']) === 1) {
                            contestPartList['c5'].push(contestListData[i]);
                        } else if (parseInt(contestListData[i]['contestType']) === 2) {
                            contestPartList['cg'].push(contestListData[i]);
                        }                        
                    }
                    
                }
            }
            
            setTimeout(function() {
                app.mobileApp.hideLoading();   
                app.mobileApp.navigate(m, 'slide');
                if(v) {
                    $(v).data("kendoMobileView").destroy();
                    $(v).remove();
                }
                
            },500);
        }
        
        return {
            init: init,
            launchPlay: launchPlay,
            launchRanking: launchRanking,
            launchRecord: launchRecord,
            launchShop: launchShop,
            launchProfile: launchProfile,
            launchRT: launchRT,
            reloadContest: reloadContest
        };
    }());

    return objModel;
}());