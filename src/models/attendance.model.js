const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const attendanceSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    data: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: ['present', 'absent', 'late'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ batch: 1, date: 1, subject: 1 }, { unique: true });

// add plugin that converts mongoose to json
attendanceSchema.plugin(toJSON);
attendanceSchema.plugin(paginate);

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
