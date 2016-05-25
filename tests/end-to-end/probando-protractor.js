var should = require("chai").should();


describe('TpTpis protractor', function(done) {


    var alumno = 'alumno';
    var professor = 'pepe';


    before('create users', function(done){

    	logout().then(function(){
    		login(alumno).then(function(loged){
	    		if(!loged){
			    	browser.get('http://localhost:3000/#/register');

			    	element(by.model('user.username')).sendKeys(alumno);
			        element(by.model('user.password')).sendKeys(alumno);

					element(by.css('[ng-submit="register()"]')).submit().then(function(){
						done();
					});
	    		} else {
	    			done();
	    		}
    		});
    	});

    });

    var isLoggedIn = function(username){
    	return  element(by.cssContainingText('a', username)).isPresent();
    };

    var login = function(username) {

    	return isLoggedIn(username).then(function(loged){

    		if(!loged){
		    	console.log('login with ' + username);
		    	browser.get("http://localhost:3000/#/login");

		        element(by.model('user.username')).sendKeys(username);
		        element(by.model('user.password')).sendKeys(username);

		        return element(by.css('[ng-submit="logIn()"]')).submit().then(function(){
					var username = element(by.cssContainingText('a', username));
			        return username.isPresent();
		        });
    		}
    	});



    };

    var logout = function(){
		browser.get('http://localhost:3000/');

        var found = element(by.linkText('Log Out'));

        console.log('each log oout');

        return found.isPresent().then(function(p) {

                console.log('loggin out ');
            if (p) {
                return found.click();
            } else {
            	console.log('not loggin out ');
            	return p;
        	}
        });
    };

    beforeEach('log out before each test', function(done) {
    	logout();
    });

    describe('home page', function(done) {
        it('should have a title', function(done) {
            browser.get('http://localhost:3000/');

            browser.getTitle().then(function(title) {
                title.should.be.equal('Ideas para TIPs');
                done();
            });
        });

        it('should have a log in', function(done) {
            browser.get('http://localhost:3000/');

            element(by.linkText('Log In')).isPresent().then(function(p) {
                p.should.be.true;
                done();
            });

        });
    });

    describe('log in ', function(done) {

        it('should show my user name', function(done) {
            login(alumno).then(function(loggedin) {

            	if(loggedin){
	            	var username = element(by.cssContainingText('a', alumno));
	                username.isPresent().then(function(p) {
	                    p.should.be.true;
	                    done();
	                });
            	} else {
            		done('not loged in');
            	}
            });

        });
    });

    describe('ideas ', function(done) {

        it('should be possible to post a new idea as a professor', function(done) {
            login(alumno).then(function() {

            	var username = element(by.cssContainingText('a', alumno));
                username.isPresent().then(function(p) {
                    p.should.be.true;
                    done();
                });
            });

        });
    });
});
