// Karma configuration
// Generated on Sat May 21 2016 10:11:59 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
 	"tests/frontend/dependencies/test-dependencies.js",
 	"public/javascripts/angularApp.js",
 	"public/javascripts/modules/services/activities.js",
 	"public/javascripts/modules/services/assignments.js",
 	"public/javascripts/modules/services/auth.js",
 	"public/javascripts/modules/services/ideas.js",
 	"public/javascripts/modules/services/users.js",
 	"public/javascripts/modules/controllers/ActivitiesCtrl.js",
 	"public/javascripts/modules/controllers/AssignmentCtrl.js",
 	"public/javascripts/modules/controllers/AuthCtrl.js",
 	"public/javascripts/modules/controllers/IdeasCtrl.js",
 	"public/javascripts/modules/controllers/MainCtrl.js",
 	"public/javascripts/modules/controllers/NavCtrl.js",
 	"public/javascripts/modules/controllers/PendingIdeasCtrl.js",
 	"public/javascripts/external/dependencies.js",
 	"tests/frontend/controllers/ActivitiesCtrl.test.js",
 	"tests/frontend/controllers/AssignmentCtrl.test.js",
 	"tests/frontend/controllers/IdeasCtrl.test.js",
 	"tests/frontend/controllers/MainCtrl.test.js",
 	"tests/frontend/controllers/PendingIdeasCtrl.test.js",
 	"tests/frontend/services/activities.test.js",
 	"tests/frontend/services/assignments.test.js",
 	"tests/frontend/services/ideas.test.js",
 	"tests/frontend/services/users.test.js"
 	],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
