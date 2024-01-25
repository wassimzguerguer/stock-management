// controllers/UserController.js
const asyncHandler = require ('express-async-handler');

const bcrypt = require ('bcrypt');
const User = require ('../models/User');
const jwt = require ('jsonwebtoken');
const mongoose = require ('mongoose');
const crypto = require ('crypto');
const Token = require ('../models/token');
const sendEmail = require ('../utils/sendEmail');

// fnct Creat user

const registerUser = async (req, res) => {
  try {
    const {name, email, password, phoneNumber, role} = req.body;

    const existingUser = await User.findOne ({email});
    if (existingUser) {
      return res.status (400).json ({message: 'Email already registered'});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash (password, saltRounds);

    const newUser = new User ({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await newUser.save ();

    res.json (newUser);
  } catch (error) {
    console.error ('Error during user registration:', error);
    res
      .status (500)
      .json ({message: 'An error occurred during user registration'});
  }
};
// fnct login

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne ({email});

    if (!user) {
      return res.status (401).json ({message: 'Invalid email or password'});
    }

    const isPasswordValid = await bcrypt.compare (password, user.password);

    if (!isPasswordValid) {
      return res.status (401).json ({message: 'Invalid email or password'});
    }

    const token = jwt.sign ({userId: user._id}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json ({token, role: user.role, name: user.name, userId: user._id});
  } catch (error) {
    console.error ('Error during user login:', error);
    res.status (500).json ({message: 'An error occurred during user login'});
  }
};

//get single user

const getOneUser = async (req, res) => {
  try {
    const user = await User.findById (req.params.id);
    if (!user) return res.status (400).json ({msg: 'User does not exist.'});

    res.json (user);
  } catch (err) {
    return res.status (500).json ({msg: err.message});
  }
};

//update user

const updateUser = async (req, res) => {
  try {
    const {name, email, phoneNumber} = req.body;
    await User.findOneAndUpdate (
      {_id: req.params.id},
      {name, email, phoneNumber}
    );

    res.json ({msg: 'Updated a user'});
  } catch (err) {
    return res.status (500).json ({msg: err.message});
  }
};

// change password
const changePassword = asyncHandler (async (req, res) => {
  console.log (req.user);
  const user = await User.findById (req.user._id);
  const {oldPassword, password} = req.body;

  if (!user) {
    res.status (400);
    throw new Error ('User not found, please signup');
  }
  //Validate
  if (!oldPassword || !password) {
    res.status (400);
    throw new Error ('Please add old and new password');
  }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare (oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash (password, saltRounds);
    user.password = hashedPassword;
    await user.save ();
    res.status (200).send ('Password change successful');
  } else {
    res.status (400);
    throw new Error ('Old password is incorrect');
  }
});

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find ();
    res.json (users);
  } catch (err) {
    return res.status (500).json ({msg: err.message});
  }
};

// delete user

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete the user
    await User.findByIdAndDelete (userId);

    // Delete related employee categories (if needed)
    // await EmployeeCategory.deleteMany({ userId });

    res.json ({message: 'User deleted successfully'});
  } catch (error) {
    console.error ('Error deleting user:', error);
    res
      .status (500)
      .json ({message: 'An error occurred while deleting the user'});
  }
};
//forgot passsword
const forgotPassword = asyncHandler (async (req, res) => {
  //get variable depuit front
  const {email} = req.body;
  const user = await User.findOne ({email});

  if (!user) {
    res.status (404);
    throw new Error ('User does not exist');
  }
  //delet Old Token
  let token = await Token.findOne ({userId: user._id});
  if (token) {
    await token.deleteOne ();
  }

  // Create Reste Token
  let resetToken = crypto.randomBytes (32).toString ('hex') + user._id;
  console.log (resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash ('sha256')
    .update (resetToken)
    .digest ('hex');
  //console.log (hashedToken);
  // Save Token to DB
  await new Token ({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now (),
    expiresAt: Date.now () + 30 * (60 * 1000), // Thirty minutes
  }).save ();
  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  console.log (resetUrl);

  // Reset Email
  const message = `
      <h2>Hello ${user.name}</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>Pinvent Team</p>
    `;

  const subject = 'Password Reset Request';
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail (subject, message, send_to, sent_from);
    res.status (200).json ({success: true, message: 'Reset Email Sent'});
  } catch (error) {
    res.status (500);
    throw new Error ('Email not sent, please try again');
  }
});
// Reset password
const resetPassword = asyncHandler (async (req, res) => {
  const {password} = req.body;
  const {resetToken} = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash ('sha256')
    .update (resetToken)
    .digest ('hex');

  // fIND tOKEN in DB
  const userToken = await Token.findOne ({
    token: hashedToken,
    expiresAt: {$gt: Date.now ()},
  });
  //user not find token
  if (!userToken) {
    res.status (404);
    throw new Error ('Invalid or Expired Token');
  }

  // Find user
  const user = await User.findOne ({_id: userToken.userId});
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash (password, saltRounds);
  user.password = hashedPassword;
  await user.save ();
  res.status (200).json ({
    message: 'Password Reset Successful, Please Login',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getOneUser,
  updateUser,
  deleteUser,
  getAllUsers,
  changePassword,
  forgotPassword,
  resetPassword,
};
