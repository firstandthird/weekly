
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
