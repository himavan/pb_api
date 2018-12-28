const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   res.send('Welcome to Phonebook App API. API reference will be published soon!')
});

  module.exports = router; 
  