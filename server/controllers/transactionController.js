const Transaction = require ('../models/Transaction');
const Product = require ('../models/Product');

const createTransaction = async (req, res) => {
  try {
    let {type, category, product, price, quantity} = req.body;
    quantity = Number (quantity);

    // Find the product
    console.log ('PRODUCT:', product);
    const updatedProduct = await Product.findById (product);

    if (type === 'stockOut' && updatedProduct.quantityInStock < quantity) {
      return res.status (400).json ({error: 'Insufficient quantity in stock'});
    }

    if (type === 'stockIn') {
      updatedProduct.quantityInStock += quantity;
    } else if (type === 'stockOut') {
      updatedProduct.quantityInStock -= quantity;
    }

    // Save the updated product
    await updatedProduct.save ();

    // Create a new transaction
    const transaction = new Transaction ({
      transactionType: type,
      category,
      product,
      price,
      quantity,
    });

    // Save the transaction in the database
    const savedTransaction = await transaction.save ();
    console.log (savedTransaction);

    res.status (201).json (savedTransaction);
  } catch (error) {
    console.error ('Error creating transaction:', error);
    res.status (500).json ({error: 'Internal server error'});
  }
};

const getFilteredTransactions = async (req, res) => {
  try {
    // Récupérez les filtres de req.query
    const {type, category, product, startDate, endDate} = req.query;

    // Construisez un objet de filtre en fonction des paramètres reçus
    const filter = {};

    if (type) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }

    if (product) {
      filter.product = product;
    }

    if (startDate && endDate) {
      filter.createdAt = {$gte: new Date (startDate), $lte: new Date (endDate)};
    }

    // Recherchez les transactions avec les filtres
    const filteredTransactions = await Transaction.find (filter);

    res.status (200).json (filteredTransactions);
  } catch (error) {
    console.error (
      'Erreur lors de la récupération des transactions filtrées :',
      error
    );
    res.status (500).json ({error: 'Erreur interne du serveur'});
  }
};

// const updateTransaction = async (req, res) => {
//   try {
//     const {id} = req.params;
//     let {transactionType: type, category, product, price, quantity} = req.body;

//     // Vérifiez si la transaction existe
//     const transaction = await Transaction.findById (id);

//     if (!transaction) {
//       return res.status (404).json ({error: 'Transaction non trouvée'});
//     }

//     // Mettez à jour la transaction
//     transaction.transactionType = type;
//     transaction.category = category;
//     transaction.product = product;
//     transaction.price = price;
//     transaction.quantity = quantity;

//     // Enregistrez la transaction mise à jour
//     const updatedTransaction = await transaction.save ();

//     res.status (200).json (updatedTransaction);
//   } catch (error) {
//     console.error ('Erreur lors de la mise à jour de la transaction :', error);
//     res.status (500).json ({error: 'Erreur interne du serveur'});
//   }
// };
const updateTransaction = async (req, res) => {
  try {
    const {id} = req.params;
    const updatedTransaction = await Transaction.findByIdAndUpdate (
      id,
      req.body,
      {new: true}
    );

    if (!updatedTransaction) {
      return res.status (404).json ({message: 'Transaction non trouvée'});
    }

    res.status (200).json (updatedTransaction);
  } catch (error) {
    res.status (500).json ({error: error.message});
  }
};

module.exports = {
  createTransaction,
  getFilteredTransactions,
  updateTransaction,
};
