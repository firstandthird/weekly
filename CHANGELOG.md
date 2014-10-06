
0.4.0 / 2014-10-06 
==================

  * add weekly-day-available and weekly-day-unavailable to weekly-days element

0.3.3 / 2014-09-02 
==================

  * factor in .5 in timezone offset
  * updated connect config

0.3.2 / 2014-08-13 
==================

  * change logic for checking if dates
  * [mobile] dummy function for setSelectableDates

0.3.1 / 2014-08-13 
==================

  * call this.update when setting selectableDates
  * fixed test

0.3.0 / 2014-08-12 
==================

  * added weekly-unavailable class to days that can't be selected
  * added a ui test for selectableDates
  * allow native date objects to be passed to selectableDates

0.2.0 / 2014-08-12 
==================

  * added selectable dates example
  * removed console.log
  * jshint stuff
  * added setter for selectable dates
  * updated datefmt lib
  * changed date format to be %Y-%m-%d
  * tests: console.log to terminal

0.1.0 / 2014-08-06 
==================

  * Add option for selectable dates

0.0.50 / 2014-03-21 
==================

  * overlap: false.
  * Added day to header on mobile.
  * passing tests that failed due to dst change.

0.0.49 / 2014-03-06 
==================

  * Fixed timezone offset bug.

0.0.48 / 2014-03-02 
==================

  * Updated jquery path.
  * Disabled readonly and tweaked styles.
  * mobile lib

0.0.47 / 2014-02-05 
==================

  * Added support for Date() in scrollFirstEvent and fixed date parse issue.
  * Adds ability to scroll to first event on a given date (or every date).
  * Switched out Timeformat to use dateFormat from bower.
  * Merge pull request #14 from firstandthird/feature/10-working-tests
  * Fixed tests around timezone changes.

0.0.46 / 2013-11-18 
==================

 * Merge pull request #13 from firstandthird/feature/12-highlight-day-label
 * Highlights day label.

0.0.45 / 2013-11-07 
==================

  * Merge pull request #11 from firstandthird/feature/class-weekend
  * Add class to weekends.

0.0.44 / 2013-11-05 
==================

  * Fix for clicking right on an hour divider line creating weird events.

0.0.43 / 2013-10-28 
==================

  * removed console.log

0.0.42 / 2013-10-27 
==================

  * added jumpTo method
  * updated build scripts

0.0.41 / 2013-10-25 
==================

  * IE8 support for time format lib
  * added other tests to mocha

0.0.40 / 2013-10-21 
==================

  * don't change resize and delete on change readonly
  * split up scripts in test/index.html for code coverage

0.0.39 / 2013-10-17 
==================

  * remove auto split code.  fixes #6
  * added template2js to watch
  * if 30 min event and has title, don't show time. fixes #7
  * build full version on watch
  * updated build scripts

0.0.38 / 2013-10-08 
==================

  * added setReadOnly method
  * updated grunt to just run default on watch
  * few changes to the build scripts
  * updated to use load-grunt-config

0.0.37 / 2013-10-02 
==================

  * added setSplitInterval method

0.0.36 / 2013-10-02 
==================

  * added property to set autoSplitInterval independant from interval
  * updated example to toggle autosplit
  * method to setAutoSplit

0.0.35 / 2013-09-27 
==================

  * fixed split event to support interval
  * Added ability to pass in interval.

0.0.34 / 2013-09-26 
==================

  * tweaked layout of delete button
  * added livereload to grunt-connect
  * Killed plato (hehe).
  * Updated tests files.
  * Added test for fromDecimal
  * Allows events to be created in 30 minute intervals.
  * Tweaked time border colors.
  * Added half hour guides.
  * load-grunt-tasks and bower ignore

0.0.33 / 2013-09-05 
==================

  * Fixed isPastDate

0.0.32 / 2013-08-29 
==================

  * moved livereload option to the top
  * don't return time when calling getDates()
  * renamed getdateUtils to getDates

0.0.31 / 2013-08-26 
==================

  * fixed tests
  * Added support to start the week on any given week offset (0-6) or today.

0.0.30 / 2013-08-21 
==================

  * Fixed issue when mouseDown would be set too early. Also added check for clicking on close button.

0.0.29 / 2013-08-20 
==================

  * Merge branch 'feature/create-previous-events'
  * updated build
  * Added option to disable/enable creating past events.

0.0.28 / 2013-08-19 
==================

  * updated to use bower 1.0

0.0.27 / 2013-08-09 
==================

  * updated timezone should not trigger weekchange
  * [grunt] don't run default on dev
  * addEvent shouldn't offset time

0.0.26 / 2013-08-07 
==================

  * Merge remote-tracking branch 'origin/bug/time-display-midnight'
  * Merge remote-tracking branch 'origin/feature/timezoneOffset'
  * removed moment-timezone from exclude
  * Fixed problem with midnight display.
  * Fixed issue with new events being offset when they didn't need to be.

0.0.25 / 2013-08-06 
==================

  * Merge branch 'feature/timezoneOffset'
  * Updated setTimezoneOffset to actually work correctly and not just offset everything.
  * added timezone dropdown to example
  * First version of timezone support.

