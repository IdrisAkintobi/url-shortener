import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
    APP_PORT: Joi.number().port().required(),
    REDIS_PORT: Joi.number().port().required(),
    REDIS_HOST: Joi.string().required(),
    BASE_URL: Joi.string().uri().required(),
    SHORT_URL_LENGTH: Joi.number().default(6),
});
