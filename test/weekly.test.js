
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

      assert.equal(el.find('.weekly-today').length, 2);
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

    test('drag to create', function(done) {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
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
        currentDate: date
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      el.one('addEvent', function() {
        assert.equal(firstDate.find('.weekly-event-pending').length, 1);
        done();
      });

      firstDate.click();
    });

    test('readonly mode', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        readOnly: true
      });

      var firstDate = el.find('.weekly-grid .weekly-day').first();

      firstDate.click();

      assert.equal(firstDate.find('.weekly-event-pending').length, 0);
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

      var dates = dateUtils.getdateUtils(date, 1);
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

      var dates = dateUtils.getdateUtils(date, -1);
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

      var dates = dateUtils.getdateUtils(date, 0);
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
  });

  suite('splitEvent', function() {
    test('split time', function() {
      var event = {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 12, 0)
      };

      var el = $('.weekly').weekly({
        autoRender: false
      });

      var span = el.weekly('splitEvent', event);
      assert.equal(span instanceof Array, true);
      assert.equal(span.length, 3);
      assert.equal(typeof span[0], 'object');
      assert.equal(span[0].title, 'Test Event');
      assert.equal(span[0].start.getTime(), new Date(2013, 4, 13, 9, 0).getTime());
      assert.equal(span[0].end.getTime(), new Date(2013, 4, 13, 10, 0).getTime());
      assert.equal(span[1].title, 'Test Event');
      assert.equal(span[1].start.getTime(), new Date(2013, 4, 13, 10, 0).getTime());
      assert.equal(span[1].end.getTime(), new Date(2013, 4, 13, 11, 0).getTime());
      assert.equal(span[2].title, 'Test Event');
      assert.equal(span[2].start.getTime(), new Date(2013, 4, 13, 11, 0).getTime());
      assert.equal(span[2].end.getTime(), new Date(2013, 4, 13, 12, 0).getTime());
    });

  });

  suite('auto split', function() {
    test('auto split events by interval', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        autoSplit: true,
        currentDate: date
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 12, 0)
      });

      assert.equal(el.find('.weekly-event').length, 3);
    });

    test('pass in array of events', function() {

      var events = [{
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 12, 0)
      }, {
        title: 'Test Event 2',
        start: new Date(2013, 4, 13, 13, 0),
        end: new Date(2013, 4, 13, 15, 0)
      }];

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        autoSplit: true,
        currentDate: date
      });

      el.weekly('addEvent', events);

      assert.equal(el.find('.weekly-event').length, 5);

    });

    test('single event fire for one split event', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        autoSplit: true,
        currentDate: date
      });

      var count = 0;
      el.on('addEvent', function(e, data) {
        assert.equal(data instanceof Array, true);
        assert.equal(data.length, 3);
        count++;
      });

      el.weekly('addEvent', {
        title: 'Test Event',
        start: new Date(2013, 4, 13, 9, 0),
        end: new Date(2013, 4, 13, 12, 0)
      });

      assert.equal(count, 1);

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

});
