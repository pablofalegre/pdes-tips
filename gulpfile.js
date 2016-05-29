// Include gulp
var gulp = require('gulp');
// Include plugins
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpFilter = require('gulp-filter');

gulp.task('main-bower-files', function() {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/*.min.*',
                        './dist/fonts/*.*'
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest('public'));
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
      'public/javascripts/angularApp.js',
      'public/javascripts/**/*.js'])
      .pipe(concat('sources.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('public'));
});
gulp.task('uglify', function(){
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(uglify())
        .pipe(gulp.dest('public/sources'));
});
gulp.task('css', function(){
  return gulp.src('bower_components/bootstrap/dist/css/bootstrap.css')
        .pipe(concat('styles.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public'));
});
// Default Task
gulp.task('default', ['scripts','main-bower-files']);
