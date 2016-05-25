var proxyquire = require("proxyquire");
var should = require("chai").should();
var expect = require("chai").expect;
var sinon = require("sinon");

var express = require("express");

var app = express();
app.use(require('body-parser').json());

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
require("../../../models/Assignments");
var Idea = require("../../../models/Ideas");
var User = require("../../../models/Users");

var fail = false;
var postulant;
var router = proxyquire("../../../routes/ideas.js", {
	'./fullAuth': function(x) {

		if (fail){
			return [function(req, res, next){
				next("error");
			}]}
		else {
			return [function(req, res, next){
				req.user =  postulant;
				next();
			}];
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

	beforeEach(function(done) {
		idea = new Idea();
		idea.title = "An idea";
		idea.state = "disponible";
		idea.description = "A Description";
		idea.save(done);
		postulant = new User({username: "Pepe"});
		postulant.save();
	});

	describe("GET /ideas/<id>", function() {
		it("obtains the expected idea", function(done) {
		request(app)
			.get("/" + idea._id)
			.expect(200)
			.end(function(err, response) {
				expect(response.body).to.have.property('title').and.equal(idea.title);
				expect(response.body).to.have.property('state').and.equal(idea.state);
				expect(response.body).to.have.property('description').and.equal(idea.description);
				done();
			});
		});
	});

	describe("PUT /ideas/<id>/postulate", function() {
		describe("when not logged in", function(){
			before(function(done){
				fail = true;
				done();
			});
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
			beforeEach(function(done){
				fail = false;
				done();
			});
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
			it("changes the idea postulant", function(done) {
			request(app)
				.put("/" + idea._id + "/postulate", dummyMiddleware)
				.expect(200)
				.end(function(err, response) {
					should.not.exist(err);
					response.body.should.have.property("postulant")
					response.body.postulant.username.should.be.equal(postulant.username);
					done();
				});
			});
		});
	});

	describe("PUT /ideas/<id>/accept", function() {
		describe("when not logged in", function(){
			before(function(done){
				fail = true;
				done();
			});
			it("throws http 401 Unauthorized", function(done) {
			request(app)
				.put("/" + idea._id + "/accept", dummyMiddleware)
				.expect(401)
				.end(function() {
					done();
				});
			});
		});

		describe("when logged in", function(){
			beforeEach(function(done){
				fail = false;
				done();
			});
			it("changes idea state to 'aceptada'", function(done) {
			request(app)
				.put("/" + idea._id + "/accept", dummyMiddleware)
				.expect(200)
				.end(function(err, response) {
					should.not.exist(err);
					response.body.should.have.property("state").that.equal('aceptada');
					done();
				});
			});
		});
	});

	describe("PUT /ideas/<id>/reject", function() {
		describe("when not logged in", function(){
			before(function(done){
				fail = true;
				done();
			});
			it("throws http 401 Unauthorized", function(done) {
			request(app)
				.put("/" + idea._id + "/reject", dummyMiddleware)
				.expect(401)
				.end(function() {
					done();
				});
			});
		});

		describe("when logged in", function(){
			beforeEach(function(done){
				fail = false;
				done();
			});
			it("changes idea state to 'disponible'", function(done) {
			request(app)
				.put("/" + idea._id + "/reject", dummyMiddleware)
				.expect(200)
				.end(function(err, response) {
					should.not.exist(err);
					response.body.should.have.property("state").that.equal('disponible');
					done();
				});
			});
		});
	});

	describe("PUT /ideas/<id>/delete", function() {
		describe("when not logged in", function(){
			before(function(done){
				fail = true;
				done();
			});
			it("throws http 401 Unauthorized", function(done) {
			request(app)
				.put("/" + idea._id + "/delete", dummyMiddleware)
				.expect(401)
				.end(function() {
					done();
				});
			});
		});

		describe("when logged in", function(){
			beforeEach(function(done){
				fail = false;
				done();
			});
			it("changes idea state to 'eliminada'", function(done) {
			request(app)
				.put("/" + idea._id + "/delete", dummyMiddleware)
				.expect(200)
				.end(function(err, response) {
					should.not.exist(err);
					response.body.should.have.property("state").that.equal('eliminada');
					done();
				});
			});
		});
	});
});
