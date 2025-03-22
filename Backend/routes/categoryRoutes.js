const { Router } = require('express');
const router = Router(); 
const authenticate = require('../middleware/authMiddleware');
const { createCategory, getAllCategories, getProductsByCategory } = require('../controllers/productController');


router.post('/',authenticate, createCategory)
router.get('/',authenticate, getAllCategories)
router.post('/:category',authenticate, getProductsByCategory )
 
module.exports = router