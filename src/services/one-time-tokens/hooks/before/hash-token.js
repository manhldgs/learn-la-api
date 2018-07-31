const bcrypt = require('bcryptjs');
const { BadRequest } = require('@feathersjs/errors');

module.exports = function hashToken() {
  return async context => {
    const { token } = context.data;

    if (!token) {
      throw new BadRequest('Missing token');
    }

    context.data.token = await bcrypt.hash(token, 8);
    return context;
  };
};
