const errorHandler = (error, request, response, next) => {
    let statusCode = response.statusCode && response.statusCode !== 200 ? response.statusCode : 500

    if (error.name === 'CastError') {
        statusCode = 404
    }

    //en la respuesta del handler
    response.status(statusCode)
    response.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack      
    })
}

module.exports = errorHandler
