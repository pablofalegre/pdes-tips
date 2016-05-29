var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

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

            return protractor.promise.all([un, ps]).then(function(r) {
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
                return found.click().then(function() {
                    return protractor.promise.fullyResolved();
                });
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

        var f = function(algo) {

            browser.get('http://localhost:3000/');

            var un = element(by.model('title')).sendKeys(name);
            var ps = element(by.model('description')).sendKeys(name + ' decripcion');

            return protractor.promise.all([un, ps]).then(function(r) {
                return element(by.css('[ng-submit="addIdea()"]')).submit();
            });
        };
        return f;
    };

    var verifyIdea = function(name) {
        var f = function(algo) {
            browser.get('http://localhost:3000/');

            var title = element.all(by.binding('idea.title')).first();

            // expect(title.getText()).toBe(name);

            title.getText().should.eventually.be.equal(name);

            return protractor.promise.fullyResolved();
        };
        return f;
    };

    var filterIdea = function(title) {

        return function(elem, index) {
            return elem.getText().then(function(text) {
                return text == title;
            });
        };
    };


    var deleteIdea = function(ideaTitle) {
        return function(algo) {
            browser.get('http://localhost:3000/');

            var title = element.all(by.binding('idea.title')).filter(filterIdea(ideaTitle)).first();

            title.click().then(function() {
                return element(by.css('[ng-click="delete()"]')).click();
            });

        };
    };

    var verifyDeletion = function(ideaTitle) {
        return function(algo) {
            browser.get('http://localhost:3000/');

            return element.all(by.binding('idea.title')).filter(filterIdea(ideaTitle)).count().then(function(amount) {
                amount.should.be.equal(0);
                return protractor.promise.fullyResolved();
            });
        };
    };

    var randomTitle = function(characterLength) {
        var randomText = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < characterLength; i++)
            randomText += possible.charAt(Math.floor(Math.random() * possible.length));
        return randomText;
    };

    var postulateStudent = function(ideaTitle) {

        return function(algo) {
            browser.get('http://localhost:3000/');

            var title = element.all(by.binding('idea.title')).filter(filterIdea(ideaTitle)).first();

            return title.click().then(function() {
                return element(by.css('[ng-click="postulate()"]')).click();
            });
        };
    };

    var filterDisplayed = function(elem, index) {
            return elem.isDisplayed().then(function(b) {
                console.log('displayed ? = ' + b);
                return (b === true);
            });
    };

    var verifyPostulated = function(ideaTitle) {

        return function(algo) {
            browser.get('http://localhost:3000/');

            return element.all(by.binding('idea.title'))
                .filter(filterIdea(ideaTitle))
                .first()
                .element(by.xpath('ancestor::span'))
                .element(by.xpath('following-sibling::label'))
                .element(by.xpath('following-sibling::label'))
                .getText().then(function(text) {
                    text.should.be.equal('En Revision');
                    console.log('TEXT DL LABEL = ' + text);
                    return protractor.promise.fullyResolved();
                });
        };
    };

    describe('ideas ', function(done) {

        it('a student can postulate on an idea', function(done) {

            var anIdea = randomTitle(15);
            login(professor)
                .then(postIdea(anIdea))
                .then(logout)
                .then(function() {
                    return login(alumno);
                })
                .then(postulateStudent(anIdea))
                .then(verifyPostulated(anIdea))
                .then(done);
        });

        it('should be possible to post a new idea as a professor', function(done) {

            var firstIdea = randomTitle(10);
            var secondIdea = randomTitle(20);
            login(professor)
                .then(postIdea(firstIdea))
                .then(verifyIdea(firstIdea))
                .then(postIdea(secondIdea))
                .then(verifyIdea(secondIdea))
                .then(done);
        });

        it('should be possible to delete an idea as professor', function(done) {

            var anIdea = randomTitle(15);
            login(professor)
                .then(postIdea(anIdea))
                .then(verifyIdea(anIdea))
                .then(deleteIdea(anIdea))
                .then(verifyDeletion(anIdea))
                .then(done);
        });
    });

});
