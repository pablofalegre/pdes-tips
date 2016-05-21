describe("service activities", function() {

	describe("activities", function() {

		beforeEach('loading app', module("tpTips"));

		var activities;
		var $httpBackend;
/*
		beforeEach('injecting', inject(function(_activities_, _$httpBackend_) {
			activities = _activities_;	
			$httpBackend = _$httpBackend_;
		}));*/
		
		beforeEach('injecting...', inject(function($injector) {
	     // Set up the mock http service responses
	     	$httpBackend = $injector.get('$httpBackend');

	     	activities = $injector.get('activities');
		}));

		describe("#recent()", function() {

			it("should call backend and get recent activities", function(done) {

				//upvote devuelve una promise que no se va a resolver hasta el backend
				//no conteste. El backend va a contestar una vez que invoquemos a 
				//$httpBackend.flush();
				console.log('activities is = ' + activities);

				var promise = activities.recent();
				promise.then(function() {
					activities.should.have.property("activities").eql([1]);
					done();
				});

				var mockResponse = [1];

				$httpBackend.expectGET("/activities").respond(mockResponse);
				$httpBackend.expectGET("/ideas").respond(mockResponse);
				$httpBackend.expectGET("/assignments").respond(mockResponse);
				$httpBackend.flush();
			});

		});

	});

});
