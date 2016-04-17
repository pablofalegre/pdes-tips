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
			    }]
			  }
	    })
	    .state('posts', {
			  url: '/posts/{id}',
			  templateUrl: '/posts.html',
			  controller: 'PostsCtrl',
				  resolve: {
				    post: ['$stateParams', 'posts', function($stateParams, posts) {
				      return posts.get($stateParams.id);
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
			    	console.log('resolving');
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
		});
	  $urlRouterProvider.otherwise('home');
	}
]);

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

	auth.saveToken = function (token){
	  $window.localStorage['tp-tips-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['tp-tips-token'];
	};
	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};
	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};
	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};
	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};
	auth.logOut = function(){
	  $window.localStorage.removeItem('tp-tips-token');
	};

  return auth;
}]);

app.factory('ideas', ['$http', 'auth', function($http, auth){
  var o = {
    ideas: []
  };
  o.home = function(){ 
  	return $http.get('/');
  };
  o.getAll = function() {
    return $http.get('/ideas').success(function(data){
      angular.copy(data, o.ideas);
    });
  };
  	o.get = function(id) {

  		console.log('getting idea ');
	  	return $http.get('/ideas/' + id).error(function(error){
	      console.log('error gettign idea = ' + error);
	      $scope.error = error;
	    }).then(function(res){
	  		console.log('tehn return');
	    	return res.data;
	  	});
	};

  	o.create = function(idea) {
  		console.log("creating idea " + idea);
	  return $http.post('/ideas', idea, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    	o.ideas.push(data);
	  });
	};

  return o;
}]);

app.factory('activities', ['$http', 'auth', function($http, auth){
  var o = {
    activities: []
  };

  o.recent = function() {
  	console.log("calling recent");
    return $http.get('/activities').error(function(error){
	      console.log('error gettign activities = ' + error);
	      $scope.error = error;
	    }).success(function(data){
      angular.copy(data, o.activities);
    });
  };

  return o;
}]);

app.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
    posts: []
  };
  o.home = function(){ 
  	return $http.get('/');
  };
  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };
  o.create = function(post) {
	  return $http.post('/posts', post, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.posts.push(data);
	  });
	};

	o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    post.upvotes += 1;
	  });
	};
	o.downvote = function(post) {
	  return $http.put('/posts/' + post._id + '/downvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    post.downvotes += 1;
	  });
	};
	o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
	};
	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  });
	};
	o.upvoteComment = function(post, comment) {
	  return $http.put('/comments/'+ comment._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    comment.upvotes += 1;
	  });
	};
  return o;
}]);

app.controller('NavCtrl', [
	'$scope',
	'auth',
	function($scope, auth){
	  $scope.isLoggedIn = auth.isLoggedIn;
	  $scope.currentUser = auth.currentUser;
	  $scope.logOut = auth.logOut;
	}
]);

app.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
	  $scope.user = {};

	  $scope.register = function(){
	    auth.register($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      $state.go('home');
	    });
	  };

	  $scope.logIn = function(){
	    auth.logIn($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      $state.go('home');
	    });
	  };
}]);

app.controller('MainCtrl', [
	'$scope',
	'ideas',
	'auth',
	function($scope, ideas, auth){
		$scope.orderProperty = '-creationDate';
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.ideas = ideas.ideas;	

		$scope.addIdea = function(){

			if(!$scope.title || $scope.title === '') { return; };
			
	  		ideas.create({
	  			title: $scope.title,
	  			description: $scope.description,
	  			state: "disponible" 
  			});
  			$scope.title  = '';
  			$scope.description = '';
		};
}]);

app.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	'auth',
	'$location',
	function($scope, posts, post, auth, $location){
		$scope.isLoggedIn = auth.isLoggedIn;
	  $scope.post = post;
	  $scope.home = function(){
			posts.home();
		};
		$scope.addComment = function(){
		  if(!$scope.body || $scope.body === '') { return; }
		  posts.addComment(post._id, {
		    body: $scope.body
		  }).success(function(comment) {
		    $scope.post.comments.push(comment);
		  });
		  $scope.body = '';
		};
		$scope.incrementUpvotes = function(comment) {
	  	posts.upvoteComment(post, comment);
		};

		$scope.backToHome = function() {
	  	$location.path('/');
		};	
	}
]);

app.controller('IdeasCtrl', [
	'$scope',
	'ideas',
	'idea',
	'auth',
	'$location',
	function($scope, ideas, idea, auth, $location){

		console.log('ideas ctrl');

		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.idea = idea;
		$scope.home = function(){
			ideas.home();
		};	
		$scope.backToHome = function() {
	  		$location.path('/');
		};
	}
]);

app.controller('ActivitiesCtrl', [
	'$scope',
	'activities',
	function($scope, activities){
		console.log('ctrl activities');
		$scope.activities = activities.activities;
		$scope.home = function(){
			activities.recent();
		};
	}
]);