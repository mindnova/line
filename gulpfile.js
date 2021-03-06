var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var insert = require('gulp-insert');
var es = require('event-stream');
var babel = require('gulp-babel');


// Define Paths
var path = {
  src: {
    js: "./src/js/",
    css: "./src/css/"
  },
  dist: {
    js: "./dist/js/",
    css: "./dist/css/",
    path: "./dist/"
  }
};


// Define class sequence manually. Eventually it will be webpack or browserify or something.
// Parent classes needs to be defined before its extended children
var coreElems = [
  "SegmentList", "LineForm", "BaseLine", "DottedLine", "InterpolatedLine", "HatchingLine",
  "SpeedLine", "ZigZagLine", "RestatedLine", "SpeedBrush", "SmoothSpeedBrush", "InnerLine",
  "WiggleLine", "NoiseLine", "NoiseBrush", "SmoothNoiseLine", "NoiseDashLine", "NoiseChopLine", "LagLine",
  "GrowLine", "JaggedLine"
  /* , "ContinuousLine", "StepperLine", "ReflectLine", "ArcLine", */
];
var coreFiles = coreElems.map(function(n) { return path.src.js+"lines/"+n+".js"; } );


function handleError( error ) {
  gutil.log( error.stack );
  this.emit( 'end' );
}


gulp.task('default', ["watch"]);

// Watch
// This just rebuild the pt-core.js and pt-extend.js files without doing the full re-build.
gulp.task('watch', function() {
  gulp.watch( path.src.js+"/*.js", ['es6']);
  gulp.watch( path.src.js+"**/*.js", ['lines']);
});

// ES6 Babel
gulp.task('es6', function () {
    return gulp.src( path.src.js+"*.js" )
        .pipe(babel({ modules: "common"})).on('error', handleError)
        .pipe(gulp.dest( path.dist.js ));
});


gulp.task('lines', function() {
  return gulp.src( coreFiles )
    .pipe( concat('lines.js') )
    .pipe(babel({ modules: "common"})).on('error', handleError)
    .pipe( gulp.dest( path.dist.js+"lines" ) )
});