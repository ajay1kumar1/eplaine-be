const httpStatus = require('http-status');
const { ClassNumber } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a classNumber
 * @param {Object} classNumberBody
 * @returns {Promise<ClassNumber>}
 */
const createClassNumber = async (classNumberBody) => {
  return ClassNumber.create(classNumberBody);
};

/**
 * Query for classNumbers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClassNumbers = async (filter, options) => {
  const classNumbers = await ClassNumber.paginate(filter, options);
  return classNumbers;
};

/**
 * Get classNumber by id
 * @param {ObjectId} id
 * @returns {Promise<ClassNumber>}
 */
const getClassNumberById = async (id) => {
  return ClassNumber.findById(id);
};

/**
 * Get classNumber by email
 * @param {string} email
 * @returns {Promise<ClassNumber>}
 */
const getClassNumberByEmail = async (email) => {
  return ClassNumber.findOne({ email });
};

/**
 * Update classNumber by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<ClassNumber>}
 */
const updateClassNumberById = async (id, updateBody) => {
  const classNumber = await getClassNumberById(id);
  if (!classNumber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ClassNumber not found');
  }
  Object.assign(classNumber, updateBody);
  await classNumber.save();
  return classNumber;
};

/**
 * Delete classNumber by id
 * @param {ObjectId} id
 * @returns {Promise<ClassNumber>}
 */
const deleteClassNumberById = async (id) => {
  const classNumber = await getClassNumberById(id);
  if (!classNumber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ClassNumber not found');
  }
  await classNumber.remove();
  return classNumber;
};

module.exports = {
  createClassNumber,
  queryClassNumbers,
  getClassNumberById,
  getClassNumberByEmail,
  updateClassNumberById,
  deleteClassNumberById,
};
