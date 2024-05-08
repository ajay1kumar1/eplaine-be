const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { batchService, subjectService, examAttemptService } = require('../services');

const createExamAttempt = catchAsync(async (req, res) => {
  const examAttempt = await examAttemptService.createExamAttempt(req.body);
  res.status(httpStatus.CREATED).send(examAttempt);
});

const getExamAttempts = catchAsync(async (req, res) => {
  /* const { page, limit, filters  } = req.query; */
  /* const options = pick(req.query, ['sortBy', 'limit', 'page']); */

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await examAttemptService.queryExamAttempts(filter, options);
  res.send(result);
});

const getExamAttempt = catchAsync(async (req, res) => {
  const examAttempt = await examAttemptService.getExamAttemptById(req.params.id);
  if (!examAttempt) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExamAttempt not found');
  }
  res.send(examAttempt);
});

const updateExamAttempt = catchAsync(async (req, res) => {
  const examAttempt = await examAttemptService.updateExamAttemptById(req.params.id, req.body);
  res.send(examAttempt);
});

const deleteExamAttempt = catchAsync(async (req, res) => {
  await examAttemptService.deleteExamAttemptById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getExamAttemptsByBatch = catchAsync(async (req, res) => {
  const { batchId } = req.params;
  /* const batch = await batchService.getBatchById(batchId); */
  const examAttempts = await examAttemptService.getExamAttemptsByBatchId(batchId);
  res.send(examAttempts);
});

module.exports = {
  createExamAttempt,
  getExamAttempts,
  getExamAttempt,
  updateExamAttempt,
  deleteExamAttempt,
  getExamAttemptsByBatch,
};
