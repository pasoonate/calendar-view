const { src, dest, parallel, watch } = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
 
const regex = /^(import|export).*;{1}$/gm;

function jsBuild() {
  return src(['./src/*.js', ], {base:'./'})
    .pipe(concat('calendar-view.js'))
    .pipe(replace(regex, ''))
    .pipe(dest('dist'))
};

function jsMinify() {
  return src(['./src/*.js', ], {base:'./'})
    .pipe(concat('calendar-view.js'))
    .pipe(replace(regex, ''))
    .pipe(minify())
    .pipe(dest('dist'))
    .pipe(rename('calendar-view.min.js'))
}

function sassBuild() {
  return src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist'));
};

function sassMinify() {
  return src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist'));
};



exports.default = parallel(sassMinify, jsMinify);
exports.minify = parallel(sassMinify, jsMinify);
exports.build = parallel(sassBuild, jsBuild);
 
exports.watch = function () {
  watch('./src', parallel(sassBuild, jsBuild));
};