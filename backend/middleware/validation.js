const Joi = require('joi');

/** Validates request body for creation of user
 * 
 * sets  res.locals.body to validation result.
 * sets res.locals.errors if any
 * 
 */
function validateRegister(req, res, next) {

    const schema = Joi.object({
        email: Joi.string().min(5).max(64).email().lowercase(),
        firstName: Joi.string().trim().min(2).max(35),
        lastName: Joi.string().trim().min(2).max(35),
        password: Joi.string().trim().min(8).max(35),
        phoneNumber: Joi.string().trim().min(10).max(12),
    });

    const body = req.body;
    body.phoneNumber.replace(/\D/g, '');
    const { error, value } = schema.validate(body);

    if (error) res.locals.errors = error;
    else res.locals.data = value;

    return next();
}

function validateLogin(req, res, next) {
    const body = req.body;

    const schema = Joi.object({
        email: Joi.string().min(5).max(64).email().lowercase(),
        phoneNumber: Joi.string().trim().min(10).max(12),
        password: Joi.string().trim().min(8).max(35),
    }).or('email', 'phoneNumber');

    if (body.phoneNumber) body.phoneNumber.replace(/\D/g, '');
    const { error, value } = schema.validate(body);

    if (error) res.locals.errors = error;
    else res.locals.data = value;
    return next();
}

module.exports = { validateRegister, validateLogin };
