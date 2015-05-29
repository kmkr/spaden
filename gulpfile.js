var gulp = require('gulp');
var del = require('del');
var pack = require('./package');
var plugins = require('gulp-load-plugins')();
var postcssPlugins = require('./postcss.config.js');

var DIST_DIR = './dist/';
var OUT_DIR = DIST_DIR + pack.name + '-' + pack.version;

function addVersionHeader() {
    return plugins.injectString.prepend('/* ' + pack.version + ' - ' + new Date() + ' */\n');
}

gulp.task('copy-images', ['clean'], function() {
    return gulp.src(['./src/img/**'], { base: 'src/'})
        // .pipe(plugins.imageoptim.optimize())
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('optimize-images', [], function() {
    return gulp.src([OUT_DIR + '/img/**'], { base: OUT_DIR}).pipe(plugins.imageoptim.optimize());
});


gulp.task('compile-stylesheets', ['copy-images'], function() {
    return gulp.src('src/styles/*.css')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.postcss(postcssPlugins))
        .pipe(plugins.minifyCss({processImport: false, keepBreaks: true}))
        .pipe(addVersionHeader())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('package-tarball', ['compile-stylesheets'], function() {
    var artifactVersion = pack.version;

    if (plugins.util.env.versionOverride) {
        artifactVersion = plugins.util.env.versionOverride;
        console.log('Version / artifactVersion Overriden', artifactVersion);
    }

    return gulp.src([ OUT_DIR + '/**', OUT_DIR + '/.css'], {
            base: OUT_DIR + '/'
        })
        .pipe(plugins.tar(pack.name + '-' + artifactVersion + '.tar'))
        .pipe(plugins.gzip())
        .pipe(gulp.dest('./dist'));
});

gulp.task('replace-imgpaths', ['compile-stylesheets'], function() {
    return gulp.src(OUT_DIR + '/**/*.css')
        .pipe(plugins.replace(/\.\.\/\.\.\/img\//g, 'img/'))
        .pipe(plugins.replace(/\/img\//g, 'img/'))
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('clean', del.bind(null, DIST_DIR));

gulp.on('err', function(e) {
    console.log(e.err.stack);
});

gulp.task('watch', []);

gulp.task('default', [
    'copy-images',
    'compile-stylesheets',
    'replace-imgpaths'
]);

gulp.task('package', [
    'default',
    'optimize-images',
    'package-tarball'
]);
