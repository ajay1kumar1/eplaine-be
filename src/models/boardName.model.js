const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const boardNameSchema = mongoose.Schema(
  {
    boardName: {
      type: String,
      required: true,
      unique: true,
      validate: {
        async validator(value) {
          const subject = await mongoose.models.BoardName.findOne({ boardName: value });
          if (subject) {
            throw new Error('The board name must be unique.');
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
boardNameSchema.plugin(toJSON);
boardNameSchema.plugin(paginate);

const BoardName = mongoose.model('BoardName', boardNameSchema);
module.exports = BoardName;
