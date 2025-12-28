const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');

router.get('/users', userController.getAllUsers);
router.get('/categories', categoryController.getAllCategories);

module.exports = router;
