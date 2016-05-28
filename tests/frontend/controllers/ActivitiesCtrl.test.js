describe('ActivitiesCtrl', function() {
  beforeEach(module('tpTips'));

  var $controller;
  var activities;

  beforeEach(inject(function(_$controller_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    activities = $injector.get('activities');
  }));

  describe('$scope.home', function() {
    it('should get recent activities', function() {
      var $scope = {};
      var controller = $controller('ActivitiesCtrl', { $scope: $scope, activities : activities });

      //mockeo el recent del servicio
      activities.recent = function(){ 
      	this.activities.push(1);
      	this.activities.push(2);
      	this.activities.push(3);
      };

      $scope.home();

      $scope.activities.should.eql([1, 2, 3]);

    });

  });
});