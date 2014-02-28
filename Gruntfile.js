module.exports = function(grunt) {

  require('load-grunt-config')(grunt, {
    config: {
      info: grunt.file.readJSON('bower.json'),
      name: 'weekly'
    }
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('script-dist', ['concat:dist', 'concat:distMobile', 'uglify:dist', 'uglify:distMobile']);
  grunt.registerTask('script-full', ['concat:full', 'concat:fullMobile', 'uglify:full', 'uglify:fullMobile']);
  grunt.registerTask('scripts', ['jshint', 'bower', 'script-dist', 'script-full', 'template2js', 'clean:bower', 'mocha', 'bytesize', 'notify:generic']);
  grunt.registerTask('default', ['scripts', 'less']);
  grunt.registerTask('dev', ['default', 'connect:server', 'notify:watch', 'watch']);
};
