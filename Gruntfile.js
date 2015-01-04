var path = require('path');

module.exports = function(grunt){
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
			zepto: {
				src: ['lib/zeptojs/zepto.js', 'lib/zeptojs/*.js'],
				dest: 'lib/zeptojs/zepto.min.js'
			},
			js: {
				src: ['js/util.js','js/core.js', 'js/mask.js', 'js/state.js', 'js/**'],
				dest: 'js/jmui.js'
			}
		},

		copy: {
		  dist: {
		  	files: [
			  	{src: 'index.html', dest: 'dist/'},
			  	{src: 'demo/**', dest: 'dist/'},
			  	{src: 'img/**', dest: 'dist/'},
			  	{src: 'css/jmui.css', dest: 'dist/css/jmui.css'},
			  	{src: 'js/jmui.js', dest: 'dist/js/jmui.js'},
			  	{src: 'lib/**', dest: 'dist/'}
			]
		  }
		},

        watch: {
            stylus:{
                files: ['stylus/*.styl'],
                tasks: ['stylus']
            },
            livereload: {
            	files: ['css/*.css', 'demo/*.html'],
            	options: {
            		livereload: true
            	}
            }
        },

        jsdoc: {
            dist: {
                src: ['js/**/*.js'], 
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

	grunt.registerTask('default', ['clean', 'stylus:compile', 'concat:js', 'copy:dist', 'uglify', 'cssmin']);
};