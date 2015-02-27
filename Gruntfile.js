var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),

        clean: ['dist/**/*', 'js/jmui.js'],

        stylus: {
            all: {
                options: {
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: 'stylus/',
                    src: ['**/*.styl'],
                    dest: 'css/',
                    ext: '.css'
                }]
            },
            maincss: {
                options: {
                    compress: false
                },
                files: {'css/jmui.css': 'stylus/jmui.styl'}
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js'],
            options: {
                // 允许多行字符拼接, 在 *.tpl 中常用
                "multistr": true,
                // 允许使用类似这种表达式 $.isFunction( fn ) && fn();
                "expr": true,
                // 允许使用类似这种函数  new Function("obj","return 123")
                "evil": true
            }
        },

        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.js'],
                    dest: 'dist/',
                    ext: '.min.js'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.css'],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            // TODO 这里的 zepto 来自 coupon/js/lib/zepto 含业务代码，应抽离
            zepto: {
                src: [
                    'lib/zeptojs/zepto.js',
                    'lib/zeptojs/event.js',
                    'lib/zeptojs/extend/touch.js',     // modify fix ios 误点击
                    'lib/zeptojs/detect.js',
                    'lib/zeptojs/extend/util.js',
                    'lib/zeptojs/animate.js'
                    //'lib/zeptojs/fx.js',
                    //'lib/zeptojs/fx_methods.js',
                    //'lib/zeptojs/extend/ajax.js',    // modify fix 跨域ajax bort触发error
                ],
                dest: 'lib/zeptojs/zepto.min.js'
            },
            js: {
                src: [
                    'js/core/core.js',
                    'js/core/component.js',
                    'js/util/*.js',
                    'js/component/*.js',
                    // TODO 以下组件未整理好
                    'js/component/carousel.js'
                ],
                dest: 'js/jmui.js'
            }
        },

        copy: {
            dist: {
                files: [
                    {src: 'index.html', dest: 'dist/'},
                    {src: 'demo/**/*', dest: 'dist/'},
                    {src: 'img/**/*', dest: 'dist/'},
                    {src: 'css/**/*', dest: 'dist/'},
                    {src: 'js/**/*', dest: 'dist/'},
                    {src: 'lib/**/*', dest: 'dist/'}
                ]
            }
        },

        watch: {
            //options: {
            //	livereload: true
            //},
            html: {
                files: ['index.html', 'demo/*.html']
            },
            stylus: {
                files: ['stylus/*.styl'],
                tasks: ['newer:stylus', 'stylus:maincss']
            },
            css: {
                files: ['css/*.css']
            },
            js: {
                files: ['js/**/*.js', '!js/jmui.js'],
                tasks: ['concat:js']
            }

        },

        jsdoc: {
            dist: {
                src: ['test/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    grunt.registerTask('generateDemoCodes','根据 consig.js 生成配置到 data/*.js 和示例到 demo/demo-*.html', function(){
        var fs = require('fs');
        var pageConfig = require('./config').page;
        var utils = require('./utils');

        var jmuiDataDir = path.resolve('./data/');
        var jmuiDemoDir = path.resolve('./demo/');
        // 将html 保存到文件中
        var htmlHeader = fs.readFileSync(path.join(jmuiDemoDir, 'demo-header.html'));
        var htmlFooter = fs.readFileSync(path.join(jmuiDemoDir, 'demo-footer.html'));

        // 将生成的代码片段保存到文件中
        // 将多个 html 拼成一个文件
        var allHtml = '';
        for (var category in pageConfig) {
            var files = pageConfig[category].files;
            var demos = utils.getDemos(jmuiDemoDir, files);
            var htmlContent = '';
            fs.writeFileSync(path.join(jmuiDataDir, 'demo-' + category + '.js'), JSON.stringify(demos));
            for(var i = 0; i < files.length; i ++) {
                htmlContent += demos[i].html;
            }
            fs.writeFileSync(path.join(jmuiDemoDir, 'demo-' + category + '.html'), htmlHeader + htmlContent + htmlFooter);
            allHtml += htmlContent;
        }
        fs.writeFileSync(path.join(jmuiDemoDir, 'demo-all.html'), htmlHeader + allHtml + htmlFooter);
    });
    grunt.registerTask('generateStaticHtmls', '根据 site/views/*.ejs 生成静态页面 到 site/public/*.html', function () {
        var ejs = require('ejs');
        var fs = require('fs');
        var path = require('path');

        // 替换 href="base-css" 为 href="base-css.html"
        function replaceHref(str, pages) {
            pages.forEach(function (name) {
                str = str.replace('href="' + name + '"', 'href="' + name + '.html"');
            });

            // 静态页面无法使用构件化功能，先屏蔽掉
            str = str.replace('<li><a href="customize">定制化</a></li>', '');
            return str;
        }
        // name = 'base-css' 'ui-css' 'ui-js' 'index' 'customize';
        var pages = ['base-css', 'ui-css', 'ui-js', 'index', 'quick-start'];

        pages.forEach(function (name) {
            var filePath = path.join(__dirname, './site/views/' + name + '.ejs');
            var demoConfigPath = path.join(__dirname, './data/demo-' + name + '.js');

            var data = {
                title: name,
                filename: filePath // 指定 include 时的文件
            };

            if (fs.existsSync(demoConfigPath)) {
                data.demos = JSON.parse(fs.readFileSync(demoConfigPath));
            }

            var str = fs.readFileSync(filePath).toString();


            var html = ejs.render(str, data);
            html = replaceHref(html, pages);

            var destPath = path.join('./site/public', name + '.html');
            fs.writeFileSync(destPath, html);
        });
    });


    grunt.registerTask('default', ['concat', 'watch']);

    // 生成 Demo 和配置自动生成文档网站
    grunt.registerTask('site', ['generateDemoCodes', 'generateStaticHtmls']);

    // 生成 dist/ 和 site/
    grunt.registerTask('dist', ['clean', 'stylus', 'concat', 'copy:dist', 'cssmin', 'site']);


};