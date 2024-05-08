const httpStatus = require('http-status');
const { Parent } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a parent
 * @param {Object} parentBody
 * @returns {Promise<Parent>}
 */
const createParent = async (parentBody) => {
  if (await Parent.isEmailTaken(parentBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Parent.create(parentBody);
};

/**
 * Query for parents
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryParents = async (filter, options) => {
  const parents = await Parent.paginate(filter, options);
  return parents;
};

/**
 * Get parent by id
 * @param {ObjectId} id
 * @returns {Promise<Parent>}
 */
const getParentById = async (id) => {
  return Parent.findById(id).populate('children');
};

/**
 * Get parent by email
 * @param {string} email
 * @returns {Promise<Parent>}
 */
const getParentByEmail = async (email) => {
  return Parent.findOne({ email }).populate('children');
};

/**
 * Update parent by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Parent>}
 */
const updateParentById = async (id, updateBody) => {
  const parent = await getParentById(id);
  if (!parent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parent not found');
  }
  if (updateBody.email && (await Parent.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(parent, updateBody);
  await parent.save();
  return parent;
};

/**
 * Delete parent by id
 * @param {ObjectId} id
 * @returns {Promise<Parent>}
 */
const deleteParentById = async (id) => {
  const parent = await getParentById(id);
  if (!parent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parent not found');
  }
  await parent.remove();
  return parent;
};

module.exports = {
  createParent,
  queryParents,
  getParentById,
  getParentByEmail,
  updateParentById,
  deleteParentById,
};
