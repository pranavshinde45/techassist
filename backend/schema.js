
const Joi = require("joi");

const shopSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    description: Joi.string().allow(""),
    contact: Joi.string().allow(""),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
});

const bookingSchema = Joi.object({
  contact: Joi.string().min(7).max(15).required(),
  issue: Joi.string().required(),
  serviceType: Joi.string().valid('remote', 'inPerson').required(),
  sessionLink: Joi.string().uri().allow(null, ''),
  sessionTime: Joi.date(),
  sessionId: Joi.string().allow('', null),

  // ✅ Allow and require shopId here
  shopId: Joi.string().required()
});


const technicianSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    contact: Joi.string().required(),
    qualification: Joi.string().min(2).max(100),
})

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000).required()
})

module.exports = {shopSchema, bookingSchema, reviewSchema, technicianSchema};