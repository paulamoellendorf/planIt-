const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
username:String,
password:String,
familyName: String,
members: [
  {
  type: Schema.Types.ObjectId,
  ref: 'User'
}
],
tasks:{
type:Schema.Types.ObjectId,
ref:'Task'
},
chart:Object,

});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
