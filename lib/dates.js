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
    getLastDayOfWeek: function(date, weekOffset) {
      weekOffset = weekOffset || 0;

      var first = date.getDate() - date.getDay();
      var newDate = new Date(date.getTime());
      newDate.setDate(first + 6 + (weekOffset * 7));

      return newDate;
    },
    getDates: function(date, weekOffset, dayOffset, daysDisplay) {
      date = moment(date) || moment();
      date.startOf('day');

      dayOffset = dayOffset || 0;
      daysDisplay = daysDisplay || 7; // 7 days in a week

      var days = [];
      var firstDay = this.getFirstDayOfWeek(date, weekOffset);

      for (var i = 0; i < daysDisplay; i++) {
        days.push(
          moment(firstDay).add(i + dayOffset, 'days').toDate()
        );
      }

      return days;
    },
    getTimes: function(startTime, endTime) {
      var end = endTime + 12;

      var times = [];
      for (var i = startTime; i < end; i++) {
        var hour = (i > 12 || i === 0) ? Math.abs(i - 12) : i;
        var timeString = hour+':00 ';

        timeString += (i > 11) ? 'PM' : 'AM';

        times.push(timeString);
      }

      return times;
    },
    getWeekSpan: function(date, offset, dayOffset) {
      dayOffset = dayOffset || 0;
      var first = this.getFirstDayOfWeek(date, offset);
      var last = this.getLastDayOfWeek(date, offset);

      first.setDate(first.getDate() + dayOffset);
      last.setDate(last.getDate() + dayOffset);

      var span = moment(first).format('MMM DD') + ' - ';
      if (first.getMonth() == last.getMonth()) {
        span += moment(last).format('DD');
      } else {
        span += moment(last).format('MMM DD');
      }
      return span;
    },
    getDaySpan: function(date, offset, dayOffset) {
      dayOffset = dayOffset || 0;
      var first = this.getFirstDayOfWeek(date, offset);

      first.setDate(first.getDate() + dayOffset);

      var span = dateFormat('%D, %M %d', first);
      return span;
    },
    realTimezoneOffset: function(offset) {
      var local = (new Date()).getTimezoneOffset() / -60;
      var real = offset - local;
      return real;
    },
    getWeekOffset: function(dateA, dateB) {
      var weekA = moment(dateA).startOf('week').toDate().getTime();
      var weekB = moment(dateB).startOf('week').toDate().getTime();

      return Math.floor((weekB - weekA) / (1000*60*60*24*7));
    },
    getDateWithoutTime: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  };

  w.dateUtils = dateUtils;
})(window);
