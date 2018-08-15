const { LocationSchema, TimeslotSchema } = require('./customTypes');

module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const log = new Schema(
    {
      to: { type: String, required: true },
      logId: { type: String, required: true },
      read: { type: Date },
      extra: { type: Object },
    },
    {
      timestamps: true,
    }
  );

  const matchings = new Schema(
    {
      studentId: { type: Schema.Types.ObjectId, required: true },
      teacherId: { type: Schema.Types.ObjectId, required: true },

      // type: 'studentAd' || 'courseAd'
      type: { type: String, required: true },
      courseAdId: { type: Schema.Types.ObjectId },
      studentAdId: { type: Schema.Types.ObjectId },

      studentHeadline: { type: String, required: true },
      teacherHeadline: { type: String, required: true },

      title: { type: String, required: true },
      category: { type: String, required: true },
      level: { type: Number, required: true },

      timeslots: { type: [TimeslotSchema] },
      timeTable: { type: [Number] },
      location: { type: LocationSchema, required: true },
      duration: { type: Number, required: true },
      homeTuition: { type: Boolean, required: true },
      startDate: { type: Date, required: true },

      numOfStudents: { type: Number, default: 1 },
      noSmoking: { type: Boolean },
      requireQualificationProof: { type: Boolean },

      exchangePhone: { type: String },
      activityLogs: { type: [log] },

      expiredAt: { type: Date },
      archivedAt: { type: Date },
      removedAt: { type: Date },
    },
    {
      timestamps: true,
    }
  );

  return mongooseClient.model('matchings', matchings);
};
