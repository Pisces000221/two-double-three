/*
 * This is a simple library and thus it's easy to be kept
 * compatible with older browsers. Therefore, we deprecate forEach().
 **/
(function (root) {
  'use strict';

  var js233 = (function () {
    var comments = [[], [], []];
    var STUCK_DURATION = 2;

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

    function getAll() {
      var r = [[], [], []];
      // Top-stuck comments (type 1)
      sort(comments[1]);
      var posUsage = [], i, j, cur, found, ret;
      // Iterate through each comment.
      for (i = 0; i < comments[1].length; i++) {
        cur = comments[1][i];
        found = false;
        ret = {id: i, time: cur[0], text: cur[1], colour: cur[2]};
        // Find a place to put the comment.
        for (j = 0; j < posUsage.length; j++) if (posUsage[j] < cur[0]) {
          // Found that line #i is available. Put it there.
          ret.line = j;
          posUsage[j] = cur[0] + STUCK_DURATION;
          found = true; break;
        }
        if (!found) {
          // No current line is available. Allocate a new one.
          ret.line = posUsage.length;
          posUsage.push(cur[0] + STUCK_DURATION);
        }
        r[1].push(ret);
      }
      return r;
    }

    return {
      addComment: addComment,
      getAll: getAll
    };
  }());

  root.js233 = js233;
}(this));
