/**
 * Result Control view model
 * Ranking, Recent Records
 */
var app = app || {};

app.Resnrnk = (function () {
    'use strict';
    
    var ResnrnkProcess = (function () {
        
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejean) / 86400000) + onejan.getDay() + 1) / 7);
        }
        
        function init(e) {
            
            var scroller = e.view.scroller;
            scroller.setOptions({
                pullToRefresh: true,
                pull: function(){
                    console.log("pull event");
                    if(thisTab === "SR") {
                        generateRank();
                    } else {
                        generateWRank();
                    }
                    setTimeout(function() { scroller.pullHandled(); }, 400);
                }
            });
        }
        
        function initRank() {
            observableView();
            generateRank();            
        }
        
        function initRecord() {
            observableView();
            generateRecordList();
        }
        
        var rankSeason = function() {
            $('#tabstrip_header_week').removeClass('ts');
            $('#tabstrip_header_season').addClass('ts');
            $('#tabstrip_week').addClass('hide');
            $('#tabstrip_season').removeClass('hide');
            $('#rnk_season').removeClass('hide');
            $('#rnk_week').addClass('hide');
            
            thisTab = "SR";
            nowRank = 0;
            myRank = 0;
            myRankPoint = 0;
            generateRank();
        };
        
        var rankWeekly = function() {
            $('#tabstrip_header_season').removeClass('ts');
            $('#tabstrip_header_week').addClass('ts');
            $('#tabstrip_season').addClass('hide');
            $('#tabstrip_week').removeClass('hide');
            $('#rnk_season').addClass('hide');
            $('#rnk_week').removeClass('hide');
            thisTab = "WR";
            nowRank = 0;
            myRank = 0;
            myRankPoint = 0;
            generateWRank();
        };
        
        var thisTab = "SR";
        var nowRank = 0;
        var myRank = 0;
        var myRankPoint = 0;

        function generateRank() {
            app.mobileApp.showLoading();
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"lastId":' + nowRank + '}';
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
                    "id": "getSeasonRank",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                        var rowData = response.data;
                        var rowLength = rowData.list.length;
                        console.log(rowData);
                        if(rowLength > 0) {
                            var nowRankIndex = rowData.list.length - 1;
                            
                            if(rowData.totalRanking <= rowData.list[nowRankIndex]['rank']) {
                                nowRank = 0;
                            } else {
                                nowRank = rowData.list[nowRankIndex]['rank'];
                            }
                        }
                        else
                        {
                            nowRank = 0;
                        }
                        
                        $('#rnk_season').html(rowData.curSeason + " 시즌");
                        $('#ranking_season').empty();
                        
                        if(rowData.myRank > 0) {
                            var li_el = '<li class="clearfix rank myrank"><div class="listitem_rank">' + rowData.myRank + 
                            '</div><div class="listitem_name">' + uu_data.nick + '</div><div class="listitem_point">' + rowData.score + '</div></li>';
                            $('#ranking_season').append(li_el);
                        }
                                                
                        //rowDataList = [];
                        
                        $.each(rowData.list, function (i, p) {
                            //rowDataList.push({rank: p.rank, nick: p.nick, score: p.score});
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.rank + '</div><div class="listitem_name">' + p.nick + '</div><div class="listitem_point">' + p.score + '</div></li>';
                            $('#ranking_season').append(li_el);
                        });
                    }
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });
        }
        

        function generateWRank() {
            app.mobileApp.showLoading();
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"lastId":' + nowRank + '}';
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
                    "id": "getWeeklyRank",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                        var rowData = response.data;
                        var rowLength = rowData.list.length;
                        console.log(rowData);
                        if(rowLength > 0) {
                            var nowRankIndex = rowData.list.length - 1;
                            
                            if(rowData.totalRanking <= rowData.list[nowRankIndex]['rank']) {
                                nowRank = 0;
                            } else {
                                nowRank = rowData.list[nowRankIndex]['rank'];
                            }
                        }
                        else
                        {
                            nowRank = 0;
                        }
                        
                        $('#rnk_week').html(rowData.curSeason + " 시즌 " + rowData.curRound + " 라운드");
                        
                        $('#ranking_week').empty();
                        
                        if(rowData.myRank > 0) {
                            var li_el = '<li class="clearfix rank myrank"><div class="listitem_rank">' + rowData.myRank + 
                            '</div><div class="listitem_name">' + uu_data.nick + '</div><div class="listitem_point">' + rowData.score + '</div></li>';
                            $('#ranking_week').append(li_el);
                        }
                                                
                        //rowDataList = [];
                        
                        $.each(rowData.list, function (i, p) {
                            //rowDataList.push({rank: p.rank, nick: p.nick, score: p.score});
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.rank + '</div><div class="listitem_name">' + p.nick + '</div><div class="listitem_point">' + p.score + '</div></li>';
                            $('#ranking_week').append(li_el);
                        });
                    }
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });
        }
                
        function generateRecordList() {
            app.mobileApp.showLoading();
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + '}';
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
                    "id": "contestMyHistory",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {

                        $('#ranking_week').empty();
                        
                        var dataSource = [];
                        $.each(response.data, function (i, p) {
                            dataSource.push({
                                contestStatus: p.contestStatus,
                                totalEntry: p.totalEntry,
                                entrySeq: p.entrySeq,
                                totalMileage: p.totalMileage,
                                contestName: p.contestName,
                                totalReward: p.totalReward,
                                totalJoin: p.totalJoin,
                                contestSeq: p.contestSeq,
                                entryFee: p.entryFee,
                                guaranteed: p.guaranteed,
                                rewardCount: p.rewardCount,
                                contestType: p.contestType,
                                roundDate: timeGenerate(p.roundDate)
                            });
                        });
                        
                        console.log(dataSource);
                        
                        $("#recordList").kendoMobileListView({
                            dataSource: dataSource,
                            template: $("#recordListTemplate").html()
                        });
                        
                    }
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });
        }
        
        //var weekDay = new Array("Sun.","Mon.","Tue.","Wed.","Thu.","Fri.","Sat.");
        
        var timeGenerate = function(timeValue) {
            console.log(timeValue);
            timeValue = timeValue.toString();
            
            var dateLabel = timeValue.substring(0,4) + "." + timeValue.substring(4,6) + "." + timeValue.substring(6,8);
           
            return dateLabel;

        };
        
        function recordView(e) {
            var btns = e.button.data();
            if(btns.rel) {
                app.mobileApp.navigate('views/recordDetailVu.html?contest=' + btns.rel, 'slide');
            }

            app.mobileApp.hideLoading();
        }
      
      
        /* */
        
        var thisRecordTab = "TR";
        var thisContest = "";
        var nowRecordRank = 0;
        var totalRank = 0;
        var contestReward = 0;
        
        
        var rankDataSource = new kendo.data.DataSource({
            transport: {
                read: function(options) {
                    var newArr = rowDataList;
                    options.success(newArr);                        
                }
            }
        });
        
        var rowDataList = [];
        
        function doContestReward() {
            if(contestReward === 0) {
                app.mobileApp.hideLoading();
                
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + ',"contestSeq":' + thisContest + '}';
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
                        "id": "checkContestReward",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            var rowData = response.data;
                            if(rowData.rewardType !== undefined && rowData.rewardType === 1) {
                                app.showAlert('보상이 지급되었습니다.','안내', function() {
                                    uu_data.cash = uu_data.cash + rowData.reward;
                                    observableView();
                                });
                            }
                        }
                    },
                    error: function(e) {
                        console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    },
                    complete: function() {
                        app.mobileApp.hideLoading();
                    }
                });
                
            } else {
                app.showAlert('이미 보상을 받으셨습니다.','안내');
            }
        }
        
        function getContestResult() {
            app.mobileApp.showLoading();
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","contestId":' + thisContest + ',"memSeq":' + uu_data.memSeq + ',"lastId":0}';
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
                    "id": "getContestRank",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                        var rowData = response.data;
                        var rowLength = rowData.list.length;
                        console.log(rowData);
                        if(rowLength > 0) {
                            var nowRankIndex = rowData.list.length - 1;
                            nowRecordRank = rowData.list[nowRankIndex]['rank'];
                        }
                        else
                        {
                            nowRecordRank = 0;
                        }
                        
                        contestReward = rowData.rewardYn;
                        if(contestReward > 0) {
                            $('.btn-do-reward').addClass('rewardComplete');
                        }
                        $('#contestResult__user__d').html(uu_data.nick);
                        $('#contestResult__rank__d').html(rowData.myRank + "위");
                        $('#contestResult__reward__d').html(numberFormat(rowData.reward));
                        
                        //rowDataList = [];
                        $('#play_result_list__d').empty();
                        $.each(rowData.list, function (i, p) {
                            //rowDataList.push({rank: p.rank, nick: p.nick, score: p.score});
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.rank + '</div><div class="listitem_name">' + p.nick + '</div><div class="listitem_point">' + p.score + '</div></li>';
                            $('#play_result_list__d').append(li_el);
                        });
                        
                    }
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });
        }   
        
        function getContestResultRankMore() {
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","contestId":' + thisContest + ',"memSeq":' + uu_data.memSeq + ',"lastId":' + nowRecordRank + '}';
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
                    "id": "getContestRank",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                        var rowData = response.data;
                        var rowLength = rowData.list.length;
                        
                        if(rowLength > 0) {
                            var nowRankIndex = rowData.list.length - 1;
                            
                            if(rowData.totalRanking <= rowData.list[nowRankIndex]['rank']) {
                                nowRecordRank = 0;
                            } else {
                                nowRecordRank = rowData.list[nowRankIndex]['rank'];
                            }
                        }
                        else
                        {
                            nowRecordRank = 0;
                        }
                        
                        $('#play_result_list__d').empty();
                        $.each(rowData.list, function (i, p) {
                            //rowDataList.push({rank: p.rank, nick: p.nick, score: p.score});
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.rank + '</div><div class="listitem_name">' + p.nick + '</div><div class="listitem_point">' + p.score + '</div></li>';
                            $('#play_result_list__d').append(li_el);
                        });
                    }
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                    app.mobileApp.hideLoading();
                }
            });
        }   

        function getTeamScore() {
            app.mobileApp.showLoading();
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","contestId":' + thisContest + ',"memSeq":' + uu_data.memSeq + '}';
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
                    "id": "getMyentryScore",
                    "param":param
                },
                success: function(response) {
                    if (response.code === 0) {
                         
                        $('#play_result_teams_core__d').empty();
                        console.log(response.data);
                        $.each(response.data, function (i, p) {
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.posType + '</div><div class="listitem_name">' + p.playerName + '</div><div class="listitem_point">' + p.score + ' <span>PT</span></div></li>';
                            $('#play_result_teams_core__d').append(li_el);
                        });
                    }
                },
                error: function(e) {
                    console.log("error - setupPlayerOnLeague : " + JSON.stringify(e));
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });
        }
        
        function resultInit(e) {
            
            observableView();
            
            nowRecordRank = 0;
            totalRank = 0;
            contestReward = 0;
            var param = e.view.params;
            thisContest = param.contest;
            if(thisContest) {
                getContestResult();
                                
                var scroller = e.view.scroller;

                scroller.setOptions({
                    pullToRefresh: true,
                    pull: function(){
                        console.log("pull event");
                        if(thisRecordTab === "TR") {
                            getContestResultRankMore();
                        } 
                        setTimeout(function() { scroller.pullHandled(); }, 400);
                    }
                });
                
            } else {
                
            }
        }
        
        
       var playResultTotal = function() {
            $('#tabstrip_live_result__d').removeClass('ts');
            $('#tabstrip_upcoming_result__d').addClass('ts');
            $('#result_role_record__d').addClass('hide');
            $('#tab_live_result__d').addClass('hide');
            $('#result_role_rank__d').removeClass('hide');
            $('#tab_upcomming_result__d').removeClass('hide');
            $('#tab_result_team_score__d').addClass('hide');
            thisRecordTab = "TR";
        };
        
        var playResultTeam = function() {
            $('#tabstrip_upcoming_result__d').removeClass('ts');
            $('#tabstrip_live_result__d').addClass('ts');
            $('#tab_upcomming_result__d').addClass('hide');
            $('#result_role_rank__d').addClass('hide');
            $('#tab_live_result__d').removeClass('hide');
            $('#result_role_record__d').removeClass('hide');
            $('#tab_result_team_score__d').removeClass('hide');
            thisRecordTab = "TS";
            getTeamScore();
        };
        
        
        
        return {
            init: init,
            initRank: initRank,
            initRecord: initRecord,
            rankSeason: rankSeason,
            rankWeekly: rankWeekly,
            recordView: recordView,
            playResultTotal: playResultTotal,
            playResultTeam: playResultTeam,
            resultInit: resultInit
        };
    }());

    return ResnrnkProcess;
}());
