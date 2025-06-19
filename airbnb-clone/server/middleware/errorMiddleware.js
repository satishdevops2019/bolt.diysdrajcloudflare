// Global Error Handling Middleware

function errorHandler(err, req, res, next) {
  console.error("Global Error Handler caught an error:");
  if (err.stack) {
    console.error(err.stack);
  } else {
    console.error(err);
  }


  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server!';

  res.status(statusCode).json({
    message: message,
    // Only include stack trace in development environment
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler; // Exporting directly as the function is the middleware
