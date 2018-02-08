var connector = require('./appModel'),
	ObjectID = require('mongodb').ObjectID,
	_ = require('underscore'),
	email = require('../lib/email.js'),
	uuid = require('node-uuid'),
	async = require('async');

var user = {
	create: function(data, res){
		console.log("Data received");
		console.log(data);
		if(Object.keys(data).length === 0) { return res("Please enter valid data"); }
		var verificationUUID = uuid.v1();

		var userData = {
			"collection": "user",
			"qry":{
				"username": data.username,
				"email_id": data.email_id,
				"password": data.password,
				"verificationUUID" : verificationUUID,
				"passReset": false
			}
		}
		
		connector.mongoPool.insert(userData,function(err, result){
			if(err){
				res(err);
			}else{
				var insertId = result;
				user.sendEmail(data.email_id, verificationUUID, function(emailErr, emailResponse){
					if(err) res(null, emailErr);
					
					res(null, insertId)
				});
			}
		})
	},

	validateUser: function(data, res){
		var mongoSelectData = {
			"collection": "user",
			"qry":{
				"username": data.username,
				"password": data.password
			}
		};
		console.log(mongoSelectData);
		connector.mongoPool.query(mongoSelectData,function(err, result){
			console.log(err, result);
			res(null, result);
		})
	},

	resetPass: function(data, res){
		console.log(data);
		async.waterfall([
			function(callback) {
				var mongoSelectData = {
					"collection": "user",
					"qry" : {"verificationUUID":data.verificationUUID, passReset: false}
				}
				console.log(mongoSelectData);
				connector.mongoPool.query(mongoSelectData,function(err, result){
					console.log(result);
					callback(null, result);
				})
			},
			function(mongoResult,callback){
				if(mongoResult.length > 0){
					var mongoUpdateData = {
						"collection": "user",
						"qry":{
							condition : { "_id" : new ObjectID(mongoResult[0]["_id"])},
							values : { "password" : data.password, passReset: true }	
						}
					}
					connector.mongoPool.update(mongoUpdateData,function(err, result){
						callback(null, result);
					});
				}else{
					callback(null);
				}
			}
		],function(err,result){
				res(null,result);
		});
	},

	sendEmail : function(username, authToken, callback){
		console.log("In sendEmail");
		var to = username
		var subject = "Email Verification"
		var text = "http://localhost:4200/resetPassword/" + authToken;
		var html = "<a href =" + text + ">" + text + "</a>";
		email.sendMail(to, subject, text, html, function(err, emailResponse) {
			if(err) {
				callback(err)
			}else{
				callback(null, emailResponse);
			}		
		});
	},

}

module.exports = user;
