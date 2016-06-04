
describe("assignments service", function() {

	beforeEach('loading app', module("tpTips"));

	var assignments;
	var $httpBackend;
	
	beforeEach('injecting...', inject(function($injector) {
     // Set up the mock http service responses
     	$httpBackend = $injector.get('$httpBackend');

     	assignments = $injector.get('assignments');
	}));

	describe("#all()", function() {

		it("should call backend and get all assignments", function(done) {

			var mockAssignments = ['x', 'y', 'z'];

			var promise = assignments.all();

			promise.then(function() {
				assignments.should.have.property("assignments").eql(mockAssignments);
				done();
			});

			var mockResponse = [];

			$httpBackend.when('GET', "/assignments").respond(mockAssignments);
			$httpBackend.when('GET', "/ideas").respond(mockResponse);
			$httpBackend.flush();
		});

	});

	describe("#save()", function() {

		it("should call backend and save an assignment", function(done) {

			var dataMock = 'assignment';

			var promise = assignments.save(dataMock);

			promise.then(function() {
				assignments.should.have.property("assignments").that.include(dataMock);
				done();
			});

			var mockResponse = [];

			$httpBackend.when('GET', "/assignments").respond(mockResponse);
			$httpBackend.when('GET', "/ideas").respond(mockResponse);
			$httpBackend.when('POST', "/assignments").respond(dataMock);
			$httpBackend.flush();
		});

	});

	describe("#delete()", function() {

		it("should call backend with a delete using corresponding id", function(done) {

			var assignmentMock = { _id : 'abc123'};

			var all = [{name:'objetos'}];

			var promise = assignments.delete(assignmentMock);

			promise.then(function() {
				done();
			});

			$httpBackend.when('GET', "/assignments").respond(all);
			$httpBackend.when('GET', "/ideas").respond([]);
			$httpBackend.expectPUT("/assignments/abc123/delete").respond(all);
			$httpBackend.flush();
			
			assignments.should.have.property("assignments").that.eql(all);
		});

	});
});

