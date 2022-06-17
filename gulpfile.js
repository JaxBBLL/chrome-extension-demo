const gulp = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-cssmin')
const del = require('del')
const plumber = require('gulp-plumber')
const fileinclude = require('gulp-file-include')
const connect = require('gulp-connect')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const proxy = require('http-proxy-middleware')
const cp = require('child_process')
const javascriptObfuscator = require('gulp-javascript-obfuscator')
const through = require('through2')
const { low: obfuscationOption } = require('./obfuscation-config.js')

const paths = {
  dest: 'dist',
  style: {
    srcAll: 'src/style/**/*.less',
    src: ['src/style/**/*.less', '!src/style/{common,components}/**/*.less'],
    dest: 'dist/style/',
  },
  script: {
    src: 'src/script/**/*.js',
    dest: 'dist/script/',
  },
  html: {
    src: ['src/**/*.html', '!src/{lib,template}/**/*.html'],
    dest: 'dist/',
  },
  lib: {
    src: ['src/lib/**/*'],
    dest: 'dist/lib/',
  },
  images: {
    src: 'src/images/**/*.{png,jpg,gif,ico,svg}',
    dest: 'dist/images/',
  },
  template: {
    src: 'src/template/**/*',
  },
  manifest: {
    src: 'src/**/*.json',
    dest: 'dist/',
  },
}

const host = {
  path: 'dist/',
  port: 3000,
  proxy: '',
}

const isDev = process.env.NODE_ENV === 'development'

function clean() {
  return del([paths.dest])
}

function style() {
  return gulp
    .src(paths.style.src)
    .pipe(plumber()) // 防止报错中断task
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.style.dest))
    .pipe(connect.reload())
}

function styleBuild() {
  return gulp
    .src(paths.style.src)
    .pipe(plumber()) // 防止报错中断task
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest(paths.style.dest))
}

function script() {
  return gulp
    .src(paths.script.src)
    .pipe(gulp.dest(paths.script.dest))
    .pipe(connect.reload())
}

function scriptBuild() {
  return gulp
    .src(paths.script.src)
    .pipe(javascriptObfuscator(obfuscationOption))
    .pipe(gulp.dest(paths.script.dest))
    .pipe(connect.reload())
}

function lib() {
  return gulp
    .src(paths.lib.src)
    .pipe(gulp.dest(paths.lib.dest))
    .pipe(connect.reload())
}

function images() {
  return gulp
    .src(paths.images.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(connect.reload())
}

function htmlCompile() {
  return gulp
    .src(paths.html.src)
    .pipe(plumber())
    .pipe(fileinclude({ prefix: '@', basepath: './src/template' }))
    .pipe(gulp.dest(paths.dest))
    .pipe(connect.reload())
}

function htmlCompileBuild() {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    minifyJS: true, //压缩页面JS
    minifyCSS: true, //压缩页面CSS
  }
  return gulp
    .src(paths.html.src)
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: '@',
        basepath: '@root',
      }),
    )
    .pipe(htmlmin(options))
    .pipe(gulp.dest(paths.dest))
}

function transformManifest(input) {
  // input.content_scripts[0].matches = ['https://admin.zhaosw.com']
  return input
}

function manifestCompile() {
  return gulp
    .src('src/manifest.json')
    .pipe(
      through.obj((file, enc, cb) => {
        if (!isDev) {
          // get content of json file
          const rawJSON = file.contents.toString()
          // parse raw json into javscript object
          const parsed = JSON.parse(rawJSON)
          // transform json into desired shape
          const transformed = transformManifest(parsed)
          // make string from javascript obj
          const stringified = JSON.stringify(transformed)
          // make bufer from string and attach it as current file content
          file.contents = Buffer.from(stringified)
        }
        // pass transformed file into next gulp pipe
        cb(null, file)
      }),
    )
    .pipe(rename('manifest.json'))
    .pipe(plumber())
    .pipe(gulp.dest(paths.manifest.dest))
}

function serve() {
  connect.server({
    root: host.path,
    port: host.port,
    livereload: true,
    host: '::',
    // middleware: function(connect, opt) {
    //   return [proxy('/admin/', {
    //     target: host.proxy,
    //     changeOrigin: true
    //   })]
    // }
  })
}

function watch() {
  gulp.watch(paths.script.src, script)
  gulp.watch(paths.style.srcAll, style)
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.html.src, htmlCompile)
  gulp.watch(paths.manifest.src, manifestCompile)
  gulp.watch(paths.template.src, htmlCompile)
}

function openBrowser() {
  cp.exec(`start http://localhost:${host.port}`)
}

const dev = gulp.series(
  clean,
  gulp.parallel(manifestCompile, htmlCompile, style, script, lib, images),
  gulp.parallel(openBrowser, serve, watch),
)

const build = gulp.series(
  clean,
  gulp.parallel(
    manifestCompile,
    htmlCompileBuild,
    styleBuild,
    scriptBuild,
    lib,
    images,
  ),
)

gulp.task('default', dev)
gulp.task('build', build)
