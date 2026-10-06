import Joi from 'joi';

const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value: validateRes } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details.map(detail => detail.message)
            })
        } else {
            if (!req.value) req.value = {};

            req.value.body = validateRes;
            next();
        }
    }
}

const validateParams = (schema, field) => {
    return (req, res, next) => {
        const { error, value } = schema.validate({param: req.params[field]});

        if (error) {
            return res.status(400).json({
                error: error.details.map((detail) => detail.message)
            });
        } else {
            if (!req.value) req.value = {};
            if (!req.value['params']) req.value['params'] = {};
            req.value.params[field] = value.param;
            next();
        }
    }
}

const schemas = {
    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9]{2}$/).required()
    }),

    userSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        fullName: Joi.string().trim().min(3).max(30).required(),
        password: Joi.string().min(8).required(),
    })
}

export {
    validateBody,
    validateParams,
    schemas
};
