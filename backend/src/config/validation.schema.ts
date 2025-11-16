import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_HOST: Joi.string().hostname().default('localhost').required(),
  REDIS_PORT: Joi.number().port().default(6379).required(),
  JWT_SECRET: Joi.string().required(),
});

export default validationSchema;
