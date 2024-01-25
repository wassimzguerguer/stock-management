const Product = require ('../models/Product');
const Category = require ('../models/Category');

const getFilteredProducts = async (req, res) => {
  try {
    // const sort = {_id: -1};
    // const categories = req.query.categories;
    // console.log (categories);
    // if (categories) {
    //   const products = await Product.find ({
    //     categories: {$in: categories},
    //   }).sort (sort);
    //   return res.status (200).json (products);
    // }
    // const products = await Product.find ().sort (sort);
    // res.status (200).json (products);
    let filter = {};
    if (req.query.categories) {
      filter = {category: req.query.categories.split (',')};
    }
    const products = await Product.find (filter).populate ('category');
    // const products = await Product.find (filter).populate (
    //   'category',
    //   'name -_id'
    // );

    return res.status (200).json (products);
  } catch (error) {
    res.status (400).send (error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    //verification category already Exist
    const category = await Category.findById (req.body.category);
    if (!category) {
      return res.status (400).send ({message: 'Invaid Category'});
    }

    // verification Product already Exist;

    const checkProd = await Product.findOne ({name: req.body.name});
    console.log (checkProd);
    if (checkProd) {
      return res.status (400).send ({
        message: 'Product already Exist!',
      });
    }
    const product = new Product ({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      quantityInStock: req.body.quantityInStock,
    });

    const savedProduct = await product.save ();
    res.status (201).json (savedProduct);
  } catch (error) {
    console.error ('Error creating product:', error);
    res.status (500).json ({error: 'Internal Server Error'});
  }
};

const updateProduct = async (req, res) => {
  const {id} = req.params;
  try {
    const {name, description, price, category, quantityInStock} = req.body;
    const product = await Product.findByIdAndUpdate (id, {
      name,
      description,
      price,
      quantityInStock,
      category,
    });
    const products = await Product.find ();
    res.status (200).json (products);
  } catch (error) {
    res.status (400).send (error.message);
  }
};

/*const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user.isAdmin) return res.status(401).json("You don't have permission");
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error.message);
  }
};*/
const deleteProduct = async (req, res) => {
  const {id} = req.params;
  try {
    await Product.findByIdAndDelete (id);
    const products = await Product.find ();
    res.status (200).json (products);
  } catch (error) {
    res.status (400).send (error.message);
  }
};

const getProductDetails = async (req, res) => {
  const {id} = req.params;
  try {
    const product = await Product.findById (id);
    const similar = await Product.find ({
      categoryId: product.categoryId,
    }).limit (5);
    res.status (200).json ({product, similar});
  } catch (error) {
    res.status (400).send (error.message);
  }
};

const getProductsByCategory = async (req, res) => {
  const {categoryId} = req.params;
  try {
    let products;
    const sort = {_id: -1};
    if (categoryId === 'all') {
      products = await Product.find ().sort (sort);
    } else {
      // products = await Product.find ({categoryId}).sort (sort);
      products = await Product.find ({category: categoryId}).populate (
        'category'
      );
    }
    return res.status (200).json (products);
  } catch (error) {
    return res.status (400).send (error.message);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getProductsByCategory,
  getFilteredProducts,
};
