const savedSearches = [];

exports.saveSearch = (userId, query) => {

  savedSearches.push({
    userId,
    query,
    createdAt: new Date()
  });

  return true;
};

exports.getSavedSearches = (userId) => {
  return savedSearches.filter(s => s.userId === userId);
};