/**
 * Object Control view model
 */
var app = app || {};

app.Contests = (function () {
    'use strict';
    
    var contestProcess = (function () {

        var joinMatchNo = "";
        var checkedData = "";
        
        $(document).on('click','.inboxList-btn', function() {
            joinMatch( $(this) );
        });
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
                        
            matchPlay();
            
            observableView();
            //loadContestData();
            restoreMatchs();
            
            myContestList();
        }
        
        function playInit(e) {
            var param = e.view.params;
            
            app.mobileApp.showLoading();
            
            currentContestType = param.bar;

            observableView();
            setTimeout(function() {
                if(currentContestType === "F") {
                    $('ul#playListBox').html(contestFtypeData);
                } else if(currentContestType === "5") {
                    $('ul#playListBox').html(contest5typeData);
                } else {
                    $('ul#playListBox').html(contestGtypeData);
                }
                
                app.mobileApp.hideLoading();
            },300);
        }
        
        function onShowReset(e) {
            var param =  e.view.params;
            currentContestType = param.bar;
            setTimeout(function() {
                if(currentContestType === "F") {
                    $('ul#playListBox').html(contestFtypeData);
                } else if(currentContestType === "5") {
                    $('ul#playListBox').html(contest5typeData);
                } else {
                    $('ul#playListBox').html(contestGtypeData);
                }
                
                app.mobileApp.hideLoading();
            },300);
        }
                
        function resultInit() {

        }
        
        function onShow() {
            init();
        }
        
        
        var myContestList = function() {

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
        };
                
        var matchPlay = function() {
            $('#tabstrip_live').removeClass('ts');
            $('#tabstrip_upcoming').addClass('ts');
            $('#tab_live').addClass('hide');
            $('#tab_upcomming').removeClass('hide');
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
                return false;
            } else if( checkedData.contestStatus === 3 ) {
                navigator.notification.confirm(errorMessage.game_closed, function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       var resVwUrl = 'views/playResultView.html?contest=' + joinMatchNo;
                       pageTransition(resVwUrl);
                   } else {
                       closeModal();
                   }
                }, '알림', ['확인', '취소']);
                return false;
            }
            
            if( parseInt(checkedData.entryFee) > parseInt(uu_data.cash) ) {
                navigator.notification.confirm(errorMessage.game_cash, function (confirmed) {
                   if (confirmed === true || confirmed === 1) {
                       pageTransition('views/shopView.html');
                   } else {
                       closeModal();
                   }
                }, '알림', ['충전하기', '나가기']);
                return false;
            }
            
            app.Entry.initEntryData();
            var entryUrl = 'views/entryRegistrationView.html?contest=' + joinMatchNo + '&fee=' + checkedData.entryFee + '&mode=reg';
            
            closeModal();
            app.mobileApp.navigate(entryUrl, 'slide');
        }
        
        var joinMatch = function(e) {
            //var data = e.button.data();
            var rel = parseInt(e.attr('data-rel'));
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
                return "featured";
            } else if(c === 2) {
                return "50 / 50";    
            } else {
                return "랭킹전";
            }
        }
        
        var closeModal = function(e) {
            checkedData = "";
            joinMatchNo = "";
            
            $("#join-match").data("kendoMobileModalView").close();
        };
        
        var resultMatch = function(e) {
            //var data = e.button.data();
            app.ObjControl.reloadContest();
            app.showError(errorMessage.game_started);
            return false;
        }
        
        var restoreMatchs = function() {
            //$('ul#playListBox').empty();
        }
        
        var joinFeatured = function(e) {
            e.preventDefault();
            if( contestFtypeData === "" ) {
                app.showError(errorMessage.game_empty);
                return false;
            }
            
            app.mobileApp.showLoading();
            //$('ul#playListBox').html(contestFtypeData);
            setTimeout(function() {
                app.mobileApp.navigate('views/playListView.html?bar=F', 'slide');
                $('#play-title').html('featured');
                app.mobileApp.hideLoading();
            },300);
        };
       
        var joinFF = function(e) {
            e.preventDefault();
            if( contest5typeData === "" ) {
                app.showError(errorMessage.game_empty);
                return false;
            }
            app.mobileApp.showLoading();
            //$('ul#playListBox').html(contest5typeData);
            setTimeout(function() {
                app.mobileApp.navigate('views/playListView.html?bar=5', 'slide');
                $('#play-title').html('50 / 50');
                app.mobileApp.hideLoading();
            },300);
        };
        
        var joinGuarateed = function(e) {
            e.preventDefault();
            if( contestGtypeData === "" ) {
                app.showError(errorMessage.game_empty);
                return false;
            }
            app.mobileApp.showLoading();
            //$('ul#playListBox').html(contestGtypeData);
            setTimeout(function() {
                app.mobileApp.navigate('views/playListView.html?bar=G', 'slide');
                $('#play-title').html('랭킹전');
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
        
        var playResult = function(e) {
            var data = e.button.data();
            
            app.mobileApp.navigate('views/playResultView.html', 'slide');
        };
        
        var playEdit = function(e) {
            var data = e.button.data();
        };
        
        var recordInfo = function(e) {
            app.mobileApp.navigate('views/playResultRecordView.html', 'slide');
        }
        
        return {
            init: init,
            playInit: playInit,
            resultInit: resultInit,
            onShow: onShow,
            onShowReset: onShowReset,
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
            joinMatchConfirm: joinMatchConfirm
        };
    }());

    return contestProcess;
}());