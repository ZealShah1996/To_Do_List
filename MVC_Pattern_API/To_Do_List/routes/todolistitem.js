var express = require('express');
var router = express.Router();

const services = require('../../../Mongo_Operations');
const configService = services.configService;
const findKeyName = configService.findVariableAvaiableInConfiguration;
const debugService = services.debugService;
const mongoService = services.mongoService;
const utilityService = services.utilityService;
const debug = debugService.debugConsole(__dirname, __filename);
let requiredFieldsForGetALl = ["id", "name", "is_active", "is_deleted","todolist_id","task_text"];
let requiredFieldsForCreate = ["id", "name", "is_active", "is_deleted","todolist_id","task_text"];
let requiredFieldsForUpdate = ["id", "name", "is_active", "is_deleted","todolist_id","task_text"];
let requiredFieldsForDelete = ["id", "name", "is_active", "is_deleted","todolist_id","task_text"];
let modelName = "todolistitem";

//#region basic operations
/**
 * @description get all to do list item 
 */
router.get('/', async function (req, res) {
  let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForGetALl);
  let data = await mongoService.findAll(modelName, { "is_active": true, "is_deleted": false }, { "requiredFields": requiredFields });
  res.contentType('application/json');
  await utilityService.response(res, JSON.stringify(data));

});


/**
 * @description create a to do list item
 */
router.post('/create/0', async function (req, res) {
  let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForCreate);
  let createdData = await mongoService.create(modelName, req.body, { "requiredFields": requiredFields });
  res.contentType('application/json');
  await utilityService.response(res, JSON.stringify(createdData));
});

/**
 * @description update a to do list item 
 */
router.patch('/update/:todolistitemid', async function (req, res) {
  let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForUpdate);
  let updatedData = await mongoService.updateOne(modelName, { "id": req.params.todolistitemid, "is_deleted": false, "is_active": true }, req.body, { "requiredFields": requiredFields });
  res.contentType('application/json');
  await utilityService.response(res, JSON.stringify(updatedData));
});


/**
 * @description delete a to do list item
 */
router.delete('/delete/:todolistitemid', async function (req, res) {
  let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForDelete);
  let deletedData = await mongoService.deleteOne(modelName, { "id": req.params.todolistitemid, "is_deleted": false, "is_active": true }, { "requiredFields": requiredFields });
  res.contentType('application/json');
  await utilityService.response(res, JSON.stringify(deletedData));
});

//#endregion 

//#region advance operations
/**
 * @description get list of to do list based on a user  
 */
router.get('/todolist/:todolistid', async function (req, res) {
  let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForGetALl);
  let data = await mongoService.findAll(modelName, { "todolist_id": req.params.todolistid, "is_deleted": false, "is_active": true }, { "requiredFields": requiredFields });
  res.contentType('application/json');
  await utilityService.response(res, JSON.stringify(data));
});


/**
 * @description get specific todolist of specific user  
 */
router.get('/todolist/:todolistid/todolistitem/:todolistitemid', async function (req, res) {
  let requiredFields = await utilityService.findRequiredFieldsFromHeaders(req, requiredFieldsForGetALl);
  let data = await mongoService.findAll(modelName, { "todolist_id": req.params.todolistid, "id": req.params.todolistitemid, "is_deleted": false, "is_active": true }, { "requiredFields": requiredFields });
  res.contentType('application/json');
  await utilityService.response(res, JSON.stringify(data));
});

//#endregion

module.exports = router;
