/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.0.1
 * https://github.com/jgallen23/weekly
 * copyright Greg Allen 2013
 * MIT License
*/
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
 * fidel - a ui view controller
 * v2.2.1
 * https://github.com/jgallen23/fidel
 * copyright JGA 2013
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

      return methodValue || els;
    };

    $.fn[name].defaults = obj.defaults || {};

  };

  $.Fidel = Fidel;
})(jQuery);

w.Fidel = Fidel;
})(window, window.jQuery || window.Zepto);

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

(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 8,
      endTime: 6,
      weekOffset: 0,
      currentDate: new Date(),
      autoRender: true,
      template: '<div class="weekly-days"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= date.getFullYear() %>-<%= date.getMonth() %>-<%= date.getDate() %>"><%= date.toDateString() %></div><% } %></div><div class="weekly-times"><% for (var i = 0; i < times.length; i++) { var time = times[i]; %>  <div class="weekly-time" data-time="<%= time %>"><%= time %></div><% } %></div><div class="weekly-grid"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= date.getFullYear() %>-<%= date.getMonth() %>-<%= date.getDate() %>">    <% for (var ii = 0; ii < times.length; ii++) { var time = times[ii]; %>      <div class="weekly-time" data-time="<%= time %>">&nbsp;</div>    <% } %>  </div><% } %></div>'
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
        if($(event.target).is('.weekly-time')) {
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
      }).append('<button data-action="removeEvent" class="weekly-delete">×</button><div class="weekly-event-title">' + startTime + '</div><div class="weekly-event-name">' + event.name + '</div><div class="weekly-event-desc">' + event.description + '</div>');

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
