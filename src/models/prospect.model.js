const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const parentInterface = {
  firstName: String,
  lastName: String,
  contactNumber: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
};

const prospectSchema = mongoose.Schema(
  {
    dateOfInquiry: {
      type: Date,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    schoolName: {
      type: String,
    },
    category: {
      type: String,
    },
    existingParents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
      },
    ],
    newParents: [parentInterface],
    address: {
      type: String,
    },
    emergencyContactNumber: {
      type: String,
    },
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
      },
    ],
    discount: {
      type: Number,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

prospectSchema.statics.isEmailTaken = async function(email, excludeUserId) {
  const prospect = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!prospect;
};

// add plugin that converts mongoose to json
prospectSchema.plugin(toJSON);
prospectSchema.plugin(paginate);

const Prospect = mongoose.model('Prospect', prospectSchema);
module.exports = Prospect;
