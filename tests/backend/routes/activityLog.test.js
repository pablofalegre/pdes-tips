var mongoose = require("mongoose");
var mockgoose = require("mockgoose");

require('../../../models/Activities');
var activityLog = require('../../../routes/activityLog');

var httpMock = require("node-mocks-http");

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
            });
        });
});
