const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recordService } = require('../services');

const getRecordsForStudentForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForStudentForm();
  res.send(records);
});

const getRecordsForTeacherForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForTeacherForm();
  res.send(records);
});

const getRecordsForParentForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForParentForm();
  res.send(records);
});

const getRecordsForBatchForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForBatchForm();
  res.send(records);
});

const getRecordsForAttendanceForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForAttendanceForm();
  res.send(records);
});

const getRecordsForPaymentForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForPaymentForm();
  res.send(records);
});

const getRecordsForExamForm = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForExamForm();
  res.send(records);
});

const getRecordsForParentForMobile = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForParentForMobile(req.params.id);
  res.send(records);
});

const getRecordsForStudentForMobile = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForStudentForMobile(req.params.id);
  res.send(records);
});

const getRecordsForStudentAttendanceForMobile = catchAsync(async (req, res) => {
  const records = await recordService.getRecordsForStudentAttendanceForMobile(req.params.id);
  res.send(records);
});

module.exports = {getRecordsForExamForm, getRecordsForStudentAttendanceForMobile, getRecordsForTeacherForm, getRecordsForAttendanceForm, getRecordsForPaymentForm, getRecordsForBatchForm, getRecordsForStudentForm, getRecordsForParentForm, getRecordsForParentForMobile, getRecordsForStudentForMobile };
