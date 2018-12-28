angular.module('angularApp', [])
    .controller('indexCtrl', function ($scope, $http,$window) {
        // Initialize variables
        $scope.name1 = '';
        this.name2 = '';
        this.username = "";
        this.password = "";
        this.loginSuccess = 0;
        this.url = 'http://localhost:4000';
        //$scope.app.listoftasks = response.data;
        this.listoftasks=[];
        this.tasksDataCame=false;
        // $http.get(`${this.url}/todolists`).
        // then(function(response) {
        //     $scope.data = response.data;
        // });
        //    Our GET request function
        // $scope.getRequest = function () {
        //     console.log("I've been pressed!");
        //     $http.get(`${this.url}/users`)
        //         .then(function successCallback(response) {
        //             $scope.response = response;
        //         }, function errorCallback(response) {
        //             console.log("Unable to perform get request");
        //         });
        // };

        //  Our POST request function
        $scope.postRequest = function () {
            let data = {};
            data["username"] = $scope.app.username;
            data["password"] = $scope.app.password;

            $http.post(`${$scope.app.url}/users/login`, data)
                .then(function successCallback(response) {

                    $scope.app.loginSuccess = 200;
                    $scope.redirect('/tasks/listoftasks');
                    console.log("Successfully POST-ed data");
                }, function errorCallback(response) {
             
                    $scope.app.loginSuccess = 401;
                
                    console.log("POST-ing of data failed");
                });
        };

        $scope.redirect = function (url) {
            let data = {};
       
            $window.location.href = `${url}`;
        };
        

        $scope.createToListRequest=function (){
          
            console.log("Getting all tasks!!!!!");
            $http.get(`${$scope.app.url}/todolists/users/1`)
                .then(function successCallback(response) {
                    debugger;
                    $scope.app.listoftasks = response.data;
                    $scope.app.tasksDataCame=true;
                    console.log("able to perform get request");
                    console.log("all tasks is recevied!!!!!");
                }, function errorCallback(response) {
                    debugger;
                    console.log("Unable to perform get request");
                    console.log("all tasks is not recevied!!!!!");
                });
        }
        // $scope.greeting1 = `Hello ${$scope.name1}`;
        // this.greeting2 = `Hi ${this.name2}`;
    });