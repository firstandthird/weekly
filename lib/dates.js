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
      date = moment(date);
      offset = offset || 0;

      var firstDay = date.startOf('week');

      if (offset) {
        firstDay.add(offset, 'weeks');
      }

      return firstDay.toDate();
    },
    getLastDayOfWeek: function(date, offset) {
      date = moment(date);
      offset = offset || 0;

      var lastDay = date.endOf('week');

      if (offset) {
        lastDay.add(offset, 'weeks');
      }

      return lastDay.toDate();
    },
    getTimes: function(startTime, endTime) {
      var end = endTime + 12;

      var times = [];
      for (var i = startTime; i < end; i++) {
        var hour = (i > 12 || i === 0) ? Math.abs(i - 12) : i;
        var timeString = hour + ':00 ';

        timeString += (i > 11) ? 'PM' : 'AM';

        times.push(timeString);
      }

      return times;
    },
    getWeekSpan: function(date, offset, dayOffset) {
      var first = moment(this.getFirstDayOfWeek(date, offset));
      var last = moment(this.getLastDayOfWeek(date, offset));
      dayOffset = dayOffset || 0;

      if (dayOffset) {
        first.add(dayOffset, 'days');
        last.add(dayOffset, 'days');
      }

      var span = first.format('MMM DD') + ' - ';

      if (first.isSame(last, 'month')) {
        span += moment(last).format('DD');
      } else {
        span += moment(last).format('MMM DD');
      }

      return span;
    },
    realTimezoneOffset: function(offset) {
      var local = (new Date()).getTimezoneOffset() / -60;

      return offset - local;
    },
    getWeekOffset: function(dateA, dateB) {
      var weekA = moment(dateA).startOf('week').toDate().getTime();
      var weekB = moment(dateB).startOf('week').toDate().getTime();

      return Math.floor((weekB - weekA) / (1000*60*60*24*7));
    }
  };

  w.dateUtils = dateUtils;
})(window);
