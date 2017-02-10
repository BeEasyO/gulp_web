var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require('browser-sync').create();
<<<<<<< HEAD
var sourcemaps   = require('gulp-sourcemaps');
=======
>>>>>>> e75a95227a14b71957f9ac1726e3e412318ada9a
var reload      = browserSync.reload;

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('sass', function(){
  return gulp.src(['app/scss/*.scss', 'app/scss/*.sass'])
    .pipe(sourcemaps.init())
    .pipe(sass({outoutStyle: 'expanded'}).on('error', sass.logError)) // Using gulp-sass
    .pipe(autoprefixer({ //autoprefixer.
      browsers: ['last 15 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch',['sass', 'browserSync'], function(){
  gulp.watch(['app/scss/*.scss', 'app/scss/*.sass'], ['sass']); 
  gulp.watch("app/*.html").on("change", reload);
})

gulp.task('default', ['watch', 'sass']);
