const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
task:String,
date:Date,
location: String,
notification:Date,
name: String,

});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;