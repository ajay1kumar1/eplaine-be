const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { classNumberService } = require('../services');

const createClassNumber = catchAsync(async (req, res) => {
  const classNumber = await classNumberService.createClassNumber(req.body);
  res.status(httpStatus.CREATED).send(classNumber);
});

const getClassNumbers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await classNumberService.queryClassNumbers(filter, options);
  res.send(result);
});

const getClassNumber = catchAsync(async (req, res) => {
  const classNumber = await classNumberService.getClassNumberById(req.params.id);
  if (!classNumber) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ClassNumber not found');
  }
  res.send(classNumber);
});

const updateClassNumber = catchAsync(async (req, res) => {
  const classNumber = await classNumberService.updateClassNumberById(req.params.id, req.body);
  res.send(classNumber);
});

const deleteClassNumber = catchAsync(async (req, res) => {
  await classNumberService.deleteClassNumberById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClassNumber,
  getClassNumbers,
  getClassNumber,
  updateClassNumber,
  deleteClassNumber,
};
