var baseurl = "https://vote-habycza9akaxgshf.southindia-01.azurewebsites.net";
//var baseurl = "https://apiprost.stumagz.com";


angular.module('myApp', [])
    .controller('homeController', function ($scope, $http, $timeout) {

        function init() {
            try {
                if (localStorage.getItem("session")) {
                    $scope.input = JSON.parse(localStorage.getItem("session"));
                }
            } catch {

            }
        }
        $scope.input = {
            Name: "",
            Phone: "",
            Email: "",
            MiddleName: "",
            CollegeName: "",
            DepartmentName: "",
            StudentYear: "",
            mechanical: "",
            ece: "",
            cse: "",
            cseaids: "",
            cseaiml: "",
            civil: "",
            mba: "",
            ba: "",
            bba: "",
            tpo: "",
            bcom: "",
            OTP: "",
            page: 1,
            user: {}
        };
        init();
        var OTP = Math.floor(1000 + Math.random() * 9000);

        $scope.onSubmitContact = function () {

            if (isValidate1()) {
                localStorage.setItem("session", JSON.stringify($scope.input));
                $http.post(baseurl + "/api/Prost/ValidateUser", JSON.stringify($scope.input))
                    .then(function (response) {
                        if (response.data.intStatus == 1)
                            $scope.input.page = 2;
                        else {
                            $scope.errorStudentYear = response.data.responseMessage;
                        }
                        localStorage.setItem("session", JSON.stringify($scope.input));
                    }).catch(function (err) {
                        alert("servers busy please try again");
                        console.log(err);
                        throw err;
                    });

            }
        }

        function isValidate1() {
            var isvalid = true;
            if ($scope.input.Name.trim() == "") {
                isvalid = false;
                $scope.errorName = "Please enter Name"
            } else {
                $scope.errorName = "";
            }
            if ($scope.input.Phone.trim() == "") {
                isvalid = false;
                $scope.errorPhone = "Please enter Phone"
            } else if (!(/[0-9]{10}/.test($scope.input.Phone.trim()))) {
                isvalid = false;
                $scope.errorPhone = "Please enter valid Phone"
            }
            else {
                $scope.errorPhone = "";
            }

            if ($scope.input.Email.trim() == "") {
                isvalid = false;
                $scope.errorEmail = "Please enter Email"
            } else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.input.Email.trim()))) {
                isvalid = false;
                $scope.errorEmail = "Please enter valid Email"
            }
            else {
                $scope.errorEmail = "";
            }

            if ($scope.input.CollegeName.trim() == "") {
                isvalid = false;
                $scope.errorCollegeName = "Please enter College Name"
            } else {
                $scope.errorCollegeName = "";
            }

            if ($scope.input.DepartmentName.trim() == "") {
                isvalid = false;
                $scope.errorDepartmentName = "Please enter Department Name"
            } else {
                $scope.errorDepartmentName = "";
            }

            if ($scope.input.StudentYear.trim() == "") {
                isvalid = false;
                $scope.errorStudentYear = "Please select Student Year"
            } else {
                $scope.errorStudentYear = "";
            }

            return isvalid;
        }

        $scope.onSubmitVote = function () {
            if (isValidate2()) {
                $http.post(baseurl + "/api/Prost/SendSMS", JSON.stringify({
                    "user": {
                    }, "OTP": "" + OTP,
                    "Phone": "91" + $scope.input.Phone
                }))
                    .then(function (response) {
                        $scope.input.page = 3;
                        localStorage.setItem("session", JSON.stringify($scope.input));
                    }).catch(function (err) {
                        alert("servers busy please try again");
                        console.log(err);
                        throw err;
                    });
            }
        }

        function isValidate2() {
            var isvalid = true;
            var counter = 0;
            if ($scope.input.mechanical != "")
                counter++;
            if ($scope.input.ece != "")
                counter++;
            if ($scope.input.eee != "")
                counter++;
            if ($scope.input.cse != "")
                counter++;
            if ($scope.input.cseaids != "")
                counter++;
            if ($scope.input.cseaiml != "")
                counter++;
            if ($scope.input.civil != "")
                counter++;
            if ($scope.input.mba != "")
                counter++;
            if ($scope.input.ba != "")
                counter++;

            if ($scope.input.bba != "")
                counter++;

            if ($scope.input.tpo != "")
                counter++;
            if ($scope.input.bcom != "")
                counter++;

            if (counter <= 3) {
                $scope.errorBest = "Please select at least 4 categories";
                isvalid = false;
            }

            return isvalid;
        }
        $scope.isResendEnable = false;
        $timeout(() => { $scope.isResendEnable = true; }, 15000);
        $scope.onResendOTP = function () {
            $scope.isResendEnable = false;
            $timeout(() => { $scope.isResendEnable = true; }, 30000);
            $http.post(baseurl + "/api/Prost/SendSMS", JSON.stringify({
                "user": {
                }, "OTP": "" + OTP,
                "Phone": "91" + $scope.input.Phone
            }))
                .then(function (response) {

                }).catch(function (err) {
                    alert("servers busy please try again");
                    console.log(err);
                    throw err;
                });
        }

        $scope.onSubmitOtp = function () {
            $timeout(() => { $scope.isResendEnable = true; }, 60000);

            if ($scope.input.OTP == "") {
                $scope.errorOTP = "Please enter otp";
                return;
            } else {
                $scope.errorOTP = "";
            }
            if ($scope.input.OTP == OTP) {
                $http.post(baseurl + "/api/Prost/SaveUser", JSON.stringify($scope.input))
                    .then(function (response) {
                        if (response.data.intStatus == 1) {
                            $scope.input.page = 4;
                            localStorage.clear();
                        }
                    }).catch(function (err) {
                        alert("servers busy please try again");
                        console.log(err);
                        throw err;
                    });

            }
        }



    });