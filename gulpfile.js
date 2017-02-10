var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require('browser-sync').create();
var sourcemaps   = require('gulp-sourcemaps');
var reload      = browserSync.reload;
var spritesmith = require('gulp.spritesmith');


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('sass', function(){
  return gulp.src(['app/scss/main.scss', 'app/scss/main.sass'])
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

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('src/sprites/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.sass',
                padding: 2,
                cssFormat: 'sass',
                algorithm: 'binary-tree',
            }));

    spriteData.img.pipe(gulp.dest('app/img')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/scss/')); // путь, куда сохраняем стили
});

gulp.task('watch',['sass', 'browserSync'], function(){
  gulp.watch('src/sprites/*.*', ['sprite']);
  gulp.watch(['app/scss/*.scss', 'app/scss/*.sass'], ['sass']); 
  gulp.watch("app/*.html").on("change", reload);
})

gulp.task('default', ['sprite' ,'watch', 'sass']);