const Joi = require('joi');

const expenseSchema = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'any.required': 'User ID is required',
        'number.base': 'User ID must be a number'
    }),
    category: Joi.number().integer().required().messages({
        'any.required': 'Category is required',
        'number.base': 'Category must be a number'
    }),
    amount: Joi.number().positive().required().messages({
        'any.required': 'Amount is required',
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be a positive number'
    }),
    description: Joi.string().allow('', null).max(255),
    date: Joi.date().iso().required().messages({
        'any.required': 'Date is required',
        'date.format': 'Date must be a valid ISO format'
    })
});

module.exports = { expenseSchema };
