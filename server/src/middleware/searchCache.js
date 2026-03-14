const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 });

module.exports = (req, res, next) => {

  const key = req.originalUrl;

  const cached = cache.get(key);

  if (cached) {
    return res.json(cached);
  }

  res.sendResponse = res.json;

  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };

  next();
};