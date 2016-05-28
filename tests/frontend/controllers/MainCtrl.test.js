describe('MainCtrl', function() {
    beforeEach(module('tpTips'));

    var $controller;
    var ideas;
    var users;
    var auth;

    var mainCtrl;

    var $scope;

    beforeEach(inject(function(_$controller_, $injector) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        ideas = $injector.get('ideas');
        users = $injector.get('users');
        auth = $injector.get('auth');

        $scope = {};
        mainCtrl = $controller('MainCtrl', { $scope: $scope, ideas: ideas, users: users, auth: auth });
        sandbox = sinon.sandbox.create();
    }));

    describe('addIdea', function() {
        it('should call ideas to add a new idea', function() {

            var title = 'un titulo';
            var description = 'a description';
            var assignments = ['x'];
            var links = [];

            $scope.title = title;
            $scope.description = description;
            $scope.tmpLinks = links;
            $scope.ideaAssignments = assignments;

            sandbox.stub(ideas, 'create');

            $scope.addIdea();

            ideas.create.calledOnce.should.be.true;

            var ideaArg = ideas.create.getCall(0).args[0];

            ideaArg.title.should.equal(title);
            ideaArg.description.should.equal(description);
            ideaArg.assignments.should.equal(assignments);
            ideaArg.links.should.equal(links);
        });

        it('should not add an idea when title is empty', function() {

            var title = '';
            var description = 'a description';
            var assignments = ['x'];
            var links = [];

            $scope.title = title;
            $scope.description = description;
            $scope.tmpLinks = links;
            $scope.ideaAssignments = assignments;

            sandbox.stub(ideas, 'create');

            $scope.addIdea();

            ideas.create.notCalled.should.be.true;

        });
    });

    describe('addLink', function() {
        it('should add link if it is valid', function() {

            var link = 'http://www.google.com';

            $scope.url.text = link;

            $scope.ideaForm = {};

            $scope.addLink();

            $scope.tmpLinks.should.include(link);
        });

        it('should not add link if it is not valid', function() {

            var link = '';

            $scope.url.text = link;

            $scope.ideaForm = {};

            $scope.addLink();

            $scope.tmpLinks.should.not. include(link);
        });
    });
});
