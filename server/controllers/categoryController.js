const Category = require ('../models/Category');

// Obtenir toutes les catégories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find ();
    res.json (categories);
  } catch (error) {
    res.status (500).json ({
      message: error.message,
    });
  }
};
//get categories by id 
const getById=async (req, res) => {
   const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category with the given ID was not found.'})
    } 
    res.status(200).send(category);

} ;


// Créer une nouvelle catégorie
const createCategory = async (req, res) => {
  const category = new Category (req.body);

  try {
    const newCategory = await category.save ();
    res.status (201).json (newCategory);
  } catch 
   {
    if (!category)
    return res.status (400).send ('the category cannot be created!');

  }
};

// Mettre à jour une catégorie par id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById (req.params.id);
    if (!category) {
      return res.status (404).json ({
        message: 'Category not found',
      });
    }

    category.name = req.body.name;

    const updatedCategory = await category.save ();
    res.json (updatedCategory);
  } catch (error) {
    res.status (400).json ({
      message: error.message,
    });
  }
};

// Supprimer une catégorie par id
const deleteCategory = async (req, res) => {
  try {
    // const category = await Category.findById (req.params.id);
   
    // if (!category) {
    //   return res.status (404).json ({
    //     message: 'Category not found',
    //   });
    // }
    // await category.remove ();
    // console.log (category);

    // res.json ({
    //   message: 'Category deleted',
    // });
    Category.findByIdAndRemove (req.params.id).then (category => {
  if (!category) {
    return res.status (404).send ({
      message: 'Category not found with id' + req.params.catId,
    });
  }
  res.send ({
    status: '200',
    message: 'Category Deleted!',
    data: category,
  });
});

    
  } catch (error) {
    res.status (500).json ({
      message: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getById,
  createCategory,
  updateCategory,
  deleteCategory,
};
