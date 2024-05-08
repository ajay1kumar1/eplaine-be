const { Attendance, Subject, Batch, Parent, Student, BoardName, ClassNumber, Teacher } = require('../models');

// Define a function to fetch records based on selected values
async function getRecordsForStudentForm() {
  const subjects = await Subject.find();
  const batches = await Batch.find();
  const parents = await Parent.find();

  return { subjects, batches, parents };
}

async function getRecordsForTeacherForm() {
  const subjects = await Subject.find();

  return { subjects };
}

async function getRecordsForParentForm() {
  const student = await Student.find();

  return { student };
}

async function getRecordsForBatchForm() {
  const boardNames = await BoardName.find();
  const classNumbers = await ClassNumber.find();
  const subjects = await Subject.find();
  const teachers = await Teacher.find();

  return { boardNames, classNumbers, subjects, teachers };
}

async function getRecordsForAttendanceForm() {
  const boardNames = await BoardName.find();
  const batches = await Batch.find();
  const classNumbers = await ClassNumber.find();
  const subjects = await Subject.find();

  return { boardNames, classNumbers, batches, subjects };
}

async function getRecordsForPaymentForm() {
  const boardNames = await BoardName.find();
  /* const batches = await Batch.find(); */

  const batches = await Batch.find().lean();
  const populatedBatches = await Batch.populate(batches, { path: 'students' });
  const classNumbers = await ClassNumber.find();

  return { boardNames, classNumbers, batches: populatedBatches };
}

async function getRecordsForExamForm() {
  const classNumbers = await ClassNumber.find();
  const subjects = await Subject.find();

  return { classNumbers, subjects };
}

async function getRecordsForParentForMobile(id) {
  const parents = await Parent.findById(id);
  /* const populatedParents = await Parent.populate(parents, { path: 'children' }); */
  await parents
    .populate({
      path: 'children',
      populate: [
        {
          path: 'batches',
          populate: [
            { path: 'classNumber', model: 'ClassNumber' },
            { path: 'boardName', model: 'BoardName' },
          ],
        },
      ],
    })
    .execPopulate();
  return parents;
}

async function getRecordsForStudentForMobile(id) {
  const students = await Student.findById(id);

  const populatedStudents = await Student.populate(students, {
    path: 'parents',
  });
  await populatedStudents
    .populate({
      path: 'batches',
      populate: [
        {
          path: 'classNumber',
          model: 'ClassNumber',
        },
        {
          path: 'boardName',
          model: 'BoardName',
        },
      ],
    })
    .execPopulate();
  /* const batchId = populatedStudents.batches[0]; */
  /* const selectedBatch = await Batch.findById(batchId); */
  /* const classNumber = await */
  /* const populatedBatches = await Student.populate(selectedBatch, { path: 'classNumber boardName' }); */
  return { populatedStudents };
}

async function getRecordsForStudentAttendanceForMobile(id) {
  const attendanceRecords = await Attendance.find(
    { 'data.student': id },
    { date: 1, subject: 1, batch: 1, 'data.$': 1 } // Projection using $elemMatch
  )
    .populate('subject batch')
    .exec();

  return attendanceRecords;
}

module.exports = {
  getRecordsForAttendanceForm,
  getRecordsForStudentForm,
  getRecordsForParentForm,
  getRecordsForBatchForm,
  getRecordsForPaymentForm,
  getRecordsForExamForm,
  getRecordsForParentForMobile,
  getRecordsForStudentForMobile,
  getRecordsForStudentAttendanceForMobile,
  getRecordsForTeacherForm,
};
