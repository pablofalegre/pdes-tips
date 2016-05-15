var express = require("express");

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");

require('../../models/Activities');
var Activity = mongoose.model('Activity');
var activityLog = require('../../routes/activityLog');

var request = require("supertest");

var httpMock = require("node-mocks-http");

var dummyMiddleware = function(req, res) {
        next();
}

describe("router activityLog", function() {

        before(function(done) {
                mockgoose(mongoose).then(function() {
                        mongoose.connect("mongodb://localhost/fruta");
                        done();
                })
        });

        afterEach(function(done) {
                mockgoose.reset(done);
        });

        var post;
/*
        beforeEach(function(done) {
                post = new Post();
                post.title = "Dummy post";
                post.author = "Yo";
                post.upvotes = 12;
                post.save(done);
        });
*/
        describe("when intercepting req res", function() {

                it("should create activity when necessary", function(done) {
                        var req = httpMock.createRequest({
                                method : 'POST',
                                url : '/ideas'
                        });
                        var res = httpMock.createResponse({
                                  eventEmitter: require('events').EventEmitter
                        });

                        activityLog(req, res);

                        res.on('finish', function(){
                                done();
                        });

                        res.send('');
                        console.log("EEEE");
                });

        });

})
