(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 8,
      endTime: 6,
      weekOffset: 0,
      currentDate: new Date(),
      autoRender: true,
      template: '##template##'
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
