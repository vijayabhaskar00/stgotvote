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
      BestPlacementCell: "",
      BestECell: "",
      BestSportsCollege: "",
      BestCollegeinCocurriculars: "",
      BestEmergingCollege: "",
      BestInfrastructure: "",
      BestEcoFriendlyCollege: "",
      BestRAndDCollege: "",
      BestParticipationInEvents: "",
      OTP: "",
      page: 1,
      user: {}
    };
    init();
    var OTP = Math.floor(1000 + Math.random() * 9000);

    $scope.onSubmitContact = function () {

      if (isValidate1()) {
        localStorage.setItem("session", JSON.stringify($scope.input));
        $http.post("https://apiprost.stumagz.com/api/Prost/ValidateUser", JSON.stringify($scope.input))
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
        $http.post("https://apiprost.stumagz.com/api/Prost/SendSMS", JSON.stringify({
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
      if ($scope.input.BestECell != "")
        counter++;
      if ($scope.input.BestEcoFriendlyCollege != "")
        counter++;
      if ($scope.input.BestEmergingCollege != "")
        counter++;
      if ($scope.input.BestInfrastructure != "")
        counter++;
        if ($scope.input.BestCollegeinCocurriculars != "")
        counter++;
      if ($scope.input.BestParticipationInEvents != "")
        counter++;
      if ($scope.input.BestPlacementCell != "")
        counter++;
      if ($scope.input.BestRAndDCollege != "")
        counter++;
      if ($scope.input.BestSportsCollege != "")
        counter++;

      if (counter <= 2) {
        $scope.errorBest = "Please select at least 3 categories";
        isvalid = false;
      }

      return isvalid;
    }
    $scope.isResendEnable = false;
    $timeout(() => { $scope.isResendEnable = true; }, 15000);
    $scope.onResendOTP = function () {
      $scope.isResendEnable = false; 
      $timeout(() => { $scope.isResendEnable = true; }, 30000);
      $http.post("https://apiprost.stumagz.com/api/Prost/SendSMS", JSON.stringify({
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
        $http.post("https://apiprost.stumagz.com/api/Prost/SaveUser", JSON.stringify($scope.input))
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