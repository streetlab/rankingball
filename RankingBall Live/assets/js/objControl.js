/**
 * Object Control view model
 */
var app = app || {};

app.ObjControl = (function () {
    'use strict';

    var $blocks;
    
    var objModel = (function () {
        
        var swiper;
        var swipe_num = 0;
        var swipe_position = 0;
    
        /* Page Init - Only First time */
        function init() {
            
            var dWidth = parseInt($(window).width()) - 10;
            var dHeight = parseInt($(window).height()) - 148;
            var vHeight = dHeight / 3;
            var sWidth = dWidth - 90;

            $('.main_boxs').width(dWidth).height(vHeight);
            $('.swipe_box').width(sWidth);
        }
        
        /* Page Init - When Page display */
        function initShow()
        {
            setTimeout(function() {
                fncRenderMain.init();
            }, 500);
        }
        
        /* Contents Display & Animation Control */
        var fncRenderMain = {
            _loopRTScheduler: "",
            _loopRTIndex: 0,
            _rtCount: 0,
            _loopCHScheduler: "",
            _clubHouseCount: 1,
            init: function() {
                var that = this;
                that.updateDFS();
                that.updateRT();
                that.updateCH();
                //console.log(featuredList);
                //console.log(rtWeekList);
            },
            updateDFS: function()
            {
                var fList = Object.keys(featuredList).length;
                if(fList > 0) {
                    swipe_num = fList - 1;
                    var dfsHtml = "";
                    $('#dfsSliderList').empty();
                    for(var i=0;i<fList;i++) {
                        dfsHtml = '<div class="swipe_boxs"><div class="swipe_box">' +
                                    '<div class="swipe_box__title">' + featuredList[i].contestName + '</div>' +
                                    '<div class="hr"></div><div class="swipe_box__summary">' +
                                    '<div class="swipe_box__summary-item">Entries<span>' + featuredList[i].totalEntry + '/' + featuredList[i].maxEntry + '</span></div>' +
                                    '<div class="swipe_box__summary-item">Entryfee<span>' + featuredList[i].entryFee + 'G</span></div>' +
                                    '<div class="swipe_box__summary-item">Prizes<span>' + featuredList[i].totalReward + 'G</span></div>' +
                                    '<div class="swipe_box__summary-item">Start<span>' + featuredList[i].timeRew + '</span></div>' +
                                    '</div></div></div>';
                        $('#dfsSliderList').append(dfsHtml);
                    }
                    
                    
                    $('.swipe_control').removeClass('hide');
                    swiper = new Swipe(document.getElementById('dfsSlider'), 
                    {
                        startSlide: 0,
                        speed: 400,
                        auto: 5000,
                        continuous: true,
                        disableScroll: false,
                        stopPropagation: true,
                        callback: function(index, elem) {},
                        transitionEnd: function(index, elem) {
                            swipe_position = index;
                        }
                    });
                }
            },
            updateRT: function()
            {
                var that = this;
                that._rtCount = Object.keys(rtWeekList).length;
                if(that._rtCount > 0) {
                    if(!that._loopRTScheduler) {
                        that._loopRTScheduler = setInterval(function() {
                            //console.log("rt loop count : " + that._loopRTIndex);
                            that.rtCycle();
                        }, 5000);
                    }
                }
            },
            rtCycle: function()
            {
                var that = this;
                var rtHtml = '<div class="scheduler__datetime"><span class="scheduler__datetime-date">' + rtWeekList[that._loopRTIndex].game_sd + '</span> ' +
                             '<span class="scheduler__datetime-time">' + rtWeekList[that._loopRTIndex].game_sh + '</span></div><div class="scheduler__teams">' +
                             '<div class="scheduler__team-amblem amblem__' + rtWeekList[that._loopRTIndex].home_code + '"></div><div class="scheduler__team-vs">VS</div>' +
                             '<div class="scheduler__team-amblem amblem__' + rtWeekList[that._loopRTIndex].away_code + '"></div></div>';
                
                $('#rtScheduler').fadeOut(1500, function() {
                    $(this).html(rtHtml).fadeIn(2000);
                });
                
                that._loopRTIndex++;
                //console.log(that._loopRTIndex + " : " + that._rtCount);
                if(that._loopRTIndex >= that._rtCount) {
                    that._loopRTIndex = 0;
                }
            },
            updateCH: function()
            {
                var that = this;

                if(!that._loopCHScheduler) {
                    that._loopCHScheduler = setInterval(function() {
                        that.clubCycle();
                    }, 6000);
                }
            },
            clubCycle: function()
            {
                var that = this;
                
                var fEl = $('#player_card__00' + that._clubHouseCount);
                var fBEl = "with_player_bg_00" + that._clubHouseCount;
                var bEl = $('#player_card__001');
                var bBEl = "with_player_bg_001";
                
                if(parseInt(that._clubHouseCount) < 3) {
                    bEl = $('#player_card__00' + ( parseInt(that._clubHouseCount) + 1) );
                    bBEl = "with_player_bg_00" + ( parseInt(that._clubHouseCount) + 1);
                }
                
          
                fEl.addClass('hide');
                bEl.removeClass('hide');
                $('#player_card__bg').removeClass(fBEl).addClass(bBEl);

                
                that._clubHouseCount += 1;
                if(that._clubHouseCount > 3) {
                    that._clubHouseCount = 1;
                }
            },
            clearBar: function() {
                var that = this;
                window.clearInterval(that._loopRTScheduler);
                that._loopRTScheduler = "";
                window.clearInterval(that._loopCHScheduler);
                that._loopCHScheduler = "";
                if(swiper !== undefined) {
                    swiper.stop();
                    swiper = function(){};
                    //swiper.kill();                    
                }

            },
            objSize: function(obj)
            {
                var size = 0, key;
                for(key in obj) {
                    if(obj.hasOwnProperty(key)) size++;
                }
                return size;
            }
        };
        
        /* Main menu touch effect */
        var touchNmove = {
            touchEffect: function(el)
            {
                var that = this;
                $('#box-' + el).addClass('custom_box_touch_events');
                setTimeout(function() {
                    that.pageSlide(el);
                    $('#box-' + el).removeClass('custom_box_touch_events');
                }, 100);
            },
            pageSlide: function(m)
            {
                var vu = "";
                app.mobileApp.showLoading();
                switch(m) {
                    case 'touchDFS':
                        vu = "views/playView.html";
                        break;
                    case 'touchRT':
                        vu = "views/playRTListVu.html";
                        break;
                    case 'touchCH':
                        vu = "views/clubHouseVu.html";
                        break;
                    case 'touchRNK':
                        vu = "views/rankingView.html";
                        break;
                    case 'touchRC':
                        vu = "views/recordView.html";
                        break;
                    case 'touchPF':
                        vu = "views/profileView.html";
                        break;
                    case 'touchSO':
                        vu = "views/shopVu.html";
                        break;
                }
                
               if( vu === "" ) {
                    app.showAlert($.langScript[laf]['noti_045'],'Notice');
                } else {
                    fncRenderMain.clearBar();
                    setTimeout(function() {
            
                        app.mobileApp.navigate(vu, 'slide:left');
                        app.mobileApp.hideLoading();   
                    },500);
                }
            }
        };
        
        /* menu touch effect & move */
        function clickMenuBox(e)
        {
            var element_id = e.currentTarget.id;
            touchNmove.touchEffect(element_id);
        }
        
        function clickStaticMenuBox(e)
        {
            var data = e.button.data();
            touchNmove.touchEffect(data.rel);
        }
        
        /* DFS summary list swipe button control  */
        function dfsSwipe(e) 
        {
            var data = e.button.data();

            if(data.rel === "prev") {
                swipe_position = (swipe_position === 0) ? swipe_num : swipe_position - 1;
            } else {
                swipe_position = (swipe_position === swipe_num) ? 0 : swipe_position + 1;
            }
            swiper.slide(swipe_position, 300);
        }
        
        
        
        
        
        
        
        /* Old version */
        function launchPlay() 
        {
           if( uu_data.memSeq === "" ) {
                app.showAlert($.langScript[laf]['noti_020'],'Notice',function() {
                    navigator.app.exitApp();
                });
            } else {
                app.mobileApp.showLoading();
                setupPlayerOnLeague();
            }
        }
                
        function setupPlayerOnLeague() 
        {
            
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
                
                if(contestListData[i]['myEntry'] > 0) 
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
                app.mobileApp.navigate('views/landing2Vu.html', 'slide:left');
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
        
        /* 컨테스트 리스트 새로 가져오기 */
        function reloadContest(killView, moveto) {
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"organ":1}';
            var url = init_data.apps + "?callback=?";
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

                        console.log(playerOnLeague);
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
                
                if(contestListData[i]['myEntry'] > 0) 
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
                //app.mobileApp.navigate('views/playView.html?', 'slide');
                //$("#po_entry_registration").data("kendoMobileView").destroy();
                //$('#po_entry_players').data("kendoMobileView").destroy();
                $("#po_entry_registration").remove();
                //$("#po_entry_players").remove();
                /*
                if(v) {
                    $(v).data("kendoMobileView").destroy();
                    $(v).remove();
                }
                */
                
            },500);
        }
        
        return {
            init: init,
            decoVu: initShow,
            launchPlay: launchPlay,
            reloadContest: reloadContest,
            dfsSwipe: dfsSwipe,
            clickMenuBox: clickMenuBox,
            clickStaticMenuBox: clickStaticMenuBox
        };
    }());

    return objModel;
}());