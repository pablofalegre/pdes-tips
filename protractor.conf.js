exports.config = {
    framework: 'mocha',
    seleniumAddress: 'http://localhost:4444/wd/hub',

    capabilities: {
        'browserName': 'phantomjs'
    },
    specs: ['tests/end-to-end/*.js'],
    mochaOpts: {
        timeout: 30000,
        reporter: "spec"
    },
};
