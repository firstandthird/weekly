
/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.0.46
 * https://github.com/firstandthird/weekly
 * copyright First + Third 2014
 * MIT License
*/
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
    getDates: function(date, weekOffset, dayOffset) {
      date = new Date(date);
      date.setHours(0, 0, 0);
      dayOffset = dayOffset || 0;
      var daysInWeek = 7;

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

      var span = TimeFormat('%M %d', first) + ' - ';
      if (first.getMonth() == last.getMonth()) {
        span += TimeFormat('%d', last);
      } else {
        span += TimeFormat('%M %d', last);
      }
      return span;
    },
    realTimezoneOffset: function(offset) {
      var local = (new Date()).getTimezoneOffset() / -60;
      var real = offset - local;
      return real;
    },
    isPastDate: function(past) {
      var pastParts = past.split('-');
      return (TimeFormat('%Y%m%d', new Date(pastParts[0], pastParts[1], pastParts[2])) < TimeFormat('%Y%m%d', new Date()));
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

/**
 * Simple date and time formatter based on php's date() syntax.
 */

(function(w) {
  var oldRef = w.TimeFormat;

  var months = 'January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
  var days = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|');

  var TimeFormat = function(format, time) {
    if(!time instanceof Date) return;

    // Implements PHP's date format syntax.
    return format.replace(/%d|%D|%j|%l|%S|%w|%F|%m|%M|%n|%Y|%y|%a|%A|%g|%G|%h|%H|%i|%s|%u|%e/g, function(match) {
      switch(match) {
        case '%d':
          return ("0" + time.getDate()).slice(-2);
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
          return ("0" + (time.getMonth() + 1)).slice(-2);
        case '%M':
          return months[time.getMonth()].substr(0,3);
        case '%n':
          return time.getMonth();
        case '%Y':
          return time.getFullYear();
        case '%y':
          return time.getFullYear().toString().slice(-2);
        case '%a':
          return time.getHours() > 11 ? 'pm' : 'am';
        case '%A':
          return time.getHours() > 11 ? 'PM' : 'AM';
        case '%g':
          return time.getHours() > 12 ? time.getHours() -12 : (time.getHours() ? time.getHours() : 12);
        case '%G':
        return time.getHours();
        case '%h':
          return ("0" + (time.getHours() > 12 ? time.getHours() -12 : time.getHours())).slice(-2);
        case '%H':
          return ("0" + time.getHours()).slice(-2);
        case '%i':
          return ("0" + time.getMinutes()).slice(-2);
        case '%s':
          return ("0" + time.getSeconds()).slice(-2);
        case '%u':
          return time.getMilliseconds();
        case '%e':
          return time.getTimezoneOffset();
      }
    });
  };

  TimeFormat.noConflict = function() {
    w.TimeFormat = oldRef;
    return TimeFormat;
  };

  w.TimeFormat = TimeFormat;

})(window);

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
      template: '<div class="weekly-time-navigation">  <% if (showPreviousWeekButton) { %>  <button class="weekly-previous-week weekly-change-week-button" data-action="prevWeek">&laquo; <span class="week"></span></button>  <% } %>  <button class="weekly-next-week weekly-change-week-button" data-action="nextWeek"><span class="week"></span> &raquo;</button>  <button class="weekly-jump-today weekly-change-today-button" data-action="jumpToday">Today</button>  <div class="weekly-header"></div></div><div class="weekly-calendar">  <div class="weekly-days">  <% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>    <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%n-%j\', date) %>">      <%= timef(\'%D %m/%d\', date) %>    </div>  <% } %>  </div>  <div class="weekly-scroller">    <div class="weekly-times">    <% for (var i = 0; i < times.length; i++) { var time = times[i]; %>      <div class="weekly-time" data-time="<%= time %>"><%= time %></div>    <% } %>    </div>    <div class="weekly-grid">    <% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>      <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%n-%j\', date) %>">        <% for (var ii = 0; ii < times.length; ii++) { var time = times[ii]; %>          <div class="weekly-time" data-time="<%= time %>">&nbsp;</div>        <% } %>      </div>    <% } %>    </div>  </div></div>',
      readOnly: false,
      enableResize: true,
      enableDelete: true,
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

      this.firstEvent = null;

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

      this.registerClickToCreate();
      this.registerModifyEvent();

      this.highlightToday();
      this.highlightWeekend();

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
      var dateString = TimeFormat('%Y-%n-%j', today);

      this.el.find('.weekly-grid [data-date="' + dateString + '"], .weekly-days [data-date="' + dateString + '"]').addClass('weekly-today');
    },

    highlightWeekend: function() {
      this.el.find('.weekly-grid .weekly-day').each(function(){
        var $this = $(this);
        var parsedDate = $this.data('date').split('-');
        var weekDay = new Date(parsedDate[0], parsedDate[1], parsedDate[2]);

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
            scrollDate = TimeFormat('%Y-%n-%j', new Date());
          } else if(this.scrollFirstEvent instanceof Date) {
            scrollDate = TimeFormat('%Y-%n-%j', this.scrollFirstEvent);
          } else if(this.scrollFirstEvent !== 'everyday') {
            var parsedDate = this.scrollFirstEvent.split('-');
            scrollDate = TimeFormat('%Y-%n-%j', new Date(parsedDate[0], parsedDate[1] - 1, parsedDate[2]));
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
    }

  });

})(jQuery);
