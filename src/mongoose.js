const mongoose = require('mongoose');

module.exports = function(app) {
  mongoose.connect(
    app.get('mongodb'),
    {
      useNewUrlParser: true,
      autoIndex: false,
    },
  );
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
