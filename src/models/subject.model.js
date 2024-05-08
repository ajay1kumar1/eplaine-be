const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        async validator(value) {
          const subject = await mongoose.models.Subject.findOne({ name: value });
          if (subject) {
            throw new Error('The name field must be unique.');
          }
          return true;
        },
      },
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
      },
    ],
  },
  {
    timestamps: true,
  }
);

subjectSchema.statics.isSubjectNameTaken = async function (subjectName, excludeUserId) {
  const subject = await this.findOne({ subjectName, _id: { $ne: excludeUserId } });
  return !!subject;
};

subjectSchema.plugin(toJSON);
subjectSchema.plugin(paginate);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
