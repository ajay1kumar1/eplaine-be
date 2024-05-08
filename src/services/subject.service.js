const httpStatus = require('http-status');
const { Subject } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subject
 * @param {Object} subjectBody
 * @returns {Promise<Subject>}
 */
const createSubject = async (subjectBody) => {
  if (await Subject.isSubjectNameTaken(subjectBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Subject name is already taken');
  }
  return Subject.create(subjectBody);
};

/**
 * Query for subjects
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubjects = async (filter, options) => {
  const subjects = await Subject.paginate(filter, options);
  return subjects;
};

/**
 * Get subject by id
 * @param {ObjectId} id
 * @returns {Promise<Subject>}
 */
const getSubjectById = async (id) => {
  return Subject.findById(id);
};

/**
 * Get subject by email
 * @param {string} email
 * @returns {Promise<Subject>}
 */
const getSubjectByEmail = async (email) => {
  return Subject.findOne({ email });
};

/**
 * Update subject by id
 * @param {ObjectId} subjectId
 * @param {Object} updateBody
 * @returns {Promise<Subject>}
 */
const updateSubjectById = async (subjectId, updateBody) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  if (updateBody.email && (await Subject.isEmailTaken(updateBody.email, subjectId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(subject, updateBody);
  await subject.save();
  return subject;
};

/**
 * Delete subject by id
 * @param {ObjectId} subjectId
 * @returns {Promise<Subject>}
 */
const deleteSubjectById = async (subjectId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  await subject.remove();
  return subject;
};

const getSubjectByName = async (name) => {
  return Subject.findOne({ name });
};

module.exports = {
  createSubject,
  querySubjects,
  getSubjectById,
  getSubjectByEmail,
  updateSubjectById,
  deleteSubjectById,
  getSubjectByName,
};
