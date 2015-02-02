
/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.6.1
 * https://github.com/firstandthird/weekly
 * copyright First+Third 2015
 * MIT License
*/
/*global jQuery */
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );
/*!
 * dateformat - Date format lib
 * v0.4.1
 * https://github.com/firstandthird/dateformat
 * copyright First + Third 2014
 * MIT License
*/
/**
 * Simple date and time formatter based on php's date() syntax.
 */

(function(w) {
  var root = this;
  var oldRef = root.dateFormat;

  var months = 'January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
  var days = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|');

  var dateFormat = function(format, time) {
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
          return time.getMonth() + 1;
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

  dateFormat.translate = function(trans_months, trans_days) {
    months = trans_months;
    days = trans_days;
  };

  dateFormat.noConflict = function() {
    root.dateFormat = oldRef;
    return dateFormat;
  };

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = dateFormat;
    }
    exports.dateFormat = dateFormat;
  } else {
    root.dateFormat = dateFormat;
  }

}).call(this);
/*!
 * fidel - a ui view controller
 * v2.2.5
 * https://github.com/jgallen23/fidel
 * copyright Greg Allen 2014
 * MIT License
*/
(function(w, $) {
  var _id = 0;
  var Fidel = function(obj) {
    this.obj = obj;
  };

  Fidel.prototype.__init = function(options) {
    $.extend(this, this.obj);
    this.id = _id++;
    this.namespace = '.fidel' + this.id;
    this.obj.defaults = this.obj.defaults || {};
    $.extend(this, this.obj.defaults, options);
    $('body').trigger('FidelPreInit', this);
    this.setElement(this.el || $('<div/>'));
    if (this.init) {
      this.init();
    }
    $('body').trigger('FidelPostInit', this);
  };
  Fidel.prototype.eventSplitter = /^(\w+)\s*(.*)$/;

  Fidel.prototype.setElement = function(el) {
    this.el = el;
    this.getElements();
    this.dataElements();
    this.delegateEvents();
    this.delegateActions();
  };

  Fidel.prototype.find = function(selector) {
    return this.el.find(selector);
  };

  Fidel.prototype.proxy = function(func) {
    return $.proxy(func, this);
  };

  Fidel.prototype.getElements = function() {
    if (!this.elements)
      return;

    for (var selector in this.elements) {
      var elemName = this.elements[selector];
      this[elemName] = this.find(selector);
    }
  };

  Fidel.prototype.dataElements = function() {
    var self = this;
    this.find('[data-element]').each(function(index, item) {
      var el = $(item);
      var name = el.data('element');
      self[name] = el;
    });
  };

  Fidel.prototype.delegateEvents = function() {
    if (!this.events)
      return;
    for (var key in this.events) {
      var methodName = this.events[key];
      var match = key.match(this.eventSplitter);
      var eventName = match[1], selector = match[2];

      var method = this.proxy(this[methodName]);

      if (selector === '') {
        this.el.on(eventName + this.namespace, method);
      } else {
        if (this[selector] && typeof this[selector] != 'function') {
          this[selector].on(eventName + this.namespace, method);
        } else {
          this.el.on(eventName + this.namespace, selector, method);
        }
      }
    }
  };

  Fidel.prototype.delegateActions = function() {
    var self = this;
    self.el.on('click'+this.namespace, '[data-action]', function(e) {
      var el = $(this);
      var action = el.attr('data-action');
      if (self[action]) {
        self[action](e, el);
      }
    });
  };

  Fidel.prototype.on = function(eventName, cb) {
    this.el.on(eventName+this.namespace, cb);
  };

  Fidel.prototype.one = function(eventName, cb) {
    this.el.one(eventName+this.namespace, cb);
  };

  Fidel.prototype.emit = function(eventName, data, namespaced) {
    var ns = (namespaced) ? this.namespace : '';
    this.el.trigger(eventName+ns, data);
  };

  Fidel.prototype.hide = function() {
    if (this.views) {
      for (var key in this.views) {
        this.views[key].hide();
      }
    }
    this.el.hide();
  };
  Fidel.prototype.show = function() {
    if (this.views) {
      for (var key in this.views) {
        this.views[key].show();
      }
    }
    this.el.show();
  };

  Fidel.prototype.destroy = function() {
    this.el.empty();
    this.emit('destroy');
    this.el.unbind(this.namespace);
  };

  Fidel.declare = function(obj) {
    var FidelModule = function(el, options) {
      this.__init(el, options);
    };
    FidelModule.prototype = new Fidel(obj);
    return FidelModule;
  };

  //for plugins
  Fidel.onPreInit = function(fn) {
    $('body').on('FidelPreInit', function(e, obj) {
      fn.call(obj);
    });
  };
  Fidel.onPostInit = function(fn) {
    $('body').on('FidelPostInit', function(e, obj) {
      fn.call(obj);
    });
  };
  w.Fidel = Fidel;
})(window, window.jQuery || window.Zepto);

