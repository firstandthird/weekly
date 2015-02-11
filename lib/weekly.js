/* global dateUtils,dateFormat */
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
      whitelistedTimes: null,

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

      this.oldDate = this.currentDate;

      if (this.todayFirst) {
        this.dayOffset = this.currentDate.getDay();
      }

      if(this.interval < 1 || this.interval > 60) {
        this.interval = 60;
      }

      this.canAdd_ = [];
      this.selectable_ = [];
      this.whitelisted_ = [];
      this.canAdd = this.proxy(this.canAdd);
      this.setWhitelistedTimes(this.whitelistedTimes, true);

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

          if (!$(e.target).is('.weekly-dragger')) {
            this.hoverPreviewTimer = setTimeout(this.proxy(function() {
              this.showPreviewEvent(e);
            }), this.hoverPreviewDelay);
          }
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

    update: function() {

      this.firstEvent = null;

      var data = {
        timef: dateFormat,
        canAdd: this.canAdd,
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

      this.registerClickToCreate();
      this.registerModifyEvent();

      this.highlightToday();
      this.highlightWeekend();

      if(!this.showToday || !this.weekOffset) {
        this.el.find('.weekly-change-today-button').css('display', 'none');
      } else {
        this.el.find('.weekly-change-today-button').css('display', 'block');
      }

      this.el.find('.weekly-time-navigation .weekly-previous-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset - 1, this.dayOffset));
      this.el.find('.weekly-time-navigation .weekly-next-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset + 1, this.dayOffset));

      this.el.find('.weekly-time-navigation .weekly-header').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset, this.dayOffset));

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

    highlightToday: function() {
      var today = this.currentDate;
      var dateString = dateFormat('%Y-%m-%d', today);

      this.el.find('.weekly-grid [data-date="' + dateString + '"], .weekly-days [data-date="' + dateString + '"]').addClass('weekly-today');
    },

    highlightWeekend: function() {
      this.el.find('.weekly-grid .weekly-day').each(function(){
        var $this = $(this);
        var parsedDate = $this.data('date').split('-');
        var weekDay = new Date(parsedDate[0], parsedDate[1]-1, parsedDate[2]);

        if(weekDay.getDay()%6===0) {
          $this.addClass('weekly-weekend');
        }
      });
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.weekly-grid .weekly-day');

      // Make sure anything previously bound is bound no more.
      gridDays.unbind('mousedown mousemove mouseup mouseout click');

      if (this.readOnly) {
        return;
      }

      gridDays.on('mousedown', this.proxy(function(event){
        var target = $(event.target);

        if(event.which !== 1 || target.is('.weekly-dragger') || target.is('.weekly-delete')) {
          return;
        }

        var currentTarget = $(event.currentTarget);
        var timeTarget = $(event.target);

        if((!this.allowPastEventCreation && dateUtils.isPastDate(currentTarget.data('date'))) || !this.canAdd(currentTarget.data('date'), timeTarget.data('time'))) {
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
          var startDate = new Date(parsedDate[0], parsedDate[1]-1, parsedDate[2], startHours, startMins);
          var endDate = new Date(parsedDate[0], parsedDate[1]-1, parsedDate[2], endHours, endMins);
          var startDateFormatted = dateFormat('%Y-%m-%d', startDate);
          var startTimeFormatted = dateFormat('%g:%i %A', startDate);
          var endDateFormatted = dateFormat('%Y-%m-%d', endDate);
          var endTimeFormatted = dateFormat('%g:%i %A', endDate);

          if (!this.canAdd(startDateFormatted, startTimeFormatted) || !this.canAdd(endDateFormatted, endTimeFormatted)) {
            this.pendingEvent.remove();
            this.pendingEvent = null;
            this.pendingEventStart = null;
            return;
          }

          this.addEvent({
            start: startDate,
            end: endDate
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
        var currentTarget = $(event.currentTarget);
        var target = $(event.target);

        if((!this.allowPastEventCreation && dateUtils.isPastDate(currentTarget.data('date'))) || !this.canAdd(currentTarget.data('date'), target.data('time'))) {
          return;
        }

        if(target.is('.weekly-time,.weekly-day,.weekly-event-preview,.weekly-event-preview-time')) {
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

      if (this.readOnly) {
        return;
      }

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

      var startDate = dateFormat('%Y-%m-%d', start);
      var startTime = dateFormat('%g:%i %A', start);
      var endDate = dateFormat('%Y-%m-%d', end);
      var endTime = dateFormat('%g:%i %A', end);

      if (this.intersects(target).length || !this.canAdd(startDate, startTime) || !this.canAdd(endDate, endTime)) {
        this.currentDragger.trigger('mouseup');
        target.css({
          bottom: dayHeight - tempEnd + intervalHeight
        });
        return;
      }

      if(tempEnd < (targetOffset.top + dayHeight)) {
        target.css({
          bottom: dayHeight - tempEnd
        });
      }

      if (!target.data('end') || end.getTime() !== target.data('end').getTime()) {
        target.data('end', end);
        this.events[target.data('_index')].end = end;
        this.el.trigger('modifyEvent', this.events[target.data('_index')]);
      }
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

      var startDate = dateFormat('%Y-%m-%d', start);
      var startTime = start.toTimeString().slice(0,5);
      var endDate = dateFormat('%Y-%m-%d', end);
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
        '<div class="weekly-event-time">' + dateFormat('%g:%i', start) + ' - ' + dateFormat('%g:%i%a', end) + '</div>',
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
            scrollDate = dateFormat('%Y-%m-%d', new Date());
          } else if(this.scrollFirstEvent instanceof Date) {
            scrollDate = dateFormat('%Y-%m-%d', this.scrollFirstEvent);
          } else if(this.scrollFirstEvent !== 'everyday') {
            var parsedDate = this.scrollFirstEvent.split('-');
            scrollDate = dateFormat('%Y-%m-%d', new Date(parsedDate[0], parsedDate[1] - 1, parsedDate[2]));
          }

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

    canAdd: function(date, time) {
      var canAdd = true;
      var validator, validatorResult;

      for (var i = 0, length = this.canAdd_.length; i < length && canAdd; i++) {
        validator = this.canAdd_[i];

        if ($.type(validator) === 'function') {
          validatorResult = validator.call(this, date, time);

          if ($.type(validatorResult) === 'undefined') {
            validatorResult = true;
          }

          canAdd = validatorResult;
        }
      }

      return canAdd;
    },

    setWhitelistedTimes: function(times, skipUpdate) {
      if (times){
        if ($.type(times) === 'function'){
          this.canAdd_.push(times);
        } else {
          for (var i = 0, c = times.length; i < c; i++) {
            if (typeof times[i] == 'object') {
              if (times[i].start) {
                this.whitelisted_.push({
                  start: times[i].start.getTime(),
                  end: times[i].end.getTime()
                });
              } else { // It's a Date
                this.selectable_.push(dateFormat('%Y-%m-%d', times[i]));
              }
            }
          }

          this.canAdd_.push(function (date, time) {
            if (date && time) {
              return this.isWithinWhitelistedRange(dateUtils.datetimeToDate(date, time)) || this.selectable_.indexOf(date) > -1;
            }
          });
        }
      }

      if (!skipUpdate) {
        this.update();
      }
    },

    isWithinWhitelistedRange: function(date) {
      var whitelisted = true;

      for (var i = 0, length = this.whitelisted_.length; i < length && whitelisted; i++) {
        var whitelistObject = this.whitelisted_[i];
        whitelisted = date.getTime() >= whitelistObject.start && date.getTime() <= whitelistObject.end;
      }

      return whitelisted;
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

      target.append('<div class="weekly-event-preview"><div class="weekly-event-preview-time weekly-event-time">' + dateFormat('%g:%i', start) + ' - ' + dateFormat('%g:%i%a', end) + '</div></div>');
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
