suite('dates', function() {

  suite('#getFirstDayOfWeek', function() {
    test('date', function() {
      var date = new Date(2013, 4, 15);

      var first = dateUtils.getFirstDayOfWeek(date);
      assert.equal(first.toDateString(), 'Sun May 12 2013');
    });
    test('date + offset', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var first = dateUtils.getFirstDayOfWeek(date, 1);
      assert.equal(first.toDateString(), 'Sun May 19 2013');
    });
  });

  suite('#getLastDayOfWeek', function() {
    test('date', function() {
      var date = new Date(2013, 4, 15);

      var first = dateUtils.getLastDayOfWeek(date);
      assert.equal(first.toDateString(), 'Sat May 18 2013');
    });
    test('date + offset', function() {
      var date = new Date(2013, 4, 15);

      var el = $('.weekly').weekly({
        currentDate: date,
        autoRender: false
      });

      var first = dateUtils.getLastDayOfWeek(date, 1);
      assert.equal(first.toDateString(), 'Sat May 25 2013');
    });
  });


  suite('#getWeekSpan', function() {

    test('same month', function() {
      var date = new Date(2013, 4, 15);

      var span = dateUtils.getWeekSpan(date);
      assert.equal(span, 'May 12 - 18');
    });

    test('different month', function() {
      var date = new Date(2013, 4, 29);

      var span = dateUtils.getWeekSpan(date);
      assert.equal(span, 'May 26 - Jun 01');
    });

    test('offset', function() {
      var date = new Date(2013, 4, 15);

      var span = dateUtils.getWeekSpan(date, 1);
      assert.equal(span, 'May 19 - 25');
    });
  });

  suite('getdateUtils', function() {

    test('get dates in middle of month', function() {

      var date = new Date(2013, 4, 15);

      var dates = dateUtils.getdateUtils(date, 0);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 12 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 18 2013');
    });

    test('get dates in beginning of month', function() {

      var date = new Date(2013, 4, 1);

      var dates = dateUtils.getdateUtils(date, 0);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun Apr 28 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 04 2013');
    });


    test('get dates from a sunday', function() {

      var date = new Date(2013, 4, 5);

      var dates = dateUtils.getdateUtils(date, 0);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 05 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 11 2013');
    });

    test('get dates from a sat', function() {

      var date = new Date(2013, 4, 11);

      var dates = dateUtils.getdateUtils(date, 0);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 05 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 11 2013');
    });


    test('get dates end of month', function() {

      var date = new Date(2013, 4, 29);

      var dates = dateUtils.getdateUtils(date, 0);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 26 2013');
      assert.equal(dates[6].toDateString(), 'Sat Jun 01 2013');
    });

    test('take into consideration weekOffset', function() {

      var date = new Date(2013, 4, 29);

      var dates = dateUtils.getdateUtils(date, -1);
      assert.equal(dates.length, 7);
      assert.equal(dates[0].toDateString(), 'Sun May 19 2013');
      assert.equal(dates[6].toDateString(), 'Sat May 25 2013');

    });
  });

  suite('getTimes', function() {

    test('get times', function() {
      var times = dateUtils.getTimes(8, 6);

      assert.equal(times.length, 10);
      assert.equal(times[0], '8:00 AM');
      assert.deepEqual(times, ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']);
    });

    test('get times overriding start and end', function() {
      var times = dateUtils.getTimes(6, 3);

      assert.deepEqual(times, ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']);

    });

    test('get times overriding start and end', function() {
      var times = dateUtils.getTimes(0, 3);

      assert.deepEqual(times, ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']);

    });

  });
});
