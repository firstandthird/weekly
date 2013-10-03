module.exports = function(grunt) {

  require('load-grunt-config')(grunt, {
    config: {
      info: grunt.file.readJSON('bower.json'),
      name: 'weekly'
    }
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('script-dist', ['concat:dist', 'uglify:dist']);
  grunt.registerTask('script-full', ['concat:full', 'uglify:full']);
  grunt.registerTask('scripts', ['jshint', 'bower', 'script-dist', 'script-full', 'template2js', 'clean:bower', 'mocha', 'bytesize', 'notify:generic']);
  grunt.registerTask('default', ['scripts']);
  grunt.registerTask('dev', ['connect:server', 'watch']);
};
