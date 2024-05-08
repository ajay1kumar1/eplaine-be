const httpStatus = require('http-status');
const { Exam } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a exam
 * @param {Object} examBody
 * @returns {Promise<Exam>}
 */
const createExam = async (examBody) => {
  return Exam.create(examBody);
};

/**
 * Query for exams
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExams = async (filter, options) => {
  const exams = await Exam.paginate(filter, options);
  return exams;
};

/**
 * Get exam by id
 * @param {ObjectId} id
 * @returns {Promise<Exam>}
 */
const getExamById = async (id) => {
  return Exam.findById(id);
};

/**
 * Get exam by email
 * @param {string} email
 * @returns {Promise<Exam>}
 */
const getExamByEmail = async (email) => {
  return Exam.findOne({ email });
};

/**
 * Update exam by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Exam>}
 */
const updateExamById = async (id, updateBody) => {
  const exam = await getExamById(id);
  if (!exam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  if (updateBody.email && (await Exam.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(exam, updateBody);
  await exam.save();
  return exam;
};

/**
 * Delete exam by id
 * @param {ObjectId} id
 * @returns {Promise<Exam>}
 */
const deleteExamById = async (id) => {
  const exam = await getExamById(id);
  if (!exam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  await exam.remove();
  return exam;
};

const getExamsByBatchId = async (batchId) => {
  const exams = await Exam.find({
    batches: { $in: [batchId] },
  });

  return exams;
};

module.exports = {
  createExam,
  queryExams,
  getExamById,
  getExamByEmail,
  updateExamById,
  deleteExamById,
  getExamsByBatchId,
};
