const cache = {};

function setCache(key, data) {
  cache[key] = {
    data,
    expiry: Date.now() + 5 * 60 * 1000
  };
}

function getCache(key) {
  const entry = cache[key];

  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    delete cache[key];
    return null;
  }

  return entry.data;
}

module.exports = { setCache, getCache };
