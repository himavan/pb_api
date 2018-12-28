const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let ddata ="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHRpdGxlPkFzc2V0IDU8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggZD0iTTEwMCw0NnY4YTUuNTUsNS41NSwwLDAsMC0uMzQsMUM5Ni43Miw3Ni4yMyw4NSw5MC4yOSw2NSw5Ny41Myw2MS41LDk4LjgsNTcuNjksOTkuMiw1NCwxMDBINDZhNS41NSw1LjU1LDAsMCwwLTEtLjM0QzIzLjc3LDk2LjcyLDkuNzEsODUsMi40Nyw2NSwxLjIsNjEuNS44LDU3LjY5LDAsNTRWNDZhNS41NSw1LjU1LDAsMCwwLC4zNC0xQzMuMjgsMjMuNzcsMTUsOS43MSwzNSwyLjQ3LDM4LjUsMS4yLDQyLjMxLjgsNDYsMGg4YTUuNTUsNS41NSwwLDAsMCwxLC4zNEM3Ni4yMywzLjI4LDkwLjI5LDE1LDk3LjUzLDM1LDk4LjgsMzguNSw5OS4yLDQyLjMxLDEwMCw0NlpNODUuMzEsNzcuMzVjMTIuMzItMTQuNzUsMTMuOTMtNDItNC01OS40NC0xNy40Ni0xNy00Ni4xNS0xNi43Ny02My4xOS40OEMuNDksMzYuMjksMi43OCw2My4zMiwxNC43MSw3Ny4zMkE0MC44NSw0MC44NSwwLDAsMSwzOCw1Ny4zQzMxLjg4LDUzLDI3Ljg3LDQ3LjQ1LDI3LDQwLjA4czEuNjktMTMuNzYsNi45My0xOWEyMi40NiwyMi40NiwwLDAsMSwzMS43Mi0uNDYsMjIuNDIsMjIuNDIsMCwwLDEsNy41MSwxNS42OGMuMzksOS0zLjg1LDE1Ljc2LTExLjEzLDIxQTQwLjg2LDQwLjg2LDAsMCwxLDg1LjMxLDc3LjM1Wk00Ni4xMiw5NC42NGMxNS4xNSwwLDI1LjI5LTMuOCwzMy43Ni0xMS4xNCwxLjI5LTEuMTEsMS41OC0yLC43OC0zLjU2Qzc0LjI1LDY3LjUyLDY0LjEyLDYwLjgzLDUwLjE0LDYwLjc4UzI1LjgzLDY3LjM5LDE5LjM3LDc5LjljLS43OSwxLjUyLS42LDIuNDQuNzEsMy41N0MyOC42NSw5MC44NywzOC41OCw5NC41NCw0Ni4xMiw5NC42NFptMjEuNzQtNTdjMC0xMC4zMy03LjQ5LTE4LTE3LjcyLTE4cy0xOCw3LjQ5LTE4LDE3LjcyLDcuNDksMTgsMTcuNzIsMThTNjcuODMsNDcuODcsNjcuODYsMzcuNjRaIi8+PC9nPjwvZz48L3N2Zz4=";

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
