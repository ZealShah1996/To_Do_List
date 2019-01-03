let mongoose = require('mongoose'),
autoIncrement = require('mongoose-auto-increment');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//mongoose.set('debug', true);
const services = require('./../../../Mongo_Operations');
const debugService = services.debugService;
const debug = debugService.debugConsole(__dirname, __filename);

const configService=services.configService;
const findKeyName=configService.findVariableAvaiableInConfiguration;
let mongo = findKeyName('mongo_connection');
let urlForDB = `mongodb://${mongo.URI}:${mongo.Port}/${mongo.dbName}`;
var connection = mongoose.createConnection(urlForDB);
autoIncrement.initialize(connection);


var todolistitemSchema = new mongoose.Schema({
    id: { type: Number, default: 1 },
    name: { type: String, default: 'Task details' },
    todolist_id:{type:Number,default:0},
    task_text: { type: String, default: '' },
    is_complete: { type:Boolean, default:true},
    created_at: { type: Date, default:Date.now() },
    update_at: { type: Date, default: Date.now()},
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    context:{type:Object,default:{}}
});


todolistitemSchema.plugin(autoIncrement.plugin, { model: 'ToDoListItem', field: 'id',startAt: 1});
var ToDoListItem = mongoose.model("ToDoListItem", todolistitemSchema);

module.exports = {
    model: ToDoListItem,
    mongoose:mongoose
}