const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const examScheduleSchema = mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
    batchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
      },
    ],
    dateTimeOfExam: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
examScheduleSchema.plugin(toJSON);
examScheduleSchema.plugin(paginate);

const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);
module.exports = ExamSchedule;
