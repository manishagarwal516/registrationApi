var	userModel = require('../models/userModel'),
	_ = require('underscore'),
	controller = require('./appController');

var user = {
	register: function(req, res) {
		userModel.create(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	login: function(req, res) {
		userModel.validateUser(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	},

	resetPassword: function(req, res) {
		userModel.resetPass(req.body, function(err, data){
			controller.responsify(err, data, function(response){
				res(response);
			});
		});
	}
}

module.exports = user;