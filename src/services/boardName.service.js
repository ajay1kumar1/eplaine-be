const httpStatus = require('http-status');
const { BoardName } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a boardName
 * @param {Object} boardNameBody
 * @returns {Promise<BoardName>}
 */
const createBoardName = async (boardNameBody) => {
  return BoardName.create(boardNameBody);
};

/**
 * Query for boardNames
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBoardNames = async (filter, options) => {
  const boardNames = await BoardName.paginate(filter, options);
  return boardNames;
};

/**
 * Get boardName by id
 * @param {ObjectId} id
 * @returns {Promise<BoardName>}
 */
const getBoardNameById = async (id) => {
  return BoardName.findById(id);
};

/**
 * Get boardName by email
 * @param {string} email
 * @returns {Promise<BoardName>}
 */
const getBoardNameByEmail = async (email) => {
  return BoardName.findOne({ email });
};

/**
 * Update boardName by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<BoardName>}
 */
const updateBoardNameById = async (id, updateBody) => {
  const boardName = await getBoardNameById(id);
  if (!boardName) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BoardName not found');
  }
  Object.assign(boardName, updateBody);
  await boardName.save();
  return boardName;
};

/**
 * Delete boardName by id
 * @param {ObjectId} id
 * @returns {Promise<BoardName>}
 */
const deleteBoardNameById = async (id) => {
  const boardName = await getBoardNameById(id);
  if (!boardName) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BoardName not found');
  }
  await boardName.remove();
  return boardName;
};

module.exports = {
  createBoardName,
  queryBoardNames,
  getBoardNameById,
  getBoardNameByEmail,
  updateBoardNameById,
  deleteBoardNameById,
};
