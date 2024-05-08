const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { userSchema } = require('./user.model');
const { updateRelatedDocuments, updateRelatedDocumentsOnDeletion } = require('./utils/updateRelatedDocuments');

const studentSchema = mongoose.Schema(
  {
    admissionId: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
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
    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        set(pa) {
          this._originalParents = this.parents;
          return pa;
        },
        ref: 'Parent',
      },
    ],
    address: {
      type: String,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
    },
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        set(pa) {
          this._originalBatches = this.batches;
          return pa;
        },
        ref: 'Batch',
      },
    ],
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

function preSaveFunction(next) {
  if (this.isNew) {
    this._originalParents = [];
    this._originalBatches = [];
  } else {
    this._originalParents = this._originalParents ? this._originalParents.slice() : [];
    this._originalBatches = this._originalBatches ? this._originalBatches.slice() : [];
  }
  next();
}

async function postSaveFunction(doc) {
  const previousParents = this._originalParents;
  const previousBatches = this._originalBatches;
  /* await updateParents(doc, previousParents); */
  const Parent = mongoose.model('Parent');
  const Batch = mongoose.model('Batch');
  await updateRelatedDocuments(Parent, doc, 'children', previousParents, 'parents');
  await updateRelatedDocuments(Batch, doc, 'students', previousBatches, 'batches');
}

async function preRemoveFunction(next) {
  const Parent = mongoose.model('Parent');
  const Batch = mongoose.model('Batch');
  await updateRelatedDocumentsOnDeletion(Parent, this, 'children', next);
  await updateRelatedDocumentsOnDeletion(Batch, this, 'students', next);
}

studentSchema.pre('save', preSaveFunction);
studentSchema.post('save', postSaveFunction);

studentSchema.pre('remove', preRemoveFunction);

studentSchema.methods.isPasswordMatch = async function (password) {
  const student = this;
  return bcrypt.compare(password, student.password);
};

studentSchema.add(userSchema);

studentSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const student = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!student;
};

// add plugin that converts mongoose to json
studentSchema.plugin(toJSON);
studentSchema.plugin(paginate);

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
