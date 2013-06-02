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

      this.timeDifference = (this.endTime + 13) - this.startTime;

      this.registerClickToCreate();
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.grid .day');

      gridDays.unbind('mousedown mousemove mouseup mouseout');

      gridDays.on('mousedown', this.proxy(function(event){
        this.mouseDown = true;

        if(this.pendingEvent) {
          this.pendingEvent.remove();
          this.pendingEvent = null;
        }
      }));

      gridDays.on('mouseup', this.proxy(function(){
        this.mouseDown = false;

        var eventData = this.pendingEvent.data();

        var parsedDate = eventData.date.split('-');

        this.addEvent({
          start: new Date(parsedDate[0], parsedDate[1], parsedDate[2], eventData.starttime),
          end: new Date(parsedDate[0], parsedDate[1], parsedDate[2], eventData.endtime)
        });

        this.el.trigger('addEvent', [eventData]);

        this.pendingEvent.remove();
        this.pendingEvent = null;
        this.pendingEventStart = null;
      }));

      gridDays.on('mousemove', this.proxy(function(event){
        if(this.mouseDown) {
          var target = $(event.currentTarget);
          var targetOffset = target.offset();
          var mouseOffsetTop = event.clientY - targetOffset.top;
          var dayHeight = $(event.currentTarget).height();
          var hourHeight = Math.round(dayHeight / this.timeDifference);

          var tempStart = Math.floor(mouseOffsetTop / hourHeight) * hourHeight;
          var tempEnd = Math.ceil(mouseOffsetTop / hourHeight) * hourHeight;

          if(this.pendingEventStart === null) {
            this.pendingEventStart = tempStart;
          }

          if(this.pendingEventEnd === null || tempEnd > this.pendingEventStart) {
            this.pendingEventEnd = tempEnd;
          }

          if(!this.pendingEvent) {
            target.append('<div class="event-pending"></div>');
            this.pendingEvent = target.find('.event-pending');
            this.pendingEvent.data('date', target.data('date'));
          }

          this.pendingEvent.css({
            top: this.pendingEventStart,
            bottom: dayHeight - this.pendingEventEnd
          });

          this.pendingEvent.data('starttime', ((this.pendingEventStart / hourHeight) || 0) + this.startTime);
          this.pendingEvent.data('endtime', ((this.pendingEventEnd / hourHeight) || 1) + this.startTime);
        }
      }));

      gridDays.on('mouseleave', this.proxy(function(event){
        if(this.mouseDown) {
          gridDays.trigger('mouseup');
        }
      }));
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
      var startDate = event.start.getFullYear() + "-" + event.start.getMonth() + "-" + event.start.getDate();
      var startTime = event.start.toTimeString().slice(0,5);
      var endDate = event.end.getFullYear() + "-" + event.end.getMonth() + "-" + event.end.getDate();
      var endTime = event.end.toTimeString().slice(0,5);

      var topOffset = 100 - this.getTimeOffsetPercent(startTime);
      var bottomOffset = this.getTimeOffsetPercent(endTime);

      var eventTemplate = $('<div class="event"></div>');

      eventTemplate.css({
        top: topOffset + '%',
        bottom: bottomOffset + '%'
      }).append('<div class="event-title">' + startTime + '</div><div class="event-name">' + event.name + '</div><div class="event-desc">' + event.description + '</div>');

      this.el.find('.grid .day[data-date="' + startDate + '"]').append(eventTemplate);
    },

    toFraction: function(time) {
      if(time.toString().indexOf(':') === -1) {
        return time;
      }

      var parts = time.toString().split(':');

      return parseFloat(parts[0] + '.' + 100/(60/parts[1]));
    },

    getTimeOffsetPercent: function(time) {
      time = this.toFraction(time) - this.startTime;

      var diff = this.timeDifference - time;

      if(diff < 0) {
        diff = time - this.timeDifference;
      }

      var percent = (diff / this.timeDifference) * 100;

      return percent;
    },

    addEvent: function(event) {
      event = $.extend({
        name: '',
        description: '',
        start: null,
        end: null
      }, event);

      this.renderEvent(event);
      this.events.push(event);
    }
  });

})(jQuery);
