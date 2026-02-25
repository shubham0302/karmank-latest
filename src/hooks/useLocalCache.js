/**
 * useLocalCache — generic localStorage cache with TTL
 *
 * All keys are namespaced under "karmank:" to avoid collisions.
 *
 * Usage:
 *   const cache = useLocalCache();
 *   cache.set('my-key', data, 60 * 60 * 1000); // 1 hour TTL
 *   const data = cache.get('my-key');           // null if missing/expired
 *   cache.remove('my-key');
 *   cache.clear('members-');                    // remove all keys with this prefix
 */

const NS = 'karmank:';

function set(key, value, ttlMs = null) {
  try {
    localStorage.setItem(NS + key, JSON.stringify({
      v: value,
      exp: ttlMs ? Date.now() + ttlMs : null,
    }));
  } catch {
    // localStorage quota exceeded — silently ignore, app still works
  }
}

function get(key) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return null;
    const { v, exp } = JSON.parse(raw);
    if (exp && Date.now() > exp) {
      localStorage.removeItem(NS + key);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

function remove(key) {
  localStorage.removeItem(NS + key);
}

/** Remove all cached keys whose local name starts with `prefix` */
function clear(prefix = '') {
  const full = NS + prefix;
  Object.keys(localStorage)
    .filter(k => k.startsWith(full))
    .forEach(k => localStorage.removeItem(k));
}

/** Build a stable cache key for a numerology report */
function reportKey(name, dob, gender) {
  return `report:${(name || '').trim().toLowerCase()}|${dob || ''}|${(gender || '').toLowerCase()}`;
}

/** Build a cache key for a user's family members list */
function membersKey(userId) {
  return `members:${userId}`;
}

/** Build a key for the last-selected member per user */
function lastMemberKey(userId) {
  return `last-member:${userId}`;
}

export const localCache = { set, get, remove, clear, reportKey, membersKey, lastMemberKey };

/** React hook that simply returns the same stable object */
export function useLocalCache() {
  return localCache;
}
