/**
 * Real Time Service model
 */
var app = app || {};

app.Hambugerz = (function () {
    'use strict';

    var funcz = (function () {
        
        var noticeData = [];
        var mailData = [];
        var eventData = [];
        var tapLast = "";
        
        function langExchange() 
        {
            app.langExchange.exchangeLanguage(laf);    
        }
        
        function init()
        {
            langExchange();
            var dHeight = parseInt($(window).height()) - 77;
            var sHeight = dHeight - 190;
            $('#hamburgers').height(dHeight);
            $('.profile-box').height(sHeight);
        }
        
        function showOn()
        {
            observableView();
            $('.card-face__name').html(uu_data.nick);
            $('.card-face__pincode').html(uu_data.pinValue);
        }
        
        function gnbMailbox()
        {
            showOn();
            transitionVu.getMailData();
        }
        function gnbInven()
        {
            showOn();
            transitionVu.getMailData();
        }
        
        function gnbDefInit(e)
        {
            var id = $('[data-role=view]:last').attr('id');
            if(id === "gnb_notice")
            {
                transitionVu.getNoticeJSON();
            } else if(id === "gnb_mail") {
                transitionVu.getNoticeJSON();
            }
            //langExchange();
            observableView();
        }
        
        function gnbNavi(e) 
        {
            var data = e.button.data();
            transitionVu.transferCase(data.rel);
        }
        
        var transitionVu = {
            transferCase: function(m) {
                var that = this;
                switch(m) {
                    case 'mail':
                        that.transferOn('views/gnbMailView.html');
                        break;
                    case 'inven':
                        that.transferOn('views/gnbInvenView.html');
                        break;
                    case 'conf':
                        that.transferOn('views/gnbSettingView.html');
                        break;
                    case 'noti':
                        that.transferOn('views/gnbNoticeView.html');
                        break;
                    case 'know':
                        that.transferOn('views/gnbGuideView.html');
                        break;
                }
            },
            transferOn: function(pg) {
                app.mobileApp.showLoading();
                setTimeout(function() {
                    app.mobileApp.navigate(pg, 'slide');
                    app.mobileApp.hideLoading();
                },300);
            },
            getNoticeJSON: function()
            {
                var that = this;
                app.mobileApp.showLoading();
                $.getJSON("http://scv.rankingball.com/asset/contents/announcements.json", function(result) {
                        
                        noticeData = result.notice;
                        eventData = result.event;
                        that.appendNotice();
                        that.appendEvent();
                        setTimeout(function() {
                            app.mobileApp.hideLoading();
                        },300);
                    }
                );
            },
            getMailData: function()
            {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + '}';
                var url = init_data.auth + "?callback=?";
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "getMemberMail",
                        "param":param
                    },
                    success: function(response) {
                        
                        if (response.code === 0) {
                            console.log(response.data);
                            mailData = response.data;
                            that.appendMailbox();
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error : " + JSON.stringify(e));
                    }
                });
            },
            getInvenData: function()
            {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + '","category":3}';
                var url = init_data.auth + "?callback=?";
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "getMemberMail",
                        "param":param
                    },
                    success: function(response) {
                        
                        if (response.code === 0) {
                            console.log(response.data);
                            that.appendInven(response.data);
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error : " + JSON.stringify(e));
                    }
                });
            },
            appendNotice: function()
            {
                var dataSource = new kendo.data.DataSource({
                    data: noticeData
                });
                $("#gnbNotice").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#gnbNoticeListTemplate").html()
                });
            },
            appendMailbox: function()
            {
                var dataSource = new kendo.data.DataSource({
                    data: mailData
                });
                $("#gnbMail").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#gnbMailListTemplate").html()
                });
            },
            appendInven: function(invenData)
            {
                var dataSource = new kendo.data.DataSource({
                    data: invenData
                });
                $("#gnbInven").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#gnbInvenTemplate").html()
                });
            },
            appendEvent: function()
            {
                var dataSource = new kendo.data.DataSource({
                    data: eventData
                });
                $("#gnbEvents").kendoMobileListView({
                    dataSource: dataSource,
                    template: $("#gnbEventListTemplate").html()
                });
            }
        }
        
        function tapStriper(e)
        {
            var data = e.button.data();
            if(tapLast === data.rel) return false;           
            if(data.rel === "noti") {    
                changeTap.tapNoti();
            } else {
                changeTap.tapEvent();
            }
            tapLast = data.rel;
        }
        
        var changeTap = {
            tapInit: function()
            {
                app.mobileApp.showLoading();
            },
            tapNoti: function() {
                var that = this;
                that.tapInit();
                $('#tabstripNotice').addClass('ts');
                $('#tabstripEvents').removeClass('ts');
                $('#gnbNotice').removeClass('hide');
                $('#gnbEvents').addClass('hide');
                that.tapComplete();
            },
            tapEvent: function() {
                var that = this;
                that.tapInit();
                $('#tabstripNotice').removeClass('ts');
                $('#tabstripEvents').addClass('ts');
                $('#gnbNotice').addClass('hide');
                $('#gnbEvents').removeClass('hide');
                that.tapComplete();
            },
            tapComplete: function() {
                setTimeout(function() {
                    app.mobileApp.hideLoading();
                }, 300);
            }
        };
        
        function mailRecevice(e)
        {
            var data = e.button.data();
            console.log(e);
            receiveMail.requestReceive(data.rel,data.fk);
        }
        function mailReceviceAll()
        {
            app.mobileApp.showLoading();
            $.each(mailData, function(i,v) {
                setTimeout(function() {
                    receiveMail.requestReceive(v.mailSeq,v.itemFK);
                    
                },300);
            });
            
            app.mobileApp.hideLoading();            
        }
        
        var receiveMail = {
            requestReceive: function(mseq,mfk) {
                var that = this;
                var param = '{"osType":' + init_apps.osType + ',"version":"' + init_apps.version + '","memSeq":' + uu_data.memSeq + '","mailSeq":' + mseq + '","itemFK":' + mfk + '}';
                var url = init_data.auth + "?callback=?";
                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "jsonp",
                    jsonpCallback: "jsonCallback",
                    data: {
                        "type": "apps.member",
                        "id": "openMailbox",
                        "param":param
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            console.log(response.data);
                            that.removeMail();
                        }
                    },
                    error: function(e) {
                        app.mobileApp.hideLoading();
                        console.log("error : " + JSON.stringify(e));
                    }
                });
            },
            removeMail: function() {
                var listview = $("#gnbMail").data("kendoMobileListView");
                listview.scroller().reset();
            }
        };
        
        function modalOpen(e)
        {
            var data = e.button.data();
            var result = "";
            if(data.mol === "moadl_notice") {
                result = $.grep(noticeData, function(a){ return a.id === data.rel; });
                $('#noticeContent').html('<h4>' + result[0].subject + '</h4><div class="hr"></div>' + result[0].content);
            } else {
                result = $.grep(eventData, function(a){ return a.id === data.rel; });
                $('#eventContent').html('<h4>' + result[0].subject + '</h4><div class="hr"></div>' + result[0].content);
            }
                        
            $("#" + data.mol).data("kendoMobileModalView").open();
        }

        function modalClose(e)
        {
            var data = e.button.data();
            $("#" + data.rel).data("kendoMobileModalView").close();
        }
        
        function onHide(e)
        {
            console.log("hide this view");
            console.log(e);
        }
        
        return {
            init: init,
            showOn: showOn,
            onHide: onHide,
            gnbNavi: gnbNavi,
            gnbDefInit: gnbDefInit,
            modalOpen: modalOpen,
            modalClose: modalClose,
            tapStriper: tapStriper,
            gnbMailbox: gnbMailbox,
            mailRecevice: mailRecevice,
            mailReceviceAll: mailReceviceAll
        };
        
    }());

    return funcz;
}());