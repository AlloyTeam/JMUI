var path = require('path');

module.exports = function(grunt){
	grunt.initConfig({
		// pkg: grunt.file.readJSON('package.json'),

		clean: ['dist/**/*'],

		stylus: {
		  compile: {
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
	        },
		},

		uglify: {
		    dist: {
		    	files: [{
	    	         expand: true,
	    	         cwd: 'js/',
	    	         src: ['**/*.js'],
	    	         dest: 'dist/js',
	    	         ext: '.js'
	    	       }]
		    }
		},

		concat: {
			dist: {
				src: ['dist/intro.js', 'src/project.js', 'src/outro.js'],
				dest: 'dist/built.js',
			},
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
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jsdoc');

	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['clean', 'jshint', 'stylus:compile', 'copy:dist', 'uglify:dist', 'watch']);
};