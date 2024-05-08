const httpStatus = require('http-status');
const { Attendance } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a attendance
 * @param {Object} attendanceBody
 * @returns {Promise<Attendance>}
 */
const createAttendance = async (attendanceBody) => {
  /* if (await Attendance.isEmailTaken(attendanceBody.email)) { */
  /*   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'); */
  /* } */
  console.log({attendanceBody}, attendanceBody.data)
  return Attendance.create(attendanceBody);
};

/**
 * Query for attendances
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAttendances = async (filter, options) => {
  const attendances = await Attendance.paginate(filter, options);
  return attendances;
};

/**
 * Get attendance by id
 * @param {ObjectId} id
 * @returns {Promise<Attendance>}
 */
const getAttendanceById = async (id) => {
  return Attendance.findById(id);
};

/**
 * Get attendance by email
 * @param {string} email
 * @returns {Promise<Attendance>}
 */
/* const getAttendanceByEmail = async (email) => { */
/*   return Attendance.findOne({ email }); */
/* }; */

/**
 * Update attendance by id
 * @param {ObjectId} attendanceId
 * @param {Object} updateBody
 * @returns {Promise<Attendance>}
 */
const updateAttendanceById = async (attendanceId, updateBody) => {
  const attendance = await getAttendanceById(attendanceId);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attendance not found');
  }
  /* if (updateBody.email && (await Attendance.isEmailTaken(updateBody.email, attendanceId))) { */
  /*   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'); */
  /* } */
  Object.assign(attendance, updateBody);
  await attendance.save();
  return attendance;
};

/**
 * Delete attendance by id
 * @param {ObjectId} attendanceId
 * @returns {Promise<Attendance>}
 */
const deleteAttendanceById = async (attendanceId) => {
  const attendance = await getAttendanceById(attendanceId);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attendance not found');
  }
  await attendance.remove();
  return attendance;
};

module.exports = {
  createAttendance,
  queryAttendances,
  getAttendanceById,
  /* getAttendanceByEmail, */
  updateAttendanceById,
  deleteAttendanceById,
};
