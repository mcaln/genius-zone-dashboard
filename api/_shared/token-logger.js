/* ==========================================================================
   SHARED TOKEN LOGGER — Token usage tracking
   Logs to Supabase when configured, console-only otherwise.
   ========================================================================== */

var { isSupabaseConfigured, SUPABASE_URL, getServiceRoleKey } = require('./supabase-config');

async function logTokenUsage(endpoint, model, inputTokens, outputTokens) {
  if (!inputTokens && !outputTokens) return;

  console.log('[TOKENS] ' + endpoint + ' ' + model + ' in=' + (inputTokens || 0) + ' out=' + (outputTokens || 0));

  if (!isSupabaseConfigured()) return;

  var key;
  try { key = getServiceRoleKey(); } catch (e) { return; }

  try {
    await fetch(SUPABASE_URL + '/rest/v1/api_token_usage', {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        endpoint: endpoint,
        model: model,
        input_tokens: inputTokens || 0,
        output_tokens: outputTokens || 0
      })
    });
  } catch (e) {
    console.error('logTokenUsage failed:', e.message);
  }
}

module.exports = { logTokenUsage };
