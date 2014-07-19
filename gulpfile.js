var gulp = require('gulp');
var extensions = {
    uglify : 'gulp-uglify',
    connect : 'gulp-connect',
    rename : 'gulp-rename'
};

var e = function() {
    var cache = {};
    return function(ext) {
        return cache[ext] || (cache[ext] = require(extensions[ext]));
    };
}();

process.env.NODE_ENV = 'development';

gulp.task('js', function() {
    return gulp.src('src/keyboard.js')
        .pipe(e('rename')('keyboard.js'))
        .pipe(gulp.dest('lib'));
});

gulp.task('js.min', function () {
    return gulp.src('src/keyboard.js')
        .pipe(e('uglify')())
        .pipe(e('rename')('keyboard.min.js'))
        .pipe(gulp.dest('lib'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['release']);
});

gulp.task('server', function() {
    e('connect').server({
        root: '.',
        port: 3000,
        livereload: true
    });
});

gulp.task('default', function() {
    return gulp.start('release', 'server', 'watch');
});

gulp.task('release', function() {
    return gulp.start('js', 'js.min');
});