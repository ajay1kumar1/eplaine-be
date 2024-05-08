const httpStatus = require('http-status');
const { Student } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a student
 * @param {Object} studentBody
 * @returns {Promise<Student>}
 */
const createStudent = async (studentBody) => {
  if (await Student.isEmailTaken(studentBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Student.create(studentBody);
};

/**
 * Query for students
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStudents = async (filter, options) => {
  const students = await Student.paginate(filter, options);
  return students;
};

/**
 * Get student by id
 * @param {ObjectId} id
 * @returns {Promise<Student>}
 */
const getStudentById = async (id) => {
  return Student.findById(id);
};

/**
 * Get student by email
 * @param {string} email
 * @returns {Promise<Student>}
 */
const getStudentByEmail = async (email) => {
  return Student.findOne({ email });
};

/**
 * Update student by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Student>}
 */
const updateStudentById = async (id, updateBody) => {
  const student = await getStudentById(id);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  if (updateBody.email && (await Student.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(student, updateBody);
  await student.save();
  return student;
};

/**
 * Delete student by id
 * @param {ObjectId} id
 * @returns {Promise<Student>}
 */
const deleteStudentById = async (id) => {
  const student = await getStudentById(id);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  await student.remove();
  return student;
};

const getStudentsByBatchId = async (batchId) => {
  const students = await Student.find({
    batches: { $in: [batchId] },
  });

  return students;
};

module.exports = {
  createStudent,
  queryStudents,
  getStudentById,
  getStudentByEmail,
  updateStudentById,
  deleteStudentById,
  getStudentsByBatchId,
};
