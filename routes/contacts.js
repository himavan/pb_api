const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Contact, validate, validateNumber, validateGroup } = require('../models/contact');
const { uniqueArray, spliceArray } = require('../models/group');

router.get('/', auth, async (req, res) => {
    const contact = await Contact.find({ added_by: req.user._id });
    if (!contact) return res.status(404).send('The contacts with the given User ID was not found.');
    res.send(contact);
});

router.get('/fav/', auth, async (req, res) => {
    const contact = await Contact.find({ added_by: req.user._id, isFavourite:true });
    if (!contact) return res.status(404).send('The contacts with the given User ID was not found.');
    res.send(contact);
});

router.post('/', auth, async (req, res) => {
    req.body.added_by = req.user._id;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let contact = new Contact(req.body);
    contact = await contact.save();

    res.send(contact)
});

router.get('/:contactId', auth, async (req, res) => {
    const contact = await Contact.find({ added_by: req.user._id, _id: req.params.contactId });
    if (!contact) return res.status(404).send('Contact not found.');
    res.send(contact);
});

router.post('/:contactId', auth, async (req, res) => {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) return res.status(401).send('Invalid Access');

    const { error } = validateNumber(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    contact.phone.push(req.body);
    contact.save();

    res.send(contact)
});

router.put('/:contactId', auth, async (req, res) => {
    const contactID = await Contact.find({added_by:req.user._id, _id:req.params.contactId});
    if (!contactID) return res.status(401).send('Invalid Access');

    const { error } =  validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);     

    const contact = await Contact.findOneAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            added_by:req.user._id
        }, { new: true });

    res.send(contact);
});

router.put('/update/:contactId', auth, async (req, res) => {
    const contactID = await Contact.find({added_by:req.user._id, _id:req.params.contactId});
    if (!contactID) return res.status(401).send('Invalid Access');

    const { error } =  validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);     

    let contact = await Contact.findById(req.params.contactId);
       contact.name = req.body.name;
       contact.email = req.body.email;
       contact.address = req.body.address;
       contact.group = req.body.group;
       contact.image = req.body.image
       for (let i = 0; i < contact.phone.length; i++) {
           contact.phone[i].type = req.body.phone[i].type;
           contact.phone[i].code = req.body.phone[i].code;
           contact.phone[i].number = req.body.phone[i].number;
       }
       contact.save();
    res.send(contact);
});

router.put('/:contactId/fav/', auth, async (req, res) => {
    const contactID = await Contact.find({added_by:req.user._id, _id:req.params.contactId});
    if (!contactID) return res.status(401).send('Invalid Access');   

    let contact = await Contact.findById(req.params.contactId);
    if(contact.isFavourite === true)
        contact.isFavourite = false;
    else
    contact.isFavourite = true;

    contact.save();

    res.send(contact);
});

router.delete('/:contactId', auth, async (req, res) => {
    const contactID = await Contact.find({added_by:req.user._id, _id:req.params.contactId});
    if (!contactID) return res.status(401).send('Invalid Access');

    const contact = await Contact.deleteOne({ _id: req.params.contactId } );
    res.send(contact);
});

router.get('/:contactId/:numberId', auth, async (req, res) => {
    const contact = await Contact.find({ _id: req.params.contactId }, { phone: { $elemMatch: { _id: req.params.numberId } } });
    if (!contact) return res.status(404).send('The contact with the given ID was not found.');
    res.send(contact);
});

router.put('/:contactId/:numberId', auth, async (req, res) => {
    const contactID = await Contact.find({ added_by: req.user._Id, _id: req.params.contactId });
    if (!contactID) return res.status(401).send('Invalid Access');

    const { error } = validateNumber(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let contact = await Contact.findById(req.params.contactId);

    let phone = contact.phone.id(req.params.numberId);
    phone.type = req.body.type;
    phone.code = req.body.code;
    phone.number = req.body.number;

    contact.save();

    res.send(contact);
});

router.post('/group/:contactID', auth, async (req, res) => {

    try {
        const contactID = await Contact.find({ added_by: req.user._id, _id: req.params.contactID });
        if (!contactID) return res.status(401).send('Invalid Access');

        const { error } = validateGroup(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let contact = await Contact.findById(req.params.contactID);
        contact.group = uniqueArray(contact.group.concat(req.body.group));
    
        contact.save();

        res.send(contact);

    } catch (error) {
        console.log(error);
    }




   
});

router.delete('/:contactId/group/', auth, async (req, res) => {

    const contactID = await Contact.find({ added_by: req.user._id, _id: req.params.contactId });
    if (!contactID) return res.status(401).send('Invalid Access');

    const { error } = validateGroup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let contact = await Contact.findById(req.params.contactId);
    contact.group = spliceArray( contact.group, req.body.group);
    contact.save();

    res.send(contact);
});

router.delete('/:contactId/number', auth, async (req, res) => {
    const contactID = await Contact.find({ added_by: req.user._id, _id: req.params.contactId });
    if (!contactID) return res.status(401).send('Invalid Access');

    let contact = await Contact.findById(req.params.contactId);
    // let phone = contact.phone.id(req.params.numberId);
    req.body._id = mongoose.Types.ObjectId(req.body._id);
    contact.phone = spliceArray( contact.phone, req.body);
    contact.save();
    res.send(contact.phone);
});

module.exports = router; 
  