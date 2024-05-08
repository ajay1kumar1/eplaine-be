const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { userSchema } = require('./user.model');
/* const { updateRelatedDocuments, updateRelatedDocumentsOnDeletion } = require('./utils/updateRelatedDocuments'); */

const teacherSchema = mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    education: {
      type: String,
    },
    address: {
      type: String,
    },
    specialization: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        set(value) {
          this._originalBatches = this.batches;
          return value;
        },
        ref: 'Batch',
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* function preSaveFunction(next) { */
/*   if (this.isNew) { */
/*     this._originalBatches = []; */
/*   } else { */
/*     this._originalBatches = this._originalBatches ? this._originalBatches.slice() : []; */
/*   } */
/*   next(); */
/* } */

/* async function postSaveFunction(doc) { */
/*   const previousBatches = this._originalBatches.map((item) => item.id) || []; */
/**/
/*   const Batch = mongoose.model('Batch'); */
/*   await updateRelatedDocuments(Batch, doc, 'teachers', previousBatches, 'batches'); */
/* } */
/**/
/* async function preRemoveFunction(next) { */
/*   const Batch = mongoose.model('Batch'); */
/*   await updateRelatedDocumentsOnDeletion(Batch, this, 'teachers', next); */
/* } */
/**/
/* teacherSchema.pre('save', preSaveFunction); */
/* teacherSchema.post('save', postSaveFunction); */
/**/
/* teacherSchema.pre('remove', preRemoveFunction); */

teacherSchema.methods.isPasswordMatch = async function (password) {
  const teacher = this;
  return bcrypt.compare(password, teacher.password);
};

teacherSchema.add(userSchema);

// add plugin that converts mongoose to json
teacherSchema.plugin(toJSON);
teacherSchema.plugin(paginate);

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
