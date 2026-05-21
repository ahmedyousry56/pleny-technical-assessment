
import * as Joi from 'joi';

export const configurationsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DEFAULT_LANGUAGE: Joi.string().valid('en', 'ar').default('en'),
});