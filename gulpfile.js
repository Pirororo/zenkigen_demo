const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browser = require("browser-sync");
const plumber = require("gulp-plumber");
const notify = require('gulp-notify');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

// sass --------------------------------------
gulp.task('sass', (done) => {
  return gulp.watch('./src/scss/**/*.scss', function () {
    return gulp.src('./src/scss/**/*.scss')
      // .pipe(plumberWithNotify())

      // Sassのコンパイルを実行
      .pipe(sass({
        outputStyle: 'expanded'
      })
        // Sassのコンパイルエラーを表示 (これがないと自動的に止まってしまう)
        .on('error', sass.logError))
      //
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.init())
      .pipe(gulp.dest('./build/assets/css/'))
      .pipe(browser.reload({
        stream: true
      }))
  });
  console.log('sass success!');
  done();
});

// server ----------------------------------
gulp.task("server", function () {
  browser({
    server: {
      baseDir: "./build"
    },
    "notify": false
  });
});

gulp.task('default', gulp.series(
  gulp.parallel('sass', 'server')
));

// 通知とエラー停止回避の関数
function plumberWithNotify() {
  return plumber({
    // errorHandler: notify.onError("<%= error.message %>")
  });
}
