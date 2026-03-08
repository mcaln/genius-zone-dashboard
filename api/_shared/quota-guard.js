/* ==========================================================================
   SHARED QUOTA GUARD — Per-user quota enforcement (business limits)
   When Supabase is not configured, quotas are disabled (fail-open).
   ========================================================================== */

var { isSupabaseConfigured, SUPABASE_URL, getServiceRoleKey } = require('./supabase-config');

async function enforceQuota(req, res, userId, endpoint, maxCount, windowMs) {
  if (!isSupabaseConfigured()) return false;

  var key;
  try { key = getServiceRoleKey(); } catch (e) { return false; }

  var since = new Date(Date.now() - windowMs).toISOString();

  try {
    var url = SUPABASE_URL + '/rest/v1/api_quota_usage'
      + '?user_id=eq.' + userId
      + '&endpoint=eq.' + encodeURIComponent(endpoint)
      + '&created_at=gte.' + encodeURIComponent(since)
      + '&select=id';

    var resp = await fetch(url, {
      method: 'HEAD',
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Prefer': 'count=exact'
      }
    });

    if (!resp.ok) return false;

    var range = resp.headers.get('content-range');
    var count = 0;
    if (range) {
      var parts = range.split('/');
      count = parseInt(parts[1], 10) || 0;
    }

    if (count >= maxCount) {
      var resetAt = new Date(Date.now() + windowMs);
      res.status(429).json({
        error: 'Quota excedida',
        quota: { limit: maxCount, used: count, windowMs: windowMs, resetAt: resetAt.toISOString() }
      });
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

async function recordUsage(userId, endpoint) {
  if (!isSupabaseConfigured()) return;

  var key;
  try { key = getServiceRoleKey(); } catch (e) { return; }

  try {
    await fetch(SUPABASE_URL + '/rest/v1/api_quota_usage', {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ user_id: userId, endpoint: endpoint })
    });
  } catch (e) {
    console.error('quota-guard recordUsage failed:', e.message);
  }
}

module.exports = { enforceQuota: enforceQuota, recordUsage: recordUsage };
