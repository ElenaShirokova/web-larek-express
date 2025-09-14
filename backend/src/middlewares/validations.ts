import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

const orderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string()).min(1).required(),
});

export const validateOrderBody: RequestHandler = celebrate({
  [Segments.BODY]: orderSchema,
});

const productShema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  category: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).allow(null),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
});

export const validateProductBody: RequestHandler = celebrate({
  [Segments.BODY]: productShema,
});
