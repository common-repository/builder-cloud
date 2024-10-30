const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const conf = require('../conf/gulp.conf');
const fileFilter = filter(file => file.stat.isFile());

gulp.task('clean', clean);
gulp.task('other', other);
gulp.task('htmlm', htmlm);
gulp.task('imagem', imagem);
gulp.task('svgm', svgm);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
  return gulp.src([
    conf.paths.src + '/**/*',
    '!' + conf.paths.src + '/**/*.{less,js,html,png,jpg,jpeg,gif,svg}',
    '!' + conf.paths.src + '/**/*.html',
    '!' + conf.paths.src + '/**/*.{png,jpg,jpeg,gif,svg}',
    '!' + conf.paths.src + '/assets',
    '!' + conf.paths.src + '/assets/**',
  ])
  .pipe(fileFilter)
  .pipe(gulp.dest(conf.paths.dist));
}

function htmlm() {
  return gulp.src([
    conf.paths.src + '/**/*.html',
    '!' + conf.paths.src + '/assets',
    '!' + conf.paths.src + '/assets/**'
  ])
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    keepClosingSlash: true
  }))
  .pipe(gulp.dest(conf.paths.dist));
}

function svgm() {
  return gulp.src([
    conf.paths.src + '/**/*.svg',
    '!' + conf.paths.src + '/assets',
    '!' + conf.paths.src + '/assets/**'
  ])
  .pipe(imagemin(
    [
      imagemin.svgo(),
    ],
    {verbose:true}
  ))
  .pipe(gulp.dest(conf.paths.dist));
}

function imagem() {
  return gulp.src([
    conf.paths.src + '/**/*.{png,jpg,jpeg,gif}',
    '!' + conf.paths.src + '/assets',
    '!' + conf.paths.src + '/assets/**'
  ])
  .pipe(imageResize({
    width: 2000,
    height: 6000,
    crop: false,
    quality: 0.95 // image quality will be further reduced by imagemin
  }))
  .pipe(imagemin(
    [
      imagemin.gifsicle(),
      imagemin.optipng(),
      imageminJpegRecompress({
        quality: 'veryhigh',
        method: 'ssim',
        target: 0.997,
        min: 60,
        max: 75,
      }),
      imagemin.jpegtran()
    ],
    {verbose:true}
  ))
  .pipe(gulp.dest(conf.paths.dist));
}
