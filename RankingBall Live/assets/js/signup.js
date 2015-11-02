/**
 * Signup view model
 */
var app = app || {};

app.Signup = (function () {
    'use strict';

    var singupViewModel = (function () {
        var dataSource;
        var $signUpForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;
        
        // Register user after required fields (username and password) are validated in Backend Services
        var signup = function () {
            
            if (dataSource.Email === '' || !validateEmail(dataSource.Email))
            {
                alert('이메일 형식에 맞게 입력해주세요.');
                return false;
            }
            
            var autoLogin = $("input:checkbox[id='keep-login']").is(":checked");
  
            var param = '{"osType":' + init_apps.osType + 
                ',"version":"' + init_apps.version + 
                '","email":"' + dataSource.Email + 
                '","name":"' + dataSource.Username + 
                '","memPwd":"' + dataSource.Password + 
                '","registType":' + registType +
                ',"memUID":"' + init_apps.memUID + 
                '","deviceID":"' + init_apps.deviceID + '"}';
            
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
                    "id": "memberJoin",
                    "param":param
                },
                success: function(response) {
                    if(response.code === 0) {
                        uu_data = response.data;
                        uu_data.osType = init_apps.osType;
                        uu_data.version = init_apps.version;
                        uu_data.memUID = init_apps.memUID;
                        uu_data.deviceID = init_apps.deviceID;
                        
                        app.showAlert("회원 가입이 완료되었습니다.","안내",app.mobileApp.navigate('views/loginView.html', 'slide'));
                        
                        setlocalStorage('appd',JSON.stringify(uu_data));
                        setlocalStorage('doLogin',autoLogin);
                        setlocalStorage('doStrip',dataSource.Password);
                    }
                    else
                    {
                        app.showAlert(response.message,"안내");
                    }
                },
                complete: function() {
                    app.mobileApp.hideLoading();
                }
            });  
            
            /*
            
            Everlive.$.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
                .then(function () {
                    app.showAlert("Registration successful");
                    app.mobileApp.navigate('views/loginView.html', 'slide');
                },
                      function (err) {
                          app.showError(err.message);
                      });
           */
        };

        function validateEmail(mail)
        {  
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
            {  
                return (true);
            }  
            alert("You have entered an invalid email address!")  
            return (false);
        }  
        
        var confirmis;
        
        var confirmStatus = function() {
            $confirmAgree = $('#agreeAll');
            $confirmUse = $('#agreeUse');
            $confirmPersonal = $('#agreePersonal');
            $confirmBtnWrp = $('#confirmBtnWrp');
        }
        var confirmShow = function () {
            confirmis = kendo.observable({
                
                optional: false
            });
            kendo.bind($('#signupConfirm'), confirmis);
        };
        
        
        var signupConfirm = function() {
            var termService = $("input:checkbox[id='agreeUse']").is(":checked");
            var termPersonal = $("input:checkbox[id='agreePersonal']").is(":checked");
            
            if (termService && termPersonal) {
                app.mobileApp.navigate('views/signupView.html', 'slide');
            } else {
                app.showAlert("먼저 약관을 확인하시고 동의해주세요.");
            }
        }
        
        var checkConfirmAll = function() {

            if ( $("input:checkbox[id='agreeAll']").is(":checked") ) {
                $("input:checkbox[id='agreeUse']").prop('checked', true); 
                $("input:checkbox[id='agreePersonal']").prop('checked', true);
            } else {
                console.log('unchecked');
                $("input:checkbox[id='agreeUse']").prop('checked', false); 
                $("input:checkbox[id='agreePersonal']").prop('checked', false);
            }
        }
        
        // Executed after Signup view initialization
        // init form validator
        var init = function () {
            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        }

        // Executed after show of the Signup view
        var show = function () {
            dataSource = kendo.observable({
                  Username: '',
                  Password: '',
                  Email: ''
              });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $("input:checkbox[id='agreeAll']").prop('checked', false); 
            $("input:checkbox[id='agreeUse']").prop('checked', false); 
            $("input:checkbox[id='agreePersonal']").prop('checked', false);
            
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected === 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            confirmStatus: confirmStatus,
            confirmShow: confirmShow,
            onSelectChange: onSelectChange,
            signup: signup,
            signupConfirm: signupConfirm,
            checkConfirmAll: checkConfirmAll
        };
    }());

    return singupViewModel;
}());