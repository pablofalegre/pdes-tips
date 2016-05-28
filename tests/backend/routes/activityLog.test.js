var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var proxyquire = require("proxyquire");

require('../../../models/Activities');


var httpMock = require("node-mocks-http");

var sinon = require("sinon");

var dummyConfig = {};

var activityLog = proxyquire('../../../routes/activityLog', {
    '../config/ActivitiesConfig' : dummyConfig
});

var logger = activityLog.logger;
var maker = activityLog.maker;


describe("router activityLog", function() {

        before(function(done) {
            mockgoose(mongoose).then(function() {
                    mongoose.connect("mongodb://localhost/tests");
                    done();
            });
        });

        afterEach(function(done) {
            mockgoose.reset(done);
        });

        after(function(done){
            mongoose.disconnect(done);
        });

        describe("when intercepting req res", function() {
            it("should subscribe a function to 'on' event", function(done) {
                    var req = httpMock.createRequest({
                            method : 'POST',
                            url : '/ideas',
                            path : '',
                            route : {path : ''}
                    });

                    var res = httpMock.createResponse({
                    });

                    var resSpy = sinon.spy(res, 'on');

                    logger(req, res);

                    sinon.assert.calledOnce(resSpy);

                    done();
            });
        });

        describe("when calling makeActivity", function() {
            it("should create an activity if response was ok and activity could be found", function(done) {

                    var baseUrl = '/ideas';

                    var req = httpMock.createRequest({
                            method : 'POST',
                            url : baseUrl,
                            user : {user : 'lucas'},
                            path : ''
                    });

                    req.route = { path : ''};
                    req.baseUrl = baseUrl;

                    var res = httpMock.createResponse({
                    });

                    res.statusCode = 200;

                    configSpy = sinon.spy(dummyConfig, 'find');

                    maker(req, res);

                    sinon.assert.calledOnce(configSpy);

                    configSpy.calledWith(baseUrl, 'POST');

                    done();
            });
        });
});
