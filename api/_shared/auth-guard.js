/**
 * Auth Guard — Supabase JWT verification for API endpoints
 * When Supabase is not configured, returns an anonymous user (auth-optional mode).
 */

var { SUPABASE_URL, isSupabaseConfigured, getAnonKey } = require('./supabase-config');

/**
 * Extract and verify Supabase JWT from Authorization header
 * @param {object} req - HTTP request
 * @returns {object|null} Supabase user object or null
 */
async function verifyAuth(req) {
  if (!isSupabaseConfigured()) return null;

  var header = req.headers['authorization'];
  if (!header || header.indexOf('Bearer ') !== 0) return null;

  var token = header.slice(7);
  if (!token || token.length < 20) return null;

  try {
    var resp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'apikey': getAnonKey()
      }
    });
    if (!resp.ok) return null;
    var user = await resp.json();
    return user && user.id ? user : null;
  } catch (e) {
    return null;
  }
}

/**
 * Require authentication — in auth-optional mode, returns anonymous user
 * @param {object} req
 * @param {object} res
 * @returns {object|null} user if authenticated, null if 401 was sent
 */
async function requireAuth(req, res) {
  var header = req.headers['authorization'];

  // Auth-optional: if no token is provided, return anonymous user
  if (!header || header.indexOf('Bearer ') !== 0) {
    return { id: 'anonymous', email: 'anonymous@local' };
  }

  // If a token IS provided, we attempt to verify it IF Supabase is configured
  if (isSupabaseConfigured()) {
    var user = await verifyAuth(req);
    if (!user) {
      var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'unknown';
      console.warn('[SECURITY] AUTH_FAILURE ip=' + ip + ' endpoint=' + (req.url || ''));
      res.status(401).json({ error: 'Authentication required' });
      return null;
    }
    return user;
  }

  // If token provided but Supabase NOT configured, fallback to anonymous
  return { id: 'anonymous', email: 'anonymous@local' };
}

module.exports = { verifyAuth: verifyAuth, requireAuth: requireAuth };
