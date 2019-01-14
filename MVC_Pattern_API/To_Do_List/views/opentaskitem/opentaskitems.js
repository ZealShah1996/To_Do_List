angular.module('itemtasksApp', ['ngSanitize'])
    .controller('indexCtrl1', function ($scope, $http, $compile, $location) {
        // Initialize variables
        this.listoftasks = [];
        this.requestSuccess = true;
        this.url = 'http://localhost:4000';
        
        this.id = $location.$$absUrl.split('/')[$location.$$absUrl.split('/').length - 1];
        this.editPage = 0;
        
        this.DefaultTaskItem={"id":0,"name":"Name of task","task_text":"task details","todolist_id":this.id,"is_complete":false};
        this.TaskItem=this.DefaultTaskItem;
        //    Our GET request function
        console.log("Getting all tasks items!!!!!");
        // let variable=$routeParams;
        // console.log(variable);
        let headers = { "requiredFields": "id,name,task_text,is_active" };
        let data = { "headers": headers };
        $http.get(`${this.url}/todolistsitem/todolist/${$scope.app.id}`,data)
            .then(function successCallback(response) {
                if (response.data.data.length > 0) {
                    $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data.data);
                    var temp = $compile($scope.app.listoftasks)($scope);
                    angular.element(document.getElementById('taksitemtable')).append(temp);
                    //  $scope.taksitemtable = temp;
                    $scope.app.requestSuccess = true;
                    console.log("able to perform get request");
                    console.log("all tasks items is recevied!!!!!");
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).html("");
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                
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
            
            console.log("request for deleting id:-" + id);
            let url = `${this.url}/todolistsitem/delete/${id}`;
            let headers = { "requiredFields": "id,name,task_text" };
            let data = { "headers": headers }
            $http.delete(url, data).then(function (response) {
                console.log(response);
                $scope.getAll();
            }, function (response) {
                console.log(response);
            });
        }

        $scope.editRequest = (id) => {
            console.log("request for editing id:-" + id);
            $http.get(`${this.url}/todolistsitem/todolist/${$scope.app.id}/todolistitem/${id}`,data)
            .then(function successCallback(response) {
                if (response.data.data.length > 0) {
                    Object.keys($scope.app.DefaultTaskItem).forEach((element)=>{
                            if(Object.keys(response.data.data[0]).indexOf(element)==-1){
                                response.data.data[0][element]=$scope.app.DefaultTaskItem[element];
                            }
                    });
                    
                    $scope.app.TaskItem=response.data.data[0];
                    // var temp = $compile($scope.app.listoftasks)($scope);
                    // angular.element(document.getElementById('taksitemtable')).append(temp);
                    // //  $scope.taksitemtable = temp;
                    // $scope.app.requestSuccess = true;
                    
                    $scope.cerateToDoListItem();
                    console.log("able to perform get request");
                    console.log("all tasks items is recevied!!!!!");
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).html("");
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                
                console.log("Unable to perform get request");
                console.log("all tasks items is not recevied!!!!!");
            });
        }

        $scope.cerateToDoListItem = () => {
            
            $scope.app.editPage = 1;
        }

        $scope.cerateToDoListItemForCreatingNew = () => { 
            $scope.app.editPage = 1;
            $scope.app.TaskItem=$scope.app.DefaultTaskItem;
        }
        $scope.saveData = () => {
            
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
        if(data.id==0){
            
            //let 
            delete data.id;
            $http.post(`${this.url}/todolistsitem/create/0`,data)
            .then(function successCallback(response) {
                
                if (response.data.data != undefined) {
                    // $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data.data);
                    // var temp = $compile($scope.app.listoftasks)($scope);
                    // angular.element(document.getElementById('taksitemtable')).append(temp);
                    //  $scope.taksitemtable = temp;
                    $scope.app.requestSuccess = true;
                    console.log("able to perform get request");
                    console.log("all tasks items is recevied!!!!!");
                    $scope.getAll();
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).html("");
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                
                console.log("Unable to perform get request");
                console.log("all tasks items is not recevied!!!!!");
            });

        }
        else if(data.id!=0){
            
            //let 
            $http.patch(`${this.url}/todolistsitem/update/${data.id}`,data)
            .then(function successCallback(response) {
                if (response.data.data.length > 0) {
                    $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data.data);
                    var temp = $compile($scope.app.listoftasks)($scope);
                    angular.element(document.getElementById('taksitemtable')).append(temp);
                    //  $scope.taksitemtable = temp;
                    $scope.app.requestSuccess = true;
                   
                    console.log("able to perform patch request");
                    console.log("Update is successfull!!!!!");
                    $scope.getAll();
                }
                else {
                    angular.element(document.getElementById('taksitemtable')).html("");
                    angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                }
            }, function errorCallback(response) {
                
                console.log("Unable to perform patch request");
                console.log("Update is not successfull!!!!!");
            });
        }
        }


        $scope.getAll=()=>{
            $scope.app.editPage = 0;
            console.log("Getting all tasks items!!!!!");
            // let variable=$routeParams;
            // console.log(variable);
            let headers = { "requiredFields": "id,name,task_text,is_active" };
            let data = { "headers": headers };

            $http.get(`${$scope.app.url}/todolistsitem/todolist/${$scope.app.id}`,data)
                .then(function successCallback(response) {
                    if (response.data.data.length > 0) {
                        $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data.data);
                        var temp = $compile($scope.app.listoftasks)($scope);
                        angular.element(document.getElementById('taksitemtable')).html("");
                        angular.element(document.getElementById('taksitemtable')).append(temp);
                        //  $scope.taksitemtable = temp;
                        $scope.app.requestSuccess = true;
                        console.log("able to perform get request");
                        console.log("all tasks items is recevied!!!!!");
                    }
                    else {
                        angular.element(document.getElementById('taksitemtable')).html("");
                        angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
                    }
                }, function errorCallback(response) {
                    
                    console.log("Unable to perform get request");
                    console.log("all tasks items is not recevied!!!!!");
                });
        }
    });




