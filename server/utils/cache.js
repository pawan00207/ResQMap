// simple in-memory cache for frequently requested resources

const cacheStore = {};

// time (in ms) for which data will stay in cache
const CACHE_DURATION = 60 * 1000; // 1 minute

function getCache(key) {
  const cached = cacheStore[key];

  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;

  if (isExpired) {
    delete cacheStore[key];
    return null;
  }

  return cached.data;
}

function setCache(key, data) {
  cacheStore[key] = {
    data,
    timestamp: Date.now(),
  };
}

module.exports = {
  getCache,
  setCache,
};