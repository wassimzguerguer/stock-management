require ('dotenv').config ();
const express = require ('express');
const mongoose = require ('mongoose');
const userRoutes = require ('./routes/users');
const productRoutes = require ('./routes/products');
const categoryRoutes = require ('./routes/category');
const transactionRoutes = require ('./routes/transaction');

const cors = require ('cors');
const errorHandler = require ('./middleware/errorMiddleware');
//const cookieParser = require ('cookies-parser');
//const bodyParser = require ('body-parser');

// express app
const app = express ();

// middleware
app.use (cors ());
app.use (express.json ());
app.use (express.urlencoded ({extended: true}));
//app.use (cookieParser);
//app.use (bodyParser.json ());

app.use ((req, res, next) => {
  //console.log (req.path, req.method);
  next ();
});

// routes
app.use ('/api/users', userRoutes);
app.use ('/api/products', productRoutes);
app.use ('/api/category', categoryRoutes);
app.use ('/api/transactions', transactionRoutes);

// error middleware
//app.use (errorHandler);

// connect to db
mongoose
  .connect (process.env.MONGO_URI)
  .then (() => {
    console.log ('connected to database');
    // listen to port
    app.listen (process.env.PORT, () => {
      console.log ('listening for requests on port', process.env.PORT);
    });
  })
  .catch (err => {
    console.log (err);
  });
