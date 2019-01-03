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

var todolistSchema = new mongoose.Schema({
    id: { type: Number, default: 1 },
    user_id:{type:Number,default:0},
    name: { type: String, default: 'zeal' },
    color:{type:String,default:"green"},
    created_at: { type: Date, default:Date.now() },
    update_at: { type: Date, default: Date.now()},
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    context:{type:Object,default:{}}
});


todolistSchema.plugin(autoIncrement.plugin, { model: 'ToDoList', field: 'id',startAt: 1});
var ToDoList = mongoose.model("ToDoList", todolistSchema);

module.exports = {
    model: ToDoList,
    mongoose:mongoose
}