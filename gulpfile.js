/*eslint-env node */
const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
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

const buildFolder = 'dist';

gulp.task('prod:serve', ['prod:build'], () => {
  browserSync.init({
    server: `${buildFolder}`
  });
});

gulp.task('dev:serve', ['dev:build'], () => {
  gulp.watch('*.html', ['html']);
  gulp.watch('css/**/*.scss', ['dev:styles']);
  gulp.watch(['js/**/*.js', '!js/service-worker.js'], ['lint', 'dev:scripts']);
  gulp.watch('js/service-worker.js', ['lint', 'dev:service-worker']);

  gulp.watch([`${buildFolder}/*.html`, `${buildFolder}/js/**/*.bundle.js`, `${buildFolder}/css/**/*.css`]).on('change', browserSync.reload);

  browserSync.init({
    server: `${buildFolder}`
  });
});

gulp.task('prod:build', done => {
  runSequence('lint', 'clean', ['html', 'prod:styles', 'prod:scripts', 'prod:service-worker', 'images', 'manifest'], done);
});

gulp.task('dev:build', done => {
  runSequence('lint', 'clean', ['html', 'dev:styles', 'dev:scripts', 'dev:service-worker', 'images', 'manifest'], done);
});


gulp.task('clean', () => {
  return del(`${buildFolder}`);
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
      .pipe(gulp.dest(`${buildFolder}`));

    done();
  });
});

gulp.task('prod:styles', () => {
  return gulp.src(['css/**/*.scss', '!css/base.scss'])
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(`${buildFolder}/css`));
});

gulp.task('dev:styles', () => {
  return gulp.src(['css/**/*.scss', '!css/base.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${buildFolder}/css`));
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
        .pipe(gulp.dest(`${buildFolder}/js`));
    });
  };

  return bundleThis(['main', 'restaurant']);
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
        .pipe(gulp.dest(`${buildFolder}/js`));
    });
  };

  return bundleThis(['main', 'restaurant']);
});

gulp.task('prod:service-worker', () => {
  return browserify(['js/service-worker.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('service-worker.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(`${buildFolder}`));
});

gulp.task('dev:service-worker', () => {
  return gulp.src('js/service-worker.js')
    .pipe(gulp.dest(`${buildFolder}`));
});

gulp.task('images', () => {
  return gulp.src(['img/**/*.jpg', 'img/**/*.png', 'img/**/*.svg'])
    .pipe(gulp.dest(`${buildFolder}/img`));
});

gulp.task('lint', () => {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('manifest', () => {
  return gulp.src('manifest.json')
    .pipe(gulp.dest(`${buildFolder}`));
});
