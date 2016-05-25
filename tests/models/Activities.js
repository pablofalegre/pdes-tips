require('../../models/Activities');

var Activity = require('mongoose').model('Activity');

var assert = require("chai").assert;

describe("Activity", function() {
    describe("#print()", function() {

    	context("when has empty user, target and action", function() {
			it("should print an empty string", function() {

				var activity = new Activity({user : "", target : "", action : ""});

        		assert.equal("  ", activity.print());
    		});


		});
	});
});