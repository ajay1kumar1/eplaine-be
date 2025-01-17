const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/models/user.model');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  contactNumber: '753',
  gender: 'male',
  lastName: 'ln',
  firstName: 'fn',
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  contactNumber: '753',
  gender: 'male',
  lastName: 'ln',
  firstName: 'fn',
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  contactNumber: '753',
  gender: 'male',
  lastName: 'ln',
  firstName: 'fn',
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
