
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

      assert.equal(el.find('table').length, 1);
      assert.equal(el.find('th').length, 8);
      assert.equal(el.find('tr').length, 12);

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
        date: new Date(2013, 4, 13, 4, 0)
      });
    });

  });
});
