const httpStatus = require('http-status');
const { Batch } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a batch
 * @param {Object} batchBody
 * @returns {Promise<Batch>}
 */
const createBatch = async (batchBody) => {
  if (await Batch.isBatchNameTaken(batchBody.batchName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Batch name is already taken');
  }
  return Batch.create(batchBody);
};

/**
 * Query for batches
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBatches = async (filter, options) => {
  const batches = await Batch.paginate(filter, options);
  return batches;
};

/**
 * Get batch by id
 * @param {ObjectId} id
 * @returns {Promise<Batch>}
 */
const getBatchById = async (id) => {
  return Batch.findById(id);
};

/**
 * Get batch by email
 * @param {string} email
 * @returns {Promise<Batch>}
 */
const getBatchByEmail = async (email) => {
  return Batch.findOne({ email });
};

/**
 * Update batch by id
 * @param {ObjectId} batchId
 * @param {Object} updateBody
 * @returns {Promise<Batch>}
 */
const updateBatchById = async (batchId, updateBody) => {
  const batch = await getBatchById(batchId);
  if (!batch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }
  if (updateBody.email && (await Batch.isEmailTaken(updateBody.email, batchId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(batch, updateBody);
  await batch.save();
  return batch;
};

/**
 * Delete batch by id
 * @param {ObjectId} batchId
 * @returns {Promise<Batch>}
 */
const deleteBatchById = async (batchId) => {
  const batch = await getBatchById(batchId);
  if (!batch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }
  await batch.remove();
  return batch;
};

const getBatchByName = async (batchName) => {
  return Batch.findOne({ batchName });
};

module.exports = {
  createBatch,
  queryBatches,
  getBatchById,
  getBatchByEmail,
  updateBatchById,
  deleteBatchById,
  getBatchByName,
};
