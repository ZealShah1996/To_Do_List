var express = require('express');
var router = express.Router();

const services=require('./../../../Mongo_Operations');
const configService=services.configService;
const findKeyName=configService.findVariableAvaiableInConfiguration;
const debugService=services.debugService;
const mongoService=services.mongoService;
const utilityService=services.utilityService;
const debug = debugService.debugConsole(__dirname, __filename);
let requiredFieldsForGetALl=["id","name","age","is_active","is_delete","password"];
let requiredFieldsForCreate=["id","name","age","is_active","is_delete","password"];
let requiredFieldsForUpdate=["id","name","age","is_active","is_delete","password"];
let requiredFieldsForDelete=["id","name","age","is_active","is_delete","password"];
let modelName="user";
/**
 * @description get all users 
 */
router.get('/', async function(req, res) {
 // await mongoService.create(modelName,{"id":1,"name":"zeal"});
 // await mongoService.create("todolist",{"id":1,"name":"zeal"});
//  await mongoService.create("todolistitem",{"id":1,"name":"zeal"});


let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForGetALl);
  let data=await mongoService.findAll(modelName,{"is_active":true,"is_deleted":false},{"requiredFields":requiredFields});
  res.contentType('application/json');
  await utilityService.response(res,JSON.stringify(data));
});


/**
 * @description log in of users 
 */
router.post('/login', async function(req, res) {
  let data=await mongoService.findAll(modelName,{"name":req.body.username,"password":req.body.password,"is_active":true,"is_deleted":false},{"requiredFields":["name","id"]});
  res.contentType('application/json');
  if(data.length==1){
    res.status(200);
  }
  else{
    res.status(401);
  }
  await utilityService.response(res,JSON.stringify(data));
});

/**
 * @description create a user  
 */
router.post('/create/0', async function(req, res) {
  let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForCreate);
  let createdData=await mongoService.create(modelName,req.body,{"requiredFields":requiredFields});
  res.contentType('application/json');
  await utilityService.response(res,JSON.stringify(createdData));
});

/**
 * @description create a user  
 */
router.patch('/update/:userid', async function(req, res) {
  let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForUpdate);
  let updatedData=await mongoService.updateOne(modelName,{"id":req.params.userid,"is_deleted":false,"is_active":true},req.body,{"requiredFields":requiredFields},next);
  res.contentType('application/json');
  await utilityService.response(res,JSON.stringify(updatedData));
});


/**
 * @description delete a user  
 */
router.delete('/delete/:userid', async function(req, res) {
  let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForDelete);
  let deletedData=await mongoService.deleteOne(modelName,{"id":req.params.userid,"is_deleted":false,"is_active":true},{"requiredFields":requiredFields});
  res.contentType('application/json');
  await utilityService.response(res,JSON.stringify(deletedData));
});

module.exports = router;
