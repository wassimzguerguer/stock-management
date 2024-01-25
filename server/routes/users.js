const express = require ('express');

// Import the registerUser function from the controller

const {
  registerUser,
  loginUser,
  getOneUser,
  updateUser,
  deleteUser,
  getAllUsers,
  changePassword,
  forgotPassword,
  resetPassword,
} = require ('../controllers/userController');
const protect = require ('../middleware/authMiddleware');

const router = express.Router ();

router.post ('/register', registerUser); // Use registerUser as the callback function for the post method
router.post ('/login', loginUser); // Use loginUser as the callback function for the post method
router.get ('/:id', getOneUser);
router.put ('/update/:id', updateUser);
router.put ('/changepassword', protect, changePassword);
router.get ('/', getAllUsers);
router.delete ('/:id', deleteUser);
router.post ('/forgotpassword', forgotPassword);
router.put ('/resetpassword/:resetToken', resetPassword);

module.exports = router;
