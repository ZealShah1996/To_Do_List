var request = require('supertest');
var assert = require('assert');
var expect = require('chai').expect;
var baseUrl = "http://localhost:3000/";
var app = require('../app');
const services = require('./../../../Mongo_Operations');
const utilityService = services.utilityService;
const debugService = services.debugService;
const mongoService = services.mongoService;
//const testService=services.testService;
const debug = debugService.debugConsole(__dirname, __filename);
let k=3;
process.env.NODE_ENV = 'dev_to_do_list_test';




//#region Test Executing
/**
 * @description creating new dyanmic function for executing test.
 */
exports.executingTest = async (httpmethodName, url, headers, data, expectedStatus, expectedData, description, ExpectedTotestcase) => {
    //Processing with headers 
    it(`${description}`, function (done) {
        let output;
        let apptocheck = request(app)[httpmethodName](`${url}`);
        Object.keys(headers).forEach((element) => {
            apptocheck.set(element, headers[element]);
        });
        if (utilityService.checkValueShouldBeInArray(data, "notEmptyStringandnotEmptyObject") && utilityService.checkValueShouldBeInArray(data, "notUndefindedandnotNull")) {
            let dataToPassed = {};
            Object.keys(data).forEach((element) => {
                dataToPassed[element] = data[element];
            });
            apptocheck.send(dataToPassed);
            // apptocheck.send({body:data});
        }
        apptocheck.expect(expectedStatus)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                else {
                    try {
                        let outputMatched = utilityService.matchObject(res.body, expectedData);
                        // JSON.stringify(res.body) == JSON.stringify(expectedData)
                        expect(outputMatched).to.deep.equal(ExpectedTotestcase);
                        done();
                    }
                    catch (e) {
                        done(e);
                    }
                }
            });
        debug(apptocheck);
    });
}
let testModule = require('./test').executingTest;
//#endregion
//==================== ${modelName} API test ====================
//#region request
/**
 * Testing get all ${modelName} endpoint
 */


describe('User API Testing....', function () {
    var tests = [];
    var requiredFields = 'name,password,id';
    let modelName = "users";
    let defaultDataPassedForCreation = {"name":"test1","password":"test1"};
    let defaultDataPassedForLogin = {"username":"test1","password":"test1"};
    let wrongdatatotest={"name": "test1", "password": "test1", "age": 23, "is_active": true, "id": 1};
    let dataToCheck={ "name": "test1", "password": "test1", "id": 1 };


    tests.push(testModule("get", `/${modelName}`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, {}, 200, { "data": [], "message": { "total": 0 } }, `Success || getting all ${modelName} list in api`, true));

    tests.push(testModule("get", `/${modelName}`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, {}, 200, { "data": { wrongdatatotest } }, `Fail || getting all ${modelName} list in api`, false));

    tests.push(testModule("post", `/${modelName}/create/0`, { "requiredFields": requiredFields, 'Accept': 'application/json' },  defaultDataPassedForCreation , 200, { "data":dataToCheck}, `success ||  create user`, true));

    tests.push(testModule("post", `/${modelName}/login`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForLogin, 200, { "data": [{ "name": "test1", "id": 1 }], "message": { "total": 1 } }, `Success || Log in user`, true));

    tests.push(testModule("post", `/${modelName}/create/0`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 200, { "data": { "name": "test1", "password": "test1", "id": 2 } }, `success ||  create ${modelName} id 2`, true));

    tests.push(testModule("post", `/${modelName}/login`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForLogin, 401, { "message": { "loginfailedmessage": "There is multiple accouts." } }, `Success || Log in user`, true));

    tests.push(testModule("delete", `/${modelName}/delete/3`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 404, { "message": "There is no entry regarding this id." }, `Success || delete ${modelName} which is not avaible in db`, true));


    tests.push(testModule("delete", `/${modelName}/delete/1`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 200, { "data": [{ "name": "test1", "password": "test1", "id": 1 }], "message": { "total": 1 } }, `Success || delete ${modelName} which is avaible in db`, true));

    tests.push(testModule("post", `/${modelName}/login`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForLogin, 200, { "data": [{ "name": "test1", "id": 2 }], "message": { "total": 1 } }, `Success || Log in ${modelName} with  accouts avaiable`, true));

    tests.push(testModule("patch", `/${modelName}/update/2`, { 'Accept': 'application/json' }, { "is_deleted": true }, 200, { "data": [{ "name": "test1", "password": "test1", "age": 23, "is_active": true, "id": 2 }], "message": { "total": 1 } }, `Success || Update ${modelName} to is_deleted true`, true));

    Promise.all(tests).then(function () {

    });
}).beforeAll(() => {
    console.log("====================================User api test start===========================");
}).afterAll(async () => {
    console.log("====================================User api test end=============================");
    await mongoService.removeWholeDb();
    // process.exit(1);
});


//#endregion
//==================== User End API test ====================
//==================== to do list API test ====================
//#region request to do item
/**
 * Testing get all To do item endpoint
 */


