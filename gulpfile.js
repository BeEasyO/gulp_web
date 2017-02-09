var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('sass', function(){
  return gulp.src(['app/scss/*.scss', 'app/scss/*.sass'])
    .pipe(sass({outoutStyle: 'expanded'}).on('error', sass.logError)) // Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch',['sass', 'browserSync'], function(){
  gulp.watch(['app/scss/*.scss', 'app/scss/*.sass'], ['sass']); 
  // Other watchers
})

gulp.task('default', ['watch', 'sass']);