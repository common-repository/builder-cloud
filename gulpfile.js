const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('build', gulp.series('clean', gulp.parallel('other', 'htmlm', 'imagem', 'svgm'), 'webpack:dist'));
gulp.task('serve', gulp.series('webpack:watch', watch, 'browsersync'));
gulp.task('test', gulp.series('karma:single-run'));
gulp.task('test:auto', gulp.series('karma:auto-run'));
gulp.task('serve:dist', gulp.series('browsersync:dist'));

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch(conf.path.tmp('index.html'), reloadBrowserSync);
  gulp.watch(conf.path.src('**/*.html'), reloadBrowserSync);
  done();
}
