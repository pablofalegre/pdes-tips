var app = angular.module('tpTips', ['ui.router','angularMoment']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

	  $stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: '/home.html',
	      controller: 'MainCtrl',
	      resolve: {
			    ideaPromise: ['ideas', function(ideas){
			      return ideas.getAll();
			    }],
			    materiasPromise: ['assignments', function(assignments){
			    	return assignments.all();
			    }]

			  }
	    })
	    .state('pending_ideas', {
	      url: '/pending_ideas',
	      templateUrl: '/pending_ideas.html',
	      controller: 'PendingIdeasCtrl',
	      resolve: {
			    pendingIdeasPromise: ['ideas', function(ideas){
			      return ideas.getPendingIdeas();
			    }]
			  }
	    })
	    .state('ideas', {
			  url: '/ideas/{id}',
			  templateUrl: '/ideas.html',
			  controller: 'IdeasCtrl',
				  resolve: {
				    idea: ['$stateParams', 'ideas', function($stateParams, ideas) {
				      return ideas.get($stateParams.id);
				    }]
				  }
			})
	    .state('activities', {
			url: '/activities',
			templateUrl: '/activities.html',
			controller: 'ActivitiesCtrl',
			resolve: {
			    activitiesPromise: ['activities', function(activities) {
			    	
			    	return activities.recent();
			    }]
			}
		})
		.state('login', {
		  url: '/login',
		  templateUrl: '/login.html',
		  controller: 'AuthCtrl',
		  onEnter: ['$state', 'auth', function($state, auth){
		    if(auth.isLoggedIn()){
		      $state.go('home');
		    }
		  }]
		})
		.state('register', {
		  url: '/register',
		  templateUrl: '/register.html',
		  controller: 'AuthCtrl',
		  onEnter: ['$state', 'auth', function($state, auth){
		    if(auth.isLoggedIn()){
		      $state.go('home');
		    }
		  }]
		})
		.state('assignments', {
			url: '/assignments',
			templateUrl: '/assignments.html',
			controller: 'AssignmentCtrl',
			resolve: {
			    assignmentsPromise: ['assignments', function(assignments) {
			    	return assignments.all();
			    }]
			}
		});
	  $urlRouterProvider.otherwise('home');
	}
]);

