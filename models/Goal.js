const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
goal:String,
description:String,
//members: [String],
limit: Date,
family:{
  type: Schema.Types.ObjectId,
  ref:'Family'
}

});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
