var express = require('express');
var path = require('path');
var router = express.Router();

// Handle get request to '/' by sending them the sender index page
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../clients/sender/index.html'));
});

// Handle get request to '/receiver' by sending them the receiver index page
router.get('/receiver', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../clients/receiver/index.html'));
});

module.exports = router;
