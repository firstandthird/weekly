
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
