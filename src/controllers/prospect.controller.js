const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { batchService, subjectService, prospectService } = require('../services');

const createProspect = catchAsync(async (req, res) => {
  const prospect = await prospectService.createProspect(req.body);
  res.status(httpStatus.CREATED).send(prospect);
});

const getProspects = catchAsync(async (req, res) => {
  const { page, limit, name, ...filters } = req.query;
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
  const result = await prospectService.queryProspects(filter, options);
  res.send(result);
});

const getProspect = catchAsync(async (req, res) => {
  const prospect = await prospectService.getProspectById(req.params.id);
  if (!prospect) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prospect not found');
  }
  res.send(prospect);
});

const updateProspect = catchAsync(async (req, res) => {
  const prospect = await prospectService.updateProspectById(req.params.id, req.body);
  res.send(prospect);
});

const deleteProspect = catchAsync(async (req, res) => {
  await prospectService.deleteProspectById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getProspectsByBatchAndSubject = catchAsync(async (req, res) => {
  const { batchName, subjectName } = req.params;
  const batch = await batchService.getBatchByName(batchName);
  const subject = await subjectService.getSubjectByName(subjectName);
  const prospects = await prospectService.getProspectsByBatchIdAndSubjectId(batch._id, subject._id);
  res.send(prospects);
});

module.exports = {
  createProspect,
  getProspects,
  getProspect,
  updateProspect,
  deleteProspect,
  getProspectsByBatchAndSubject,
};
