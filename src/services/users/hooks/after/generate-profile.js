module.exports = function generateProfile() {
  return async context => {
    const { platform } = context.params;
    const { _id, roles } = context.result;

    data = {
      userId: _id,
      ...context.data,
    };

    if (platform === 'teacher') {
      const profile = await context.app.service('teachers').create(data);
      // .create({ userId: _id });
      return context;
    }

    if (platform === 'student') {
      await context.app.service('students').create(data);
      return context;
    }
  };
};
