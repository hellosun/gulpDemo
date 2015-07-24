/**
 * DMC gulpfile config
 * @type {[type]}
 */
var gulp = require('gulp'); // 主要
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');	
var proxyMiddleware = require('http-proxy-middleware');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');


var paths = {
    css: ['./styles/*.css'],
    html: ['./views/*.html'],
    img: ['./images/*.*'],
    buildPath: './build'

};

// http环境，接口反向代理
gulp.task('browser-sync', function() {

	// 多个地址的反向代理
	// 反向代理网易图片在自己的页面上
	var proxy163 = proxyMiddleware('/f2e', {
	    target: 'http://img1.cache.netease.com',
	    headers: {
	    	host:'img1.cache.netease.com'	// 这个挺关键
	    }
	  });

	// 反向代理百度图片在自己的页面上
	var proxyAdtime = proxyMiddleware('/img', {
	    target: 'http://www.baidu.com',
	    headers: {
	    	host:'www.baidu.com'
	    }
	  });
	browserSync({
	    server: {
	        baseDir: "./",
	        port: 80,
	        middleware: [proxy163, proxyAdtime]
	    }
	});
});


// css文件重新在浏览器渲染
gulp.task('css', function() {
    gulp.src('./styles/*.css')
        .pipe(browserSync.reload({
            stream: true
        }));
});

// html文件重新在浏览器渲染
gulp.task('html', function() {
    gulp.src('./*.html')
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 监控css文件的改变
gulp.task('watch', function() {
    gulp.watch('./styles/*.css', ['css']);
    gulp.watch('./*.html', ['html']);
});



/**
 * 压缩修改html文件
 */
gulp.task('usemin', function(){
    // 压缩index文件
    gulp.src('./index.html')
        .pipe(usemin({
            indexCSS: [minifyCss(), 'concat', rev()],	// 压缩css、合并、添加版本号
            jsLibs: [rev()],
            jsMain: [uglify(), rev()],
            html: [minifyHtml({empty:true, quotes: true})]
        }))
        .pipe(gulp.dest(paths.buildPath));   
});

/**
 * 清除目录
 * @param  {[type]} )
 * @return {[type]}   [description]
 */
gulp.task('clean', function () {
    return gulp.src(paths.buildPath)
        .pipe(clean({force: true}))
        .end();
});

/**
 * 拷贝图片目录
 */
gulp.task('copyFolder', function(){
    // 图片排量拷贝
    gulp.src(paths.img)
        .pipe(gulp.dest(paths.buildPath + '/images/'));
});


// 开发时执行
gulp.task('dev', ['browser-sync', 'watch']);

// 打包文件
gulp.task('build', ['clean', 'usemin', 'copyFolder']);

