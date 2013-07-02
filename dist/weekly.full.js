/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.0.11
 * https://github.com/jgallen23/weekly
 * copyright Greg Allen 2013
 * MIT License
*/
/*global jQuery */
/*!
* FitText.js 1.1
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
 * fidel - a ui view controller
 * v2.2.2
 * https://github.com/jgallen23/fidel
 * copyright Greg Allen 2013
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
    this.delegateEvents();
    this.dataElements();
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
    var self = this;
    if (!this.events)
      return;
    for (var key in this.events) {
      var methodName = this.events[key];
      var match = key.match(this.eventSplitter);
      var eventName = match[1], selector = match[2];

      var method = this.proxy(this[methodName]);

      if (selector === '') {
        this.el.on(eventName, method);
      } else {
        if (this[selector] && typeof this[selector] != 'function') {
          this[selector].on(eventName, method);
        } else {
          this.el.on(eventName, selector, method);
        }
      }
    }
  };

  Fidel.prototype.delegateActions = function() {
    var self = this;
    self.el.on('click', '[data-action]', function(e) {
      var el = $(this);
      var action = el.attr('data-action');
      if (self[action]) {
        self[action](e, el);
      }
    });
  };

  Fidel.prototype.on = function(eventName, cb) {
    this.el.on(eventName+'.fidel'+this.id, cb);
  };

  Fidel.prototype.one = function(eventName, cb) {
    this.el.one(eventName+'.fidel'+this.id, cb);
  };

  Fidel.prototype.emit = function(eventName, data, namespaced) {
    var ns = (namespaced) ? '.fidel'+this.id : '';
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
    this.el.unbind('.fidel'+this.id);
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
 * v0.2.1
 * https://github.com/jgallen23/fidel-template
 * copyright Greg Allen 2013
 * MIT License
*/

