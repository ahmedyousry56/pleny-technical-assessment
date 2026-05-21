
import * as Joi from 'joi';

export const configurationsSchema = Joi.object({
    // APP CONFIGURATIONS
    APP_NAME: Joi.string().default('Restaurant API'),
    APP_DESCRIPTION: Joi.string().default('Restaurant API documentation'),
    APP_VERSION: Joi.string().default('1.0.0'),
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    DEFAULT_LANGUAGE: Joi.string().valid('en', 'ar').default('en'),

    // DATABASE CONFIGURATIONS
    MONGODB_URI: Joi.string().required(),
});