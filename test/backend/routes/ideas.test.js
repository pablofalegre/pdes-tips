var proxyquire = require("proxyquire");
var should = require("chai").should();
var expect = require("chai").expect;
var sinon = require("sinon");

var express = require("express");

var app = express();

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
require("../../../models/Assignments");
var Idea = require("../../../models/Ideas");
var User = require("../../../models/Users");

var fail = false;
var router = proxyquire("../../../routes/ideas.js", {
	'./fullAuth': function(x) {
		return [];
		if (fail){
			return [function(req, res, next){
				next("error");
			}]}
		else {
			return [];
		}
	}
	
});
app.use("/", router);
var request = require("supertest");

var dummyMiddleware = function(req, res, next) {
	next();
}

describe("router Ideas", function() {

	before("mockgooseConnect", function(done) {
		mockgoose(mongoose).then(function() {
			mongoose.connect("mongodb://localhost/tests");
			done();
		}).catch(function(err){
			done(err);
		})
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	});

	after(function(done){
		mongoose.disconnect(done);
	});

	var idea;
	var postulant;

	beforeEach(function(done) {
		idea = new Idea();
		idea.title = "An idea";
		idea.state = "disponible";
		idea.description = "A Description";
		idea.save(done);
		postulant = new User();
	});

	describe("PUT /ideas/<id>/postulate", function() {
		before(function(done){
			fail = true;
			done();
		})
		describe("when not logged in", function(){
			it("throws http 401 Unauthorized", function(done) {
			request(app)
				.put("/" + idea._id + "/postulate", dummyMiddleware)
				.expect(401)
				.end(function() {
					done();
				});
			});
		});

		describe("when logged in", function(){
			it("change idea state to 'en revision'", function(done) {
			request(app)
				.put("/" + idea._id + "/postulate", dummyMiddleware)
				.expect(200)
				.end(function(err, response) {
					should.not.exist(err);
					response.body.should.have.property("state").that.equal('en revision');
					done();
				});
			});
		});
	});

});
