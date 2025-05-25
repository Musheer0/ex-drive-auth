import Joi from 'joi';


const googleOAuthUserSchema = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required(), // Google ID is a string of digits
  email: Joi.string().email().required(),
  verified_email: Joi.boolean().required(),
  name: Joi.string().min(1).max(100).required(),
  given_name: Joi.string().min(1).max(100).required(),
  family_name: Joi.string().min(1).max(100).required(),
  picture: Joi.string().uri().optional().allow(null, ''),
});
const credentialsUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(1).max(100).required(),
  picture: Joi.string().uri().optional().allow(null, ''),
});
export const ValidateOAuthData = (data)=> googleOAuthUserSchema.validate(data) 
export const ValidateCredentialsData = (data)=> credentialsUserSchema.validate(data) 