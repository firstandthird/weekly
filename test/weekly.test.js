Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};


suite('weekly', function() {

  beforeEach(function() {
    $('#fixture').html('<div class="weekly"></div>');
    $('.weekly').data('weekly', null);
  });

  suite('render', function() {

    test('basic calendar rendered', function() {

      var el = $('.weekly').weekly();

      assert.equal(el.find('.weekly-days').length, 1);
      assert.equal(el.find('.weekly-times').length, 1);
      assert.equal(el.find('.weekly-grid').length, 1);

    });

    test('highlight current date', function() {
      var el = $('.weekly').weekly();
      var today = new Date();

      assert.equal(el.find('.weekly-grid .weekly-today').length, 1);
      assert.equal(el.find('.weekly-days .weekly-today').length, 1);
    });

    test('weekSpan updates on prev', function() {
      var date = new Date(2013, 5, 5);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('prevWeek');

      assert.equal(dateUtils.getWeekSpan(date, -1), el.find('.weekly-header').html());
    });

    test('weekSpan updates on next', function() {
      var date = new Date(2013, 5, 5);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('nextWeek');

      assert.equal(dateUtils.getWeekSpan(date, 1), el.find('.weekly-header').html());
    });

    test('enableResize', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        enableResize: false
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event').length, 1);
      assert.equal(el.find('.weekly-dragger').length, 0);
    });

    test('enableDelete', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        enableDelete: false
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event').length, 1);
      assert.equal(el.find('.weekly-delete').length, 0);
    });

    test('readOnly - no close or resize', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        readOnly: true
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event').length, 1);
      assert.equal(el.find('.weekly-delete').length, 0);
      assert.equal(el.find('.weekly-dragger').length, 0);
    });

    test('populate title', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event-title').html(), 'Test Event');

    });

    test('add class for event type', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        type: 'test',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event-test').length, 1);

    });

    test('add class for event type (with spaces)', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        type: 'testing types',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event-testing-types').length, 1);

    });

    test('allowPreviousWeeks: true', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date
      });

      assert.equal(el.find('.weekly-previous-week').length, 1);
    });

    test('allowPreviousWeeks: false', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPreviousWeeks: false
      });

      assert.equal(el.find('.weekly-previous-week').length, 0);
    });

    test('allowPreviousWeeks: false, not current week', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPreviousWeeks: false
      });
      el.weekly('nextWeek');

      assert.equal(el.find('.weekly-previous-week').length, 1);
    });

    test('showToday: true', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date
      });
      el.weekly('nextWeek');

      assert.equal(el.find('.weekly-jump-today').length, 1);
      assert.equal(el.find('.weekly-jump-today').css('display'), 'block');

    });

    test('showToday: false', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date,
        showToday: false
      });
      el.weekly('nextWeek');

      assert.equal(el.find('.weekly-jump-today').css('display'), 'none');

    });

    test('endTime', function() {

      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date,
        endTime: 8
      });

      assert.equal(el.find('[data-time="7:00 PM"]').length, 8);
      assert.equal(el.find('[data-time="8:00 PM"]').length, 0);

    });

    test('startTimeScrollOffset', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        currentDate: date
      });

      var scroll = el.find('.weekly-scroller').scrollTop();
      //assert.notEqual(scroll, 0);

    });
  });

  suite('addEvent', function() {

    test('add basic event', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event').length, 1);
    });

    test('add basic events', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', [{
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      },{
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      }]);

      assert.equal(el.find('.weekly-event').length, 2);
    });

    test('addEvent triggered', function(done) {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function(e, evt) {
        assert.equal(evt.title, 'Test Event');
        assert.equal(firstDate.find('.weekly-event').length, 1);
        done();
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 12, 9, 05),
        end: new Date(2013, 4, 12, 9, 45)
      });
    });

    test('remove basic event', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.weekly-event').length, 1);

      el.find('.weekly-event .weekly-delete').click();

      assert.equal(el.find('.weekly-event').length, 0);
    });

    test('remove basic events', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', [{
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      },{
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      }]);

      assert.equal(el.find('.weekly-event').length, 2);

      el.weekly('clearEvents');

      assert.equal(el.find('.weekly-event').length, 0);
    });

    test('removeEvent triggered', function(done) {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('removeEvent', function() {
        assert.equal(firstDate.find('.weekly-event').length, 0);
        done();
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 12, 9, 05),
        end: new Date(2013, 4, 12, 9, 45)
      });

      el.find('.weekly-event .weekly-delete').click();
    });

    test('convert time to fraction', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      assert.equal(el.weekly('toFraction', "8:30"), 8.5);
      assert.equal(el.weekly('toFraction', "8:00"), 8);
      assert.equal(el.weekly('toFraction', "8"), 8);
    });

    test('convert decimal to minutes', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      assert.equal(el.weekly('fromDecimal', 0.50), 30);
      assert.equal(el.weekly('fromDecimal', 0.75), 45);
      assert.equal(el.weekly('fromDecimal', 0.25), 15);
      assert.equal(el.weekly('fromDecimal', 1.00), 0);
      assert.equal(el.weekly('fromDecimal', 3.50), 30);
    });

    test('drag to create', function(done) {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function() {
        assert.equal(firstDate.find('.weekly-event-pending').length, 1);
        done();
      });

      firstDate.simulate('mousedown');

      firstDate.simulate('mousemove', {
        handle: 'center',
        dx: 1,
        dy: 100
      });

      firstDate.simulate('mouseup');
    });

    test('click to create', function(done) {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function(e, evt) {
        assert.equal(evt.start.toISOString(), '2013-05-12T07:00:00.000Z');
        assert.equal(firstDate.find('.weekly-event-pending').length, 1);
        done();
      });

      firstDate.click();
    });

    test('create event a week out', function(done) {
      var el = $('.weekly').weekly();

      el.weekly('nextWeek');

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function() {
        assert.equal(firstDate.find('.weekly-event').length, 1);
        done();
      });

      firstDate.click();
    });

    test('readonly mode', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true,
        readOnly: true
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      firstDate.click();

      assert.equal(firstDate.find('.weekly-event').length, 0);
    });

    test('set readonly from method', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true
      });

      el.weekly('setReadOnly', true);

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      firstDate.click();

      assert.equal(firstDate.find('.weekly-event').length, 0);
    });

    test.skip('if readonly, no delete or resize', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 12, 9, 05),
        end: new Date(2013, 4, 12, 9, 45)
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      assert.equal(firstDate.find('.weekly-event').length, 1);
      assert.equal(firstDate.find('.weekly-dragger').length, 1);
      assert.equal(firstDate.find('.weekly-delete').length, 1);

      el.weekly('setReadOnly', true);

      assert.equal(firstDate.find('.weekly-event').length, 1);
      assert.equal(firstDate.find('.weekly-dragger').length, 0);
      assert.equal(firstDate.find('.weekly-delete').length, 0);

      el.weekly('setReadOnly', false);

      assert.equal(firstDate.find('.weekly-event').length, 1);
      assert.equal(firstDate.find('.weekly-dragger').length, 1);
      assert.equal(firstDate.find('.weekly-delete').length, 1);
    });

    test('don\'t render event outside of time range', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        startTime: 8,
        endTime: 6
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 7),
        end: new Date(2013, 4, 13, 8)
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 18),
        end: new Date(2013, 4, 13, 19)
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 8),
        end: new Date(2013, 4, 13, 9)
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 17),
        end: new Date(2013, 4, 13, 18)
      });

      assert.equal(el.find('.weekly-event').length, 2);
      var inst = el.data('weekly');
      assert.equal(inst.events.length, 4);

    });

    test('event ending at midnight should display correctly.', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 22, 0),
        end: new Date(2013, 4, 14, 0, 0)
      });

      assert.equal(el.find('.weekly-event').css('bottom'), '0%');
    });

    test('events created after timezone change should have correct time', function(){
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      var offset = (date.dst()) ? -5 : -6;

      el.weekly('setTimezoneOffset', offset);

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 8, 0),
        end: new Date(2013, 4, 13, 9, 0)
      });

      assert.equal(10, el.find('.weekly-event').data('offset-start').getHours());
      assert.equal(11, el.find('.weekly-event').data('offset-end').getHours());
    });

    test('click event render in correct place with timezone offset', function(done) {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true
      });

      var offset = (date.dst()) ? -2 : -3;

      el.weekly('setTimezoneOffset', offset);

      var timeBlock = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function(e, event) {
        assert.equal(event.start.getHours(), 19);
        done();
      });

      timeBlock.click();

    });

    test('if >30 min event, don\'t show time', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 10, 0)
      });

      assert.equal(el.find('.weekly-event').length, 1);
      assert.equal(el.find('.weekly-event-time').css('display'), 'block');
    });

    test('if 30 min event, don\'t show time', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 9, 30)
      });

      assert.equal(el.find('.weekly-event').length, 1);
      assert.equal(el.find('.weekly-event-time').css('display'), 'none');
    });

    test('if 30 min event and no title, show time', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 9, 30)
      });

      assert.equal(el.find('.weekly-event').length, 1);
      assert.equal(el.find('.weekly-event-time').css('display'), 'block');
    });

    test.skip('if click right on hour line, event should still be one interval high', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: true,
        interval: 30
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function(event, data) {
        setTimeout(function(){
          assert.equal(firstDate.find('.weekly-event').outerHeight(), 1);
          done();
        }, 100);
      });

      firstDate.simulate('mousedown');

      firstDate.simulate('mousemove', {
        handle: 'corner',
        dx: 0,
        dy: 0
      });

      firstDate.simulate('mouseup');
    });

  });

  suite('modify event', function() {
    test('drag to modify', function(done) {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', [{
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      }]);

      var firstDate = el.find('.weekly-grid .weekly-event').first().parents('.weekly-day');
      var dragger = firstDate.find('.weekly-dragger');

      el.one('modifyEvent', function(event, data) {
        assert.equal(typeof data, 'object');
        done();
      });

      dragger.simulate('mousedown');

      firstDate.simulate('mousemove', {
        handle: 'center',
        dx: 1,
        dy: 100
      });

      firstDate.simulate('mouseup');
    });
  });

  suite('change date', function() {
    test('next week', function() {
      var date = new Date(2013, 4, 22);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('nextWeek');

      var dates = dateUtils.getDates(date, 1);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 26 2013');
      assert.equal(dates[6].toDateString(), 'Sat Jun 01 2013');
    });

    test('prev week', function() {
      var date = new Date(2013, 5, 5);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('prevWeek');

      var dates = dateUtils.getDates(date, -1);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 26 2013');
      assert.equal(dates[6].toDateString(), 'Sat Jun 01 2013');
    });

    test('today', function() {
      var date = new Date(2013, 5, 5);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('prevWeek');

      el.weekly('jumpToday');

      var dates = dateUtils.getDates(date, 0);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun Jun 02 2013');
      assert.equal(dates[6].toDateString(), 'Sat Jun 08 2013');
    });

    test('today button should only show when not today', function() {
      var date = new Date(2013, 5, 5);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('prevWeek');

      assert.equal(el.find('.weekly-change-today-button').css('display'), 'block');

      el.weekly('jumpToday');

      assert.equal(el.find('.weekly-change-today-button').css('display'), 'none');
    });

    test('weekChange should fire on init', function(done) {
      var date = new Date(2013, 5, 5);

      $('.weekly')
        .on('weekChange', function(e, data) {
          assert.equal(typeof data, 'object');
          assert.equal(data.dates instanceof Array, true);
          assert.equal(data.times instanceof Array, true);
          done();
        })
        .weekly({
          currentDate: date
        });
    });

    test('weekChange should fire when the dates have changes', function(done) {
      var date = new Date(2013, 5, 5);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.on('weekChange', function(e, data) {
        assert.equal(typeof data, 'object');
        assert.equal(data.dates instanceof Array, true);
        assert.equal(data.times instanceof Array, true);
        done();
      });

      el.weekly('prevWeek');

    });

    suite('#jumpTo', function() {
      test('jumpTo week', function(done) {

        var date = new Date(2013, 5, 5);

        var el = $('.weekly').weekly({
          currentDate: date
        });

        el.on('weekChange', function(ev, data) {
          assert.equal(data.dates[0].toDateString(), 'Sun Oct 27 2013');
          done();
        });

        el.weekly('jumpTo', new Date(2013, 9, 28));

      });

      test('jumpTo day', function(done) {

        var date = new Date(2013, 5, 5);

        var el = $('.weekly').weekly({
          currentDate: date,
          todayFirst: true
        });

        el.on('weekChange', function(ev, data) {
          assert.equal(data.dates[0].toDateString(), 'Mon Oct 28 2013');
          done();
        });

        el.weekly('jumpTo', new Date(2013, 9, 28));

      });

      test('jumpTo christmas', function(done) {

        var date = new Date(2013, 9, 27);

        var el = $('.weekly').weekly({
          //currentDate: date,
          todayFirst: true
        });

        el.on('weekChange', function(ev, data) {
          assert.equal(data.dates[0].toDateString(), 'Wed Dec 25 2013');
          done();
        });

        el.weekly('jumpTo', new Date(2013, 11, 25));

      });
    });

  });

  suite('triggered events', function() {

    test('eventClick when clicking on an event', function(done) {
      
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      var ev = el.find('.weekly-event');
      el.on('eventClick', function(e, evt, el) {
        assert.equal(el.hasClass('weekly-event'), true);
        assert.equal(evt.title, 'Test Event');
        done();
      });
      ev.click();
    });
    
  });

  suite('change timezone', function(){

    test('positive utc offset', function(){
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 1, 0),
        end: new Date(2013, 4, 13, 2, 0)
      });

      var offset = (date.dst()) ? 1 : 0;

      el.weekly('setTimezoneOffset', offset);

      assert.equal(9, el.find('.weekly-event').data('offset-start').getHours());
      assert.equal(10, el.find('.weekly-event').data('offset-end').getHours());
    });

    test('negative utc offset', function(){
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 8, 0),
        end: new Date(2013, 4, 13, 9, 0)
      });


      var offset = (date.dst()) ? -5 : -6;

      el.weekly('setTimezoneOffset', offset);

      assert.equal(10, el.find('.weekly-event').data('offset-start').getHours());
      assert.equal(11, el.find('.weekly-event').data('offset-end').getHours());
    });

    test('updating timezone should not call weekChange', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.on('weekChange', function() {
        assert.equal(false, true);
      });

      el.weekly('setTimezoneOffset', -5);

    });

  });

  suite('allowPastEventCreation', function(){
    test('past events should not be allowed to be created', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowPastEventCreation: false
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first().click();
      assert.equal(firstDate.find('.weekly-event-pending').length, 0);
    });
  });

  suite('day offset', function(){
    test('todayFirst should set dayOffset to current day of the week index', function() {
      var date = new Date();

      var el = $('.weekly').weekly({
        todayFirst: true
      });

      assert.equal(date.getDay(), el.weekly('get', 'dayOffset'));
    });

    test('todayFirst should start week on today', function(){
      var date = new Date(2013, 7, 23);

      var el = $('.weekly').weekly({
        currentDate: date,
        todayFirst: true
      });

      var firstDay = el.find('.weekly-days .weekly-day').first().data('date');

      // There is an issue with how month dates are displayed in the template
      // They start at 0, which makes it one off.
      assert.equal(firstDay, '2013-08-23');
    });
  });

  suite('weekends', function(){
    test('weekends should have a class', function(){
      var el = $('.weekly').weekly();

      assert.equal($('.weekly-weekend').length, 2);
    });
  });

  suite('special timezones', function(){
    test(':30 timezones', function(){
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 1, 0),
        end: new Date(2013, 4, 13, 2, 0)
      });

      el.weekly('setTimezoneOffset', 9.5);
      
      if(date.dst()) {
        assert.equal(17, el.find('.weekly-event').data('offset-start').getHours());
      } else {
        assert.equal(18, el.find('.weekly-event').data('offset-start').getHours());
      }
  
      assert.equal(30, el.find('.weekly-event').data('offset-start').getMinutes());

      if(date.dst()) {
        assert.equal(18, el.find('.weekly-event').data('offset-end').getHours());
      } else {
        assert.equal(19, el.find('.weekly-event').data('offset-end').getHours());
      }

      assert.equal(30, el.find('.weekly-event').data('offset-end').getMinutes());
    });

    test(':45 timezones', function(){
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 1, 0),
        end: new Date(2013, 4, 13, 2, 0)
      });

      el.weekly('setTimezoneOffset', 9.75);

      if(date.dst()) {
        assert.equal(17, el.find('.weekly-event').data('offset-start').getHours());
      } else {
        assert.equal(18, el.find('.weekly-event').data('offset-start').getHours());
      }

      assert.equal(45, el.find('.weekly-event').data('offset-start').getMinutes());
      
      if(date.dst()) {
        assert.equal(18, el.find('.weekly-event').data('offset-end').getHours());
      } else {
        assert.equal(19, el.find('.weekly-event').data('offset-end').getHours());
      }

      assert.equal(45, el.find('.weekly-event').data('offset-end').getMinutes());
    });
  });

  suite('overlap', function() {
    test('events shouldn\'t overlap', function(){
      var date = new Date(2014, 1, 1);

      var el = $('.weekly').weekly({
        currentDate: date,
        allowOverlap: false
      });

      el.weekly('addEvent', {
        title: 'event 1',
        start: new Date(2014, 1, 1, 1, 0),
        end: new Date(2014, 1, 1, 2, 0)
      });

      el.weekly('addEvent', {
        title: 'event 2',
        start: new Date(2014, 1, 1, 1, 30),
        end: new Date(2014, 1, 1, 2, 30)
      });

      el.weekly('addEvent', {
        title: 'event 3',
        start: new Date(2014, 1, 1, 2, 0),
        end: new Date(2014, 1, 1, 3, 30)
      });

      el.weekly('addEvent', {
        title: 'event 4',
        start: new Date(2014, 1, 1, 0, 0),
        end: new Date(2014, 1, 1, 4, 30)
      });

      el.weekly('addEvent', {
        title: 'event 5',
        start: new Date(2014, 1, 1, 1, 0),
        end: new Date(2014, 1, 1, 2, 0)
      });

      assert.equal(2, el.find('.weekly-event').length);
    });
  });

  suite('Select certain days', function () {
    test('Using an array as value of selectableDates should add a canAdd function that is an indexOf of that array', function () {
      var el = $('.weekly').weekly({
        selectableDates : ['foo', 'bar']
      });
      var weekly = el.data('weekly');

      assert.equal(weekly.canAdd('foo'), true);
      assert.equal(weekly.canAdd('bar'), true);
      assert.equal(weekly.canAdd('baz'), false);
    });
    test('Using a function as value of selectableDate should use the function to determine if the day can be added or not', function () {
      var calledCount = 0;
      var mock = function (date) {
        calledCount++;
        return true;
      };

      var el = $('.weekly').weekly({
        selectableDates : mock
      });
      var weekly = el.data('weekly');

      assert.equal(calledCount, 7);
    });

    test('allow date objects to be used', function() {
      var d = new Date(2014, 7, 14);
      var el = $('.weekly').weekly({
        selectableDates : [d]
      });
      var weekly = el.data('weekly');

      assert.equal(weekly.canAdd('2014-08-14'), true);
    });

    test('test ui', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        selectableDates: [new Date()],
        allowPastEventCreation: true
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function(e, evt) {
        throw new Error('should not be called');
      });

      firstDate.click();
    });

    test('should add a weekly-unavailble class to dates that aren\'t selectable', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        selectableDates: [date],
        allowPastEventCreation: true
      });

      assert.equal($('[data-date=2013-05-15]').hasClass('weekly-unavailable'), false);
      assert.equal($('[data-date=2013-05-16]').hasClass('weekly-unavailable'), true);
    });


  });
});
