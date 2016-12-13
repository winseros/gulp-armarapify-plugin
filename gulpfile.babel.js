import gulp from 'gulp';
import tsc from 'gulp-typescript';
import tslint from 'gulp-tslint';
import sourcemaps from 'gulp-sourcemaps';
import jasmine from 'gulp-jasmine';
import consoleReporter from 'jasmine-console-reporter';
import watch from 'gulp-watch';
import del from 'del';

const dist = './dist';
const sourceFiles = './src/**/*.ts';
const typingFiles = './typings/**/index.d.ts';
const testFiles = './dist/**/*.spec.js';

gulp.task('clean', () => {
    return del([`${dist}/*`]);
});

gulp.task('tslint', () => {
    return gulp.src(sourceFiles)
        .pipe(tslint({
            formatter: "verbose"
        })).pipe(tslint.report({
            emitError: false
        }));
});

gulp.task('assemble', ['clean', 'tslint'], () => {
    const tsproject = tsc.createProject('tsconfig.json');

    return gulp.src([typingFiles, sourceFiles])
        .pipe(sourcemaps.init())
        .pipe(tsproject()).js
        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../src'
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('test', ['assemble'], () => {
    return gulp.src(testFiles)
        .pipe(jasmine({
            verbose: true,
            reporter: new consoleReporter()
        }));
});

gulp.task('watch', ['assemble'], () => {
    return watch(sourceFiles, () => {
        gulp.start('assemble');
    });
});