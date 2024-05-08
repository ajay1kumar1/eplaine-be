const Joi = require('joi');
const { objectId } = require('./custom.validation');

const prospectSchema = {
  dateOfInquiry: Joi.date(),
  firstName: Joi.string(),
  middleName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string(),
  contactNumber: Joi.string(),
  email: Joi.string().email(),
  dateOfBirth: Joi.date(),
  schoolName: Joi.string(),
  category: Joi.string(),
  newParents: Joi.array().items(
    Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      contactNumber: Joi.string(),
      email: Joi.string().email(),
    })
  ),
  address: Joi.string(),
  emergencyContactNumber: Joi.string(),
  batches: Joi.array().items(Joi.string().custom(objectId)),
  discount: Joi.number(),
  note: Joi.string(),
  existingParents: Joi.array().items(Joi.string().custom(objectId)),
};

const createProspect = {
  body: Joi.object().keys({
    ...prospectSchema,
    // Make specific fields required for createProspect
    dateOfInquiry: prospectSchema.dateOfInquiry.required(),
    firstName: prospectSchema.firstName.required(),
    contactNumber: prospectSchema.contactNumber.required(),
    dateOfBirth: prospectSchema.dateOfBirth.required(),
  }),
};

const getProspects = {
  query: Joi.object().keys({
    ...prospectSchema,
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProspect = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateProspect = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      dateOfInquiry: Joi.date(),
      firstName: Joi.string(),
      middleName: Joi.string(),
      lastName: Joi.string(),
      gender: Joi.string(),
      contactNumber: Joi.string(),
      email: Joi.string().email(),
      dateOfBirth: Joi.date(),
      schoolName: Joi.string(),
      boardName: Joi.string(),
      category: Joi.string(),
      existingParents: Joi.array().items(Joi.string().custom(objectId)),
      address: Joi.string(),
      emergencyContactNumber: Joi.string(),
      batches: Joi.array().items(Joi.string().custom(objectId)),
      subjects: Joi.array().items(Joi.string().custom(objectId)),
      fees: Joi.number(),
      discount: Joi.number(),
      note: Joi.string(),
      newParents: Joi.array().items(
        Joi.object().keys({
          firstName: Joi.string(),
          lastName: Joi.string(),
          contactNumber: Joi.string(),
          email: Joi.string().email(),
        })
      ),
    })
    .min(1),
};

const deleteProspect = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProspect,
  getProspects,
  getProspect,
  updateProspect,
  deleteProspect,
};
