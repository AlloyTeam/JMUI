var path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),

        clean: ['dist/**/*', 'js/jmui.js'],

        stylus: {
            compile: {
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
            // TODO 这里的 zepto 来自 coupon/js/lib/zepto 含业务代码，应抽离
            zepto: {
                src: ['lib/zeptojs/zepto.js',
                    'lib/zeptojs/event.js',
                    'lib/zeptojs/extend/touch.js',     // modify fix ios 误点击
                    'lib/zeptojs/detect.js',
                    'lib/zeptojs/extend/util.js',
                    'lib/zeptojs/data.js'
                    //'lib/zeptojs/animate.js',
                    //'lib/zeptojs/extend/ajax.js',      // modify fix 跨域ajax bort触发error
                ],
                dest: 'lib/zeptojs/zepto.min.js'
            },
            js: {
                src: [
                    'js/core/core.js',
                    'js/core/component.js',
                    'js/util/*.js',
                    'js/component/*.js',
                    '!js/component/carousel.js',
                    '!js/component/mult-selector.js'
                ],
                dest: 'js/jmui.js'
            }
        },

        copy: {
            dist: {
                files: [
                    {src: 'index.html', dest: 'dist/'},
                    {src: 'demo/**', dest: 'dist/'},
                    {src: 'img/**', dest: 'dist/'},
                    {src: 'css/**', dest: 'dist/'},
                    {src: 'js/**', dest: 'dist/'},
                    {src: 'lib/**', dest: 'dist/'}
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

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('default', ['clean', 'stylus', 'concat:js', 'copy:dist', 'uglify', 'cssmin']);
    grunt.registerTask('build', ['clean', 'stylus', 'concat:js', 'copy:dist', 'uglify', 'cssmin']);
    grunt.registerTask('dev', ['build', 'watch']);
};