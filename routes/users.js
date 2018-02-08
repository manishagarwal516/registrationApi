var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  	userController.login(req, function(data){
        res.send(data);
    });
});

router.post('/register', function(req, res, next) {
  	userController.register(req, function(data){
        res.send(data);
    });
});

router.post('/resetPass', function(req, res, next) {
  	userController.resetPassword(req, function(data){
        res.send(data);
    });
});

module.exports = router;
