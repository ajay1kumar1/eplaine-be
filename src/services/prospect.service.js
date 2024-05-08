const httpStatus = require('http-status');
const { Prospect } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a prospect
 * @param {Object} prospectBody
 * @returns {Promise<Prospect>}
 */
const createProspect = async (prospectBody) => {
  if (await Prospect.isEmailTaken(prospectBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Prospect.create(prospectBody);
};

/**
 * Query for prospects
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProspects = async (filter, options) => {
  const prospects = await Prospect.paginate(filter, options);
  return prospects;
};

/**
 * Get prospect by id
 * @param {ObjectId} id
 * @returns {Promise<Prospect>}
 */
const getProspectById = async (id) => {
  return Prospect.findById(id);
};

/**
 * Get prospect by email
 * @param {string} email
 * @returns {Promise<Prospect>}
 */
const getProspectByEmail = async (email) => {
  return Prospect.findOne({ email });
};

/**
 * Update prospect by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Prospect>}
 */
const updateProspectById = async (id, updateBody) => {
  const prospect = await getProspectById(id);
  if (!prospect) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prospect not found');
  }
  if (updateBody.email && (await Prospect.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(prospect, updateBody);
  await prospect.save();
  return prospect;
};

/**
 * Delete prospect by id
 * @param {ObjectId} id
 * @returns {Promise<Prospect>}
 */
const deleteProspectById = async (id) => {
  const prospect = await getProspectById(id);
  if (!prospect) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prospect not found');
  }
  await prospect.remove();
  return prospect;
};

const getProspectsByBatchIdAndSubjectId = async (batchId, subjectId) => {
  const prospects = await Prospect.find({
    batch: { $in: [batchId] },
    subjects: { $in: [subjectId] },
  });

  return prospects;
};

module.exports = {
  createProspect,
  queryProspects,
  getProspectById,
  getProspectByEmail,
  updateProspectById,
  deleteProspectById,
  getProspectsByBatchIdAndSubjectId,
};
