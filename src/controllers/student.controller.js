const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { batchService, subjectService, studentService } = require('../services');

const createStudent = catchAsync(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(httpStatus.CREATED).send(student);
});

const getStudents = catchAsync(async (req, res) => {
  const { page, limit, name, firstName, ...filters } = req.query;
  /* const filters = pick(req.query, ['email', 'name']); */
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let filter = { ...filters };

  if (name) {
    const nameFilter = JSON.parse(name);
    filter = {
      ...filter,
      $or: nameFilter.$or,
    };
  }

  options.populate = {
    path: 'parents subjects batches',
  };
  const result = await studentService.queryStudents(filter, options);
  res.send(result);
});

const getStudent = catchAsync(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  res.send(student);
});

const updateStudent = catchAsync(async (req, res) => {
  const student = await studentService.updateStudentById(req.params.id, req.body);
  res.send(student);
});

const deleteStudent = catchAsync(async (req, res) => {
  await studentService.deleteStudentById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getStudentsByBatch = catchAsync(async (req, res) => {
  const { batchId } = req.params;
  /* const batch = await batchService.getBatchById(batchId); */
  const students = await studentService.getStudentsByBatchId(batchId);
  res.send(students);
});

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentsByBatch,
};
