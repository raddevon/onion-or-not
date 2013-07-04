var scripts = ['js/jquery.js', 'js/jquery.mobile.custom.js', 'js/jquery.easing.min.js', 'js/socialite.min.js', 'js/**/*.js', '!js/scripts.js'];

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        force: true
      },
      all: scripts + ['!js/jquery-1.9.1.js', '!js/jquery.mobile.custom.js', '!jquery.easing.min.js', '!js/socialite.min.js']
    },

    concat: {
      dist: {
        src: scripts,
        dest: 'js/scripts.js'
      }
    },

    uglify: {
      min: {
        files: {
          'js/scripts.js': ['js/scripts.js']
        }
      }
    },

    less: {
      dev: {
        files: {
          'css/mobile.css': 'css/mobile.less',
          'css/desktop.css': 'css/desktop.less'
        }
      },
      production: {
        options: {
          yuicompress: true,
          optimization: 1
        },
        files: {
          'css/mobile.css': 'css/mobile.less',
          'css/desktop.css': 'css/desktop.less'
        }
      }
    },

    smushit: {
      images: {
        src: ['imgs/**/*.{png,jpg,jpeg}']
      }
    },

    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: scripts,
        tasks: ['jshint', 'concat']
      },
      styles: {
        files: ['css/**/*.less'],
        tasks: ['less:dev']
      }
    },

    exec: {
      server: {
        command: 'rails server'
      }
    },

    concurrent: {
      options: {  logConcurrentOutput: true },
      server: {
        tasks: ['watch', 'exec:server']
      },
      prepare: {
        tasks: ['jshint', 'less:dev']
      },
      production: {
        tasks: ['jshint', 'less:production', 'concat', 'uglify', 'smushit']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-smushit');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Development task checks and concatenates JS, compiles SASS preserving comments and nesting, runs dev server, and starts watch
  grunt.registerTask('default', ['concurrent:prepare', 'concurrent:server']);
  // Build task builds minified versions of static files
  grunt.registerTask('build', ['concurrent:production']);

};