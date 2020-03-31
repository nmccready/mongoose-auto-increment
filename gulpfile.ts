import gulp from 'gulp';
import replace from 'gulp-replace';
import debug from 'gulp-debug';

export const fixPaths = () => {
  return gulp
    .src('dist/*.js')
    .pipe(debug())
    .pipe(replace(/\.\/package.json/, '../package.json'))
    .pipe(gulp.dest('dist'));
};

export default fixPaths;
