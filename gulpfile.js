'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');

gulp.task('javascript', function () {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
        .pipe(source('app.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
    // Add gulp plugins to the pipeline here.
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(['./src/**/*.js', './test/**/*.js'], function(err, entries) {
        // ensure any errors from globby are handled
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
            transform: [babelify]
        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle().pipe(bundledStream);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;
});

gulp.task('test-bundles', function () {

    var allFilesStream = through();

    globby(['./src/**/*.js', './test/**/*.js'], function(err, files) {
        // ensure any errors from globby are handled
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        files.forEach(function (file) {
            // gulp expects tasks to return a stream, so we create one here.
            var bundledStream = through();

            bundledStream
            // turns the output bundle stream into a stream containing
            // the normal attributes gulp plugins expect.
                .pipe(source(file))
            // the rest of the gulp task, as you would normally write it.
            // here we're copying from the Browserify + Uglify2 recipe.
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
            // Add gulp plugins to the pipeline here.
                .on('error', gutil.log)
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('./dist/'));

            // "globby" replaces the normal "gulp.src" as Browserify
            // creates it's own readable stream.

            // create the Browserify instance.
            var b = browserify({
                entries: file,
                debug: true,
                transform: [babelify]
            });

            // pipe the Browserify stream into the stream we created earlier
            // this starts our gulp pipeline.
            b.bundle().pipe(bundledStream);
            bundledStream.pipe(allFilesStream);
        });
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return allFilesStream;
});
