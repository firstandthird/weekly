
suite('weekly', function() {

  beforeEach(function() {
    $('#fixture').html('<div class="weekly"></div>');
    $('.weekly').data('weekly', null);
  });

  suite('getDates', function() {

    test('get dates in middle of month', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 12 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 18 2013');
    });

    test('get dates in beginning of month', function() {

      var date = new Date(2013, 4, 1);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun Apr 28 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 04 2013');
    });


    test('get dates from a sunday', function() {

      var date = new Date(2013, 4, 5);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 05 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 11 2013');
    });

    test('get dates from a sat', function() {

      var date = new Date(2013, 4, 11);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 05 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 11 2013');
    });


    test('get dates end of month', function() {

      var date = new Date(2013, 4, 29);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 26 2013');
      assert.equal(dates[6].toDateString(), 'Sat Jun 01 2013');
    });

    test('take into consideration weekOffset', function() {

      var date = new Date(2013, 4, 29);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false,
        weekOffset: -1
      });

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 19 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 25 2013');

    });
  });

  suite('getTimes', function() {

    test('get times', function() {
      var el = $('.weekly').weekly({
        autoRender: false
      });

      var times = el.weekly('getTimes');

      assert.equal(times.length, 11);
      assert.equal(times[0], '8:00 AM');
      assert.deepEqual(times, ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']);
    });

    test('get times overriding start and end', function() {
      var el = $('.weekly').weekly({
        autoRender: false,
        startTime: 6,
        endTime: 3
      });

      var times = el.weekly('getTimes');

      assert.deepEqual(times, ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']);

    });
  });

  suite('render', function() {

    test('basic calendar rendered', function() {

      var el = $('.weekly').weekly();

      assert.equal(el.find('.days').length, 1);
      assert.equal(el.find('.times').length, 1);
      assert.equal(el.find('.grid').length, 1);

    });

  });

  suite('addEvent', function() {

    test('add basic event', function() {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      el.weekly('addEvent', {
        name: 'Test Event',
        start: new Date(2013, 4, 13, 9, 05),
        end: new Date(2013, 4, 13, 9, 45)
      });

      assert.equal(el.find('.event').length, 1);
    });

    test('addEvent triggerd', function(done) {

      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date
      });

      var firstDate = el.find('.grid .day').first();

      el.one('addEvent', function() {
        assert.equal(firstDate.find('.event').length, 1);
        done();
      });

      el.weekly('addEvent', {
        name: 'Test Event',
        start: new Date(2013, 4, 12, 9, 05),
        end: new Date(2013, 4, 12, 9, 45)
      });
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

      var firstDate = el.find('.grid .day').first();

      el.one('addEvent', function() {
        assert.equal(firstDate.find('.event-pending').length, 1);
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
  });

  suite('change date', function() {
    test('next week', function() {
      var date = new Date(2013, 4, 22);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      el.weekly('nextWeek');

      var dates = el.weekly('getDates');
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

      var dates = el.weekly('getDates');
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 26 2013');
      assert.equal(dates[6].toDateString(), 'Sat Jun 01 2013');
    });
  });
});
