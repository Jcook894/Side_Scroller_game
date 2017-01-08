var gulp = require('gulp');
    connect = require('gulp-connect');
    gulpif = require('gulp-if');

var env = process.env.NODE_ENV;
var outputDir = 'game';

gulp.task('test', function(){
  console.log("This is a test task.");
});

gulp.task('connect', function() {
    return connect.server({
        root: [outputDir],
        port: 8888, // optional
        livereload: false
    });
});﻿

gulp.task('default', ['test', 'connect']);
