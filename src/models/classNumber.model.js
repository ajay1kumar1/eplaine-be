const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const classNumberSchema = mongoose.Schema(
  {
    classNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        async validator(value) {
          const subject = await mongoose.models.ClassNumber.findOne({ classNumber: value });
          if (subject) {
            throw new Error('The class number must be unique.');
          }
          return true;
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
classNumberSchema.plugin(toJSON);
classNumberSchema.plugin(paginate);

const ClassNumber = mongoose.model('ClassNumber', classNumberSchema);
module.exports = ClassNumber;
