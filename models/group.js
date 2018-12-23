const Joi = require('joi');
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  group: [{type:String, required: true}],
  added_by: mongoose.Schema.Types.ObjectId
});

const Group = mongoose.model('Group', groupSchema);

function validateGroup(group) {
  const schema = {
    group: Joi.array().items(Joi.string().min(3).required())
  };
  return Joi.validate(group, schema);
}

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}

function spliceArray(array, search) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (JSON.stringify(array[i]) === JSON.stringify(search)) {
      array.splice(i, 1);
    }
  }
  return array;
}

exports.groupSchema = groupSchema;
exports.Group = Group; 
exports.validate = validateGroup;
exports.uniqueArray = arrayUnique;

exports.spliceArray = spliceArray;