const express = require ('express');
const router = express.Router (); // Initialize the router

// Import the necessary functions from the controller
const {
  getFilteredProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getProductsByCategory,
} = require ('../controllers/productController');

// Define the routes
router.get ('/', getFilteredProducts); // Use the imported function directly
// router.get ('/:id', getProductDetails); // Use the imported function directly
router.post ('/', createProduct); // Use the imported function directly
router.put ('/:id', updateProduct); // Use the imported function directly
router.delete ('/:id', deleteProduct); // Use the imported function directly
router.get ('/:categoryId', getProductsByCategory); // Use the imported function directly

module.exports = router;
