angular.module('itemtasksApp', ['ngSanitize'])
    .controller('indexCtrl1', function ($scope, $http, $compile, $location) {
        // Initialize variables
        this.listoftasks = [];
        this.requestSuccess = true;
        this.url = 'http://localhost:4000';
        debugger;
        this.id = $location.$$absUrl.split('/')[$location.$$absUrl.split('/').length - 1];
        this.editPage = 0;
        this.TaskItem={"id":0,"name":"Name of task","task_text":"zealshah","todolist_id":this.id,"is_complete":false};
        //    Our GET request function
        console.log("Getting all tasks items!!!!!");
        // let variable=$routeParams;
        // console.log(variable);
        let headers = { "requiredFields": "id,name,task_text,is_active" };
        let data = { "headers": headers };
        $http.get(`${this.url}/todolistsitem/todolist/${$scope.app.id}`,data)
            .then(function successCallback(response) {
                if (response.data.length > 0) {
                    $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data);
                    var temp = $compile($scope.app.listoftasks)($scope);
                    angular.element(document.getElementById('taksitemtable')).append(temp);
                    //  $scope.taksitemtable = temp;
                    $scope.app.requestSuccess = true;
                    console.log("able to perform get request");
                    console.log("all tasks items is recevied!!!!!");
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                debugger;
                console.log("Unable to perform get request");
                console.log("all tasks items is not recevied!!!!!");
            });

        $scope.makeTableFromApiResponse = (json, primarykey) => {

            let tableHtml = "";
            let headerOfHtml = "";
            console.log(json[0]);
            let html = "<tr>";
            Object.keys(json[0]).forEach((item) => {
                if (item != "id") {
                    console.log(item);
                    html = html + `<th data-type="${item}" style="width:${100 / Object.keys(item).length};height:50px;display:center;">${item.toLocaleUpperCase().replace('_', ' ')}</td>`;
                }
            });
            headerOfHtml = headerOfHtml + html + "<tr/>";
            // });
            json.forEach((val) => {
                console.log(val);
                let html = `<tr ng-click="editData(${val.id})">`;
                Object.keys(val).forEach((item) => {
                    if (item != "id") {
                        console.log(item);
                        html = html + `<td data-type="${item}" style="width:${100 / Object.keys(val).length};height:50px;display:center;">${val[item]}</td>`;

                    }
                });
                tableHtml = tableHtml + html + `<td style="width:${100 / Object.keys(val).length};height:50px;display:center;"><a class="btn btn-info" role="button" ng-click="editRequest(${val.id})">edit</a> 
                <a id="deleteItem" class="btn btn-info" ng-click="deleteRequest(${val.id})">delete</button>
               
                <td><tr/>`;
            });

            let fulltablehtml = `<div class="table"><table class="table-hover">
                <thead>
                  ${headerOfHtml}
                </thead>
                <tbody>${tableHtml}</tbody>
                </tbody>
              </table></div>`;
            return fulltablehtml;
        }


        $scope.deleteRequest = (id) => {
            debugger;
            console.log("request for deleting id:-" + id);
            let url = `${this.url}/todolistsitem/delete/${id}`;
            let headers = { "requiredFields": "id,name,task_text" };
            let data = { "headers": headers }
            $http.delete(url, data).then(function (response) {
                console.log(response);
            }, function (response) {
                console.log(response);
            });
        }

        $scope.editRequest = (id) => {
            debugger;
            console.log("request for editing id:-" + id);
            
            $http.get(`${this.url}/todolistsitem/todolist/${$scope.app.id}/todolistitem/${id}`,data)
            .then(function successCallback(response) {
                if (response.data.length > 0) {
                    $scope.app.TaskItem=response.data;
                    // var temp = $compile($scope.app.listoftasks)($scope);
                    // angular.element(document.getElementById('taksitemtable')).append(temp);
                    // //  $scope.taksitemtable = temp;
                    // $scope.app.requestSuccess = true;
                    $scope.cerateToDoListItem();
                    console.log("able to perform get request");
                    console.log("all tasks items is recevied!!!!!");
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                debugger;
                console.log("Unable to perform get request");
                console.log("all tasks items is not recevied!!!!!");
            });
        }

        $scope.cerateToDoListItem = () => {
            debugger;
            $scope.app.editPage = 1;
        }

        $scope.saveData = () => {
            debugger;
            let dataItem = $('#TaskItem').serializeArray();
            let data = {};
            dataItem.forEach(element => {
                data[element.name] = element.value;
            });
            console.log(JSON.stringify(data));
            let headers = { "requiredFields": "id,name,task_text" };
        let dataToPass = {"data":data ,"headers": headers };
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
            //let 
            $http.post(`${this.url}/todolistsitem/create/0`,data)
            .then(function successCallback(response) {
                if (response.data.length > 0) {
                    $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data);
                    var temp = $compile($scope.app.listoftasks)($scope);
                    angular.element(document.getElementById('taksitemtable')).append(temp);
                    //  $scope.taksitemtable = temp;
                    $scope.app.requestSuccess = true;
                    console.log("able to perform get request");
                    console.log("all tasks items is recevied!!!!!");
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                debugger;
                console.log("Unable to perform get request");
                console.log("all tasks items is not recevied!!!!!");
            });

        }

    });




