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
          'lib/weekly.js'
        ],
        dest: 'dist/weekly.js'
      },

      full: {
        src: [
          'dist/_bower.js',
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

    clean: [
      'dist/_bower.js'
    ],

    less: {
      'default': {
        src: 'less/theme1.less',
        dest: 'dist/weekly.css'
      }
    },

    watch: {
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
        tasks: 'styles'
      },

      ci: {
        files: [
          'Gruntfile.js',
          'test/index.html'
        ],
        tasks: 'default'
      }
    },

    mocha: {
      all: {
        src: 'test/index.html',
        options: {
          run: true
        }
      }
    },

    plato: {
      main: {
        files: {
          'reports': ['lib/*.js']
        }
      }
    },

    reloadr: {
      main: [
        'example/*',
        'test/*',
        'dist/*'
      ]
    },

    connect: {
      server:{
        port: 8000,
        base: '.'
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-bytesize');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadTasks('tasks');
  grunt.registerTask('scripts', ['jshint', 'bower', 'concat', 'template2js', 'uglify', 'clean', 'mocha', 'bytesize']);
  grunt.registerTask('styles', ['less']);
  grunt.registerTask('default', ['scripts', 'styles']);
  grunt.registerTask('dev', ['connect:server', 'reloadr', 'watch']);
  grunt.registerTask('reports', ['plato', 'connect:plato']);
};
