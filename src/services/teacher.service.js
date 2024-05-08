const httpStatus = require('http-status');
const { Teacher } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a teacher
 * @param {Object} teacherBody
 * @returns {Promise<Teacher>}
 */
const createTeacher = async (teacherBody) => {
  if (await Teacher.isEmailTaken(teacherBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Teacher.create(teacherBody);
};

/**
 * Query for teachers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTeachers = async (filter, options) => {
  const teachers = await Teacher.paginate(filter, options);
  return teachers;
};

/**
 * Get teacher by id
 * @param {ObjectId} id
 * @returns {Promise<Teacher>}
 */
const getTeacherById = async (id) => {
  return Teacher.findById(id);
};

/**
 * Get teacher by email
 * @param {string} email
 * @returns {Promise<Teacher>}
 */
const getTeacherByEmail = async (email) => {
  return Teacher.findOne({ email });
};

/**
 * Update teacher by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Teacher>}
 */
const updateTeacherById = async (id, updateBody) => {
  const teacher = await getTeacherById(id);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }
  if (updateBody.email && (await Teacher.isEmailTaken(updateBody.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(teacher, updateBody);
  await teacher.save();
  return teacher;
};

/**
 * Delete teacher by id
 * @param {ObjectId} id
 * @returns {Promise<Teacher>}
 */
const deleteTeacherById = async (id) => {
  const teacher = await getTeacherById(id);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
  }
  await teacher.remove();
  return teacher;
};

module.exports = {
  createTeacher,
  queryTeachers,
  getTeacherById,
  getTeacherByEmail,
  updateTeacherById,
  deleteTeacherById,
};
