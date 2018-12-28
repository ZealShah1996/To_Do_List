angular.module('tasksApp', ['ngSanitize'])
  .controller('indexCtrl', function ($scope, $http) {
    // Initialize variables
    this.listoftasks = [];
    this.requestSuccess = true;
    this.url = 'http://localhost:4000';
    //    Our GET request function
    console.log("Getting all tasks!!!!!");
    $http.get(`${this.url}/todolists/users/1`)
      .then(function successCallback(response) {
        $scope.app.listoftasks = $scope.makeTableFromApiResponse(response.data);
        $scope.text = $scope.app.listoftasks;
        $scope.app.requestSuccess = true;
        console.log("able to perform get request");
        console.log("all tasks is recevied!!!!!");
      }, function errorCallback(response) {
        debugger;
        console.log("Unable to perform get request");
        console.log("all tasks is not recevied!!!!!");
      });



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
        tableHtml = tableHtml + html + `<td><a href='/edit/opentaskitems/${val.id}'>open</a> <a href=''>delete</a><td><tr/>`;
      });

      let fulltablehtml = `<div class="table-responsive" ><table class="table table-hover">
                <thead>
                  ${headerOfHtml}
                </thead>
                <tbody>${tableHtml}</tbody>
                </tbody>
              </table></div>`;
      return fulltablehtml;
    }

    $scope.editData = (json, primarykey) => {
      debugger;
      let formHtml = "";

      json.forEach((val) => {
        console.log(val);
        Object.keys(val).forEach((item) => {
          console.log(item);
          debugger;
          formHtml = formHtml + `<div class="form-group"> <label for="${item}">${item}</label><input type="text" class="form-control"></div>`;
          //html=html+`<td data-type="${item}" style="width:${100/Object.keys(val).length};display:inline;">${val[item]}</td>`;
        });
        //  tableHtml=tableHtml+html+"<tr/>";
      });
      debugger;
      return `<form>${formHtml}</form>`;
    }

    $scope.edit = (val) => {
      debugger;
    }
  });




