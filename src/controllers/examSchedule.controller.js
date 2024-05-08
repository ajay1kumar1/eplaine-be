const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { batchService, subjectService, examScheduleService } = require('../services');

const createExamSchedule = catchAsync(async (req, res) => {
  const examSchedule = await examScheduleService.createExamSchedule(req.body);
  res.status(httpStatus.CREATED).send(examSchedule);
});

const getExamSchedules = catchAsync(async (req, res) => {
  /* const { page, limit, filters  } = req.query; */
  /* const options = pick(req.query, ['sortBy', 'limit', 'page']); */

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await examScheduleService.queryExamSchedules(filter, options);
  res.send(result);
});

const getExamSchedule = catchAsync(async (req, res) => {
  const examSchedule = await examScheduleService.getExamScheduleById(req.params.id);
  if (!examSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExamSchedule not found');
  }
  res.send(examSchedule);
});

const updateExamSchedule = catchAsync(async (req, res) => {
  const examSchedule = await examScheduleService.updateExamScheduleById(req.params.id, req.body);
  res.send(examSchedule);
});

const deleteExamSchedule = catchAsync(async (req, res) => {
  await examScheduleService.deleteExamScheduleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getExamSchedulesByBatch = catchAsync(async (req, res) => {
  const { batchId } = req.params;
  /* const batch = await batchService.getBatchById(batchId); */
  const examSchedules = await examScheduleService.getExamSchedulesByBatchId(batchId);
  res.send(examSchedules);
});

module.exports = {
  createExamSchedule,
  getExamSchedules,
  getExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
  getExamSchedulesByBatch,
};
