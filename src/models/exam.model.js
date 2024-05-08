const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  marks: {
    type: String,
  },
});

const answerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  content: [
    {
      choice: {
        type: String,
      },
      note: {
        type: String,
      },
    },
  ],
  note: {
    type: String,
  },
  correctChoice: {
    type: String,
  },
});

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    classNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassNumber',
    },
    questions: [
      {
        question: {
          type: questionSchema,
          required: true,
        },
        answer: {
          type: answerSchema,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
examSchema.plugin(toJSON);
examSchema.plugin(paginate);

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
