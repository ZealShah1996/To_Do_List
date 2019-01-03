var express = require('express');
var router = express.Router();

const services = require('../../../Mongo_Operations');
const configService = services.configService;
const findKeyName = configService.findVariableAvaiableInConfiguration;
const debugService = services.debugService;
const mongoService = services.mongoService;
const utilityService = services.utilityService;

const createResponseOnPassedDataOnSuccess = utilityService.createResponseOnPassedDataOnSuccess;
const debug = debugService.debugConsole(__dirname, __filename);
let requiredFieldsForGetALl = ["id", "name", "is_active", "is_delete", "user_id", "color"];
let requiredFieldsForCreate = ["id", "name", "is_active", "is_delete", "user_id", "color"];
let requiredFieldsForUpdate = ["id", "name", "is_active", "is_delete", "user_id", "color"];
let requiredFieldsForDelete = ["id", "name", "is_active", "is_delete", "user_id", "color"];
let modelName = "todolist";

//#region basic operations
/**
 * @description get all users 
 */
router.get('/', async function (req, res) {
  try {
    let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForGetALl);
    let data = await mongoService.findAll(modelName, { "is_active": true, "is_deleted": false }, { "requiredFields": requiredFields });
    res.contentType('application/json');
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, data, { "total": data.length }));
  } catch (e) {
    await utilityService.response(res,
      await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

  }
});


/**
 * @description create a user  
 */
router.post('/create/0', async function (req, res) {
  try {
    let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForCreate);
    let createdData = await mongoService.create(modelName, req.body, { "requiredFields": requiredFields });
    res.contentType('application/json');
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, createdData, { "total": createdData.length }));
  } catch (e) {
    await utilityService.response(res,
      await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

  }
});

/**
 * @description update  a user  
 */
router.patch('/update/:todolistid', async function (req, res, next) {
  try {
    let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForUpdate);
    let updatedData = await mongoService.updateOne(modelName, { "id": req.params.todolistid, "is_deleted": false, "is_active": true }, req.body, { "requiredFields": requiredFields });
    res.contentType('application/json');
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, updatedData, { "total": updatedData.length }));
  } catch (e) {
    await utilityService.response(res,
      await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

  }
});


/**
 * @description delete a user  
 */
router.delete('/delete/:todolistid', async function (req, res) {
  try {
    let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForDelete);
    let deletedData = await mongoService.deleteOne(modelName, { "id": req.params.todolistid, "is_deleted": false, "is_active": true }, { "requiredFields": requiredFields });
    res.contentType('application/json');
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, deletedData, { "total": deletedData.length }));
  } catch (e) {
    await utilityService.response(res,
      await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

  }
});

//#endregion 

//#region advance operations
/**
 * @description get list of to do list based on a user  
 */
router.get('/users/:userid', async function (req, res) {
  try {
    let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForGetALl);
    let data = await mongoService.findAll(modelName, { "user_id": req.params.userid, "is_deleted": false, "is_active": true }, { "requiredFields": requiredFields });
    res.contentType('application/json');
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, data, { "total": data.length }));
  } catch (e) {
    await utilityService.response(res,
      await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

  }
});


/**
 * @description get specific todolist of specific user  
 */
router.get('/users/:userid/todolist/:todolistid', async function (req, res) {
  try {
    let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForGetALl);
    let data = await mongoService.findAll(modelName, { "user_id": req.params.userid, "id": req.params.todolistid, "is_deleted": false, "is_active": true }, { "requiredFields": requiredFields });
    res.contentType('application/json');
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, data, { "total": data.length }));
  } catch (e) {
    await utilityService.response(res,
      await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

  }
});

//#endregion

module.exports = router;
