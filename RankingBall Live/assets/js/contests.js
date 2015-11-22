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
        $(document).on('click','a.myContest', function() {
            
            var contest = $(this).attr('data-rel');
            var contestStatus = parseInt($(this).attr('data-status'));
                        
            if(contest !== "" && contestStatus === 1) {
                navigator.notification.confirm("엔트리를 수정하시겠습니까?", function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       
                       //app.Entry.initEntryDataUpdate(contest);
                       var entryUrl = 'views/entryUpdateView.html?contest=' + contest + '&mode=ed';
                       app.mobileApp.navigate(entryUrl, 'slide');
                   } else {
                       closeModal();
                   }
                }, '알림', ['확인', '취소']);
                return false;
            } else if(contest !== "" && contestStatus === 2) {
                app.showError("게임 진행 중에는 들어갈 수 없습니다.");
                return false;
            } else if(contest !== "" && contestStatus === 3) {
                navigator.notification.confirm("게임 결과를 확인하시겠습니까?", function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       app.mobileApp.navigate('views/playResultView.html', 'slide');
                   } else {
                       closeModal();
                   }
                }, '알림', ['확인', '취소']);
                return false;
            }

        });
        
        function init() {
            observableView();
            matchPlay();
            myContestList();
        }
        
        function onShow() {
            observableView();
            matchPlay();
            myContestList();
            
            //matchParticipating
        }
        
        function playInit(e) {
            var param = e.view.params;
            
            app.mobileApp.showLoading();
            
            currentContestType = param.bar;

            console.log(param.bar + " : " + currentContestType);
            
            observableView();
            setTimeout(function() {
                if(currentContestType === "F") {
                    resetViewTitle(e,"featured");
                    setContestList(contestPartList['cf']);
                    //$('ul#playListBox').html(contestFtypeData.arr);
                } else if(currentContestType === "5") {
                    resetViewTitle(e,"50 / 50");
                    setContestList(contestPartList['c5'])
                    //$('ul#playListBox').html(contest5typeData.arr);
                } else {
                    resetViewTitle(e,"랭킹전");
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
                    resetViewTitle(e,"featured");
                    setContestList(contestPartList['cf'])
                    //$('ul#playListBox').html(contestFtypeData.arr);
                } else if(currentContestType === "5") {
                    resetViewTitle(e,"50 / 50");
                    setContestList(contestPartList['c5'])
                    //$('ul#playListBox').html(contest5typeData.arr);
                } else {
                    resetViewTitle(e,"랭킹전");
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
            app.mobileApp.navigate('views/landingView.html', 'slide:right');
        }
        
        var resetViewTitle = function(e,t) {
            var navbar = e.view
                .header
                .find(".km-navbar")
                .data("kendoMobileNavBar");

            navbar.title(t);
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
            
            console.log( JSON.stringify(checkedData) );
            
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
                console.log(errorMessage.game_time);
            }
            
            if( checkedData.contestStatus === 2 ) {
                app.showError(errorMessage.game_started);

            } else if( checkedData.contestStatus === 3 ) {
                navigator.notification.confirm(errorMessage.game_closed, function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       var resVwUrl = 'views/playResultView.html?contest=' + joinMatchNo;
                       pageTransition(resVwUrl);
                       //$("#dashboard-view").data("kendoMobileView").destroy()
                   } else {
                       closeModal();
                   }
                }, '알림', ['확인', '취소']);

            } else {
                if( parseInt(checkedData.entryFee) > parseInt(uu_data.cash) ) {
                    navigator.notification.confirm(errorMessage.game_cash, function (confirmed) {
                       if (confirmed === true || confirmed === 1) {
                           pageTransition('views/shopView.html');
                           $("#mv_play_list").data("kendoMobileView").destroy();
                       } else {
                           closeModal();
                       }
                    }, '알림', ['충전하기', '나가기']);

                } else {
                    
                    console.log(joinMatchNo + " : " + JSON.stringify(checkedData));
                    
                    var confirmMessage;
                    if(checkedData.entryFee === 0) {       
                        closeModal();
                        app.mobileApp.navigate('views/entryRegistrationView.html?contest=' + joinMatchNo + '&fee=' + checkedData.entryFee + '&mode=reg', 'slide');
                    } else {
                        confirmMessage = "해당 경기에 참여 시 " + numberFormat(checkedData.entryFee) + "의 입장료가 소모됩니다.\n\n경기에 참여하시겠습니까?";
                        navigator.notification.confirm(confirmMessage, function (confirmed) {
                           if (confirmed === true || confirmed === 1) {
                                
                                app.mobileApp.navigate('views/entryRegistrationView.html?contest=' + joinMatchNo + '&fee=' + checkedData.entryFee + '&mode=reg', 'slide');
                               closeModal();
                           } else {
                               closeModal();
                           }
                        }, '알림', ['확인', '취소']);
                    }
                    
                    
                    //app.Entry.initEntryData();
                    //closeModal();
                    //app.mobileApp.navigate('views/entryRegistrationView.html?contest=' + joinMatchNo + '&fee=' + checkedData.entryFee + '&mode=reg', 'slide');
                }
                

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
                    modalHtml = '<dt>플레이 방 이름</dt><dd>' + v.contestName + '</dd>' + 
                    '<dt>경기방식</dt><dd>' + contestTypeLabel(v.contestType) + '</dd>' +
                    '<dt>참여 인원 및 참여가능 인원</dt><dd>' + v.totalEntry + '명 / ' + v.maxEntry + '명</dd>' +
                    '<dt>입장료</dt><dd>' + v.entryFee + '</dd>' +
                    '<dt>경기보상</dt><dd class="esp">' + v.contestReward + '</dd>';
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
                app.showError(errorMessage.game_param);
                return false;
            }
        };
        
        var contestTypeLabel = function(c) {
            if(c === 1) {
                return "50 / 50";
            } else if(c === 2) {
                return "랭킹전";
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
            //setTimeout(function() {
                //$('#play-title').html('featured');
                app.mobileApp.navigate('views/playListView.html?bar=F', 'slide');
                app.mobileApp.hideLoading();
            //},300);
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
        };
        
        var playResultTeam = function() {
            $('#tabstrip_upcoming_result').removeClass('ts');
            $('#tabstrip_live_result').addClass('ts');
            $('#tab_upcomming_result').addClass('hide');
            $('#result_role_rank').addClass('hide');
            $('#tab_live_result').removeClass('hide');
            $('#result_role_record').removeClass('hide');
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
                    $('#sort-match-label').html("이름");
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelName').addClass('sort-l');
                    $('#orderByName').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.contestName - b.contestName);
                        else return (b.contestName - a.contestName);
                    });
                    break;
                case 2:
                    $('#sort-match-label').html("인원");
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelNumber').addClass('sort-l');                  
                    $('#orderByNumber').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.maxEntry - b.maxEntry);
                        else return (b.maxEntry - a.maxEntry);
                    });
                    break;
                case 3:
                    $('#sort-match-label').html("입장료");
                    $('#sort-match-ico').addClass(orderIco);
                    $('#orderLabelFee').addClass('sort-l');  
                    $('#orderByFee').find('span').removeClass('ic-triangle-n').addClass(orderIco);
                    sortData  = sortData.sort(function(a, b) {
                        if (data.order === "asc") return (a.entryFee - b.entryFee);
                        else return (b.entryFee - a.entryFee);
                    });
                    break;
                case 4:
                    $('#sort-match-label').html("상금");
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
                navigator.notification.confirm("엔트리를 수정하시겠습니까?", function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       
                       //app.Entry.initEntryDataUpdate(contest);
                       var entryUrl = 'views/entryUpdateView.html?contest=' + contest + '&mode=ed';
                       app.mobileApp.navigate(entryUrl, 'slide');
                   } else {
                       closeModal();
                   }
                }, '알림', ['확인', '취소']);
                return false;
            } else if(contest !== "" && contestStatus === 2) {
                app.showError("게임 진행 중에는 들어갈 수 없습니다.");
                return false;
            } else if(contest !== "" && contestStatus === 3) {
                navigator.notification.confirm("게임 결과를 확인하시겠습니까?", function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       app.mobileApp.navigate('views/playResultView.html', 'slide');
                   } else {
                       closeModal();
                   }
                }, '알림', ['확인', '취소']);
                return false;
            }
        };
        
        
        return {
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
            closeModal: closeModal,
            joinMatch: joinMatch,
            joinMatchConfirm: joinMatchConfirm,
            listOrder: listOrder,
            observeMatch: observeMatch
        };
    }());

    return contestProcess;
}());