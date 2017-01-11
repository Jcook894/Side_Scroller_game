var gulp = require('gulp');
    connect = require('gulp-connect');
    gulpif = require('gulp-if');

var env = process.env.NODE_ENV;
var outputDir = 'game';

gulp.task('test', function(){
  console.log("This is a test task.");
});

//Live reload and local server.
gulp.task('connect', function() {
    return connect.server({
        root: [outputDir],
        port: 8888, // optional
        livereload: true
    });
});

gulp.task('default', ['test', 'connect']);
