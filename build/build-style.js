const gulp = require("gulp");
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

gulp.task("css", function() {
	gulp.src("../src/style/index.less")
		.pipe(less({
			javascriptEnabled: true
		}))
		.pipe(autoprefixer({
			browsers: ["last 2 versions", "ie > 8"]
		}))
		.pipe(cleanCSS())
		.pipe(rename("vui-design.css"))
		.pipe(gulp.dest("../dist/style"));
});

gulp.task("fonts", function() {
	gulp.src("../src/style/components/fonts/*.*")
		.pipe(gulp.dest("../dist/style/fonts"));
});

gulp.task("default", ["css", "fonts"]);