var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var clean        = require('gulp-clean');
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require('browser-sync').create();
var sourcemaps   = require('gulp-sourcemaps');
var reload      = browserSync.reload;
var spritesmith = require('gulp.spritesmith');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var uncss = require('gulp-uncss');
var csso = require('gulp-csso');

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
      browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scripts', function () {
  return gulp.src([
      'app/libs/jquery/dist/jquery.min.js',
    ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
})

gulp.task('css-libs', ['sass'], function(){
  return gulp.src('app/css/main.css')
  .pipe(csso())
  .pipe(cssnano())
  /*.pipe(uncss({
            html: ['app/*.html']
        }))*/
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'))
})

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('app/src/sprites/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.sass',
                imgPath: '../img/sprite.png',
                padding: 2,
                cssFormat: 'sass',
                algorithm: 'binary-tree',
            }));

    spriteData.img.pipe(gulp.dest('app/img')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/scss/')); // путь, куда сохраняем стили
});

gulp.task('imagemin', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeVievBox:false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('app/img'))
})

gulp.task('watch',['css-libs', 'browserSync', 'scripts'], function(){
  gulp.watch('app/src/sprites/*.*', ['sprite']);
  gulp.watch(['app/scss/*.scss', 'app/scss/*.sass'], ['sass']); 
  gulp.watch("app/*.html").on("change", reload);
  gulp.watch("app/js/**/*.js").on("change", reload);
})

gulp.task('default', ['sprite' ,'watch', 'sass']);


gulp.task('clean', function() {
  return gulp.src('dist/')
    .pipe(clean());
});

gulp.task('clear', function() {
  return cache.clearAll();
});


gulp.task('build', ['clean', 'sass', 'scripts', 'imagemin'], function() {

  var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));
  var buildCss = gulp.src('app/css/**/*').pipe(gulp.dest('dist/css'));
  var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
  var buildHtml = gulp.src('app/*.html').pipe(gulp.dest('dist/'));

});
