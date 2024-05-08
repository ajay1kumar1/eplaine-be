const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const examAttemptSchema = mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
    studentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    answers: [
      {
        content: {
          type: String,
        },
        marks: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
examAttemptSchema.plugin(toJSON);
examAttemptSchema.plugin(paginate);

const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);
module.exports = ExamAttempt;
