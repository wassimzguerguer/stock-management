const express = require ('express');
const router = express.Router (); // Initialize the router

// Import the necessary functions from the controller
const {
  createTransaction,
  getFilteredTransactions,
  updateTransaction,
} = require ('../controllers/transactionController');

// Define the routes
router.get ('/', getFilteredTransactions); // Use the imported function directly
router.post ('/', createTransaction); // Use the imported function directly
router.put ('/:id', updateTransaction); // Use the imported function directly

module.exports = router;
