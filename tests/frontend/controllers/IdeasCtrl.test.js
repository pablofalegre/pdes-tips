describe('IdeasCtrl', function() {
  beforeEach(module('tpTips'));

  var $controller;
  var ideas;
  var users;
  var auth;

  var ideasCtrl;

  var $scope;

  beforeEach(inject(function(_$controller_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    ideas = $injector.get('ideas');
    users = $injector.get('users');
    auth = $injector.get('auth');

    $scope = {};
    idea = {};
    ideasCtrl = $controller('IdeasCtrl', { $scope: $scope, ideas : ideas, idea : idea, users : users, auth : auth});
  }));

  describe('$scope.acceptPostulant', function() {
    it('should return true if idea accept postulant', function() {

   		idea.state = 'disponible';
   		users.isStudent = function(){ return true;};

      	accepts = $scope.acceptPostulant();

      	accepts.should.be.true;

    });

    it('should return false if user is not a student', function() {

   		idea.state = 'disponible';
   		users.isStudent = function(){ return false;};

      	accepts = $scope.acceptPostulant();

      	accepts.should.be.false;

    });
  });

  describe('$scope.canDelete', function() {
    it('should return true if idea state is disponible and user is a director', function() {

   		idea.state = 'disponible';
   		idea.author = { username: 'lucas'};

   		users.isDirector = function(){ return true;};

      	accepts = $scope.canDelete();

      	accepts.should.be.true;

    });

    it('should return true if idea state is disponible and author is current user', function() {

   		idea.state = 'disponible';
   		idea.author = { username: 'lucas'};

   		auth.currentUser = function(){return {username : 'lucas'}};

   		users.isDirector = function(){ return false;};

      	accepts = $scope.canDelete();

      	accepts.should.be.true;

    });
  });
});