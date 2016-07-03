// Include gulp
var gulp = require('gulp');
// Changelog
var runSequence = require('run-sequence');
var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');
// Gulp plugins\
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');

// Test tools
var mocha = require("gulp-mocha");
var protractor = require("gulp-protractor").protractor;
var KarmaServer = require("karma").Server;

var sources = {
  js: ["public/javascripts/external/**/*.js", "public/javascripts/angularApp.js", "public/javascripts/modules/services/**/*.js", "public/javascripts/modules/controllers/**/*.js"],
  test: {
    frontend: ["tests/frontend/dependencies/**/*.js","public/javascripts/angularApp.js", "public/javascripts/modules/services/**/*.js", "public/javascripts/modules/controllers/**/*.js", "public/javascripts/**/*.js",'tests/frontend/**/*.js'],
    backend: ["tests/backend/**/*.js"],
    e2e: ["tests/end-to-end/**/*.js"]
  }
};

// Test tasks
gulp.task("test:backend", function() {
  return gulp.src(sources.test.backend)
    .pipe(mocha());
});

gulp.task("test:frontend", ["karma:dependency:link"], function(done) {
  new KarmaServer({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }).start(done);
});

gulp.task("test:e2e", ["build"], function() {
  return gulp.src(sources.test.e2e)
    .pipe(protractor({configFile: "protractor.conf.js"}));
});

//Dependencies handling tasks
function dependencyCopy(outDir, outFile, options) {
  return gulp.src("bower.json")
      .pipe(mainBowerFiles(options || {}))
      .pipe(concat(outFile))
      .pipe(uglify())
    .pipe(gulp.dest(outDir));
}
gulp.task("dependency:external:copy", function() {
  return dependencyCopy("public/javascripts/external", "dependencies.js");
});

gulp.task("dependency:test:copy", function() {
  return dependencyCopy("tests/frontend/dependencies", "test-dependencies.js", {includeDev: true});
});

gulp.task("dependency:link", ["dependency:external:copy"], function() {
  var dependencies = gulp.src(sources.js);

  return gulp.src("views/index.ejs")
    .pipe(inject(dependencies, {
      ignorePath: 'public',
      addRootSlash: false
    }))
    .pipe(gulp.dest("views"));
});

gulp.task("karma:dependency:link", ["dependency:external:copy", "dependency:test:copy"], function() {
  var dependencies = gulp.src(sources.test.frontend);

  return gulp.src("karma.conf.js")
    .pipe(inject(dependencies, {
      starttag: "files: [",
      endtag: "],",
      transform: function(path, file, index, total) {
        return '"' + path + '"' + (index + 1 < total ? "," : "");
      },
      addRootSlash: false
    }))
    .pipe(gulp.dest("."));
});
gulp.task("test:light", ["test:backend", "test:frontend"]);
gulp.task("test:all", ["test:light", "test:e2e"]);

gulp.task("auto:tests", function() {
  gulp.watch(["models/**/*.js", "routes/**/*.js"], ["test:backend"]);
  gulp.watch(["public/modules/**/*.js", "public/javascripts/angularApp.js"], ["test:frontend"]);
});


// Deploy tasks
gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: ''
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('github-release', function(done) {
  conventionalGithubReleaser({
    type: "oauth",
    token: process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN
  }, {
    preset: 'pdes-tips'
  }, done);
});

gulp.task('bump-version', function () {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: "patch"}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  }
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'changelog',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'github-release',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});


gulp.task("build", ["dependency:link"]);
gulp.task('default', ['watch','auto:tests']);
