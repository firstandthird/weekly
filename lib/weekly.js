(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 0,
      endTime: 12,
      startTimeScrollOffset: '8:00 AM',
      weekOffset: 0,
      currentDate: new Date(),
      autoRender: true,
      fitText: true,
      fitTextMin: 12,
      fitTextMax: 15,
      template: '##template##',
      readOnly: false,
      enableResize: true,
      enableDelete: true,
      autoSplit: false,
      autoSplitInterval: 30,
      showToday: true,
      allowPreviousWeeks: true,
      allowPastEventCreation: false,
      timezoneOffset: 0,
      utcOffset: ((new Date()).getTimezoneOffset() / -60),
      todayFirst: false,
      dayOffset: 0,

      // How many minutes to draw a divider line
      interval: 30
    },

    events: {
      'click .weekly-event': 'eventClicked'
    },

    init: function() {
      this.events = [];

      this.oldDate = this.currentDate;

      if (this.readOnly) {
        this.enableResize = false;
        this.enableDelete = false;
      }

      if (this.todayFirst) {
        this.dayOffset = this.currentDate.getDay();
      }

      if(this.interval < 1 || this.interval > 60) {
        this.interval = 60;
      }

      if (this.autoRender) {
        var data = this.update();
        this.emit('weekChange', data);
      }
    },

    get: function(property) {
      return this[property];
    },

    update: function() {

      var data = {
        timef: TimeFormat,
        getWeekSpan: dateUtils.getWeekSpan,
        currentDate: this.currentDate,
        dates: dateUtils.getDates(this.currentDate, this.weekOffset, this.dayOffset),
        times: dateUtils.getTimes(this.startTime, this.endTime),
        showPreviousWeekButton: (this.allowPreviousWeeks || (this.weekOffset !== 0))
      };
      this.render(data);

      for(var i = 0, c = this.events.length; i < c; i++) {
        this.renderEvent(this.events[i]);
      }

      this.timeDifference = (this.endTime + 12) - this.startTime;

      if(!this.readOnly) {
        this.registerClickToCreate();
        this.registerModifyEvent();
      }

      this.highlightToday();

      if(!this.showToday || !this.weekOffset) {
        this.el.find(".weekly-change-today-button").css('display', 'none');
      } else {
        this.el.find(".weekly-change-today-button").css('display', 'block');
      }

      this.el.find('.weekly-time-navigation .weekly-previous-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset - 1, this.dayOffset));
      this.el.find('.weekly-time-navigation .weekly-next-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset + 1, this.dayOffset));

      this.el.find('.weekly-time-navigation .weekly-header').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset, this.dayOffset));

      if (this.fitText) {
        this.el.find(".weekly-days .weekly-day, .weekly-times .weekly-time").fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }

      if (this.startTimeScrollOffset) {
        var top = $(window).scrollTop();
        var el = this.el.find('[data-time="'+this.startTimeScrollOffset+'"]');
        el[0].scrollIntoView();
        $(window).scrollTop(top);
      }

      return { dates: data.dates, times: data.times };
    },

    highlightToday: function() {
      var today = this.currentDate;

      this.el.find('.weekly-grid [data-date="' + TimeFormat('%Y-%n-%j', today) + '"]').addClass('weekly-today');
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.weekly-grid .weekly-day');

      // Make sure anything previously bound is bound no more.
      gridDays.unbind('mousedown mousemove mouseup mouseout click');

      gridDays.on('mousedown', this.proxy(function(event){
        var target = $(event.target);

        if(event.which !== 1 || target.is('.weekly-dragger') || target.is('.weekly-delete')) return;

        var currentTarget = $(event.currentTarget);

        if(!this.allowPastEventCreation && dateUtils.isPastDate(currentTarget.data('date'))) {
          return;
        }

        this.mouseDown = true;

        if(this.pendingEvent) {
          this.pendingEvent.remove();
          this.pendingEvent = null;
        }
      }));

      gridDays.on('mouseup', this.proxy(function(){
        if(!this.mouseDown) return;

        this.mouseDown = false;

        if(this.pendingEvent) {
          var eventData = this.pendingEvent.data();

          var parsedDate = eventData.date.split('-');

          this.addEvent({
            start: new Date(parsedDate[0], parsedDate[1], parsedDate[2], ~~(eventData.starttime) - this.timezoneOffset, this.fromDecimal(eventData.starttime)),
            end: new Date(parsedDate[0], parsedDate[1], parsedDate[2], ~~(eventData.endtime) - this.timezoneOffset, this.fromDecimal(eventData.endtime))
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
        var target = $(event.currentTarget);

        if(!this.allowPastEventCreation && dateUtils.isPastDate(target.data('date'))) {
          return;
        }

        if($(event.target).is('.weekly-time,.weekly-day')) {
          this.mouseDown = true;
          this.createEvent(event);
          gridDays.trigger('mouseup');
        }
      }));

      gridDays.on('mouseleave', this.proxy(function(event){
        if(this.mouseDown) {
          gridDays.trigger('mouseup');
        }
      }));
    },

    registerModifyEvent: function() {
      this.mouseModifyDown = false;

      var eventDraggers = this.el.find('.weekly-grid');

      this.currentDragger = null;

      // Make sure anything previously bound is bound no more.
      eventDraggers.find('.weekly-dragger').unbind('mousedown mousemove mouseup mouseout click');

      eventDraggers.on('mousedown', '.weekly-dragger', this.proxy(function(event){
        if(event.which !== 1) return;
        this.mouseModifyDown = true;

        this.currentDragger = $(event.target);

        this.eventOffset = 0;
      }));

      eventDraggers.on('mouseup', '.weekly-day', this.proxy(function(){
        this.mouseModifyDown = false;

        this.currentDragger = null;
      }));

      eventDraggers.on('mousemove', '.weekly-day', this.proxy(function(event){
        if(this.mouseModifyDown) {
          this.modifyEvent(event);
        }
      }));

      eventDraggers.on('mouseleave', this.proxy(function(event){
        if(this.mouseModifyDown) {
          this.currentDragger.trigger('mouseup');
        }
      }));
    },

    createEvent: function(event) {
      var target = $(event.currentTarget);
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);
      var intervalHeight = hourHeight / (60 / this.interval);

      var tempStart = Math.floor(mouseOffsetTop / intervalHeight) * intervalHeight;
      var tempEnd = Math.ceil(mouseOffsetTop / intervalHeight) * intervalHeight;

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

    modifyEvent: function(event) {
      var target = this.currentDragger.parents('.weekly-event');
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);
      var intervalHeight = hourHeight / (60 / this.interval);

      var tempEnd = Math.ceil(mouseOffsetTop / intervalHeight) * intervalHeight;

      if(tempEnd < (targetOffset.top + dayHeight)) {
        target.css({
          bottom: dayHeight - tempEnd
        });
      }

      var duration = target.outerHeight() / hourHeight;
      var end = new Date(target.data('start'));
      end.setHours(end.getHours() + ~~(duration));
      end.setMinutes(this.fromDecimal(duration));
      target.data('end', end);

      this.events[target.data('_index')].end = end;

      this.el.trigger('modifyEvent', this.events[target.data('_index')]);
    },

    nextWeek: function() {
      this.changeDate(1);
    },

    prevWeek: function() {
      this.changeDate(-1);
    },

    jumpToday: function() {
      this.changeDate(0);
    },

    changeDate: function(offsetWeek) {
      if(!offsetWeek) {
        this.weekOffset = 0;
      } else {
        this.weekOffset += offsetWeek;
      }

      var data = this.update();
      this.emit('weekChange', data);
    },

    renderEvent: function(event) {
      var start = new Date(event.start.getTime());
      var end = new Date(event.end.getTime());

      start.setHours(start.getHours() + this.timezoneOffset);
      end.setHours(end.getHours() + this.timezoneOffset);

      var startDate = start.getFullYear() + "-" + start.getMonth() + "-" + start.getDate();
      var startTime = start.toTimeString().slice(0,5);
      var endDate = end.getFullYear() + "-" + event.end.getMonth() + "-" + end.getDate();
      var endTime = end.toTimeString().slice(0,5);

      if(endTime === "00:00") {
        endTime = "24:00";
      }

      var topOffset = 100 - this.getTimeOffsetPercent(startTime);
      var bottomOffset = this.getTimeOffsetPercent(endTime);

      var eventTemplate = $('<div class="weekly-event"></div>');

      eventTemplate.data(event);

      eventTemplate.data('offset-start', start);
      eventTemplate.data('offset-end', end);

      eventTemplate.css({
        top: topOffset + '%',
        bottom: bottomOffset + '%'
      }).append([
        '<button data-action="removeEvent" class="weekly-delete">&times;</button>',
        '<div class="weekly-event-time">' + TimeFormat('%g:%i', start) + ' - ' + TimeFormat('%g:%i%a', end) + '</div>',
        '<div class="weekly-event-title">' + event.title + '</div>',
        '<div class="weekly-event-desc">' + event.description + '</div>',
        '<div class="weekly-dragger"></div>'
      ].join(''));

      if (!this.enableResize) {
        eventTemplate.find('.weekly-dragger').remove();
      }

      if (!this.enableDelete) {
        eventTemplate.find('.weekly-delete').remove();
      }

      if (event.type) {
        eventTemplate.addClass('weekly-event-'+event.type.replace(/ /g, '-'));
      }

      var selectedDay = this.el.find('.weekly-grid .weekly-day[data-date="' + startDate + '"]');

      selectedDay.append(eventTemplate);

      if (this.fitText) {
        selectedDay.find(".weekly-event-title").fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }
    },

    toFraction: function(time) {
      if(time.toString().indexOf(':') === -1) {
        return time;
      }

      var parts = time.toString().split(':');

      return parseFloat(parts[0] + '.' + 100/(60/parts[1]));
    },

    // This just gets the minutes in the decimal
    fromDecimal: function(time) {
      return Math.round(60 * (time % 1));
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

    setAutoSplit: function(val) {
      this.autoSplit = val;
    },

    setSplitInterval: function(val) {
      this.autoSplitInterval = val;
    },

    splitEvent: function(event) {
      var diff = event.end.getTime() - event.start.getTime();
      var interval = this.autoSplitInterval * 60 * 1000;
      var count = Math.ceil(diff / interval); //divide by 1 hour
      var startTime = event.start.getTime();
      var events = [];
      for (var i = 0; i < count; i++) {
        var newEvent = $.extend({}, event); //clone event
        newEvent.start = new Date(startTime + (interval * i));
        newEvent.end = new Date(startTime + (interval * (i+1)));
        events.push(newEvent);
      }
      return events;
    },

    addEvent: function(event) {
      if(event instanceof Array) {
        for(var i = 0, c = event.length; i < c; i++) {
          this.addEvent(event[i]);
        }
        return;
      }

      if (this.autoSplit) {
        event = this.splitEvent(event);
      } else {
        event = [event];
      }

      for (var x = 0, y = event.length; x < y; x++) {
        var e = event[x];

        e = $.extend({
          title: '',
          description: '',
          start: null,
          end: null
        }, e);

        e._index = this.events.length;

        if (e.start.getHours() >= this.startTime && e.end.getHours() <= (this.endTime + 12)) {
          this.renderEvent(e);
        }
        this.events.push(e);
      }

      var eventData = (this.autoSplit) ? event : event[0];
      this.emit('addEvent', [eventData]);
    },

    removeEvent: function(e) {
      var el = $(e.target).parents('.weekly-event');
      var event = el.data();

      this.events.splice(event._index, 1);
      el.remove();

      this.el.trigger('removeEvent', event);

      return false;
    },

    clearEvents: function() {
      this.el.find('.weekly-event').remove();

      this.events = [];

      this.el.trigger('clearEvents');
    },

    eventClicked: function(e) {
      var el = $(e.currentTarget);
      var event = el.data();
      this.emit('eventClick', [event, el]);
    },

    setTimezoneOffset: function(offset) {
      this.timezoneOffset = dateUtils.realTimezoneOffset(offset);

      this.utcOffset = offset;

      this.update();

      return this;
    }

  });

})(jQuery);
