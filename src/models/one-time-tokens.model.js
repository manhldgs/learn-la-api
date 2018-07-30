// oneTimeToken-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const oneTimeTokens = new Schema(
    {
      phone: { type: String, required: true, unique: true },
      token: { type: String, required: true },
    },
    {
      timestamps: true,
    },
  );

  oneTimeTokens.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
  return mongooseClient.model('oneTimeTokens', oneTimeTokens);
};
