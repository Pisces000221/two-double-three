/*
 * This is a simple library and thus it's easy to be kept
 * compatible with older browsers. Therefore, we deprecate forEach().
 **/
(function (root) {
  'use strict';

  var js233 = (function () {
    var comments = [[], [], []];
    // EV_SLIDING_RM is not necessarily used.
    // Sliding comments can be removed when it reaches the left border.
    var EV_SLIDING_ADD = 1, EV_SLIDING_RM = 2;
    var EV_TOP_STICKY_ADD = 3, EV_TOP_STICKY_RM = 4;
    var EV_BOTTOM_STICKY_ADD = 5, EV_BOTTOM_STICKY_RM = 6;

    var SLIDE_MIN_TIME = 10, SLIDE_MAX_TIME = 25;
    var STICKY_MIN_TIME = 2, STICKY_MAX_TIME = 3;

    function addComment(time, text, colour, type) {
      comments[type].push([time, text, colour]);
    }

    // A quick sort implementation.
    // Sorts an array of array by element [0].
    function sort(a, l, r) {
      if (l === undefined) { l = 0; r = a.length - 1; }
      var i = l, j = r, x = a[(l + r) >> 1][0], t;
      do {
        while (a[i][0] < x) i++;
        while (a[j][0] > x) j--;
        if (i <= j) {
          t = a[i]; a[i] = a[j]; a[j] = t;
          i++; j--;
        }
      } while (i <= j);
      if (i < r) sort(a, i, r);
      if (j > l) sort(a, l, j);
    }

    function stickyOperations(cmtList, oprList, isSliding, minDur, maxDur, addEvent, rmEvent) {
      sort(cmtList);
      var posUsage = [], i, j, cur, found, add, rm, dur, useTime;
      // Iterate through each comment.
      for (i = 0; i < cmtList.length; i++) {
        cur = cmtList[i];
        found = false;
        add = {type: addEvent, id: i, time: cur[0], text: cur[1], colour: cur[2]};
        dur = cur[0] + Math.random() * (maxDur - minDur) + minDur;
        useTime = cur.time + dur;
        rm = {type: rmEvent, id: i, time: dur};
        // If sliding, pass the duration to the operator so it can know the speed.
        // Also, sliding comments only uses the line for (0.3 * duration) seconds
        // so that multiple comments can be in one line - and THERE COMES DANMAKU!!
        if (isSliding) {
          add.duration = dur;
          useTime = cur.time + dur * 0.3;
        }
        // Find a place to put the comment.
        for (j = 0; j < posUsage.length; j++) if (posUsage[j] < cur[0]) {
          // Found that line #i is available. Put it there.
          add.line = j;
          posUsage[j] = rm.time;
          found = true; break;
        }
        if (!found) {
          // No current line is available. Allocate a new one.
          add.line = posUsage.length;
          posUsage.push(rm.time);
        }
        oprList.push(add);
        oprList.push(rm);
      }
    }

    function getAll() {
      var r = [];
      // Sliding comments (type 0)
      stickyOperations(comments[0], r, true,
        SLIDE_MIN_TIME, SLIDE_MAX_TIME, EV_SLIDING_ADD, EV_SLIDING_RM);
      // Top-sticky comments (type 1)
      stickyOperations(comments[1], r, false,
        STICKY_MIN_TIME, STICKY_MAX_TIME, EV_TOP_STICKY_ADD, EV_TOP_STICKY_RM);
      // Bottom-sticky comments (type 2)
      stickyOperations(comments[2], r, false,
        STICKY_MIN_TIME, STICKY_MAX_TIME, EV_BOTTOM_STICKY_ADD, EV_BOTTOM_STICKY_RM);
      return r;
    }

    return {
      addComment: addComment,
      getAll: getAll,
      EV_SLIDING_ADD: EV_SLIDING_ADD,
      EV_SLIDING_RM: EV_SLIDING_RM,
      EV_TOP_STICKY_ADD: EV_TOP_STICKY_ADD,
      EV_TOP_STICKY_RM: EV_TOP_STICKY_RM,
      EV_BOTTOM_STICKY_ADD: EV_BOTTOM_STICKY_ADD,
      EV_BOTTOM_STICKY_RM: EV_BOTTOM_STICKY_RM
    };
  }());

  root.js233 = js233;
}(this));
