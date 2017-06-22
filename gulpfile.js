var gulp = require('gulp');
var browserSync = require('browser-sync').create();


// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var del = require('del');
var cssnano = require('gulp-cssnano');



gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	})
})

gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		// Minifies only if it's a JavaScript file
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
		.pipe(imagemin({
			// Setting interlaced to true
			interlaced: true
		}))
		.pipe(gulp.dest('dist/images'))
});

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('clean:dist', function() {
	return del.sync('dist');
})

gulp.task('build', ['browserSync', 'sass', 'useref', 'images'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	// Reloads the browser whenever HTML or JS files change
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	console.log('Building files');

})