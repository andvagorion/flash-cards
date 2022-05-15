'use strict';

const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const crypto = require("crypto");

const replace = require('gulp-token-replace');

const es = require('event-stream');

const randomHex = () => crypto.randomBytes(3).toString('hex');
const today = (new Date()).toISOString().split('T')[0];

const config = {
    main: {
        version: `${today}-${randomHex()}`
    }
};

const paths = {
    styles: {
        src: './src/sass/app.scss',
        dest: './dist/assets/'
    },
    data: {
        src: './src/data/phrases.txt',
        dest: './dist/assets'
    },
    scripts: {
        src: [
            './src/js/util.js',
            './src/js/app.js'
        ],
        dest: './dist/assets/'
    },
    html: {
        src: './src/*.html',
        dest: './dist/'
    },
    assets: {
        src: './src/img/**.*',
        dest: './dist/assets/'
    }
};

function clean() {
    return del(['./dist']);
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(replace({ global: config }))
        .pipe(gulp.dest(paths.html.dest));
}

function assets() {
    return gulp.src(paths.assets.src)
        .pipe(gulp.dest(paths.assets.dest));
}

function convertData() {
    const splitLines = str => str.split(/\r?\n/);
    const isEmpty = str => !str || str.length === 0;
    const splitLine = str => str.split(' -> ');

    return es.map(function (file, cb) {
        const content = file.contents.toString();
        const obj = splitLines(content)
            .filter(line => !isEmpty(line))
            .map(line => {
                const parts = splitLine(line);
                return { 'de': parts[0], 'en': parts[1] };
            });

        const jsData = `const Data = ${JSON.stringify(obj)};`;

        file.contents = Buffer.from(jsData);

        cb(null, file);
    });
}

function data() {
    return gulp.src(paths.data.src)
        .pipe(convertData())
        .pipe(rename('data.min.js'))
        .pipe(gulp.dest(paths.data.dest));
}

var build = gulp.series(clean, gulp.parallel(html, styles, scripts, assets, data));

exports.default = build;
