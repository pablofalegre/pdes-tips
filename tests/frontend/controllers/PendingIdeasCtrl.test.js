describe('MainCtrl', function() {
    beforeEach(module('tpTips'));

    var $controller;
    var ideas;
    var auth;

    var mainCtrl;

    var $scope;

    beforeEach(inject(function(_$controller_, $injector) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        ideas = $injector.get('ideas');
        auth = $injector.get('auth');

        $scope = {};
        ideasCtrl = $controller('PendingIdeasCtrl', { $scope: $scope, ideas: ideas, auth: auth });
        sandbox = sinon.sandbox.create();
    }));

    describe('acceptIdea', function() {
        it('should accept an idea an remove it from pending ideas', function() {

        	var ideasMock = ['x', 'y', 'z'];

        	var ideaMock = 'x';

        	$scope.ideas = ideasMock;

            sandbox.stub(ideas, 'accept');

            ideas.accept = function(id){ return {
            		success : function(a){
            		return a(ideaMock);
	            	}
            }};

        	$scope.acceptIdea(ideaMock);

        	$scope.ideas.should.not.include(ideaMock);

        });

    });
});
