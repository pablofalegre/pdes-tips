var expect = require("chai").expect;
var should = require('chai').should();

var mongoose = require('mongoose');
var mockgoose = require("mockgoose");

var Idea = require("../../../models/Ideas")
var User = require("../../../models/Users")

describe("Idea", function() {  

	before(function(done) {
		mockgoose(mongoose).then(function() {
			mongoose.connect("mongodb://localhost/asdf");
			done();
		})
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	})

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

	describe("#postulateUser", function() {		

		it("changes state to 'en revision'", function(done) {
			idea.postulateUser(postulant, function(err,savedIdea){
				should.not.exist(err);						
				savedIdea.should.have.property("state").that.equal("en revision");
				done();
			});
		});

		it("sets the received user as the postulant", function(done) {
			idea.postulateUser(postulant, function(err,savedIdea){
				should.not.exist(err);						
				savedIdea.should.have.property("postulant").that.equal(postulant);
				done();
			});
		});
	});

	describe("#accept", function() {		

		it("changes state to 'aceptada'", function(done) {
			idea.accept(postulant, function(err,savedIdea){
				should.not.exist(err);						
				expect(savedIdea).to.have.a.property("state").that.equal("aceptada");
				done();
			});
		});		
	});

	describe("#reject", function() {		

		before(function(done) {
			idea.postulateUser(postulant);
			done();
		});

		it("changes state to 'disponible'", function(done) {
			idea.reject(postulant, function(err,savedIdea){
				should.not.exist(err);						
				expect(savedIdea).to.have.a.property("state").that.equal("disponible");
				done();
			});
		});		


		it("changes postulant to undefined", function(done) {
			idea.reject(postulant, function(err,savedIdea){
				should.not.exist(err);						
				expect(savedIdea).to.have.a.property("postulant").that.equal(undefined);
				done();
			});
		});		
	});

	describe("#delete", function() {		

		it("changes state to 'eliminada'", function(done) {
			idea.delete(postulant, function(err,savedIdea){
				should.not.exist(err);						
				expect(savedIdea).to.have.a.property("state").that.equal("eliminada");
				done();
			});
		});		
	});
});