0.0.24 / 2013-08-05 
==================

  * grunt connect to allow connections from anywhere
  * tweaks to ui to fix scrollbar offset issue
  * fixed display in firefox
  * updated style for delete x

0.0.23 / 2013-08-02 
==================

  * Merge remote-tracking branch 'origin/bug/scheduling-last-time'
  * Fixed issue with months being one off.
  * Fixed rendering bug if event ends at midnight.

0.0.22 / 2013-07-31 
==================

  * fixed start time of 0

0.0.21 / 2013-07-28 
==================

  * Merge branch 'feature/scroll-times'
  * added startTimeScrollOffset option
  * [example] updated to end at midnight
  * [grunt] run default on dev
  * Updated example.
  * Added scroller around times and grid with option in theme mixin.

0.0.20 / 2013-07-22 
==================

  * add event to events[] even if outside bounds

0.0.19 / 2013-07-22 
==================

  * fixed for including the hour after the endTime

0.0.18 / 2013-07-22 
==================

  * don't render times outside of startTime and endTime
  * added showToday option to not show today button

0.0.17 / 2013-07-17 
==================

  * added border around calendar, added option for eventSpacing

0.0.16 / 2013-07-17 
==================

  * fixed delete button location

0.0.15 / 2013-07-16 
==================

  * option to allowPreviousWeeks which hides the previous week button
  * make delete button bigger

0.0.14 / 2013-07-12 
==================

  * if event has a type attribute, add weekly-event-[type] class
  * test for populating title
  * changed name to title
  * added showing of event title

0.0.13 / 2013-07-09 
==================

  * added time.js to build
  * removed reloadr, added livereload option to watch

0.0.12 / 2013-07-08 
==================

  * added event trigger when clicking on an event
  * added enableDelete.  if readOnly, set enableDelete and enableResize to false
  * Renamed Dates to dateUtil.
  * Added Dates lib and tests. Updated weekly to reflect these changes.
  * Removed time lib from dist directory.
  * Changed weekly over to use new TimeFormat library.
  * Added TimeFormat library & tests.

0.0.11 / 2013-07-01 
==================

  * option to disable resize
  * added autoSplit option to automatically split events into hour intervals

0.0.10 / 2013-06-24 
==================

  * Added readonly mode + test.
  * Basic test for draf to modify.
  * Finished drag to modify event.

0.0.9 / 2013-06-20 
==================

  * fixed issue where tests weren't running on 2nd save of test files
  * added weekChange event

0.0.8 / 2013-06-18 
==================

  * updated example
  * changed clearedEvents to clearEvents
  * changed .id to ._index so .id can be used for fetching from db

0.0.7 / 2013-06-18 
==================

  * set background color for weekly-dragger based on eventColor
  * option for min/max for fitText

0.0.6 / 2013-06-18 
==================

  * WIP - Drag to modify event.
  * Font sizes are a little more reasonable.
  * Added dates to next/previous buttons.
  * Event time now wraps.
  * Updated header week on prev/next.

0.0.5 / 2013-06-11 
==================

  * update to user concat-bower

0.0.4 / 2013-06-11 
==================

  * Hides today button when on today + tests.
  * Added jump to today method and added test.
  * Changed changeWeek methods to use weekOffset.
  * Actually fized timezone offset test.
  * Fixed breaking time test.
  * Fixed breaking tests due to fittext.
  * Fixed bug where event would be created when right or middle clicking.
  * Added fittext and made text size more responsive.
  * Fixed time offsets.

0.0.3 / 2013-06-05 
==================

  * pass in button color

0.0.2 / 2013-06-05 
==================

  * split up core to layout and theme-mixin
  * rearranged core.less to have styles and layout separate
  * moved header in dom
  * added getWeekSpan and header
  * don't check autorender when changing dates
  * updated template to use timef
  * remove delete button styles
  * added font-family to example/index.html
  * removed font-family
  * Added clearEvents method + tests.
  * Handle arrays in addEvent.
  * Show end time on events.
  * Time correctly formatted on display.
  * Styled buttons for next/previous.
  * Added basic next/prev week buttons.
  * Added test for click to create.
  * Single click created event.
  * Fixed failing test.
  * Updated less to reflect class prefix.
  * Changed remove to a button.
  * Merge branch 'master' of github.com:jgallen23/weekly
  * Added weekly- prefix to classes.
  * updated example to use weekly.full
  * updated build process

0.0.1 / 2013-06-04 
==================

  * separated layout and style and created a less mixin
  * tweaked gruntfile.js to watch scripts and styles separately
  * Added highlight + test for current date.
  * added full distro that includes fidel and template
  * Added delete button and events.
  * Added time format method and tests.
  * Added next/prev day methods and render of saved events on update.
  * Added test for addEvent event.
  * Fixed a minor error when clicking without dragging.
  * Dragging now actually creates a real event.
  * Added basic drag to create test.
  * Added based drag event.
  * Added test for fraction conversion.
  * Working percentages!
  * Event show shows title and description. Also pretty failtastic math thats really close to being right. I can feel it.
  * Almost working alignment!
  * New template implemented and test updated to reflect this.
  * updated readme
  * initial work on lib and template
  * [bower] deps
  * boilerplate
