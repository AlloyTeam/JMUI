var autoprefixer = require('autoprefixer-core');
var path = require('path');

module.exports = function(grunt){

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),

        clean: {
            download: ['public/download'],
            jmui: ['public/JMUI'],
            site: ['public/site']
        },

        copy: {
            // 复制 JMUI grunt build 后的 dist 文件夹
            jmui: {
                files: [
                    {src: '../JMUI/dist/**/*', dest: 'public/JMUI/'}
                ]
            },
            site: {
                files: [
                    {expand: true, cwd:'public/libs', src: '**/*', dest: './public/site/libs/'},
                    {expand: true, cwd:'public/JMUI', src: '**/*', dest: './public/site/JMUI/'},
                    {expand: true, cwd:'public/img', src: '**/*', dest: './public/site/img/'}
                ]
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'public/scss',
                    src: ['**/*.scss'],
                    dest: 'public/css',
                    ext: '.css'
                }]
            }
        },

        postcss: {
            options: {
                processors: [
                    autoprefixer({ browsers: ['last 2 version'] }).postcss
                ]
            },
            dist: { src: 'public/css/*.css' }
        },

        csstidy: {
            dynamic_mappings: {
                expand: true,
                cwd: 'public/css/',
                src: ['**/*.scss'],
                dest: 'public/css/',
                ext: '.scss'
            }
        },

        jshint: {
            files: ['bin/www', 'app.js', 'config.js', 'Gruntfile.js', 'public/js/*.js', 'routes/*.js', 'util/*.js']
        },

        htmlmin: {
            site: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'public/',
                    src: '*.html',
                    dest: 'public/site/'
                }]
            }
        },

        cssmin: {
            site: {
                files: [{
                    expand: true,
                    cwd: 'public/css/',
                    src: ['*.css'],
                    dest: 'public/site/css',
                    ext: '.css'
                }]
            }
        },

        uglify: {
            site: {
                files: [{
                    expand: true,
                    cwd: 'public/js',
                    src: '**/*.js',
                    dest: 'public/site/js'
                }]
            }
        },

        watch: {
            ejs: {
                files: ['views/**/*.ejs'],
                options: {
                    //livereload: true
                }
            },
            js: {
                files: ['bin/www', 'app.js', 'config.js', 'Gruntfile.js', 'public/js/*.js', 'routes/*.js', 'util/*.js'],
                tasks: ['newer:jshint'],
                options: {
                    //livereload: true
                }
            },
            scss: {
                files: ['public/scss/*.scss'],
                tasks: ['newer:sass']
            },
            css: {
                files: ['public/css/*.css'],
                options: {
                    //livereload: true
                }
            }
        },

        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    nodeArgs: ['--debug'],
                    ignore: ['public/download/**']
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['watch', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        open : {
            dev : {
                path: 'http://127.0.0.1:3000/',
                app: 'Chrome'
            }
        }
    });


    grunt.registerTask('generateDemoCodes','生成demo代码片段', function(){
        var fs = require('fs');
        var pageConfig = require('./config').page;
        var utils = require('./utils');

        var jmuiDir = path.resolve('./public/JMUI/');
        var jmuiDistDir = path.resolve('./public/JMUI/dist');
        var jmuiDemoDir = path.resolve('./public/JMUI/dist/demo/');
        // 将html 保存到文件中
        var htmlHeader = fs.readFileSync(path.join(jmuiDemoDir, '_header.html'));
        var htmlFooter = fs.readFileSync(path.join(jmuiDemoDir, '_footer.html'));

        // 将生成的代码片段保存到文件中
        // 将多个 html 拼成一个文件
        for (var category in pageConfig) {
            var files = pageConfig[category].files;
            var demos = utils.getDemos(jmuiDemoDir, files);
            var htmlContent = '';
            fs.writeFileSync(path.join(jmuiDistDir, category + '.js'), JSON.stringify(demos));
            for(var i = 0; i < files.length; i ++) {
                htmlContent += demos[i].html;
            }
                fs.writeFileSync(path.join(jmuiDemoDir, category + '.html'), htmlHeader + htmlContent + htmlFooter);
        }
    });

    grunt.registerTask('generateStaticHtmls', '生成静态页面', function () {
        var ejs = require('ejs');
        var fs = require('fs');
        var path = require('path');

        function replaceHref(str, pages) {
            pages.forEach(function (name) {
                str = str.replace('href="' + name + '"', 'href="' + name + '.html"');
            });

            str = str.replace('<li><a href="customize">定制化</a></li>', '');
            return str;
        }
        // name = 'base-css'/'ui-css'/'ui-js'/'home'/'customize';
        var pages = ['base-css', 'ui-css', 'ui-js', 'home', 'quick-start'];

        pages.forEach(function (name) {
            var filePath = path.join(__dirname, './views/' + name + '.ejs');
            var demoConfigPath = path.join(__dirname, './public/JMUI/dist/' + name + '.js');

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

            var destPath = path.join(__dirname, './public', name + '.html');
            fs.writeFileSync(destPath, html);
        });
    });

    // 生产环境下执行 grunt
    grunt.registerTask('default', ['clean:download', 'nodemon']);

    // 部署到生产环境下前执行 先把 JMUI/dist 复制到 public/JMUI/dist 然后执行grunt build
    // 如果 JMUI 与 JMUI-site 在同级目录, 则执行 $ grunt copy:jmui 即可
    grunt.registerTask('build', ['clean:download', 'generateDemoCodes', 'sass', 'postcss']);


    // 生成静态代码
    grunt.registerTask('site', [
        'clean:site',
        'generateStaticHtmls',
        'htmlmin:site',
        'cssmin:site',
        'uglify:site',
        'copy:site'
    ]);

};