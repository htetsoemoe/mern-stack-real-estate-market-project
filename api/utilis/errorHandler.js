// Custom Error Handler
const errorHandler = (statusCode, message) => {
    const error = new Error(); // using Error constructor
    error.statusCode = statusCode;
    error.message = message;
    return error;
}

module.exports = { errorHandler }
