const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { boardNameService } = require('../services');

const createBoardName = catchAsync(async (req, res) => {
  const boardName = await boardNameService.createBoardName(req.body);
  res.status(httpStatus.CREATED).send(boardName);
});

const getBoardNames = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await boardNameService.queryBoardNames(filter, options);
  res.send(result);
});

const getBoardName = catchAsync(async (req, res) => {
  const boardName = await boardNameService.getBoardNameById(req.params.id);
  if (!boardName) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BoardName not found');
  }
  res.send(boardName);
});

const updateBoardName = catchAsync(async (req, res) => {
  const boardName = await boardNameService.updateBoardNameById(req.params.id, req.body);
  res.send(boardName);
});

const deleteBoardName = catchAsync(async (req, res) => {
  await boardNameService.deleteBoardNameById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBoardName,
  getBoardNames,
  getBoardName,
  updateBoardName,
  deleteBoardName,
};
