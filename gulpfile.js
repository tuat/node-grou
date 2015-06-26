var gulp     = require('gulp'),
    del      = require('del');
    sequence = require('gulp-sequence'),
    usemin   = require('gulp-usemin'),
    cssmin   = require('gulp-cssmin'),
    uglify   = require('gulp-uglify'),
    rev      = require('gulp-rev'),
    replace  = require('gulp-replace');

gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('images', function () {
    return gulp
            .src('src/assets/img/**/*')
            .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('render', function() {
    return gulp
            .src([
                'src/*.html',
            ])
            .pipe(usemin({
                css: [cssmin({ noAdvanced: 0, keepSpecialComments: 0 }), rev()],
                js : [uglify(), rev()]
            }))
            .pipe(gulp.dest('dist/'))
});

gulp.task('default', sequence('clean', ['render', 'images']));
