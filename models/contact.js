const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let ddata ="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAzMiIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9InVzZXIiPjxnPjxwYXRoIGQ9Ik0xMiwxNkM1LjM3NSwxNiwwLDIxLjM3NSwwLDI4YzAsMi4yMTEsMS43ODksNCw0LDRoMTZjMi4yMTEsMCw0LTEuNzg5LDQtNCAgICBDMjQsMjEuMzc1LDE4LjYyNSwxNiwxMiwxNnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSI2IiByPSI2IiBzdHlsZT0iZmlsbDojNEU0RTUwOyIvPjwvZz48L2c+PC9zdmc+";

const contactSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:50
    },
    email: {
        type: String ,
        minlength: 5,
        maxlength: 255,       
    },
    address: {
        type: String            
    },
    phone: [{
        type:{
            type: String,
            minlength: 1,
            maxlength:15 
        },
        code:{
            type: String,
            minlength: 1,
            maxlength:5 
        },
        number:{
            type: String,
            minlength: 10,
            maxlength:15, 
            
        }
    }],
    group:[String],
    isFavourite: {
        type:Boolean,
        default: false
    },
    image:{type:String,default:ddata},
    added_by: mongoose.Schema.Types.ObjectId
});

const Contact = mongoose.model('Contact', contactSchema);

const numberschema ={
    _id:Joi.objectId(),
    type:Joi.string().min(1).max(15),
    code:Joi.string().min(1).max(5),
    number:Joi.string().min(10).max(15).required(),
    __v:Joi.number()
};

function validateContact(contact) {
    const schema = {
        _id:Joi.objectId(),
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email(),
        address: Joi.string().min(5).max(50),
        phone: Joi.array().items( Joi.object(numberschema)),
        group:Joi.array(),
        isFavourite:Joi.boolean(),
        added_by:Joi.objectId().required(),
        __v:Joi.number(),
        image:Joi.string()
    };
    return Joi.validate(contact, schema);
}

function validateContactNumber(number){ 
  return Joi.validate(number, numberschema);
}

function validateContactGroup(group){ 
    const groupSchema = {
        group: Joi.array().items(Joi.string().min(3).required())
    }
    return Joi.validate(group, groupSchema);
  }

exports.Contact = Contact;
exports.validate = validateContact;
exports.validateNumber = validateContactNumber;
exports.validateGroup = validateContactGroup;
