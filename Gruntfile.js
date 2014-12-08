module.exports = function(grunt){
	grunt.initConfig({
		stylus: {
		  dist: {
		    files: [{
		             expand: true,
		             cwd: 'stylus/',
		             src: ['*.styl'],
		             dest: 'css/',
		             ext: '.css'
		           }]
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
        }
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.registerTask('default', ['watch']);

}