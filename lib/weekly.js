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

      for(var i = 0, c = this.events.length; i < c; i++) {
        this.renderEvent(this.events[i]);
      }

      this.timeDifference = (this.endTime + 13) - this.startTime;

      this.registerClickToCreate();

      this.highlightToday();
    },

    highlightToday: function() {
      var today = new Date();

      this.el.find('[data-date="' + this.timef('%Y-%n-%j', today) + '"]').addClass('weekly-today');
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.weekly-grid .weekly-day');

      // Make sure anything previously bound is bound no more.
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

        if(this.pendingEvent) {
          var eventData = this.pendingEvent.data();

          var parsedDate = eventData.date.split('-');

          this.addEvent({
            start: new Date(parsedDate[0], parsedDate[1], parsedDate[2], eventData.starttime),
            end: new Date(parsedDate[0], parsedDate[1], parsedDate[2], eventData.endtime)
          });

          this.pendingEvent.remove();
          this.pendingEvent = null;
          this.pendingEventStart = null;
        }
      }));

      gridDays.on('mousemove', this.proxy(function(event){
        if(this.mouseDown) {
          this.createEvent(event);
        }
      }));

      gridDays.on('click', this.proxy(function(event){
        console.log(event);
        if($(event.target).is('.weekly-time,.weekly-day')) {
          this.createEvent(event);
          gridDays.trigger('mouseup');
        }
      }));

      gridDays.on('mousemove', this.proxy(function(event){
        if(this.moseDown) {
          this.createEvent(event);
        }
      }));

      gridDays.on('mouseleave', this.proxy(function(event){
        if(this.mouseDown) {
          gridDays.trigger('mouseup');
        }
      }));
    },

    createEvent: function(event) {
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
        target.append('<div class="weekly-event-pending"></div>');
        this.pendingEvent = target.find('.weekly-event-pending');
        this.pendingEvent.data('date', target.data('date'));
      }

      this.pendingEvent.css({
        top: this.pendingEventStart,
        bottom: dayHeight - this.pendingEventEnd
      });

      this.pendingEvent.data('starttime', ((this.pendingEventStart / hourHeight) || 0) + this.startTime);
      this.pendingEvent.data('endtime', ((this.pendingEventEnd / hourHeight) || 1) + this.startTime);
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

    nextWeek: function() {
      this.changeDate(7);
    },

    prevWeek: function() {
      this.changeDate(-7);
    },

    changeDate: function(offsetDays) {
      this.currentDate.setDate(this.currentDate.getDate() + offsetDays);

      if (this.autoRender) {
        this.update();
      }
    },

    renderEvent: function(event) {
      var startDate = event.start.getFullYear() + "-" + event.start.getMonth() + "-" + event.start.getDate();
      var startTime = event.start.toTimeString().slice(0,5);
      var endDate = event.end.getFullYear() + "-" + event.end.getMonth() + "-" + event.end.getDate();
      var endTime = event.end.toTimeString().slice(0,5);

      var topOffset = 100 - this.getTimeOffsetPercent(startTime);
      var bottomOffset = this.getTimeOffsetPercent(endTime);

      var eventTemplate = $('<div class="weekly-event"></div>');

      eventTemplate.data(event);

      eventTemplate.css({
        top: topOffset + '%',
        bottom: bottomOffset + '%'
      }).append('<button data-action="removeEvent" class="weekly-delete">×</button><div class="weekly-event-title">' + this.timef('%g:%i %a', event.start) + '</div><div class="weekly-event-name">' + event.name + '</div><div class="weekly-event-desc">' + event.description + '</div>');

      this.el.find('.weekly-grid .weekly-day[data-date="' + startDate + '"]').append(eventTemplate);
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

    timef: function(format, time) {
      if(!time instanceof Date) return;

      var months = 'January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
      var days = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|');


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
            return time.getHours() > 11 ? time.getHours() -12 : time.getHours();
          case '%G':
          return time.getHours();
          case '%h':
            return ("0" + (time.getHours() > 11 ? time.getHours() -12 : time.getHours())).substr(-2,2);
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
    },

    addEvent: function(event) {
      event = $.extend({
        name: '',
        description: '',
        start: null,
        end: null
      }, event);

      event.id = this.events.length;

      this.renderEvent(event);
      this.events.push(event);

      this.el.trigger('addEvent', [event]);
    },

    removeEvent: function(e) {
      var el = $(e.target).parents('.weekly-event');
      var event = el.data();

      this.events.splice(event.id, 1);
      el.remove();

      this.el.trigger('removeEvent', event);

      return false;
    }
  });

})(jQuery);
