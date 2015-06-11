var gulp = require('gulp');
var del = require('del');
var pack = require('./package');
var plugins = require('gulp-load-plugins')();
var postcssPlugins = require('./postcss.config.js');

var DIST_DIR = './dist/';
var DIST_NAMED_FOLDER = DIST_DIR + pack.name + '-' + pack.version;

function addVersionHeader() {
    return plugins.injectString.prepend('/* ' + pack.version + ' - ' + new Date() + ' */\n');
}

gulp.task('copy-images', ['clean'], function() {
    return gulp.src(['./src/img/**'], { base: 'src/'})
        .pipe(gulp.dest(DIST_NAMED_FOLDER))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy-legacy-files', ['clean'], function() {
    return gulp.src(['./src/styles/thirdparty/**/**.css'], { base: './src'})
        .pipe(gulp.dest(DIST_NAMED_FOLDER))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy-browser-files', ['clean'], function() {
    return gulp.src(['./src/styles/browsers/*.css'], { base: './src/styles/browsers'})
        .pipe(gulp.dest(DIST_NAMED_FOLDER))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('compile-stylesheets', ['copy-images'], function() {
    return gulp.src('src/styles/*.css')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.postcss(postcssPlugins))
//        .pipe(plugins.minifyCss({processImport: false, keepBreaks: true, compatibility: 'ie7'}))
        .pipe(addVersionHeader())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_NAMED_FOLDER))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('minify-stylesheets', ['compile-stylesheets'], function(){
    gulp.src([DIST_NAMED_FOLDER + '/*.css', DIST_DIR + '/*.css'])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.rename({'extname': '.min.css'}))
        .pipe(plugins.minifyCss({processImport: false, keepBreaks: false, compatibility: 'ie7'}))
        .pipe(addVersionHeader())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_NAMED_FOLDER))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('package-tarball', ['minify-stylesheets'], function() {
    var artifactVersion = pack.version;

    if (plugins.util.env.versionOverride) {
        artifactVersion = plugins.util.env.versionOverride;
        console.log('Version / artifactVersion Overriden', artifactVersion);
    }

    return gulp.src([
            DIST_NAMED_FOLDER + '/**',
            DIST_NAMED_FOLDER + '/.css'
        ],
        {
            base: DIST_NAMED_FOLDER + '/'
        })
        .pipe(plugins.tar(pack.name + '-' + artifactVersion + '.tar'))
        .pipe(plugins.gzip())
        .pipe(gulp.dest('./dist'));
});

gulp.task('replace-imgpaths', ['compile-stylesheets'], function() {
    return gulp.src(DIST_NAMED_FOLDER + '/**/*.css')
        .pipe(plugins.replace(/\.\.\/\.\.\/img\//g, 'img/'))
        .pipe(plugins.replace(/\/img\//g, 'img/'))
        .pipe(gulp.dest(DIST_NAMED_FOLDER));
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
    'minify-stylesheets',
    'copy-legacy-files',
    'copy-browser-files',
    'replace-imgpaths'
]);

gulp.task('package', ['default', 'package-tarball']);
