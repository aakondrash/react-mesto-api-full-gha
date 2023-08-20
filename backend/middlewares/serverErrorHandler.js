const serverErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  let message = err.message;
  if (statusCode === 500) {
    message = 'Произошла какая-то серверная ошибка';
  }

  res.status(statusCode).send({ message });
  next();
};

module.exports = serverErrorHandler;