const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const validate = require('../middleware/validate');
const { expenseSchema } = require('../validators/expenseSchema');

router.get('/', expenseController.getAllExpenses);
router.post('/', validate(expenseSchema), expenseController.createExpense);
router.put('/:id', validate(expenseSchema), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