(function($) {
  $.declare = function(name, obj) {

    $.fn[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      var options = args.shift();
      var methodValue;
      var els;

      els = this.each(function() {
        var $this = $(this);

        var data = $this.data(name);

        if (!data) {
          var View = Fidel.declare(obj);
          var opts = $.extend({}, options, { el: $this });
          data = new View(opts);
          $this.data(name, data); 
        }
        if (typeof options === 'string') {
          methodValue = data[options].apply(data, args);
        }
      });

      return (typeof methodValue !== 'undefined') ? methodValue : els;
    };

    $.fn[name].defaults = obj.defaults || {};

  };

  $.Fidel = window.Fidel;

})(jQuery);
/*!
 * template - A simple javascript template engine.
 * v0.2.0
 * https://github.com/jgallen23/template
 * copyright Greg Allen 2013
 * MIT License
*/
//template.js
//modified version of john resig's micro templating
//http://ejohn.org/blog/javascript-micro-templating/

(function(w){
  var oldRef = w.template;
  var cache = {};

  opts = {
    openTag: '<%',
    closeTag: '%>'
  };

  var template = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(str) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split(opts.openTag).join("\t")
          .replace(new RegExp("((^|"+opts.closeTag+")[^\t]*)'", 'g'), "$1\r")
          .replace(new RegExp("\t=(.*?)"+opts.closeTag, 'g'), "',$1,'")
          .split("\t").join("');")
          .split(opts.closeTag).join("p.push('")
          .split("\r").join("\\'") + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };

  template.options = opts;
  template.noConflict = function() {
    w.template = oldRef;
    return template;
  };

  w.template = template;
})(window);

/*!
 * fidel-template - A fidel plugin to render a clientside template
 * v0.3.0
 * https://github.com/jgallen23/fidel-template
 * copyright Greg Allen 2013
 * MIT License
*/

(function(Fidel) {
  Fidel.template = template.noConflict();

  Fidel.prototype.render = function(data, el) {
    var tmpl = (this.template) ? this.template : $('#'+this.templateId).html();
    el = el || this.el;
    el.html(Fidel.template(tmpl, data));
  };
})(window.Fidel);

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
      template: '<div class="weekly-time-navigation">  <button <% if (!showPreviousWeekButton) { %> style="visibility: hidden;" <% } %> class="weekly-previous-week weekly-change-week-button" data-action="prevWeek">&laquo; <span class="week"></span></button>  <button class="weekly-next-week weekly-change-week-button" data-action="nextWeek"><span class="week"></span> &raquo;</button>  <button class="weekly-jump-today weekly-change-today-button" data-action="jumpToday">Today</button>  <div class="weekly-header"></div></div><div class="weekly-calendar">  <div class="weekly-days">  <% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day <% if (!canAdd(timef(\'%Y-%m-%d\', date))) { %>weekly-day-unavailable<% } else { %>weekly-day-available<% } %>" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%m-%d\', date) %>">      <%= timef(\'%D %m/%d\', date) %>    </div>  <% } %>  </div>  <div class="weekly-scroller">    <div class="weekly-times">    <% for (var i = 0; i < times.length; i++) { var time = times[i]; %>      <div class="weekly-time" data-time="<%= time %>"><%= time %></div>    <% } %>    </div>    <div class="weekly-grid">    <% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>      <div class="weekly-day <% if (!canAdd(timef(\'%Y-%m-%d\', date))) { %>weekly-unavailable<% } %>" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%m-%d\', date) %>">        <% for (var ii = 0; ii < times.length; ii++) { var time = times[ii]; %>          <div class="weekly-time" data-time="<%= time %>">&nbsp;</div>        <% } %>      </div>    <% } %>    </div>  </div></div>',
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

      this.oldDate = this.currentDate;

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

        if((!this.allowPastEventCreation && dateUtils.isPastDate(currentTarget.data('date'))) || !this.canAdd(currentTarget.data('date'))) {
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

        if((!this.allowPastEventCreation && dateUtils.isPastDate(target.data('date'))) || !this.canAdd(target.data('date'))) {
          return;
        }

        if($(event.target).is('.weekly-time,.weekly-day,.weekly-event-preview,.weekly-event-preview-time')) {
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

    setSelectableDates: function(dates, skipUpdate) {
      if (dates){
        //convert array of date objects to strings
        for (var i = 0, c = dates.length; i < c; i++) {
          if (typeof dates[i] == 'object') {
            dates[i] = dateFormat('%Y-%m-%d', dates[i]);
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
