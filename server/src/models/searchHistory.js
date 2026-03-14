const history = [];

exports.addHistory = (userId, query) => {

  history.push({
    userId,
    query,
    time: new Date()
  });

};

exports.getHistory = (userId) => {

  return history.filter(h => h.userId === userId);

};