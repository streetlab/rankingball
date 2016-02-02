/**
 * Object Control view model
 */
var app = app || {};

app.Contests = (function () {
    'use strict';
    
    var contestProcess = (function () {

        var joinMatchNo = "";
        var checkedData = "";

        $(document).on('click','.inboxList-off-btn', function() {
            resultMatch( $(this) );
        });
 
        function langExchange() 
        {
            console.log(laf);
            app.langExchange.exchangeLanguage(laf);    
        }
        
        function init() {
            observableView();
            matchPlay();
            liveContestList();
            myContestList();
        }
        
        function onShow(e) {
            
            observableView();
            liveContestList();
            matchPlay();
            myContestList();

            var param = e.view.params;
            if(param.tab !== undefined && param.tab === "m") {
                matchParticipating();
            }
        }
        
        function playInit(e) {
            var param = e.view.params;
            
            app.mobileApp.showLoading();
            
            currentContestType = param.bar;

            console.log(param.bar + " : " + currentContestType);
            
            observableView();
            setTimeout(function() {
                if(currentContestType === "F") {
                    resetViewTitle(e,"Featured");
                    setContestList(contestPartList['cf']);
                    //$('ul#playListBox').html(contestFtypeData.arr);
                } else if(currentContestType === "5") {
                    resetViewTitle(e,"50 / 50");
                    setContestList(contestPartList['c5'])
                    //$('ul#playListBox').html(contest5typeData.arr);
                } else {
                    resetViewTitle(e,"Rank match");
                    setContestList(contestPartList['cg'])
                    //$('ul#playListBox').html(contestGtypeData.arr);
                }
                
                app.mobileApp.hideLoading();
            },300);
        }
        
        function onShowReset(e) {
            var param =  e.view.params;
            currentContestType = param.bar;
            
            console.log(param.bar + " : " + currentContestType);
            observableView();
            
            setTimeout(function() {
                if(currentContestType === "F") {
                    resetViewTitle(e,"Featured");
                    setContestList(contestPartList['cf'])
                    //$('ul#playListBox').html(contestFtypeData.arr);
                } else if(currentContestType === "5") {
                    resetViewTitle(e,"50 / 50");
                    setContestList(contestPartList['c5'])
                    //$('ul#playListBox').html(contest5typeData.arr);
                } else {
                    resetViewTitle(e,"Rank match");
                    setContestList(contestPartList['cg'])
                    //$('ul#playListBox').html(contestGtypeData.arr);
                }
                
                app.mobileApp.hideLoading();
            },300);
        }
  
        function setContestList(sortData) {
            
            var dataSource = new kendo.data.DataSource({
                data: sortData
            });
            
            $("#playListBox").empty();
            $("#playListBox").kendoMobileListView({
                dataSource: dataSource,
                template: $("#contestListTemplate").html()
            });
            
        }
        
        function homeService() {
            //$("#mv_play_contest").data("kendoMobileView").destroy();
            app.mobileApp.navigate('views/landingVu.html', 'slide:right');
        }
        
        var resetViewTitle = function(e,t) {
            var navbar = e.view
                .header
                .find(".km-navbar")
                .data("kendoMobileNavBar");

            navbar.title(t);
        };
        
       var liveContestList = function() {
            
            var dataSource;
            
            console.log(contestPartList);
            console.log(contestMyPartList);
           
            if(contestPartList['cf'].length === 0) {
                $('#cgt_list1').html('');
                $('#cmath-cnt-f').html(0);
                $('#acco_cgt1').removeClass('ico-open');
            } else {
                
                dataSource = new kendo.data.DataSource({
                    data: contestPartList['cf']
                });
                
                $("#cgt1").empty();
                $("#cgt1").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#liveContestListTemplate").html()
                });
                
                //$('#gt_list1').html('<ul id="gt1" class="collapseInboxList">' + muContestF.arr + '</ul>');
                $('#cmath-cnt-f').html(contestPartList['cf'].length);
                $('#acco_cgt1').addClass('ico-open');
            }
            
            if(contestPartList['c5'].length === 0) {
                $('#cgt_list2').html('');
                $('#cmath-cnt-5').html(0);
                $('#acco_cgt2').removeClass('ico-open');
            } else {
                
                dataSource = new kendo.data.DataSource({
                    data: contestPartList['c5']
                });
                $("#cgt2").empty();
                $("#cgt2").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#liveContestListTemplate").html()
                });
                
                //$('#gt_list2').html('<ul id="gt2" class="collapseInboxList">' + muContest5.arr + '</ul>');
                $('#cmath-cnt-5').html(contestPartList['c5'].length);
                $('#acco_cgt2').addClass('ico-open');
            }
            
            if(contestPartList['cg'].length === 0) {
                $('#cgt_list3').html('');
                $('#cmath-cnt-g').html(0);
                $('#acco_cgt3').removeClass('ico-open');
            } else {
                
                dataSource = new kendo.data.DataSource({
                    data: contestPartList['cg']
                });
                $("#cgt3").empty();
                $("#cgt3").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#liveContestListTemplate").html()
                });
                
                //$('#gt_list3').html('<ul id="gt3" class="collapseInboxList">' + muContestG.arr + '</ul>');
                $('#cmath-cnt-g').html(contestPartList['cg'].length);
                $('#acco_cgt3').addClass('ico-open');
            }
        };
        
        var contestAccordon = function(e) {
            var data = e.button.data();
            var els_this = $('#accoList_' + data.rel);
            var els_ul = $('#' + data.rel);
            els_ul.slideToggle( "2500", "swing", function() {
                        if(els_ul.is(":visible")) {
                            els_this.find('span.collapse-btn').addClass('ico-open');
                        } else {
                            els_this.find('span.collapse-btn').removeClass('ico-open');
                        }
                    }
                );
        };
        
        var myContestList = function() {
            
            var dataSource;
            
            if(contestMyPartList['cf'].length === 0) {
                $('#gt_list1').html('');
                $('#math-cnt-f').html(0);
                $('#acco_gt1').removeClass('ico-open');
            } else {
                
                dataSource = new kendo.data.DataSource({
                    data: contestMyPartList['cf']
                });
                
                $("#gt1").empty();
                $("#gt1").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#myContestListTemplate").html()
                });
                
                //$('#gt_list1').html('<ul id="gt1" class="collapseInboxList">' + muContestF.arr + '</ul>');
                $('#math-cnt-f').html(contestMyPartList['cf'].length);
                $('#acco_gt1').addClass('ico-open');
            }
            
            if(contestMyPartList['c5'].length === 0) {
                $('#gt_list2').html('');
                $('#math-cnt-5').html(0);
                $('#acco_gt2').removeClass('ico-open');
            } else {
                
                dataSource = new kendo.data.DataSource({
                    data: contestMyPartList['c5']
                });
                $("#gt2").empty();
                $("#gt2").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#myContestListTemplate").html()
                });
                
                //$('#gt_list2').html('<ul id="gt2" class="collapseInboxList">' + muContest5.arr + '</ul>');
                $('#math-cnt-5').html(contestMyPartList['c5'].length);
                $('#acco_gt2').addClass('ico-open');
            }
            
            if(contestMyPartList['cg'].length === 0) {
                $('#gt_list3').html('');
                $('#math-cnt-g').html(0);
                $('#acco_gt3').removeClass('ico-open');
            } else {
                
                dataSource = new kendo.data.DataSource({
                    data: contestMyPartList['cg']
                });
                $("#gt3").empty();
                $("#gt3").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#myContestListTemplate").html()
                });
                
                //$('#gt_list3').html('<ul id="gt3" class="collapseInboxList">' + muContestG.arr + '</ul>');
                $('#math-cnt-g').html(contestMyPartList['cg'].length);
                $('#acco_gt3').addClass('ico-open');
            }
        };
                
        var matchPlay = function() {
            $('#tabstrip_live').removeClass('ts');
            $('#tabstrip_upcoming').addClass('ts');
            $('#tab_live').addClass('hide');
            $('#tab_upcomming').removeClass('hide');
            
            $('#math-cnt-ff').html(contestPartList['cf'].length);
            $('#math-cnt-f5').html(contestPartList['c5'].length);
            $('#math-cnt-fg').html(contestPartList['cg'].length);
        };
        
        var matchParticipating = function() {
            $('#tabstrip_upcoming').removeClass('ts');
            $('#tabstrip_live').addClass('ts');
            $('#tab_upcomming').addClass('hide');
            $('#tab_live').removeClass('hide');
        };
        
        var pageTransition = function() {
            closeModal();
            app.mobileApp.navigate('views/shopView.html', 'slide');
        };
        
        var joinMatchConfirm = function() {
            
            //console.log( JSON.stringify(checkedData) );
            
            var today = new Date();
            var timeValue = checkedData.startTime;
            var yy = timeValue.substring(0,4);
            var mm = timeValue.substring(4,6);
            var dd = timeValue.substring(6,8);
            var h = timeValue.substring(8,10);
            var m = timeValue.substring(10,12);
            var s = timeValue.substring(12,14);
                        
            var startDate = new Date(yy,Number(mm)-1,dd,h,m,s);
            
            if( ( startDate.getTime() - today.getTime() ) < 0 ) {
                //app.showError(errorMessage.game_time);
                //return false;
                console.log($.langScript[laf]['noti_004']);
            }
            
            if( checkedData.contestStatus === 2 ) {
                app.showError($.langScript[laf]['noti_04']);

            } else if( checkedData.contestStatus === 3 ) {
                navigator.notification.confirm(errorMessage.game_closed, function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       var resVwUrl = 'views/playResultView.html?contest=' + joinMatchNo;
                       pageTransition(resVwUrl);
                       //$("#dashboard-view").data("kendoMobileView").destroy()
                   } else {
                       closeModal();
                   }
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);

            } else {
                app.mobileApp.navigate('views/entryRegistrationView.html?contest=' + joinMatchNo + '&fee=' + checkedData.entryFee + '&mode=reg', 'slide');
                closeModal();
            }
            

        }
        
        var joinMatch = function(e) {
            var data = e.button.data();
            var rel = parseInt(data.rel);
            
            console.log(rel);
            
            var modalHtml = "";
            checkedData = "";
            joinMatchNo = "";

            
            
            $.each(contestListData, function(i, v) {
                if (parseInt(v.contestSeq) === rel) {
                    modalHtml = '<dt>' + $.langLabel[laf][69] + '</dt><dd>' + v.contestName + '</dd>' + 
                    '<dt>' + $.langLabel[laf][70] + '</dt><dd>' + contestTypeLabel(v.contestType) + '</dd>' +
                    '<dt>' + $.langLabel[laf][71] + '</dt><dd>' + v.totalEntry + ' / ' + v.maxEntry + '</dd>' +
                    '<dt>' + $.langLabel[laf][72] + '</dt><dd>' + numberFormat(v.entryFee) + '</dd>' +
                    '<dt>' + $.langLabel[laf][73] + '</dt><dd class="esp">' + numberFormat(v.rewardValue) + '</dd>';
                    checkedData = v;
                    joinMatchNo = rel;
                    return;
                }
            });
            
            //'<dt>순위별 보상</dt><dd>1위 ~ 5위 40루</dd>'
            if( joinMatchNo ) {
                $('#modal-info').html(modalHtml);
                $("#join-match").data("kendoMobileModalView").open();    
            } else {
                //console.log("Error Find joinMatchNo");
                app.showError(errorMessage.game_param);
                return false;
            }
        };
        
        var contestTypeLabel = function(c) {
            if(c === 1) {
                return "50 / 50";
            } else if(c === 2) {
                return "Rank match";
            } else {
                return "";
            }
        }
        
        var closeModal = function() {
            checkedData = "";
            joinMatchNo = "";
            
            $("#join-match").data("kendoMobileModalView").close();
        };
        
        var resultMatch = function() {
            //var data = e.button.data();
            app.ObjControl.reloadContest();
            app.showError(errorMessage.game_started);
            return false;
        }

        
        var joinFeatured = function() {
            //e.preventDefault();
            if( contestPartList['cf'].length === 0 ) {
                app.showError(errorMessage.game_empty);
                return false;
            }
            
            app.mobileApp.showLoading();
            //$('ul#playListBox').html(contestFtypeData);
            setTimeout(function() {
                //$('#play-title').html('featured');
                app.mobileApp.navigate('views/playListView.html?bar=F', 'slide');
                app.mobileApp.hideLoading();
            },300);
        };
       
        var joinFF = function(e) {
            e.preventDefault();
            if( contestPartList['c5'].length === 0 ) {
                app.showError(errorMessage.game_empty);
                return false;
            }
            app.mobileApp.showLoading();
            //$('ul#playListBox').html(contest5typeData);
            setTimeout(function() {
                //$('#play-title').html('50 / 50');
                app.mobileApp.navigate('views/playListView.html?bar=5', 'slide');
                app.mobileApp.hideLoading();
            },300);
        };
        
        var joinGuarateed = function(e) {
            e.preventDefault();
            if( contestPartList['cg'].length === 0 ) {
                app.showError(errorMessage.game_empty);
                return false;
            }
            app.mobileApp.showLoading();
            //$('ul#playListBox').html(contestGtypeData);
            setTimeout(function() {
                //$('#play-title').html('랭킹전');
                app.mobileApp.navigate('views/playListView.html?bar=G', 'slide');
                app.mobileApp.hideLoading();
            },300);
        };
        
        var customAccordon = function(e) {
            var data = e.button.data();
            var els_this = $('#accoList_' + data.rel);
            var els_ul = $('#' + data.rel);
            els_ul.slideToggle( "2500", "swing", function() {
                        if(els_ul.is(":visible")) {
                            els_this.find('span.collapse-btn').addClass('ico-open');
                        } else {
                            els_this.find('span.collapse-btn').removeClass('ico-open');
                        }
                    }
                );
        };
        
        
        var playResultTotal = function() {
            $('#tabstrip_live_result').removeClass('ts');
            $('#tabstrip_upcoming_result').addClass('ts');
            $('#result_role_record').addClass('hide');
            $('#tab_live_result').addClass('hide');
            $('#result_role_rank').removeClass('hide');
            $('#tab_upcomming_result').removeClass('hide');
            $('#tab_result_team_score').addClass('hide');
            thisTab = "TR";
        };
        
        var playResultTeam = function() {
            $('#tabstrip_upcoming_result').removeClass('ts');
            $('#tabstrip_live_result').addClass('ts');
            $('#tab_upcomming_result').addClass('hide');
            $('#result_role_rank').addClass('hide');
            $('#tab_live_result').removeClass('hide');
            $('#result_role_record').removeClass('hide');
            $('#tab_result_team_score').removeClass('hide');
            thisTab = "TS";
            getTeamScore();
        };
        
        var playResult = function() {
           // var data = e.button.data();
            
            app.mobileApp.navigate('views/playResultView.html', 'slide');
        };
        
        var playEdit = function(e) {
            var data = e.button.data();
        };
        
        var recordInfo = function(e) {
            app.mobileApp.navigate('views/playResultRecordView.html', 'slide');
        }
        
        
        var listOrder = function(e) {
            
            app.mobileApp.showLoading();
            
            var data = e.button.data();
            var orderType = parseInt(data.val);
            var orderSet = data.order;
            var orderIco, sortData;

            $('.sortClass').removeClass('sort-l');
            $('#popover-match-vw span').removeClass( function(index, css) {
                return (css.match(/(^|\s)ic-\S+/g) || []).join(' ');
            }).addClass('ic-triangle-n');

            $('#sort-match-ico').removeClass( function(index, css) {
                return (css.match(/(^|\s)ic-\S+/g) || []).join(' ');
            });            
            
            if(orderSet === "desc") {
                orderIco = "ic-triangle-n-on";
                data.order = "asc";
            } else {
                orderIco = "ic-triangle-s-on";
                data.order = "desc";
            }

            if(currentContestType === "F") {
                sortData = contestPartList['cf'];
            } if(currentContestType === "G") {
                sortData = contestPartList['cg'];
            } else {
                sortData = contestPartList['c5'];
            }
                       
            switch(orderType) {
                case 1:
                    $('#sort-match-label').html($.langLabel[laf][8]);
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelName').addClass('sort-l');
                    $('#orderByName').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.contestName - b.contestName);
                        else return (b.contestName - a.contestName);
                    });
                    break;
                case 2:
                    $('#sort-match-label').html($.langLabel[laf][66]);
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelNumber').addClass('sort-l');                  
                    $('#orderByNumber').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.maxEntry - b.maxEntry);
                        else return (b.maxEntry - a.maxEntry);
                    });
                    break;
                case 3:
                    $('#sort-match-label').html($.langLabel[laf][27]);
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelFee').addClass('sort-l');  
                    $('#orderByFee').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.entryFee - b.entryFee);
                        else return (b.entryFee - a.entryFee);
                    });
                    break;
                case 4:
                    $('#sort-match-label').html($.langLabel[laf][67]);
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelReward').addClass('sort-l');
                    $('#orderByReward').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.rewardValue - b.rewardValue);
                        else return (b.rewardValue - a.rewardValue);
                    });
                    break;
            }

            
            var dataSource = new kendo.data.DataSource({
                data: sortData
            });
            
            $("#playListBox").empty();
            $("#playListBox").kendoMobileListView({
                dataSource: dataSource,
                template: $("#contestListTemplate").html()
            });
            
            app.mobileApp.hideLoading();
        }
        
        var observeMatch = function(e) {
            var data = e.button.data();
            var contest = parseInt(data.rel);
            var contestStatus = parseInt(data.status);
                        
            if(contest !== "" && contestStatus === 1) {
                navigator.notification.confirm($.langScript[laf]['noti_034'], function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       
                       //app.Entry.initEntryDataUpdate(contest);
                       var entryUrl = 'views/entryUpdateView.html?contest=' + contest + '&mode=ed';
                       app.mobileApp.navigate(entryUrl, 'slide');
                   }
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
            } else if(contest !== "" && contestStatus === 2) {
                app.showError($.langScript[laf]['noti_004']);
                return false;
            } else if(contest !== "" && contestStatus === 3) {
                navigator.notification.confirm($.langScript[laf]['noti_003'], function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       var resultUrl = 'views/playResultView.html?contest=' + contest;
                       app.mobileApp.navigate(resultUrl, 'slide');
                   }
                }, 'Notice', [$.langScript[laf]['btn_ok'], $.langScript[laf]['btn_cancel']]);
            }
        };
        
        var thisTab = "TR";
        var thisContest = "";
        var nowRank = 0;
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
                                app.showAlert($.langScript[laf]['noti_015'],'Notice', function() {
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
                app.showAlert($.langScript[laf]['noti_040'],'Notice');
            }
        }
        
        function getContestResult() {
                        
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
                            nowRank = rowData.list[nowRankIndex]['rank'];
                        }
                        else
                        {
                            nowRank = 0;
                        }
                        
                        contestReward = rowData.rewardYn;
                        if(contestReward > 0) {
                            $('.btn-do-reward').addClass('rewardComplete');
                        }
                        $('#contestResult__user').html(uu_data.nick);
                        $('#contestResult__rank').html(rowData.myRank + "위");
                        $('#contestResult__reward').html(numberFormat(rowData.reward));
                        
                        //rowDataList = [];
                        $('#play_result_list').empty();
                        $.each(rowData.list, function (i, p) {
                            //rowDataList.push({rank: p.rank, nick: p.nick, score: p.score});
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.rank + '</div><div class="listitem_name">' + p.nick + '</div><div class="listitem_point">' + p.score + '</div></li>';
                            $('#play_result_list').append(li_el);
                        });
                        
                        //console.log(rowDataList);
                        //$("#play_result_list").empty();
                        /*
                        rankDataSource = new kendo.data.DataSource({
                            data: rowData.list
                        });
                        */
                        //rankListFirst();
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
            
            var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","contestId":' + thisContest + ',"memSeq":' + uu_data.memSeq + ',"lastId":' + nowRank + '}';
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
                                nowRank = 0;
                            } else {
                                nowRank = rowData.list[nowRankIndex]['rank'];
                            }
                        }
                        else
                        {
                            nowRank = 0;
                        }
                        
                        console.log(rowData.list);
                        
                        $('#play_result_list').empty();
                        $.each(rowData.list, function (i, p) {
                            //rowDataList.push({rank: p.rank, nick: p.nick, score: p.score});
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.rank + '</div><div class="listitem_name">' + p.nick + '</div><div class="listitem_point">' + p.score + '</div></li>';
                            $('#play_result_list').append(li_el);
                        });
                        /*
                        rankDataSource = new kendo.data.DataSource({
                            data: rowData.list
                        });
                        */
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
                         
                        $('#play_result_teams_core').empty();
                        console.log(response.data);
                        $.each(response.data, function (i, p) {
                            var li_el = '<li class="clearfix rank"><div class="listitem_rank">' + p.posType + '</div><div class="listitem_name">' + p.playerName + '</div><div class="listitem_point">' + p.score + ' <span>PT</span></div></li>';
                            $('#play_result_teams_core').append(li_el);
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
        
        function rankListFirst() {
            //var html = '<ul id="play_result_list" class="tab_result_label resultRankList" data-role="listview"></ul>';
            $('#tab_upcomming_result')
                .empty()
                .append('<ul id="play_result_list" class="tab_result_label resultRankList" data-role="listview"></ul>');
            
            $("#play_result_list").kendoMobileListView({
                dataSource: rankDataSource,
                template: $("#myContestResult").html(),
                sort: {
                    field: "rank",
                    dir: "desc"
                }
            });
        }        
        
        function resultInit(e) {
            app.mobileApp.showLoading();

            observableView();
            
            nowRank = 0;
            totalRank = 0;
            contestReward = 0;
            var param = e.view.params;
            thisContest = param.contest;
            if(thisContest) {
                getContestResult();
                
                console.log("do result");
                //getContestResultRankMore();
                
                var scroller = e.view.scroller;

                scroller.setOptions({
                    pullToRefresh: true,
                    pull: function(){
                        console.log("pull event");
                        if(thisTab === "TR") {
                            getContestResultRankMore();
                            
                        } 
                        setTimeout(function() { scroller.pullHandled(); }, 400);
                    }
                });
            
                
                
            } else {
                
            }
        }
        
        return {
            langExchange: langExchange,
            init: init,
            playInit: playInit,
            onShow: onShow,
            onShowReset: onShowReset,
            homeService: homeService,
            matchPlay: matchPlay,
            matchParticipating: matchParticipating,
            playResultTotal: playResultTotal,
            playResultTeam: playResultTeam,
            playResult: playResult,
            recordInfo: recordInfo,
            playEdit: playEdit,
            joinFeatured: joinFeatured,
            joinFF: joinFF,
            joinGuarateed: joinGuarateed,
            customAccordon: customAccordon,
            contestAccordon: contestAccordon,
            closeModal: closeModal,
            joinMatch: joinMatch,
            joinMatchConfirm: joinMatchConfirm,
            listOrder: listOrder,
            observeMatch: observeMatch,
            resultInit: resultInit,
            doContestReward: doContestReward
        };
    }());

    return contestProcess;
}());