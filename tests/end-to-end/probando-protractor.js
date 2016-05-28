var should = require("chai").should();

describe('TpTpis protractor', function(done) {


    var alumno = 'alumno';
    var professor = 'profesor';


    var createUser = function(user) {
        var create = function(loged) {
            if (!loged) {
                browser.get('http://localhost:3000/#/register');

                element(by.model('user.username')).sendKeys(user);
                element(by.model('user.password')).sendKeys(user);

                return element(by.css('[ng-submit="register()"]')).submit();
            } else {
                protractor.promise.fullyResolved();
            }
        };

        return logout()
            .then(create)
            .then(logout);

    };

    before('create users', function(done) {
        console.log('creating users');
        createUser(alumno)
            .then(createUser(professor))
            .then(done);
    });


    var isLoggedIn = function(username) {
        return element(by.cssContainingText('a', username)).isPresent();
    };

    var login = function(username) {

        return logout().then(function() {

                console.log('login with ' + username);
                browser.get("http://localhost:3000/#/login");

                var un = element(by.model('user.username')).sendKeys(username);
                var ps = element(by.model('user.password')).sendKeys(username);

                return protractor.promise.all([un, ps]).then(function(r){
                    return element(by.css('[ng-submit="logIn()"]')).submit();
                });
        });


    };

    var logout = function() {
        browser.get('http://localhost:3000/');

        var found = element(by.linkText('Log Out'));

        return found.isPresent().then(function(p) {
            if (p) {
                console.log('loggin out ');
                return found.click().then(function(){return protractor.promise.fullyResolved();});
            } else {
                console.log('already loged out');
                return protractor.promise.fullyResolved();
            }
        });
    };

    beforeEach('log out before each test', function(done) {
        logout()
        .then(done);
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
            login(alumno).then(function() {
                    var username = element(by.cssContainingText('a', alumno));
                    username.isPresent().then(function(p) {
                        p.should.be.true;
                        done();
                    });
            });

        });
    });

    var postIdea = function(name) {

        var f = function(algo){
            return protractor.promise.fulfilled(name);
        };
        return f;
    };

    var verifyIdea = function(name) {
        var f = function(algo){
            return protractor.promise.fulfilled(name);
        };
        return f;
    };

    describe('ideas ', function(done) {

        it('should be possible to post a new idea as a professor', function(done) {

            postIdea('eeee')('asas').then(function(val){
                console.log('val? = ' + val);
            });

            var firstIdea = 'first idea';
            var secondIdea = 'second idea';
            login(professor)
                .then(postIdea(firstIdea))
                .then(verifyIdea(firstIdea))
                .then(postIdea(secondIdea))
                .then(verifyIdea(secondIdea))
                .then(function(algo) {
                    console.log('algo? = ' + algo);
                    if (algo) {
                        done();
                    } else {
                        done('errrrr');
                    }
                });
        });


    });

});
