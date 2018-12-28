const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');
const {User, validate,validateUpdateUser,validateUpdatePwd} = require('../models/user');
const {Group} = require('../models/group');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
        
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
  
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    let groups = new Group({ group: ["family", "friends","work"], added_by: user._id });
    await groups.save();

  });

router.put('/', auth, async (req, res) => {
    const { error } = validateUpdateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById( req.user._id);
    if (!user) return res.status(400).send('User not Found!.');

    user.name = req.body.name;
    user.email = req.body.email;
    user.address = req.body.address;
    user.image = req.body.image;

    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email','address','image']));

});

router.put('/password', auth, async (req, res) => {
    const { error } = validateUpdatePwd(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById( req.user._id);
    if (!user) return res.status(400).send('User not Found!.');

    const validPassword = await bcrypt.compare(req.body.oldPwd, user.password);
    if (!validPassword) return res.status(400).send('Invalid Current Password.');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPwd, salt);

    await user.save();
    res.send("Password Updated Successfully");

});
  
  module.exports = router; 
  