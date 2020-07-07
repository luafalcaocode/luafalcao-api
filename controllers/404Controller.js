const config = require('../config/config');

exports.notFound = (request, response, next) => {
    response.status(config.statusCode.notFound).render('404');
};