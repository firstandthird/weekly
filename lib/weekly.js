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

      var startDate = event.start.getFullYear() + "-" + event.start.getMonth() + "-" + event.start.getDate();
      var startTime = event.start.toTimeString().slice(0,5);
      var endDate = event.end.getFullYear() + "-" + event.end.getMonth() + "-" + event.end.getDate();
      var endTime = event.end.toTimeString().slice(0,5);
      console.log('start:', startDate, 'end:', endDate);
      console.log('start time:', startTime, 'end time:', endTime);

      var topOffset = this.getTimeOffsetPercent(this.startTime, startTime);
      var bottomOffset = this.getTimeOffsetPercent(this.endTime, endTime);

      var eventTemplate = $('<div class="event"></div>');

      eventTemplate.css({
        top: topOffset + '%',
        bottom: bottomOffset + '%'
      });

      this.el.find('.grid .day[data-date="' + startDate + '"]').append(eventTemplate);
    },

    toMilTime: function(time) {
      if(time.toString().indexOf(':') === -1) {
        time += '00';
      }

      return ~~(time.toString().split(':').join(''));
    },

    getTimeOffsetPercent: function(time, checkTime) {
      return Math.abs(100-(this.toMilTime(time)/this.toMilTime(checkTime))*100);
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
