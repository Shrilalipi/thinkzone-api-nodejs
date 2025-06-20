export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        name: err.name || '',
        message: err.message || 'Internal server error',
        statusCode
    });
}