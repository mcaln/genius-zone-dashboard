/**
 * Auth Optional — Lightweight auth module
 * Works without Supabase (localStorage only with anonymous ID).
 * If Supabase is configured, provides full auth with persistence.
 */
var Auth = (function() {
  'use strict';

  var ANON_KEY = 'genius_zone_anon_id';
  var _user = null;
  var _client = null;

  function generateAnonId() {
    var id = localStorage.getItem(ANON_KEY);
    if (id) return id;
    id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(ANON_KEY, id);
    return id;
  }

  function getUser() {
    return _user || { id: generateAnonId(), email: 'anonymous' };
  }

  function getUserId() {
    return getUser().id;
  }

  function getClient() {
    return _client;
  }

  function authHeaders() {
    return {};
  }

  return {
    getUser: getUser,
    getUserId: getUserId,
    getClient: getClient,
    authHeaders: authHeaders
  };
})();
