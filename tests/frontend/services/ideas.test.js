
describe("ideas service", function() {

	beforeEach('loading app', module("tpTips"));

	var ideas;
	var $httpBackend;
	
	beforeEach('injecting...', inject(function($injector) {
     // Set up the mock http service responses
     	$httpBackend = $injector.get('$httpBackend');

     	ideas = $injector.get('ideas');
	}));

	describe("#getAll()", function() {

		it("should call backend and get all ideas", function(done) {

			var ideasMock = ['x', 'y', 'z'];

			var promise = ideas.getAll();

			promise.then(function() {
				ideas.should.have.property("ideas").eql(ideasMock);
				done();
			});

			var resMock = [];

			$httpBackend.when('GET', "/assignments").respond(resMock);
			$httpBackend.expectGET("/ideas").respond(ideasMock);
			$httpBackend.expectGET("/ideas").respond(ideasMock);
			$httpBackend.flush();
		});

	});

	describe("#getPendingIdeas()", function() {

		it("should call backend and get all pending ideas", function(done) {

			var ideasMock = ['x', 'y', 'z'];

			var promise = ideas.getPendingIdeas();

			promise.then(function() {
				ideas.should.have.property("pending_ideas").eql(ideasMock);
				done();
			});

			var resMock = [];

			$httpBackend.when('GET', "/assignments").respond(resMock);
			$httpBackend.when('GET', '/ideas').respond(resMock);

			$httpBackend.expectGET("/pending_ideas").respond(ideasMock);
			$httpBackend.flush();
		});

	});

	describe("#get()", function() {

		it("should call backend and get all pending ideas", function(done) {

			var ideasMock = ['x', 'y', 'z'];

			var ideaMock = {_id : '1234'};

			var promise = ideas.get(ideaMock._id);

			promise.then(function(data) {
				data.should.have.property("_id").equal('1234');
				done();
			});

			var resMock = [];

			$httpBackend.when('GET', "/assignments").respond(resMock);
			$httpBackend.when('GET', '/ideas').respond(resMock);
			
			$httpBackend.expectGET("/ideas/1234").respond(ideaMock);
			$httpBackend.flush();
		});

	});

	describe("#postulate()", function() {

		it("should call backend and change idea's state", function(done) {

			var ideasMock = ['x', 'y', 'z'];

			var ideaMock = {_id : '1234'};

			var promise = ideas.postulate(ideaMock);

			promise.then(function(data) {
				ideaMock.should.have.property("_id").equal('1234');
				ideaMock.should.have.property("state").equal('en revision');
				done();
			});

			var resMock = [];

			$httpBackend.when('GET', "/assignments").respond(resMock);
			$httpBackend.when('GET', '/ideas').respond(resMock);
			
			$httpBackend.expectPUT("/ideas/1234/postulate").respond(ideaMock);
			$httpBackend.flush();
		});
	});

	describe("#accept()", function() {

		it("should call backend and update idea on frontend", function(done) {

			var ideasMock = ['x', 'y', 'z'];

			var ideaMock = {_id : '1234'};

			var acceptedIdeaMock = {_id : '1234', state : 'accepted'};

			var promise = ideas.accept(ideaMock);

			promise.then(function(data) {
				ideaMock.should.have.property('state').equal('accepted');
				done();
			});

			var resMock = [];

			$httpBackend.when('GET', "/assignments").respond(resMock);
			$httpBackend.when('GET', '/ideas').respond(resMock);
			
			$httpBackend.expectPUT("/ideas/1234/accept").respond(acceptedIdeaMock);
			$httpBackend.flush();
		});
	});

	describe("#create()", function() {

		it("should call backend and create new idea", function(done) {

			var ideasMock = ['x', 'y', 'z'];

			var newIdeaMock = 'w';

			var promise = ideas.create(newIdeaMock);

			promise.then(function(data) {
				ideas.ideas.should.include('w');
				done();
			});

			var resMock = [];

			$httpBackend.when('GET', "/assignments").respond(resMock);
			$httpBackend.when('GET', '/ideas').respond(ideasMock);
			
			$httpBackend.expectPOST("/ideas").respond(newIdeaMock);
			$httpBackend.flush();
		});
	});
});


