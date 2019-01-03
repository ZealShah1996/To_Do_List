var express = require('express');
var router = express.Router();

const services=require('./../../../Mongo_Operations');
const configService=services.configService;
const findKeyName=configService.findVariableAvaiableInConfiguration;
const debugService=services.debugService;
const mongoService=services.mongoService;
const utilityService=services.utilityService;

const createResponseOnPassedDataOnSuccess = utilityService.createResponseOnPassedDataOnSuccess;
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
try {
let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForGetALl);
  let data=await mongoService.findAll(modelName,{"is_active":true,"is_deleted":false},{"requiredFields":requiredFields});
  res.contentType('application/json');
  await utilityService.response(res,
     await createResponseOnPassedDataOnSuccess(200, null, data, { "total": data.length }));
} catch (e) {
await utilityService.response(res,
    await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

}
});


/**
 * @description log in of users 
 */
router.post('/login', async function(req, res) {
try {
  let data=await mongoService.findAll(modelName,{"name":req.body.username,"password":req.body.password,"is_active":true,"is_deleted":false},{"requiredFields":["name","id"]});
  res.contentType('application/json');
  if(data.length==1){
    await utilityService.response(res,
      await createResponseOnPassedDataOnSuccess(200, null, data, { "total": data.length }));
  }
  else{
    if(data.length==0){
      await utilityService.response(res,
         await createResponseOnPassedDataOnSuccess(401,new Error("No account avaiable"),null,{"loginfailedmessage":"No account avaiable"}));
    }
    else if(data.length>1){
      await utilityService.response(res,
         await createResponseOnPassedDataOnSuccess(401, new Error("There is multiple accouts."),null,{"loginfailedmessage":"There is multiple accouts."}));
    }
  }
} catch (e) {
await utilityService.response(res,
    await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

}
});

/**
 * @description create a user  
 */
router.post('/create/0', async function(req, res) {
  try {
let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForCreate);
  let createdData=await mongoService.create(modelName,req.body,{"requiredFields":requiredFields});
  res.contentType('application/json');
  await utilityService.response(res,
     await createResponseOnPassedDataOnSuccess(200, null, createdData, { "total": createdData.length }));
} catch (e) {
await utilityService.response(res,
    await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

}
});

/**
 * @description create a user  
 */
router.patch('/update/:userid', async function(req, res) {
try {
  let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForUpdate);
  let updatedData=await mongoService.updateOne(modelName,{"id":req.params.userid,"is_deleted":false,"is_active":true},req.body,{"requiredFields":requiredFields});
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
router.delete('/delete/:userid', async function(req, res) {
  try {
let requiredFields=await utilityService.findRequiredFieldsFromHeaders(req,requiredFieldsForDelete);
  let deletedData=await mongoService.deleteOne(modelName,{"id":req.params.userid,"is_deleted":false,"is_active":true},{"requiredFields":requiredFields});
  res.contentType('application/json');
  await utilityService.response(res,
     await createResponseOnPassedDataOnSuccess(200, null, deletedData, { "total": deletedData.length }));
} catch (e) {
await utilityService.response(res,
    await utilityService.createResponseOnPassedDataOnSuccess(404, e, null, "Failed To Perform Action"));

}
});

module.exports = router;
