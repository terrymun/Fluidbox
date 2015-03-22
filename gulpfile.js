var autoprefixer = require('gulp-autoprefixer');
var gulp = require('gulp');
var header = require('gulp-header');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var pkg = require('./package.json');

var generateAuthors = function () {
    var authors = pkg.authors;
    var output = "";
    
    for (i = 0; i < authors.length; i++) {
        var obj = authors[i];
        output = output + obj.name + " (" + obj.homepage + ")";
        
        if (i < authors.length - 1)
            output = output + ", ";
    }
    
    return output;
};

var authors = generateAuthors();

var jsDest = './dist/js';
var cssDest = './dist/css';

var banner = '/**\n' 
            + ' * <%= pkg.name %> v<%= pkg.version %> | Copyright 2014-2015 <%= authors %> | License: <%= pkg.license %> | <%= pkg.homepage %>\n' 
            + ' */\n';

gulp.task('js', function () {
    return gulp.src('src/jquery.fluidbox.js')
            .pipe(rename('jquery.fluidbox.js'))
            .pipe(gulp.dest(jsDest))
            .pipe(rename('jquery.fluidbox.min.js'))
            .pipe(uglify())
            .pipe(header(banner, { pkg: pkg, authors: authors }))
            .pipe(gulp.dest(jsDest));
});

gulp.task('css', function () {
    return gulp.src('src/fluidbox.scss')
            .pipe(rename('fluidbox.css'))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(cssDest))
            .pipe(rename('fluidbox.min.css'))
            .pipe(cssmin())
            .pipe(header(banner, { pkg: pkg, authors: authors }))
            .pipe(gulp.dest(cssDest));
});

gulp.task('watch', function () {
    gulp.watch('src/*.js', ['js']);
    gulp.watch('src/*.scss', ['css']);
});

gulp.task('default', ['js', 'css', 'watch']);