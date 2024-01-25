const mongoose = require ('mongoose');

const transactionSchema = new mongoose.Schema (
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['stockIn', 'stockOut'], // Indique s'il s'agit d'une entrée ou d'une sortie
      required: true,
    },
  },
  {timestamps: true}
);

const Transaction = mongoose.model ('Transaction', transactionSchema);

module.exports = Transaction;
