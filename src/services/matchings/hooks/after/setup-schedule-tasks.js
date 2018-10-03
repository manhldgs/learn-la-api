const agenda = require('../../../../modules/agenda');
const messageList = require('../../../../modules/notification-messages');

module.exports = function setupScheduleTasks() {
  return context => {
    const { type } = context.result;
    let message, to;

    if (type === 'courseAd') {
      message = messageList.teacher.reminder.matching.oneHourLeft;
      to = 'teacher';
      from = 'student';
    }

    if (type === 'studentAd') {
      message = messageList.student.reminder.matching.oneHourLeft;
      to = 'student';
      from = 'teacher';
    }

    agenda.schedule('after 20 seconds', 'sendOneHourLeftReminder', {
      matching: context.result,
      message,
      to,
      from,
    });

    agenda.schedule('after 1 minute', 'autoArchiveMatching', {
      matching: context.result,
    });

    return context;
  };
};