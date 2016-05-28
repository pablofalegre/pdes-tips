
describe("users service", function() {

	beforeEach('loading app', module("tpTips"));

	var users;
	var $httpBackend;
	var auth;


	beforeEach('injecting...', inject(function($injector) {
     // Set up the mock http service responses
     	$httpBackend = $injector.get('$httpBackend');

     	users = $injector.get('users');
     	auth = $injector.get('auth');
	}));

	describe("#isDirector()", function() {

		it("should return true if current user is a director", function() {

			var currentUser = {roles : [users.roles.director]};

			auth.currentUser = function(){ return currentUser;};

			var director = users.isDirector();

			director.should.be.true;
		});

	});

	describe("#isProfessor and isStudent", function() {

		it("both should return true if an user is a professor and student", function() {

			var currentUser = {roles : [users.roles.student, users.roles.professor]};

			auth.currentUser = function(){ return currentUser;};

			var director = users.isDirector();
			var professor = users.isProfessor();
			var student = users.isStudent();

			director.should.be.false;
			professor.should.be.true;
			student.should.be.true;
		});

	});
});