describe('to do list API Testing....', function () {
    var tests = [];
    var requiredFields = 'name,color,id,user_id';
    let modelName = "todolists";
    let defaultDataPassedForCreation = {"name":"test1","user_id":1,"color":"green"};
   // let defaultDataPassedForLogin = {"username":"test1","password":"test1"};
    let wrongdatatotest={"name": "test1", "user_id": 1, "age": 23, "is_active": true, "id": 1};
    let dataToCheck={ "user_id":1,"name": "test1","color":"green", "id": 1};
    let dataToCheckforsecondid={ "user_id":1,"name": "test1","color":"green", "id": 2 };
    let afterDeletedata={"user_id":1,"name":"test1","color":"green","id":1};
    let afterDeletedataOfid2={"user_id":1,"name":"test1","color":"green","is_active":true,"id":2};

    tests.push(testModule("get", `/${modelName}`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, {}, 200, { "data": [], "message": { "total": 0 } }, `Success || getting all ${modelName} list in api`, true));

    tests.push(testModule("get", `/${modelName}`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, {}, 200, { "data": wrongdatatotest  }, `Fail || getting all ${modelName} list in api`, false));

    tests.push(testModule("post", `/${modelName}/create/0`, { "requiredFields": requiredFields, 'Accept': 'application/json' },  defaultDataPassedForCreation , 200, { "data":dataToCheck}, `success ||  create ${modelName}`, true));

    tests.push(testModule("post", `/${modelName}/create/0`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 200, { "data": dataToCheckforsecondid }, `success ||  create ${modelName} id 2`, true));

    tests.push(testModule("delete", `/${modelName}/delete/3`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 404, { "message": "There is no entry regarding this id." }, `Success || delete ${modelName} which is not avaible in db`, true));

    tests.push(testModule("delete", `/${modelName}/delete/1`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 200, { "data": [afterDeletedata], "message": { "total": 1 } }, `Success || delete ${modelName} which is avaible in db`, true));

    tests.push(testModule("patch", `/${modelName}/update/2`, { 'Accept': 'application/json' }, { "is_deleted": true }, 200, { "data": [afterDeletedataOfid2], "message": { "total": 1 } }, `Success || Update ${modelName} to is_deleted true`, true));

    Promise.all(tests).then(function () {
    });
}).beforeAll(() => {
    console.log("====================================User api test start===========================");
}).afterAll(async () => {
    console.log("====================================User api test end=============================");
    await mongoService.removeWholeDb();
    // process.exit(1);
});




describe('to do list API Testing....', function () {
    var tests = [];
    var requiredFields = 'id,task_text,todolist_id,is_complete';
    let modelName = "todolistsitem";
    let defaultDataPassedForCreation = {"task_text":"test1","todolist_id":1,"is_complete":false};
   // let defaultDataPassedForLogin = {"username":"test1","password":"test1"};
    let wrongdatatotest={"task_text":"test1","todolist_id":1,"is_complete":false};
    let dataToCheck={"todolist_id":1,"task_text":"test1","is_complete":false,"id":1};
    let dataToCheckforsecondid={"todolist_id":1,"task_text":"test1","is_complete":false, "id": 2 };
    let afterDeletedata={"todolist_id":1,"task_text":"test1","is_complete":false,"id":1};
    let afterDeletedataOfid2={"name":"Task details","todolist_id":1,"task_text":"test1","is_deleted":true,"is_active":true,"id":2};

    tests.push(testModule("get", `/${modelName}`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, {}, 200, { "data": [], "message": { "total": 0 } }, `Success || getting all ${modelName} list in api`, true));

    tests.push(testModule("get", `/${modelName}`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, {}, 200, { "data": wrongdatatotest  }, `Fail || getting all ${modelName} list in api`, false));

    tests.push(testModule("post", `/${modelName}/create/0`, { "requiredFields": requiredFields, 'Accept': 'application/json' },  defaultDataPassedForCreation , 200, { "data":dataToCheck}, `success ||  create ${modelName}`, true));

    tests.push(testModule("post", `/${modelName}/create/0`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 200, { "data": dataToCheckforsecondid }, `success ||  create ${modelName} id 2`, true));

    tests.push(testModule("delete", `/${modelName}/delete/3`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 404, { "message": "There is no entry regarding this id." }, `Success || delete ${modelName} which is not avaible in db`, true));

    tests.push(testModule("delete", `/${modelName}/delete/1`, { "requiredFields": requiredFields, 'Accept': 'application/json' }, defaultDataPassedForCreation, 200, { "data": [afterDeletedata], "message": { "total": 1 } }, `Success || delete ${modelName} which is avaible in db`, true));

    tests.push(testModule("patch", `/${modelName}/update/2`, { 'Accept': 'application/json' }, { "is_deleted": true }, 200, { "data": [afterDeletedataOfid2], "message": { "total": 1 } }, `Success || Update ${modelName} to is_deleted true`, true));

    Promise.all(tests).then(function () {
    });
}).beforeAll(() => {
    console.log("====================================User api test start===========================");
}).afterAll(async () => {
    console.log("====================================User api test end=============================");
    await mongoService.removeWholeDb();
    // process.exit(1);
});




//#endregion
//==================== to do list End API test ====================
//#region support functions for adding functionality.
function attachingSpecialCharacterWithMiddle(string, specialCharcter, length, color = '\x1b[0m') {
    let lengthOfString = string.length;
    let remeaningCharters = (length - lengthOfString) / 2;

    if (length - lengthOfString > 0) {
        // console.log(length - lengthOfString);
        console.log('\x1b[0m',
            `${specialCharcter.repeat(remeaningCharters - 1)}${string}${specialCharcter.repeat(remeaningCharters - 1)}`
            , '\x1b[0m');

    }
}
  //#endregion