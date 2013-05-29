/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.1.0
 * https://github.com/jgallen23/weekly
 * copyright Greg Allen 2013
 * MIT License
*/
(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 8,
      endTime: 6,
      weekOffset: 0,
      currentDate: new Date(),
      autoRender: true,
      template: '<div class="days"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="day" style="width:<%= 100/dates.length %>%" data-date="<%= date.getFullYear() %>-<%= date.getMonth() %>-<%= date.getDate() %>"><%= date.toDateString() %></div><% } %></div><div class="times"><% for (var i = 0; i < times.length; i++) { var time = times[i]; %>  <div class="time" data-time="<%= time %>"><%= time %></div><% } %></div><div class="grid"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="day" style="width:<%= 100/dates.length %>%" data-date="<%= date.getFullYear() %>-<%= date.getMonth() %>-<%= date.getDate() %>">    <% for (var ii = 0; ii < times.length; ii++) { var time = times[ii]; %>      <div class="time" data-time="<%= time %>">&nbsp;</div>    <% } %>  </div><% } %></div>'
    },

    init: function() {
      this.events = [];
      if (this.autoRender) {
        this.update();
      }
    },

    update: function() {
      this.render({
        dates: this.getDates(),
        times: this.getTimes()
      });
    },

    getDates: function() {
      var curr = this.currentDate;

      var first = curr.getDate() - curr.getDay();
      var daysInWeek = 7;

      var days = [];
      var sunday = new Date(curr.setDate(first + (this.weekOffset * daysInWeek)));

      for (var i = 0, c = daysInWeek; i < c; i++) {
        var d = new Date(sunday.setDate(sunday.getDate() - sunday.getDay() + i));
        days.push(d);
      }
      return days;
    },

    getTimes: function() {
      var end = this.endTime + 12;

      var times = [];
      for (var i = this.startTime; i <= end; i++) {
        var hour = (i > 12) ? i - 12 : i;
        var timeString = hour+':00 ';

        timeString += (i > 11) ? 'PM' : 'AM';

        times.push(timeString);
      }

      return times;
    },

    renderEvent: function(event) {
      console.log(event);
    },

    addEvent: function(event) {
      event = $.extend({
        name: 'Event',
        description: '',
        start: null,
        end: null
      }, event);

      this.renderEvent(event);
      this.events.push(event);
    }
  });

})(jQuery);
