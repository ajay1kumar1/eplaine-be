const express = require('express');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
//const teacherRoute = require('./teacher.route');
//const studentRoute = require('./student.route');
//const parentRoute = require('./parent.route');
//const batchRoute = require('./batch.route');
//const subjectRoute = require('./subject.route');
//const attendanceRoute = require('./attendance.route');
//const paymentRoute = require('./payment.route');
//const recordRoute = require('./record.route');
//const classNumberRoute = require('./classNumber.route');
//const prospectRoute = require('./prospect.route');
//const boardNameRoute = require('./boardName.route');
//const examRoute = require('./exam.route');
//const examScheduleRoute = require('./examSchedule.route');
//const examAttemptRoute = require('./examAttempt.route');

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: '/record',
  //   route: recordRoute,
  // },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  // {
  //   path: '/classNumbers',
  //   route: classNumberRoute,
  // },
  // {
  //   path: '/boardNames',
  //   route: boardNameRoute,
  // },
  // {
  //   path: '/students',
  //   route: studentRoute,
  // },
  // {
  //   path: '/teachers',
  //   route: teacherRoute,
  // },
  // {
  //   path: '/parents',
  //   route: parentRoute,
  // },
  // {
  //   path: '/subjects',
  //   route: subjectRoute,
  // },
  // {
  //   path: '/batches',
  //   route: batchRoute,
  // },
  // {
  //   path: '/attendances',
  //   route: attendanceRoute,
  // },
  // {
  //   path: '/payments',
  //   route: paymentRoute,
  // },
  // {
  //   path: '/prospects',
  //   route: prospectRoute,
  // },
  // {
  //   path: '/exams',
  //   route: examRoute,
  // },
  // {
  //   path: '/exam-schedules',
  //   route: examScheduleRoute,
  // },
  // {
  //   path: '/exam-attempts',
  //   route: examAttemptRoute,
  // },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
