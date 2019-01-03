angular.module('tasksApp', ['ngSanitize'])
  .controller('indexCtrl', function ($scope, $http,$location,$compile) {
    // Initialize variables
    this.listoftasks = [];
    this.requestSuccess = true;
    this.url = 'http://localhost:4000';
    //    Our GET request function
    console.log("Getting all tasks!!!!!");
    this.id = $location.$$absUrl.split('/')[$location.$$absUrl.split('/').length - 1];
    this.editPage = 0;
    this.DefaultTaskItem = { "id": 0, "name": "Name of task", "task_text": "task details", "user_id": this.id, "is_complete": false };
    this.TaskItem = this.DefaultTaskItem;
    console.log("Getting all tasks items!!!!!");
    let headers = { "requiredFields": "id,name,task_text,is_active" };
    let data = { "headers": headers };

    $scope.getAll = () => {
      $scope.app.editPage = 0;
      console.log("Getting all tasks items!!!!!");
      let headers = { "requiredFields": "id,name,task_text,is_active" };
      let data = { "headers": headers };
      $http.get(`${$scope.app.url}/todolists/users/${$scope.app.id}`, data)
        .then(function successCallback(response) {
          debugger;
          if (response.data.data.length > 0) {
            $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data.data);
            var temp = $compile($scope.app.listoftasks)($scope);
            angular.element(document.getElementById('tasktable')).html("");
            angular.element(document.getElementById('tasktable')).append(temp);
            //  $scope.taksitemtable = temp;
            $scope.app.requestSuccess = true;
            console.log("able to perform get request");
            console.log("all tasks items is recevied!!!!!");
          }
          else {
            angular.element(document.getElementById('tasktable')).append(`<p>No Data found.</p>`);
          }
        }, function errorCallback(response) {
          console.log("Unable to perform get request");
          console.log("all tasks items is not recevied!!!!!");
        });
      // $http.get(`${this.url}/todolists/users/1`)
      //   .then(function successCallback(response) {
      //     $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data.data);
      //     $scope.text = $scope.app.listoftasks;
      //     $scope.app.requestSuccess = true;
      //     console.log("able to perform get request");
      //     console.log("all tasks is recevied!!!!!");
      //   }, function errorCallback(response) {
      //     debugger;
      //     console.log("Unable to perform get request");
      //     console.log("all tasks is not recevied!!!!!");
      //   });
    }


    $scope.getAll();



    $scope.makeTableFromApiResponse = (json, primarykey) => {

      let tableHtml = "";
      let headerOfHtml = "";
      // json[0].forEach((val)=>{

      console.log(json[0]);
      let html = "<tr>";
      Object.keys(json[0]).forEach((item) => {
        console.log(item);
        html = html + `<th data-type="${item}" style="width:${100 / Object.keys(item).length};display:inline;">${item}</td>`;
      });
      headerOfHtml = headerOfHtml + html + "<tr/>";
      // });
      json.forEach((val) => {

        console.log(val);

        let html = `<tr ng-click="editData(${val.id})">`;
        Object.keys(val).forEach((item) => {
          console.log(item);
          html = html + `<td data-type="${item}" style="width:${100 / Object.keys(val).length};display:inline;">${val[item]}</td>`;
        });
        tableHtml = tableHtml + html + 
        `<td style="width:${100 / Object.keys(val).length};height:50px;display:center;"><a class="btn btn-info" role="button" href='/edit/opentaskitems/${val.id}'">open</a> 
                <a id="deleteItem" class="btn btn-info" ng-click="deleteRequest(${val.id})">delete</button>
                <td><tr/>`;
                //`<td><a href='/edit/opentaskitems/${val.id}'>open</a> <a href=''>delete</a><td><tr/>`;
      });

      let fulltablehtml = `<div class="table" ><table class="table-hover">
                <thead>
                  ${headerOfHtml}
                </thead>
                <tbody>${tableHtml}</tbody>
                </tbody>
              </table></div>`;
      return fulltablehtml;
    }

    $scope.editRequest = (id) => {
      console.log("request for editing id:-" + id);
     // /todolists/users/1
     // /todolists/users/1/todolist/6
      $http.get(`${this.url}/todolists/users/${$scope.app.id}/todolist/${id}`,data)
      .then(function successCallback(response) {
          if (response.data.data.length > 0) {
              Object.keys($scope.app.DefaultTaskItem).forEach((element)=>{
                      if(Object.keys(response.data.data[0]).indexOf(element)==-1){
                          response.data.data[0][element]=$scope.app.DefaultTaskItem[element];
                      }
              });
              debugger;
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
      debugger;
  }

    $scope.deleteRequest = (id) => {
      console.log("request for deleting id:-" + id);
      let url = `${this.url}/todolists/delete/${id}`;
      let headers = { "requiredFields": "id,name,task_text" };
      let data = { "headers": headers }
      $http.delete(url, data).then(function (response) {
        console.log(response);
        $scope.getAll();
      }, function (response) {
        console.log(response);
      });
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
      debugger;
      //let 
      delete data.id;
      $http.post(`${this.url}/todolists/create/0`,data)
      .then(function successCallback(response) {
          debugger;
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
              angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
          }
      }, function errorCallback(response) {
          
          console.log("Unable to perform get request");
          console.log("all tasks items is not recevied!!!!!");
      });

  }
  else if(data.id!=0){
      debugger;
      //let 
      $http.patch(`${this.url}/todolists/update/${data.id}`,data)
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
              angular.element(document.getElementById('taksitemtable')).append(`<p>No Data found.</p>`);
          }
      }, function errorCallback(response) {
          
          console.log("Unable to perform patch request");
          console.log("Update is not successfull!!!!!");
      });
  }
  }
  });




