var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var postcssPlugins = require('./postcss.config.js');

var DIST_DIR = './dist/';

gulp.task('copy-images', ['clean'], function() {
    return gulp.src(['./src/img/**'], { base: 'src/'})
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy-legacy-files', ['clean'], function() {
    return gulp.src(['./src/styles/thirdparty/**/**.css'], { base: './src'})
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy-browser-files', ['clean'], function() {
    return gulp.src(['./src/styles/browsers/*.css'], { base: './src/styles/browsers'})
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('compile-stylesheets', ['copy-images'], function() {
    return gulp.src('src/styles/*.css')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.postcss(postcssPlugins))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('minify-stylesheets', ['compile-stylesheets', 'replace-imgpaths'], function(){
    return gulp.src(DIST_DIR + '/*.css')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.rename({'extname': '.min.css'}))
        .pipe(plugins.minifyCss({processImport: false, keepBreaks: false, compatibility: 'ie7'}))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('replace-imgpaths', ['compile-stylesheets'], function() {
    return gulp.src(DIST_DIR + '/**/*.css')
        .pipe(plugins.replace(/\.\.\/\.\.\/img\//g, 'img/'))
        .pipe(plugins.replace(/\/img\//g, 'img/'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('clean', del.bind(null, DIST_DIR + '/*'));

gulp.on('err', function(e) {
    console.log(e.err.stack);
});

//
gulp.task('watch', ['default'], function(){
    gulp.watch('src/styles/**/*.css', ['compile-stylesheets']);
});

gulp.task('default', [
    'copy-images',
    'compile-stylesheets',
    'copy-legacy-files',
    'copy-browser-files',
    'replace-imgpaths',
    'minify-stylesheets'
]);
