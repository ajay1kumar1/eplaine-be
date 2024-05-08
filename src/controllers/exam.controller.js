const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { batchService, subjectService, examService } = require('../services');

const createExam = catchAsync(async (req, res) => {
  const exam = await examService.createExam(req.body);
  res.status(httpStatus.CREATED).send(exam);
});

const getExams = catchAsync(async (req, res) => {
  /* const { page, limit, filters  } = req.query; */
  /* const options = pick(req.query, ['sortBy', 'limit', 'page']); */

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  options.populate = {
    path: 'classNumber subject',
  };
  const result = await examService.queryExams(filter, options);
  res.send(result);
});

const getExam = catchAsync(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  if (!exam) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  res.send(exam);
});

const updateExam = catchAsync(async (req, res) => {
  const exam = await examService.updateExamById(req.params.id, req.body);
  res.send(exam);
});

const deleteExam = catchAsync(async (req, res) => {
  await examService.deleteExamById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getExamsByBatch = catchAsync(async (req, res) => {
  const { batchId } = req.params;
  /* const batch = await batchService.getBatchById(batchId); */
  const exams = await examService.getExamsByBatchId(batchId);
  res.send(exams);
});

module.exports = {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
  getExamsByBatch,
};
