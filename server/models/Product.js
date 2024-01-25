const mongoose = require ('mongoose');
//const Category = require ('../models/Category');

const productSchema = new mongoose.Schema (
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      //required: true,
    },
    quantityInStock: {
      type: Number,
      default: 0,
    },
    // image: {
    //   type: String,
    // },
    // pictures: {
    //     type: Object,
    //     default: {},
    //   },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model ('Product', productSchema);

module.exports = Product;
