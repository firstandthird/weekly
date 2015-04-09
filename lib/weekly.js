/* global dateUtils,moment */
(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 0,
      endTime: 12,
      startTimeScrollOffset: '8:00 AM',
      scrollFirstEvent: false, // '2014-02-05' or 'today' or 'everyday' or Date() or false
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
      showToday: true,
      allowPreviousWeeks: true,
      allowPastEventCreation: false,
      timezoneOffset: 0,
      utcOffset: ((new Date()).getTimezoneOffset() / -60),
      selectableDates: null,
      todayFirst: false,
      dayOffset: 0,
      allowOverlap: true,
      hoverPreviewDelay: 250,

      // How many minutes to draw a divider line
      interval: 30,
      minDuration: 30
    },

    events: {
      'click .weekly-event': 'eventClicked'
    },

    init: function() {
      var self = this;
      this.events = [];

      if (this.todayFirst) {
        this.dayOffset = this.currentDate.getDay();
      }

      if(this.interval < 1 || this.interval > 60) {
        this.interval = 60;
      }

      this.setSelectableDates(this.selectableDates, true);

      if (this.autoRender) {
        var data = this.update();
        this.emit('weekChange', data);
      }

      this.hoverPreviewTimer = null;
      if(this.hoverPreviewDelay !== false) {
        this.el.on('mousemove', '.weekly-day', this.proxy(function(e) {
          if (self.readOnly) {
            return;
          }
          this.removePreviewEvent();
          this.hoverPreviewTimer = setTimeout(this.proxy(function() {
            this.showPreviewEvent(e);
          }), this.hoverPreviewDelay);
        })).on('mouseleave', '.weekly-day', this.proxy(function() {
          if (self.readOnly) {
            return;
          }
          this.removePreviewEvent();
        }));
      }

    },

    get: function(property) {
      return this[property];
    },

    getDates: function(date, weekOffset, dayOffset, daysDisplay) {
      date = moment(date) || moment();
      date.startOf('day');

      dayOffset = dayOffset || 0;
      daysDisplay = daysDisplay || 7; // 7 days in a week

      var days = [];
      var firstDay = dateUtils.getFirstDayOfWeek(date, weekOffset);
      var day, formatted, mDay, pretty;

      for (var i = 0; i < daysDisplay; i++) {
        mDay = moment(firstDay).add(i + dayOffset, 'days');
        date = mDay.toDate();
        formatted = mDay.format('YYYY-MM-DD');
        pretty = mDay.format('ddd DD/MM');

        days.push({
          date: date,
          formatted: formatted,
          pretty: pretty,
          isToday: mDay.isSame(this.currentDate, 'day'),
          isWeekend: mDay.day()%6===0,
          canAdd: this.canAdd(formatted)
        });
      }

      return days;
    },

    update: function() {
      this.firstEvent = null;

      var data = {
        currentDate: this.currentDate,
        dates: this.getDates(this.currentDate, this.weekOffset, this.dayOffset),
        times: dateUtils.getTimes(this.startTime, this.endTime),
        hidePreviousWeekButton: !(this.allowPreviousWeeks || (this.weekOffset !== 0)),
        hideTodayButton: !this.showToday || !this.weekOffset,
        offsets: {
          previous: dateUtils.getWeekSpan(this.currentDate, this.weekOffset - 1, this.dayOffset),
          current: dateUtils.getWeekSpan(this.currentDate, this.weekOffset, this.dayOffset),
          next: dateUtils.getWeekSpan(this.currentDate, this.weekOffset + 1, this.dayOffset)
        }
      };

      this.render(data);

      for(var i = 0, c = this.events.length; i < c; i++) {
        this.renderEvent(this.events[i]);
      }

      this.timeDifference = (this.endTime + 12) - this.startTime;

      this.registerClickToCreate();
      this.registerModifyEvent();

      if (this.fitText) {
        this.el.find('.weekly-days .weekly-day, .weekly-times .weekly-time').fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }

      if(this.startTimeScrollOffset && !this.first) {
        var top = $(window).scrollTop(),
            el = this.el.find('[data-time="'+this.startTimeScrollOffset+'"]');

        el[0].scrollIntoView();
        $(window).scrollTop(top);
      }

      return { dates: data.dates, times: data.times };
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.weekly-grid .weekly-day');

      // Make sure anything previously bound is bound no more.
      gridDays.off('mousedown mousemove mouseup mouseout click');

      if (this.readOnly) {
        return;
      }

      gridDays.on('mousedown', this.proxy(function(event){
        var target = $(event.target);

        if(event.which !== 1 || target.is('.weekly-dragger') || target.is('.weekly-delete')) {
          return;
        }

        var currentTarget = $(event.currentTarget);
        var targetDate = currentTarget.data('date');

        if((!this.allowPastEventCreation && moment(targetDate).isBefore()) || !this.canAdd(targetDate)) {
          return;
        }

        this.mouseDown = true;

        if(this.pendingEvent) {
          this.pendingEvent.remove();
          this.pendingEvent = null;
        }
      }));

      gridDays.on('mouseup', this.proxy(function(){
        if(!this.mouseDown) {
          return;
        }

        this.mouseDown = false;

        if(this.pendingEvent) {
          var eventData = this.pendingEvent.data();

          var parsedDate = eventData.date.split('-');

          var startHours = eventData.starttime - ~~this.timezoneOffset;
          var startMins = this.fromDecimal(eventData.starttime) - (60 * (this.timezoneOffset % 1));
          var endHours = eventData.endtime - ~~this.timezoneOffset;
          var endMins = this.fromDecimal(eventData.endtime) - (60 * (this.timezoneOffset % 1));
          this.addEvent({
            start: new Date(parsedDate[0], parsedDate[1]-1, parsedDate[2], startHours, startMins),
            end: new Date(parsedDate[0], parsedDate[1]-1, parsedDate[2], endHours, endMins)
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
        var targetDate = target.data('date');

        if((!this.allowPastEventCreation && moment(targetDate).isBefore()) || !this.canAdd(targetDate)) {
          return;
        }

        if($(event.target).is('.weekly-time,.weekly-day,.weekly-event-preview,.weekly-event-preview-time')) {
          this.mouseDown = true;
          this.createEvent(event);
          gridDays.trigger('mouseup');
        }
      }));

      gridDays.on('mouseleave', this.proxy(function(){
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

      if (this.readOnly) {
        return;
      }

      eventDraggers.on('mousedown', '.weekly-dragger', this.proxy(function(event){
        if(event.which !== 1) return;
        this.mouseModifyDown = true;

        this.currentDragger = $(event.target);
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

      var dateSplit = target.data('date').split('-');

      var temp = {
        start: this.pendingEventStart,
        end: this.pendingEventEnd
      };

      // Ensure end is at least intervalHeight greater than start
      if(tempStart === tempEnd) {
        tempEnd += intervalHeight;
      }

      if(this.pendingEventStart === null) {
        this.pendingEventStart = tempStart;
      }

      if(this.pendingEventEnd === null || tempEnd > this.pendingEventStart) {
        this.pendingEventEnd = tempEnd;
      }

      var startTime = ((this.pendingEventStart / hourHeight) || 0) + this.startTime;
      var endTime = ((this.pendingEventEnd / hourHeight) || 1) + this.startTime;

      if(endTime - startTime < this.minDuration / 60) {
        endTime = startTime + (this.minDuration / 60);
      }

      var start = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2], startTime - this.timezoneOffset, this.fromDecimal(startTime));
      var end = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2], endTime - this.timezoneOffset, this.fromDecimal(endTime));

      if(!this.allowOverlap && this.overlaps(start.getTime(), end.getTime())) {
        // don't drag anymore and reset values
        this.pendingEventStart = temp.start;
        this.pendingEventEnd = temp.end;
        return;
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

      this.pendingEvent.data('starttime', startTime);
      this.pendingEvent.data('endtime', endTime);
    },

    modifyEvent: function(event) {
      var target = this.currentDragger.parents('.weekly-event');
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);
      var intervalHeight = hourHeight / (60 / this.interval);

      var tempEnd = Math.ceil(mouseOffsetTop / intervalHeight) * intervalHeight;

      var duration = target.outerHeight() / hourHeight;
      var start = new Date(target.data('start'));
      var end = new Date(target.data('start'));
          end.setHours(end.getHours() + ~~(duration));
          end.setMinutes(this.fromDecimal(duration));

      if(this.intersects(target).length) {
        this.currentDragger.trigger('mouseup');
        target.css({
          bottom: dayHeight - tempEnd + intervalHeight
        });
        return;
      }

      target.data('end', end);

      if(tempEnd < (targetOffset.top + dayHeight)) {
        target.css({
          bottom: dayHeight - tempEnd
        });
      }

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

    jumpTo: function(date) {

      if (this.todayFirst !== false) {
        this.dayOffset = date.getDay();
      }
      this.weekOffset = dateUtils.getWeekOffset(this.currentDate, date);

      var data = this.update();
      this.emit('weekChange', data);

      return this;

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

      start.setHours(start.getHours() + ~~this.timezoneOffset);
      end.setHours(end.getHours() + ~~this.timezoneOffset);
      start.setMinutes(start.getMinutes() + (60 * (this.timezoneOffset % 1)));
      end.setMinutes(end.getMinutes() + (60 * (this.timezoneOffset % 1)));

      var startDate = moment(start).format('YYYY-MM-DD');
      var startTime = start.toTimeString().slice(0,5);
      var endTime = end.toTimeString().slice(0,5);

      if(endTime === '00:00') {
        endTime = '24:00';
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
        '<div class="weekly-event-time">' + moment(start).format('h:mm') + ' - ' + moment(end).format('h:mmA') + '</div>',
        '<div class="weekly-event-title">' + event.title + '</div>',
        '<div class="weekly-event-desc">' + event.description + '</div>',
        '<div class="weekly-dragger"></div>'
      ].join(''));

      if (this.readOnly || !this.enableResize) {
        eventTemplate.find('.weekly-dragger').remove();
      }

      if (this.readOnly || !this.enableDelete) {
        eventTemplate.find('.weekly-delete').remove();
      }

      if (event.type) {
        eventTemplate.addClass('weekly-event-'+event.type.replace(/ /g, '-'));
      }

      var selectedDay = this.el.find('.weekly-grid .weekly-day[data-date="' + startDate + '"]');

      selectedDay.append(eventTemplate);

      var diff = end.getTime() - start.getTime();

      if (event.title && diff <= 1000*60*30) {
        eventTemplate.find('.weekly-event-time').hide();
      }

      if (this.fitText) {
        selectedDay.find('.weekly-event-title').fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }

      this.updateEventScroll(startDate);
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

    addEvent: function(event) {
      if(event instanceof Array) {
        for(var i = 0, c = event.length; i < c; i++) {
          this.addEvent(event[i]);
        }
        return;
      }

      event = $.extend({
        title: '',
        description: '',
        start: null,
        end: null
      }, event);

      event._index = this.events.length;

      if(!this.allowOverlap && this.overlaps(event.start.getTime(), event.end.getTime())) {
        this.emit('addEventOverlapError', [event]);
        return;
      }

      if (event.start.getHours() >= this.startTime && event.end.getHours() <= (this.endTime + 12)) {
        this.renderEvent(event);
      }
      this.events.push(event);

      this.emit('addEvent', [event]);
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
    },

    setReadOnly: function(val) {
      this.readOnly = val;
      this.update();
      return this;

    },

    setScrollFirstEvent: function(val) {
      this.scrollFirstEvent = val;
      this.update();
      return this;
    },

    updateEventScroll: function(startDate) {
      clearTimeout(this.scrollTimer);

      this.scrollTimer = setTimeout(this.proxy(function(){
        if(this.scrollFirstEvent) {
          var top = $(window).scrollTop(),
              scrollDate = this.scrollFirstEvent,
              el;

          if(this.scrollFirstEvent === 'today') {
            scrollDate = moment();
          } else if(this.scrollFirstEvent instanceof Date) {
            scrollDate = this.scrollFirstEvent;
          } else if(this.scrollFirstEvent !== 'everyday') {
            scrollDate = moment(this.scrollFirstEvent);
          }

          scrollDate = scrollDate.format('YYYY-MM-DD');

          if(this.scrollFirstEvent === 'everyday') {
            el = this.el.find('.weekly-event');
          } else {
            el = this.el.find('.weekly-grid [data-date="' + scrollDate + '"] .weekly-event');
          }

          if(el.length) {
            var first = this.firstEvent;

            el.each(function(){
              if(!first || this.offsetTop < first.offsetTop) {
                first = this;
              }
            });

            first.scrollIntoView();
            $(window).scrollTop(top);

            this.firstEvent = first;
          }
        }
      }), 0);
    },

    overlaps: function(start, end, id) {
      for(var i = this.events.length; i--;) {
        if(parseInt(id, 10) === i) continue;

        if(end > this.events[i].start.getTime() && start < this.events[i].end.getTime()) {
          return true;
        }
      }

      return false;
    },

    intersects: function(target) {
      var matches = [];
      var offset = target.offset();
      var targetY = [offset.top, offset.top + target.outerHeight()];

      target.siblings('.weekly-event').each(function() {
        var $this = $(this);
        var pos = $this.offset();
        var sibY = [pos.top, pos.top + $this.outerHeight()];

        if(targetY[0] < sibY[1] && targetY[1] > sibY[0]) {
          matches.push($this);
        }

      });
      return matches;
    },

    setSelectableDates: function(dates, skipUpdate) {
      if (dates){
        //convert array of date objects to strings
        for (var i = 0, c = dates.length; i < c; i++) {
          if (typeof dates[i] == 'object') {
            dates[i] = moment(dates[i]).format('YYYY-MM-DD');
          }
        }

        if ($.type(dates) === 'function'){
          this.canAdd = dates;
        } else {
          this.canAdd = function (date) {
            return dates.indexOf(date) > -1;
          };
        }
      } else {
        this.canAdd = function () {
          return true;
        };
      }
      if (!skipUpdate) {
        this.update();
      }
    },

    showPreviewEvent: function(event) {
      var previewEvent;

      var target = $(event.currentTarget);
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);
      var intervalHeight = hourHeight / (60 / this.interval);
      var minHeight = hourHeight / (60 / this.minDuration);

      var tempStart = Math.floor(mouseOffsetTop / intervalHeight) * intervalHeight;
      var tempEnd = tempStart + minHeight;

      var dateSplit = target.data('date').split('-');

      var startTime = ((tempStart / hourHeight) || 0) + this.startTime;
      var endTime = ((tempEnd / hourHeight) || 1) + this.startTime;

      if(endTime - startTime < this.minDuration / 60) {
        endTime = startTime + (this.minDuration / 60);
      }

      var start = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2], startTime, this.fromDecimal(startTime));
      var end = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2], endTime, this.fromDecimal(endTime));

      target.append('<div class="weekly-event-preview"><div class="weekly-event-preview-time weekly-event-time">' + moment(start).format('h:mm') + ' - ' + moment(end).format('h:mmA') + '</div></div>');
      previewEvent = target.find('.weekly-event-preview');

      previewEvent.css({
        top: tempStart,
        bottom: dayHeight - tempEnd
      });
    },

    removePreviewEvent: function() {
      clearTimeout(this.hoverPreviewTimer);
      this.el.find('.weekly-event-preview').remove();
    }
  });

})(jQuery);
