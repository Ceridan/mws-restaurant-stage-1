/*eslint-env node */
const fs = require('fs');
const gulp = require('gulp');
const concat = require('gulp-concat');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
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
  const bundleThis = (sources) => {
    sources.forEach(src => {
      browserify(['js/' + src + '.js'])
        .transform(babelify.configure({
          presets: ['env']
        }))
        .bundle()
        .pipe(source(src + '.bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist/js'));
    });
  };

  bundleThis(['main', 'restaurant']);
});

gulp.task('dev:scripts', () => {
  const bundleThis = (sources) => {
    sources.forEach(src => {
      browserify(['js/' + src + '.js'])
        .transform(babelify.configure({
          presets: ['env']
        }))
        .bundle()
        .pipe(source(src + '.bundle.js'))
        .pipe(gulp.dest('dist/js'));
    });
  };

  bundleThis(['main', 'restaurant']);
});

gulp.task('prod:service-worker', () => {
  return browserify(['js/service-worker.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('service-worker.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('dev:service-worker', () => {
  return gulp.src('js/service-worker.js')
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
