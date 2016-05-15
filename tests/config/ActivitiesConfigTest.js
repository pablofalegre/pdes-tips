var expect = require("chai").expect;
var should = require("chai").should();

var mongoose = require('mongoose');
require("../../models/Activities");
var Activity = mongoose.model('Activity');


var activitiesConfig = require("../../config/ActivitiesConfig");
var Optional = require('optional-js');

describe("config ActivitiesConfig", function() {

        describe("find", function() {

                it("should return empty when not found", function() {

                        var found = activitiesConfig.find("", "");

                        found.isPresent().should.be.false;
                });

                it("should return empty when found path but no method", function() {

                        var found = activitiesConfig.find("/ideas", "XXXX");

                        found.isPresent().should.be.false;
                });

                it("should return expected activity when found", function() {

                        var found = activitiesConfig.find("/ideas", "POST");

                        found.isPresent().should.be.true;

                        var body = {title : "un titulo"};
                        var req = { body : body};
                        var activityFunc = found.get();

                        console.log("ccc " + activityFunc);

                        var activity = activityFunc("lucas", req, "");

                        console.log("ccc " + activity);

                        activity.target.should.be.equal("un titulo");
                        activity.action.should.be.equal("subio una idea");
                });
        });
});