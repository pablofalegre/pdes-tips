describe('AssignmentCtrl', function() {
  beforeEach(module('tpTips'));

  var $controller;
  var assignments;
  var assignmentCtrl;

  var $scope;

  beforeEach(inject(function(_$controller_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    assignments = $injector.get('assignments');

    $scope = {};
    assignmentCtrl = $controller('AssignmentCtrl', { $scope: $scope, assignments : assignments });
  }));

  describe('$scope.home', function() {
    it('should get all assignments', function() {

      //mockeo el recent del servicio
      assignments.all = function(){ 
      	this.assignments.push('objetos');
      	this.assignments.push('practicas de des');
      	this.assignments.push('ingenieria');
      };

      $scope.home();

      $scope.assignments.should.eql(['objetos', 'practicas de des', 'ingenieria']);

    });

  });


  describe('$scope.addAssignment', function() {
    it('should add an assignment if name is not empty, and sets scope.name to empty string', function() {

    	$scope.name = 'objetos 2';

    	assignments.save = function(assignment){
    		this.assignments.push(assignment);
    	};

	    $scope.saveAssignment();

      	$scope.assignments.should.eql([{ name : 'objetos 2'}]);

    	$scope.name.should.equal('');

    });

  });
});