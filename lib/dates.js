/**
 * Date helpers
 */

(function(w){
  var oldRef = w.dateUtils;

  var dateUtils = {
    noConflict: function() {
      w.dateUtils = oldRef;
      return dateUtils;
    },
    getFirstDayOfWeek: function(date, offset) {
      offset = offset || 0;
      var first = date.getDate() - date.getDay();
      var newDate = new Date(date.getTime());
      newDate.setDate(first + (offset * 7));
      return newDate;
    },
    getLastDayOfWeek: function(date, weekOffset) {
      weekOffset = weekOffset || 0;
      var first = date.getDate() - date.getDay();
      var newDate = new Date(date.getTime());
      newDate.setDate(first + 6 + (weekOffset * 7));
      return newDate;
    },
    getdateUtils: function(date, weekOffset) {
      var daysInWeek = 7;

      var days = [];
      var sunday = this.getFirstDayOfWeek(date, weekOffset);

      for (var i = 0, c = daysInWeek; i < c; i++) {
        var d = new Date(sunday.getTime());
        d.setDate(d.getDate() - d.getDay() + i);
        days.push(d);
      }
      return days;
    },
    getTimes: function(startTime, endTime) {
      var end = endTime + 12;

      var times = [];
      for (var i = startTime; i < end; i++) {
        var hour = (i > 12) ? i - 12 : i;
        var timeString = hour+':00 ';

        timeString += (i > 11) ? 'PM' : 'AM';

        times.push(timeString);
      }

      return times;
    },
    getWeekSpan: function(date, offset) {
      var first = this.getFirstDayOfWeek(date, offset);
      var last = this.getLastDayOfWeek(date, offset);

      var span = TimeFormat('%M %d', first) + ' - ';
      if (first.getMonth() == last.getMonth()) {
        span += TimeFormat('%d', last);
      } else {
        span += TimeFormat('%M %d', last);
      }
      return span;
    },
    realTimezoneOffset: function(offset) {
      var local = (new Date()).getTimezoneOffset() / -60;
      var real = offset - local;
      return real;
    }
  };

  w.dateUtils = dateUtils;
})(window);
