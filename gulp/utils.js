(function() {
  'use strict';

  /**
   * Formatter for bytediff to display the size changes after processing
   *
   * @param {object} data - byte data
   *
   * @return {string} Difference in bytes, formatted
   */
  module.exports.bytediffFormatter = function(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from '
      + (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB'
      + ' and is ' + ((1 - data.percent) * 100).toFixed(2) + '%' + difference;
  };

  /**
   * Log any change on files
   *
   * @param {object} event - The event's change
   */
  module.exports.logWatch = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  };
})();
