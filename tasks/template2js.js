
var path = require('path');
module.exports = function(grunt) {
  grunt.registerMultiTask('template2js', 'Takes an html template file and injects it into your js library', function() {
    var options = this.options({

    });


    this.files.forEach(function(f) {
      f.src.forEach(function(src) {
        var dest = grunt.file.read(f.dest);

        var template = grunt.file.read(src);
        var templateName = path.basename(src, '.html');
        template = template.replace(/\r\n|\r|\n/g, '').replace(/'/g, "\\'");

        dest = dest.replace(new RegExp('##'+templateName+'##'), template);
        grunt.file.write(f.dest, dest);
      });
    });

  });
}
