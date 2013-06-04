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

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },

      dist: {
        src: 'lib/weekly.js',
        dest: 'dist/weekly.js'
      },

      full: {
        src: [
          'components/fidel/dist/fidel.js',
          'components/template/dist/template.js',
          'components/fidel-template/dist/fidel-template.js',
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
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadTasks('tasks');
  grunt.registerTask('scripts', ['jshint', 'concat', 'template2js', 'uglify']);
  grunt.registerTask('styles', ['less']);
  grunt.registerTask('default', ['scripts', 'styles', 'mocha']);
  grunt.registerTask('dev', ['connect:server', 'reloadr', 'watch']);
  grunt.registerTask('ci', ['connect:server', 'watch']);
  grunt.registerTask('reports', ['plato', 'connect:plato']);
};
