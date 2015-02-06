var autoprefixer = require('autoprefixer-core');
var path = require('path');

module.exports = function(grunt){

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),

        clean: {
            download: ['public/download'],
            //jmui: ['public/JMUI'],
            //site: ['public/site']
        },

        copy: {
            // 复制 JMUI grunt build 后的 dist 文件夹
            //jmui: {
            //    files: [
            //        {src: '../JMUI/dist/**/*', dest: 'public/JMUI/'}
            //    ]
            //},
            //site: {
            //    files: [
            //        {expand: true, cwd:'public/libs', src: '**/*', dest: './public/site/libs/'},
            //        {expand: true, cwd:'public/JMUI', src: '**/*', dest: './public/site/JMUI/'},
            //        {expand: true, cwd:'public/img', src: '**/*', dest: './public/site/img/'}
            //    ]
            //}
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
            //site: {
            //    options: {
            //        removeComments: true,
            //        collapseWhitespace: true
            //    },
            //    files: [{
            //        expand: true,
            //        cwd: 'public/',
            //        src: '*.html',
            //        dest: 'public/site/'
            //    }]
            //}
        },

        cssmin: {
            //site: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/css/',
            //        src: ['*.css'],
            //        dest: 'public/site/css',
            //        ext: '.css'
            //    }]
            //}
        },

        uglify: {
            //site: {
            //    files: [{
            //        expand: true,
            //        cwd: 'public/js',
            //        src: '**/*.js',
            //        dest: 'public/site/js'
            //    }]
            //}
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

        open : {
            dev : {
                path: 'http://127.0.0.1:3000/',
                app: 'Chrome'
            }
        }
    });


    // 生产环境下执行 grunt
    grunt.registerTask('default', ['clean:download', 'nodemon']);

    grunt.registerTask('build', ['clean:download', 'sass', 'postcss']);
};