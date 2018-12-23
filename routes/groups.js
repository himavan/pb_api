const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { Group, validate, uniqueArray, spliceArray } = require('../models/group');
const { Contact } = require('../models/contact');

router.get('/', auth, async (req, res) => {
  const groups = await Group.findOne({ added_by: req.user._id });
  res.send(groups.group);
});

router.post('/', auth, async (req, res) => {

  let groups = await Group.findOne({ added_by: req.user._id });
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (groups) {
    groups.group = uniqueArray(groups.group.concat(req.body.group));
  }
  else {
    groups = new Group({ group: req.body.group, added_by: req.user._id });
  }
  groups = await groups.save();
  res.send(groups);
});

router.put('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const group = await Group.find({ added_by: req.user._id });

  if (!group) return res.status(404).send('The group with the given ID was not found.');

  res.send(group);
});

router.delete('/:group', auth, async (req, res) => {
  try {

    let groups = await Group.findOne({ added_by: req.user._id });
    groups.group = spliceArray(groups.group, req.params.group)
    groups.save();
    if (!groups) return res.status(404).send('The given group was not found.');

    let contact = await Contact.find({ added_by: req.user._id, group: { $all: [req.params.group] } });
    if (contact) {
      for (let i = 0; i < contact.length; i++) {
        contact[i].group = spliceArray(contact[i].group, req.params.group);
        contact[i].save();
      }
    }
    res.send(groups);
  }
  catch (error) {
    console.log(error);
  }

});


module.exports = router;