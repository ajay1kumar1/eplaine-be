const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { userSchema } = require('./user.model');
const { updateRelatedDocuments, updateRelatedDocumentsOnDeletion } = require('./utils/updateRelatedDocuments');

const parentSchema = new mongoose.Schema({
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      set(ch) {
        this._originalChildren = this.children;
        return ch;
      },
      ref: 'Student',
    },
  ],
});

function preSaveFunction(next) {
  if (this.isNew) {
    this._originalChildren = [];
  } else {
    this._originalChildren = this._originalChildren ? this._originalChildren.slice() : [];
  }
  next();
}

async function postSaveFunction(doc) {
  const previousChildren = this._originalChildren.map((child) => child.id) || [];
  const Student = mongoose.model('Student');
  await updateRelatedDocuments(Student, doc, 'parents', previousChildren, 'children');
}

async function preRemoveFunction(next) {
  const Student = mongoose.model('Student');
  await updateRelatedDocumentsOnDeletion(Student, this, 'parents', next);
}

parentSchema.pre('save', preSaveFunction);
parentSchema.post('save', postSaveFunction);

parentSchema.pre('remove', preRemoveFunction);

parentSchema.methods.isPasswordMatch = async function (password) {
  const parent = this;
  return bcrypt.compare(password, parent.password);
};

parentSchema.add(userSchema);

// add plugin that converts mongoose to json
parentSchema.plugin(toJSON);
parentSchema.plugin(paginate);

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