(function(Fidel) {
  Fidel.template = template.noConflict();

  Fidel.prototype.render = function(data) {
    var tmpl = (this.template) ? this.template : $('#'+this.templateId).html();
    this.el.html(Fidel.template(tmpl, data));
  };
})(window.Fidel);

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
          return time.getHours() > 12 ? time.getHours() -12 : time.getHours();
        case '%G':
        return time.getHours();
        case '%h':
          return ("0" + (time.getHours() > 12 ? time.getHours() -12 : time.getHours())).substr(-2,2);
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
  };

  TimeFormat.noConflict = function() {
    w.TimeFormat = oldRef;
    return TimeFormat;
  };

  w.TimeFormat = TimeFormat;

})(window);
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
    getdateUtils: function(date, weekOffset) {
      var daysInWeek = 7;

      var days = [];
      var sunday = this.getFirstDayOfWeek(date, weekOffset);

      for (var i = 0, c = daysInWeek; i < c; i++) {
        var d = new Date(sunday.getTime());
        d.setDate(d.getDate() - d.getDay() + i);
        days.push(d);
      }
      return days;
    },
    getTimes: function(startTime, endTime) {
      var end = endTime + 12;

      var times = [];
      for (var i = startTime; i <= end; i++) {
        var hour = (i > 12) ? i - 12 : i;
        var timeString = hour+':00 ';

        timeString += (i > 11) ? 'PM' : 'AM';

        times.push(timeString);
      }

      return times;
    },
    getWeekSpan: function(date, offset) {
      var first = this.getFirstDayOfWeek(date, offset);
      var last = this.getLastDayOfWeek(date, offset);

      var span = TimeFormat('%M %d', first) + ' - ';
      if (first.getMonth() == last.getMonth()) {
        span += TimeFormat('%d', last);
      } else {
        span += TimeFormat('%M %d', last);
      }
      return span;
    }
  };

  w.dateUtils = dateUtils;
})(window);
(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 8,
      endTime: 6,
      weekOffset: 0,
      currentDate: new Date(),
      autoRender: true,
      fitText: true,
      fitTextMin: 11,
      fitTextMax: 15,
      template: '<div class="weekly-time-navigation">  <button class="weekly-previous-week weekly-change-week-button" data-action="prevWeek">&laquo; <span class="week"></span></button>  <button class="weekly-next-week weekly-change-week-button" data-action="nextWeek"><span class="week"></span> &raquo;</button>  <button class="weekly-jump-today weekly-change-today-button" data-action="jumpToday">Today</button>  <div class="weekly-header"></div></div><div class="weekly-days"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%n-%j\', date) %>">    <%= timef(\'%D %m/%d\', date) %>  </div><% } %></div><div class="weekly-times"><% for (var i = 0; i < times.length; i++) { var time = times[i]; %>  <div class="weekly-time" data-time="<%= time %>"><%= time %></div><% } %></div><div class="weekly-grid"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%n-%j\', date) %>">    <% for (var ii = 0; ii < times.length; ii++) { var time = times[ii]; %>      <div class="weekly-time" data-time="<%= time %>">&nbsp;</div>    <% } %>  </div><% } %></div>',
      readOnly: false,
      enableResize: true,
      autoSplit: false
    },

    init: function() {
      this.events = [];

      if (this.autoRender) {
        this.update();
      }
    },

    update: function() {
      var data = {
        timef: TimeFormat,
        getWeekSpan: dateUtils.getWeekSpan,
        currentDate: this.currentDate,
        dates: dateUtils.getdateUtils(this.currentDate, this.weekOffset),
        times: dateUtils.getTimes(this.startTime, this.endTime)
      };
      this.render(data);

      for(var i = 0, c = this.events.length; i < c; i++) {
        this.renderEvent(this.events[i]);
      }

      this.timeDifference = (this.endTime + 13) - this.startTime;

      if(!this.readOnly) {
        this.registerClickToCreate();
        this.registerModifyEvent();
      }

      this.highlightToday();

      if(!this.weekOffset) {
        this.el.find(".weekly-change-today-button").css('display', 'none');
      } else {
        this.el.find(".weekly-change-today-button").css('display', 'block');
      }

      this.el.find('.weekly-time-navigation .weekly-previous-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset - 1));
      this.el.find('.weekly-time-navigation .weekly-next-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset + 1));

      this.el.find('.weekly-time-navigation .weekly-header').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset));

      if (this.fitText) {
        this.el.find(".weekly-days .weekly-day, .weekly-times .weekly-time").fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }
      this.emit('weekChange', { dates: data.dates, times: data.times });
    },

    highlightToday: function() {
      var today = new Date();

      this.el.find('[data-date="' + TimeFormat('%Y-%n-%j', today) + '"]').addClass('weekly-today');
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.weekly-grid .weekly-day');

      // Make sure anything previously bound is bound no more.
      gridDays.unbind('mousedown mousemove mouseup mouseout click');

      gridDays.on('mousedown', this.proxy(function(event){
        if(event.which !== 1 || $(event.target).is('.weekly-dragger')) return;
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
        if($(event.target).is('.weekly-time,.weekly-day')) {
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

    modifyEvent: function(event) {
      var target = this.currentDragger.parents('.weekly-event');
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);

      var tempEnd = Math.ceil(mouseOffsetTop / hourHeight) * hourHeight;

      if(tempEnd < (targetOffset.top + dayHeight)) {
        target.css({
          bottom: dayHeight - tempEnd
        });
      }

      var duration = target.outerHeight() / hourHeight;
      var end = new Date(target.data('start'));
      end.setHours(end.getHours() + duration);
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

      this.update();
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
      }).append([
        '<button data-action="removeEvent" class="weekly-delete">×</button>',
        '<div class="weekly-event-title">' + TimeFormat('%g:%i %a', event.start) + ' -<br>' + TimeFormat('%g:%i %a', event.end) + '</div>',
        '<div class="weekly-event-name">' + event.name + '</div>',
        '<div class="weekly-event-desc">' + event.description + '</div>',
        '<div class="weekly-dragger"></div>'
      ].join(''));

      if (!this.enableResize) {
        eventTemplate.find('.weekly-dragger').remove();
      }

      var selectedDay = this.el.find('.weekly-grid .weekly-day[data-date="' + startDate + '"]');

      selectedDay.append(eventTemplate);

      if (this.fitText) {
        selectedDay.find(".weekly-event").fitText(1, {
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

    getTimeOffsetPercent: function(time) {
      time = this.toFraction(time) - this.startTime;

      var diff = this.timeDifference - time;

      if(diff < 0) {
        diff = time - this.timeDifference;
      }

      var percent = (diff / this.timeDifference) * 100;

      return percent;
    },

    splitEvent: function(event) {
      var diff = event.end.getTime() - event.start.getTime();
      var hour = 60 * 60 * 1000;
      var count = Math.ceil(diff / hour); //divide by 1 hour
      var startTime = event.start.getTime();
      var events = [];
      for (var i = 0; i < count; i++) {
        var newEvent = $.extend({}, event); //clone event
        newEvent.start = new Date(startTime + (hour * i));
        newEvent.end = new Date(startTime + (hour * (i+1)));
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
          name: '',
          description: '',
          start: null,
          end: null
        }, e);

        e._index = this.events.length;

        this.renderEvent(e);
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
    }
  });

})(jQuery);
