/**
 * Object Control view model
 */
var app = app || {};

app.ObjControl = (function () {
    'use strict';

    var $blocks;
    
    var objModel = (function () {
        
        
        function init() {
            
            setTimeout(setMenuAnimate,300);
            
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
            $blocks = $('.animBlock.notViewed');
            $blocks.each(function(i, elem) {
                if( $(this).hasClass('viewed') )
                    return;    
                isScrolledIntoView($(this));
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
                    
                    if (contestListData[i]['featured'] === 1 || contestListData[i]['guaranteed'] === 1) {
                        contestMyPartList['cf'].push(contestListData[i]);
                    }
                    
                    if (parseInt(contestListData[i]['contestType']) === 1) {
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
                        
                        if (contestListData[i]['featured'] === 1 || contestListData[i]['guaranteed'] === 1) {
                            contestPartList['cf'].push(contestListData[i]);
                        }
                        
                        if (parseInt(contestListData[i]['contestType']) === 1) {
                            contestPartList['c5'].push(contestListData[i]);
                        } else if (parseInt(contestListData[i]['contestType']) === 2) {
                            contestPartList['cg'].push(contestListData[i]);
                        }                        
                    }
                    
                }
            }
            
            //console.log("objControl - contestListData : " + JSON.stringify(contestListData));
            //console.log("objControl - myEntryByContest : " + JSON.stringify(myEntryByContest));
            
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
        
        function reloadContest() {
           if( uu_data.memSeq === "" ) {
                console.log("User seq is null");
            } else {
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"organ":1}';
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
                        "id": "contestGetList",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            contestListData = response.data;
                            resetContestList();
                        }
                        else
                        {
                            console.log("no match data");
                            app.mobileApp.hideLoading();
                        }
                    },
                    error: function(e) {
                        console.log("error - reload Contest : " + JSON.stringify(e));
                    }
                });
            }
        }
        
        function resetContestList() {
            contestFtypeData = {cnt:0,arr:''};
            contest5typeData = {cnt:0,arr:''};
            contestGtypeData = {cnt:0,arr:''};
            muContestF = {cnt:0,arr:''};
            muContest5 = {cnt:0,arr:''};
            muContestG = {cnt:0,arr:''};
                        
            for (var i=0 ; i < contestListData.length ; i++)
            {
                var playDate = timeGenerate(contestListData[i]['startTime']);
                var matchType = "";
                if(contestListData[i]['contestType'] === 1) {
                    matchType = '<span class="ic-50">50</span>';
                } else if(contestListData[i]['contestType'] === 2) {
                    matchType = '<span class="ic-guaranteed">G</span>';
                }
                
                var statusLabel = "";
                if(contestListData[i]['contestStatus'] === 1) {
                    statusLabel = '<span class="ic-wait">wait</span>';
                } else if(contestListData[i]['contestStatus'] === 2) {
                    statusLabel = '<span class="ic-play">play</span>';
                } else {
                    statusLabel = '<span class="ic-over">over</span>';
                }
                
                var joinBtn = "";
                var item = "";
                
                if(contestListData[i]['myEntry'] === 1) {
                    
                    if(contestListData[i]['contestStatus'] === 1) {
                        joinBtn = '<a data-role="button" data-rel="' + contestListData[i]['contestSeq'] + '" data-status="' + contestListData[i]['contestStatus'] + '" data-click="app.Contests.joinMatch" class="myContest collapseInboxList-btn km-widget km-button"><span class="km-text">JOIN</span></a>';
                    } else {
                        joinBtn = '<a data-role="button" data-rel="' + contestListData[i]['contestSeq'] + '" data-status="' + contestListData[i]['contestStatus'] + '" data-click="app.Contests.playResult" class="myContest collapseInboxList-off-btn km-widget km-button"><span class="km-text">CLOSE</span></a>';
                    }
                    
                    item = '<li><div class="collapseInboxList-face"><div class="collapseInboxList-group boxs">' +
                        '<div class="collapseInboxList-title">' + matchType + ' ' + statusLabel + ' ' + contestListData[i]['contestName'] + '</div>' +
                        '<div class="collapseInboxList-summ"><span><b>' + contestListData[i]['totalEntry'] + '</b> / ' + contestListData[i]['maxEntry'] + '</span><span><b>' + 
                        numberFormat(contestListData[i]['entryFee']) + '</b> / ' + numberFormat(contestListData[i]['rewardValue']) + '</span><span>' + playDate +'</span></div></div>' +
                        '<div class="collapseInboxList-group btns">' + joinBtn + '</div></li>';
                    
                    if (contestListData[i]['featured'] === 1 || contestListData[i]['guaranteed'] === 1) {
                        muContestF.arr += item;
                        muContestF.cnt++;
                    }
                    if (contestListData[i]['contestType'] === 1) {
                        muContest5.arr += item;
                        muContest5.cnt++;
                    } else if (contestListData[i]['contestType'] === 2) {
                        muContestG.arr += item;
                        muContestG.cnt++;
                    }

                } else {
                    
                    if(contestListData[i]['contestStatus'] === 1) {
                        joinBtn = '<a data-role="button" data-rel="' + contestListData[i]['contestSeq'] + '" data-status="' + contestListData[i]['contestStatus'] + '" data-click="app.Contests.joinMatch" class="inboxList-btn">JOIN</a>';
                    } else {
                        joinBtn = '<a data-role="button" data-rel="' + contestListData[i]['contestSeq'] + '" data-status="' + contestListData[i]['contestStatus'] + '" data-click="app.Contests.resultMatch" class="inboxList-off-btn">CLOSE</a>';
                    }
                    
                    item = '<li><div class="inboxList-group boxs"><div class="inboxList-title">' + matchType + '<div class="marquee"><p>' + contestListData[i]['contestName'] + '</p></div></div>' +
                    '<div class="inboxList-summ"><span><b>' + contestListData[i]['totalEntry'] + '</b> / ' + contestListData[i]['maxEntry'] + '</span><span><b>' + 
                    numberFormat(contestListData[i]['entryFee']) + '</b> / ' + numberFormat(contestListData[i]['rewardValue']) + '</span><span>' + playDate +'</span></div></div>' +
                    '<div class="inboxList-group btns">' + joinBtn + '</div></li>';
                    
                    if (contestListData[i]['featured'] === 1 || contestListData[i]['guaranteed'] === 1) {
                        contestFtypeData.arr += item;
                        contestFtypeData.cnt++;
                    }
                    
                    if (contestType === 1) {
                        contest5typeData.arr += item;
                        contest5typeData.cnt++;
                    } else if (contestType === 2) {
                        contestGtypeData.arr += item;
                        contestGtypeData.cnt++;
                    }
                }
            }
                        
            setTimeout(function() {
                if(currentContestType === "F") {
                    $('ul#playListBox').html(contestFtypeData.arr);
                } else if(currentContestType === "5") {
                    $('ul#playListBox').html(contest5typeData.arr);
                } else {
                    $('ul#playListBox').html(contestGtypeData.arr);
                }
                
                if(muContestF.cnt === 0) {
                    $('#gt_list1').html('');
                    $('#math-cnt-f').html(0);
                    $('#acco_gt1').removeClass('ico-open');
                } else {
                    $('#gt_list1').html('<ul id="gt1" class="collapseInboxList">' + muContestF.arr + '</ul>');
                    $('#math-cnt-f').html(muContestF.cnt);
                    $('#acco_gt1').addClass('ico-open');
                }
                
                if(muContest5.cnt === 0) {
                    $('#gt_list2').html('');
                    $('#math-cnt-5').html(0);
                    $('#acco_gt2').removeClass('ico-open');
                } else {
                    $('#gt_list2').html('<ul id="gt2" class="collapseInboxList">' + muContest5.arr + '</ul>');
                    $('#math-cnt-5').html(muContest5.cnt);
                    $('#acco_gt2').addClass('ico-open');
                }
                
                if(muContestG.cnt === 0) {
                    $('#gt_list3').html('');
                    $('#math-cnt-g').html(0);
                    $('#acco_gt3').removeClass('ico-open');
                } else {
                    $('#gt_list3').html('<ul id="gt3" class="collapseInboxList">' + muContestG.arr + '</ul>');
                    $('#math-cnt-g').html(muContestG.cnt);
                    $('#acco_gt3').addClass('ico-open');
                }
                
                console.log("reload");
                app.mobileApp.hideLoading();
            },500);
        }
        
        return {
            init: init,
            launchPlay: launchPlay,
            launchRanking: launchRanking,
            launchRecord: launchRecord,
            launchShop: launchShop,
            launchProfile: launchProfile,
            reloadContest: reloadContest
        };
    }());

    return objModel;
}());