const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { languageTypes } = require('../config/languages');

const resetPasswordSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    resetStatus: {
      type: Boolean,
      default: false,
    },
    language: {
        type: String,
        required: true,
        enum: [languageTypes.ENGLISH,languageTypes.JAPANESE],
        default: languageTypes.ENGLISH
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
resetPasswordSchema.plugin(toJSON);

/**
 * @typedef ResetPassword
 */
const ResetPassword = mongoose.model('ResetPassword', resetPasswordSchema);

module.exports = ResetPassword;
