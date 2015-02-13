/*
 * This is a simple library and thus it's easy to be kept
 * compatible with older browsers. Therefore, we deprecate forEach().
 **/
(function (root) {
  'use strict';

  var js233 = (function () {
    var comments = [[], [], []];
    var CMT_SLIDING = 0;
    var CMT_TOP_STICKY = 1;
    var CMT_BOTTOM_STICKY = 2;

    var SLIDE_MIN_TIME = 10, SLIDE_MAX_TIME = 25;
    var STICKY_MIN_TIME = 2, STICKY_MAX_TIME = 3;

    function setDurRange(slMin, slMax, stMin, stMax) {
      if (slMin) SLIDE_MIN_TIME = slMin;
      if (slMax && slMax >= slMin) SLIDE_MAX_TIME = slMax;
      if (stMin) STICKY_MIN_TIME = stMin;
      if (stMax && stMax >= stMin) STICKY_MAX_TIME = stMax;
    }

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

    function stickyOperations(cmtList, oprList, isSliding, minDur, maxDur, opType) {
      sort(cmtList);
      var posUsage = [], i, j, cur, found, op, dur, useUntil;
      // Iterate through each comment.
      for (i = 0; i < cmtList.length; i++) {
        cur = cmtList[i];
        found = false;
        dur = Math.random() * (maxDur - minDur) + minDur;
        op = {type: opType,
            time: cur[0], duration: dur, text: cur[1], colour: cur[2]};
        useUntil = cur[0] + dur;
        // If sliding, pass the duration to the operator so it can know the speed.
        // Also, sliding comments only uses the line for (0.3 * duration) seconds
        // so that multiple comments can be in one line - and THERE COMES DANMAKU!!
        if (isSliding) {
          op.duration = dur;
          useUntil = cur[0] + dur * 0.3;
        }
        // Find a place to put the comment.
        for (j = 0; j < posUsage.length; j++) if (posUsage[j] < cur[0]) {
          // Found that line #i is available. Put it there.
          op.line = j;
          posUsage[j] = useUntil;
          found = true; break;
        }
        if (!found) {
          // No current line is available. Allocate a new one.
          op.line = posUsage.length;
          posUsage.push(useUntil);
        }
        oprList.push(op);
      }
    }

    function getOperations() {
      var r = [];
      // Sliding comments (type 0)
      stickyOperations(comments[0], r, true,
        SLIDE_MIN_TIME, SLIDE_MAX_TIME, CMT_SLIDING);
      // Top-sticky comments (type 1)
      stickyOperations(comments[1], r, false,
        STICKY_MIN_TIME, STICKY_MAX_TIME, CMT_TOP_STICKY);
      // Bottom-sticky comments (type 2)
      stickyOperations(comments[2], r, false,
        STICKY_MIN_TIME, STICKY_MAX_TIME, CMT_BOTTOM_STICKY);
      return r;
    }

    return {
      addComment: addComment,
      getOperations: getOperations,
      setDurRange: setDurRange,
      CMT_SLIDING: CMT_SLIDING,
      CMT_TOP_STICKY: CMT_TOP_STICKY,
      CMT_BOTTOM_STICKY: CMT_BOTTOM_STICKY
    };
  }());

  root.js233 = js233;
}(this));
