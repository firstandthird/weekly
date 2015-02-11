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
    getDates: function(date, weekOffset, dayOffset, daysDisplay) {
      date = new Date(date);
      date.setHours(0, 0, 0);
      dayOffset = dayOffset || 0;
      var daysInWeek = daysDisplay || 7;

      var days = [];
      var sunday = this.getFirstDayOfWeek(date, weekOffset);

      for (var i = 0, c = daysInWeek; i < c; i++) {
        var d = new Date(sunday.getTime());
        d.setDate(d.getDate() - d.getDay() + dayOffset + i);
        days.push(d);
      }
      return days;
    },
    getTimes: function(startTime, endTime) {
      var end = endTime + 12;
      var times = [];

      for (var i = startTime; i < end; i++) {
        times.push(dateUtils.timeToTwelve(i));
      }

      return times;
    },
    parseTime: function(time) {
      var aux = time.split(' ');
      var hoursMinutes = aux[0].split(':');
      var hours = parseInt(hoursMinutes[0], 10);
      var minutes = parseInt(hoursMinutes[1], 10);

      if (aux[1] === 'PM' && hours !== 12) {
        hours += 12;
      }

      return {
        hours: hours,
        minutes: minutes
      };
    },
    timeToMinutes: function(time) {
      var parsed = dateUtils.parseTime(time);

      return (parsed.hours * 60) + parsed.minutes;
    },
    timeToTwelve: function(time, minutes) {
      var i = Math.floor(time);
      var hour = (i > 12 || i === 0) ? Math.abs(i - 12) : i;
      var timeString = hour + ':' + (minutes || '00');
      timeString += (i > 11) ? ' PM' : ' AM';

      return timeString;
    },
    changeHours: function(time, amount) {
      var parsed = dateUtils.parseTime(time);

      return dateUtils.timeToTwelve(parsed.hours + amount, parsed.minutes);
    },
    absoluteTime: function(time) {
      return time.split(':').shift() + ':00 ' + time.split(' ').pop();
    },
    getWeekSpan: function(date, offset, dayOffset) {
      dayOffset = dayOffset || 0;
      var first = this.getFirstDayOfWeek(date, offset);
      var last = this.getLastDayOfWeek(date, offset);

      first.setDate(first.getDate() + dayOffset);
      last.setDate(last.getDate() + dayOffset);

      var span = dateFormat('%M %d', first) + ' - ';
      if (first.getMonth() == last.getMonth()) {
        span += dateFormat('%d', last);
      } else {
        span += dateFormat('%M %d', last);
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
    isPastDate: function(past) {
      var pastParts = past.split('-');
      return (dateFormat('%Y%m%d', new Date(pastParts[0], pastParts[1], pastParts[2])) < dateFormat('%Y%m%d', new Date()));
    },
    getWeekOffset: function(dateA, dateB) {
      var weekA = this.getFirstDayOfWeek(this.getDateWithoutTime(dateA));
      var weekB = this.getFirstDayOfWeek(this.getDateWithoutTime(dateB));
      var diff = Math.floor((weekB.getTime() - weekA.getTime()) / (1000*60*60*24*7));
      return diff;
    },
    getDateWithoutTime: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  };

  w.dateUtils = dateUtils;
})(window);
