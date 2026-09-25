const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format'
    }),
    
    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password must be at most 30 characters',
        }),
    remember:Joi.boolean()

});


const validationLogin = (req,res,next) => {
    const {error , value} = schema.validate(req.body)
    if(error){
        return res.status(400).json({success:false, message: error.details[0].message})
    }
    res.locals.data = value;
    next();
}

module.exports = validationLogin