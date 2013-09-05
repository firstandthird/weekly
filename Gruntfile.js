module.exports = function(grunt) {
  grunt.initConfig({
    info: grunt.file.readJSON('bower.json'),
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/\n'
    },

    jshint: {
      main: [
        'Gruntfile.js',
        'bower.json',
        'lib/**/*.js',
        'test/*.js'
      ]
    },
    bower: {
      main: {
        dest: 'dist/_bower.js',
        exclude: [
          'assert',
          'jquery',
          'moment',
          'timezones',
          'jquery-simulate'
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },

      dist: {
        src: [
          'lib/dates.js',
          'lib/time.js',
          'lib/weekly.js'
        ],
        dest: 'dist/weekly.js'
      },

      full: {
        src: [
          'dist/_bower.js',
          'lib/time.js',
          'lib/dates.js',
          'lib/weekly.js'
        ],
        dest: 'dist/weekly.full.js'
      }
    },

    template2js: {
      dist: {
        src: 'lib/template.html',
        dest: 'dist/weekly.js'
      },

      full: {
        src: 'lib/template.html',
        dest: 'dist/weekly.full.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },

      dist: {
        src: 'dist/weekly.js',
        dest: 'dist/weekly.min.js'
      },

      full: {
        src: 'dist/weekly.full.js',
        dest: 'dist/weekly.full.min.js'
      }
    },

    clean: {
      bower: [
        'dist/_bower.js'
      ],
      dist: [
        'dist'
      ]
    },

    less: {
      'default': {
        src: 'less/theme1.less',
        dest: 'dist/weekly.css'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: [
          '<%= jshint.main %>',
          'lib/template.html'
        ],
        tasks: 'scripts'
      },

      styles: {
        files: [
          'less/*.less'
        ],
        tasks: 'styles',
      },

      example: {
        files: [
          'example/*'
        ]
      },

      ci: {
        files: [
          'Gruntfile.js',
          'test/index.html',
          'test/time.html',
          'test/dates.html'
        ],
        tasks: 'default'
      }
    },

    mocha: {
      options: {
        run: true,
        growl: true,
        reporter: 'Spec'
      },
      weekly: {
        src: 'test/index.html',
      },
      time: {
        src: 'test/time.html',
      },
      dates: {
        src: 'test/dates.html',
      }
    },

    plato: {
      main: {
        files: {
          'reports': ['lib/*.js']
        }
      }
    },

    connect: {
      server:{
        options: {
          hostname: '*'
        }
      },

      plato: {
        port: 8000,
        base: 'reports',
        options: {
          keepalive: true
        }
      }
    },
    bytesize: {
      scripts: {
        src: [
          'dist/*'
        ]
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');
  grunt.registerTask('scripts', ['jshint', 'bower', 'concat', 'template2js', 'uglify', 'clean:bower', 'mocha', 'bytesize']);
  grunt.registerTask('styles', ['less']);
  grunt.registerTask('default', ['scripts', 'styles']);
  grunt.registerTask('dev', ['connect:server', 'watch']);
  grunt.registerTask('reports', ['plato', 'connect:plato']);
};
