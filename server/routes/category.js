const express = require ('express');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getById,
} = require ('../controllers/categoryController');
const router = express.Router ();

router.get ('/', getAllCategories);
router.get ('/:id', getById);
router.post ('/', createCategory);
router.put ('/:id', updateCategory);
router.delete ('/:id', deleteCategory);

module.exports = router;
