/* ==========================================================================
   SHARED LOGGER — Console error logging
   Used by: api/analyze.js, api/aurora.js
   ========================================================================== */

async function logError(severity, source, message, context) {
  var prefix = severity === 'critical' ? 'CRITICAL' : 'ERROR';
  console.error('[' + prefix + '] ' + source + ': ' + (message || '').slice(0, 500));
  if (context && context.stack) console.error(context.stack.slice(0, 500));
}

module.exports = { logError };
