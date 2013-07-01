/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.0.11
 * https://github.com/jgallen23/weekly
 * copyright Greg Allen 2013
 * MIT License
*/
/**
 * Simple date and time formatter based on php's date() syntax.
 */

(function(w) {
  var oldRef = w.TimeFormat;

  var months = 'January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
  var days = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|');

  var TimeFormat = function(format, time) {
    if(!time instanceof Date) return;
    // Implements PHP's date format syntax.
    return format.replace(/%d|%D|%j|%l|%S|%w|%F|%m|%M|%n|%Y|%y|%a|%A|%g|%G|%h|%H|%i|%s|%u|%e/g, function(match) {
      switch(match) {
        case '%d':
          return ("0" + time.getDate()).substr(-2,2);
        case '%D':
          return days[time.getDay()].substr(0,3);
        case '%j':
          return time.getDate();
        case '%l':
          return days[time.getDay()];
        case '%S':
          if(time.getDate() === 1) {
            return 'st';
          } else if(time.getDate() === 2) {
            return 'nd';
          } else if(time.getDate() === 3) {
            return 'rd';
          } else {
            return 'th';
          }
          break;
        case '%w':
          return time.getDay();
        case '%F':
          return months[time.getMonth()];
        case '%m':
          return ("0" + time.getMonth()).substr(-2,2);
        case '%M':
          return months[time.getMonth()].substr(0,3);
        case '%n':
          return time.getMonth();
        case '%Y':
          return time.getFullYear();
        case '%y':
          return time.getFullYear().toString().substr(-2,2);
        case '%a':
          return time.getHours() > 11 ? 'pm' : 'am';
        case '%A':
          return time.getHours() > 11 ? 'PM' : 'AM';
        case '%g':
          return time.getHours() > 12 ? time.getHours() -12 : time.getHours();
        case '%G':
        return time.getHours();
        case '%h':
          return ("0" + (time.getHours() > 12 ? time.getHours() -12 : time.getHours())).substr(-2,2);
        case '%H':
          return ("0" + time.getHours()).substr(-2,2);
        case '%i':
          return ("0" + time.getMinutes()).substr(-2,2);
        case '%s':
          return ("0" + time.getSeconds()).substr(-2,2);
        case '%u':
          return time.getMilliseconds();
        case '%e':
          return time.getTimezoneOffset();
      }
    });
  };

  TimeFormat.noConflict = function() {
    w.TimeFormat = oldRef;
    return TimeFormat;
  };

  w.TimeFormat = TimeFormat;

})(window);