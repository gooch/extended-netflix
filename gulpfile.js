'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanhtml = require('gulp-cleanhtml'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    zip = require('gulp-zip'),
    jsonminify = require('gulp-jsonminify');

gulp.task('clean', function() {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

gulp.task('copy', function() {
    gulp.src('src/fonts/**')
        .pipe(gulp.dest('build/fonts'));
    gulp.src('src/icons/**')
        .pipe(gulp.dest('build/icons'));
    gulp.src('src/_locales/**')
        .pipe(gulp.dest('build/_locales'));
    return gulp.src('src/manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(cleanhtml())
        .pipe(gulp.dest('build'));
});

gulp.task('jshint', function() {
    return gulp.src('src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['jshint'], function() {
    return gulp.src(['src/scripts/*.js'])
        .pipe(stripdebug())
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('build/scripts'));
});

gulp.task('styles', function() {
	return gulp.src('src/styles/*.css')
		.pipe(minifycss({root: 'src/styles', keepSpecialComments: 0}))
		.pipe(gulp.dest('build/styles'));
});

gulp.task('minify', function () {
    return gulp.src('src/data/categories.json')
        .pipe(jsonminify())
        .pipe(gulp.dest('build/data'));
});

gulp.task('zip', ['html', 'minify', 'scripts', 'styles', 'copy'], function() {
    var manifest = require('./src/manifest'),
        distFileName = manifest.name + ' v' + manifest.version + '.zip',
        mapFileName = manifest.name + ' v' + manifest.version + '-maps.zip';
    gulp.src('build/scripts/**/*.map')
        .pipe(zip(mapFileName))
        .pipe(gulp.dest('dist'));
    return gulp.src(['build/**', '!build/scripts/**/*.map'])
        .pipe(zip(distFileName))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
    gulp.start('zip');
});
