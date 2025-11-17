import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri()
    .default('postgresql://admin:admin123@localhost:5432/aileplus?schema=public'),
  REDIS_HOST: Joi.string().hostname().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  JWT_SECRET: Joi.string().default('supersecretjwt'),
});

export default validationSchema;
