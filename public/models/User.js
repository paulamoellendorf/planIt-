const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
 username:String,
  password: String,
  name: String,
  birthday: Date,
  phone_Number:Number,
  e_mail:String,
  role: {
    type: String,
    enum: ['GUEST', 'ADMIN'],
    default: 'ADMIN',
  },
  familiy:{
    type: Schema.Types.ObjectId,
    ref: 'Familiy'
  },
 // calender:Object,
 // chart:Object,

});

const User = mongoose.model('User', userSchema);

module.exports = User;