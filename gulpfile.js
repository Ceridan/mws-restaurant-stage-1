/*eslint-env node */
const fs = require('fs');
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const htmlreplace = require('gulp-html-replace');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('prod:serve', () => {
  browserSync.init({
    server: 'dist'
  });
});

gulp.task('dev:serve', ['lint', 'html', 'styles', 'dev:scripts', 'dev:service-worker', 'images'], () => {
  gulp.watch('*.html', ['html']);
  gulp.watch('css/**/*.css', ['styles']);
  gulp.watch('js/**/*.js', ['lint', 'dev:scripts', 'dev:service-worker']);

  gulp.watch(['dist/*.html', 'dist/js/bundle.js', 'dist/css/**/*.css']).on('change', browserSync.reload);

  browserSync.init({
    server: 'dist'
  });
});

gulp.task('prod:build', done => {
  runSequence('lint', 'clean', ['html', 'styles', 'prod:scripts', 'prod:service-worker', 'images'], done);
});

gulp.task('dev:build', done => {
  runSequence('lint', 'clean', ['html', 'styles', 'dev:scripts', 'dev:service-worker', 'images'], done);
});


gulp.task('clean', () => {
  return del('dist');
});

gulp.task('html', done => {
  fs.readFile('secret.json', 'utf8', (err, data) => {
    let googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

    if (!err) {
      const secret = JSON.parse(data);

      if (secret && secret.GoogleMapsApiKey) {
        googleMapsApiKey = secret.GoogleMapsApiKey;
      }
    }

    gulp.src('*.html')
      .pipe(htmlreplace({
        js: '<script src="js/bundle.js"></script>',
        googlemaps: {
          src: googleMapsApiKey,
          tpl: '<script async defer src="https://maps.googleapis.com/maps/api/js?key=%s&libraries=places&callback=initMap"></script>'
        }
      }))
      .pipe(gulp.dest('dist'));

    done();
  });
});

gulp.task('styles', () => {
  return gulp.src('css/**/*.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.task('prod:scripts', () => {
  return gulp.src(['js/**/*.js', '!js/database-helper-local.js', '!js/service-worker.js'])
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('dev:scripts', () => {
  return gulp.src(['js/**/*.js', '!js/database-helper-local.js', '!js/service-worker.js'])
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('prod:service-worker', () => {
  return gulp.src('js/service-worker.js')
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('dev:service-worker', () => {
  return gulp.src('js/service-worker.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('img/**/*.jpg')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('lint', () => {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
