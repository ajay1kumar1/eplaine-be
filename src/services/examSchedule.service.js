const httpStatus = require('http-status');
const { ExamSchedule } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a examSchedule
 * @param {Object} examScheduleBody
 * @returns {Promise<ExamSchedule>}
 */
const createExamSchedule = async (examScheduleBody) => {
  return ExamSchedule.create(examScheduleBody);
};

/**
 * Query for examSchedules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExamSchedules = async (filter, options) => {
  const examSchedules = await ExamSchedule.paginate(filter, options);
  return examSchedules;
};

/**
 * Get examSchedule by id
 * @param {ObjectId} id
 * @returns {Promise<ExamSchedule>}
 */
const getExamScheduleById = async (id) => {
  return ExamSchedule.findById(id);
};

/**
 * Get examSchedule by email
 * @param {string} email
 * @returns {Promise<ExamSchedule>}
 */
const getExamScheduleByEmail = async (email) => {
  return ExamSchedule.findOne({ email });
};

/**
 * Update examSchedule by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<ExamSchedule>}
 */
const updateExamScheduleById = async (id, updateBody) => {
  const examSchedule = await getExamScheduleById(id);
  if (!examSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExamSchedule not found');
  }
  if (updateBody.email && (await ExamSchedule.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(examSchedule, updateBody);
  await examSchedule.save();
  return examSchedule;
};

/**
 * Delete examSchedule by id
 * @param {ObjectId} id
 * @returns {Promise<ExamSchedule>}
 */
const deleteExamScheduleById = async (id) => {
  const examSchedule = await getExamScheduleById(id);
  if (!examSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExamSchedule not found');
  }
  await examSchedule.remove();
  return examSchedule;
};

const getExamSchedulesByBatchId = async (batchId) => {
  const examSchedules = await ExamSchedule.find({
    batches: { $in: [batchId] },
  });

  return examSchedules;
};

module.exports = {
  createExamSchedule,
  queryExamSchedules,
  getExamScheduleById,
  getExamScheduleByEmail,
  updateExamScheduleById,
  deleteExamScheduleById,
  getExamSchedulesByBatchId,
};
