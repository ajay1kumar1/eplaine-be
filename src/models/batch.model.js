const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { updateRelatedDocuments, updateRelatedDocumentsOnDeletion } = require('./utils/updateRelatedDocuments');

const batchSchema = mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    classNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassNumber',
    },
    boardName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BoardName',
    },
    language: {
      type: String,
      required: true,
    },
    batchTime: {
      type: String,
      required: true,
    },
    teacherSubject: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
          required: true,
        },
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Teacher',
          required: true,
        },
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        set(value) {
          this._originalStudents = this.students;
          return value;
        },
        ref: 'Student',
      },
    ],
    fees: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

function preSaveFunction(next) {
  if (this.isNew) {
    /* this._originalTeachers = []; */
    this._originalStudents = [];
  } else {
    /* this._originalTeachers = this._originalTeachers ? this._originalTeachers.slice() : []; */
    this._originalStudents = this._originalStudents ? this._originalStudents.slice() : [];
  }
  next();
}

async function postSaveFunction(doc) {
  /* const previousTeachers = this._originalTeachers.map((item) => item.id) || []; */
  const previousStudents = this._originalStudents.map((item) => item.id) || [];

  /* const Teacher = mongoose.model('Teacher'); */
  const Student = mongoose.model('Student');
  /* await updateRelatedDocuments(Teacher, doc, 'batches', previousTeachers, 'teachers'); */
  await updateRelatedDocuments(Student, doc, 'batches', previousStudents, 'students');
}

async function preRemoveFunction(next) {
  const current = this;
  /* const Teacher = mongoose.model('Teacher'); */
  const Student = mongoose.model('Student');
  /* await updateRelatedDocumentsOnDeletion(Teacher, current, 'batches', next); */
  await updateRelatedDocumentsOnDeletion(Student, current, 'batches', next);
}

batchSchema.pre('save', preSaveFunction);
batchSchema.post('save', postSaveFunction);

batchSchema.pre('remove', preRemoveFunction);

batchSchema.statics.isBatchNameTaken = async function (batchName, excludeUserId) {
  const batch = await this.findOne({ batchName, _id: { $ne: excludeUserId } });
  return !!batch;
};

// add plugin that converts mongoose to json
batchSchema.plugin(toJSON);
batchSchema.plugin(paginate);

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;
