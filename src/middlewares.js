/* eslint-disable consistent-return */

const notFound = (req, res, next) => {
  res.status(404);
  const notFoundRoute = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(notFoundRoute);
};

//! need test
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    code: statusCode,
    success: false,
    err_message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
