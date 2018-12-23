const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

let ddata ="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMzJweCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAzMiIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJMYXllcl8xIi8+PGcgaWQ9InVzZXIiPjxnPjxwYXRoIGQ9Ik0xMiwxNkM1LjM3NSwxNiwwLDIxLjM3NSwwLDI4YzAsMi4yMTEsMS43ODksNCw0LDRoMTZjMi4yMTEsMCw0LTEuNzg5LDQtNCAgICBDMjQsMjEuMzc1LDE4LjYyNSwxNiwxMiwxNnoiIHN0eWxlPSJmaWxsOiM0RTRFNTA7Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSI2IiByPSI2IiBzdHlsZT0iZmlsbDojNEU0RTUwOyIvPjwvZz48L2c+PC9zdmc+";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    address: {
        type: String            
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    image:{
        type: String,
        default:ddata 
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, image:this.image }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);


function validateNewUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        address: Joi.string().min(5).max(50),
        image:Joi.string()
    };

    return Joi.validate(user, schema);
}

function validateUpdateUser(user) {
    const schema = {
        _id:Joi.objectId(),
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        newPwd: Joi.string().min(5).max(255).required(),
        address: Joi.string().min(5).max(50),
        image:Joi.string(),
        __v:Joi.number()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateNewUser;
exports.validateUpdateUser = validateUpdateUser;