const Product = require('../models/product');
const Category = require('../models/category');
const Transaction = require('../models/transaction');


// productController.js - Updated productIn function
exports.productIn = async (req, res) => {
  const productId = req.params.id;
  const { quantity, unitPrice, totalPrice } = req.body;

  if (!productId || quantity === undefined || !unitPrice || !totalPrice) {
    return res.status(400).json({ error: 'Product ID, quantity, unitPrice, and totalPrice are required.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Update product stock and price
    product.stock += parseInt(quantity, 10);
    product.unitPrice = unitPrice;
    product.totalPrice = product.stock * unitPrice;

    // Create transaction
    const dateTime = new Date();
    const transaction = new Transaction({ 
      product: product._id, 
      dateTime, 
      quantity, 
      unitPrice, 
      totalPrice, 
      type: 'in' 
    });

    // Save both updates
    await Promise.all([product.save(), transaction.save()]);

    res.json({ 
      message: 'Product in transaction created successfully.', 
      product,
      transaction 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product in transaction.', details: err.message });
  }
};

// productController.js - Updated productOut function
exports.productOut = async (req, res) => {
  const productId = req.params.id;
  const { quantity, unitPrice, totalPrice } = req.body;

  if (!productId || quantity === undefined || !unitPrice || !totalPrice) {
    return res.status(400).json({ error: 'Product ID, quantity, unitPrice, and totalPrice are required.' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock available.' });
    }

    // Update product stock and price
    product.stock -= parseInt(quantity, 10);
    product.unitPrice = unitPrice;
    product.totalPrice = product.stock * unitPrice;

    // Create transaction
    const dateTime = new Date();
    const transaction = new Transaction({ 
      product: product._id, 
      dateTime, 
      quantity, 
      unitPrice, 
      totalPrice, 
      type: 'out' 
    });

    // Save both updates
    await Promise.all([product.save(), transaction.save()]);

    res.json({ 
      message: 'Product out transaction created successfully.', 
      product,
      transaction 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product out transaction.', details: err.message });
  }
};

// exports.stockOut = async (req, res) => {
//   const { stock } = req.body;
//   const productId = req.params.id;

//   if (!stock || stock <= 0) {
//     return res.status(400).json({ error: 'Quantity must be a positive number.' });
//   }

//   try {
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found.' });
//     }

//     // Log the product to debug
//     console.log('Product before stock update:', product);

//     // Validate the category (optional, for debugging purposes)
//     if (!product.category) {
//       return res.status(400).json({ error: 'Product is missing a category. Please update the product.' });
//     }

//     // Check for sufficient stock
//     if (product.stock < stock) {
//       return res.status(400).json({ error: `Insufficient stock. Available stock: ${product.stock}` });
//     }

//     // Reduce stock
//     product.stock -= parseInt(stock, 10);
//     await product.save();

//     res.json({ message: 'Stock reduced successfully.', product });
//   } catch (err) {
//     console.error('Stock-out error:', err);
//     res.status(500).json({ error: 'Internal server error.', details: err.message });
//   }
// };

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, quantity, category, unitPrice, totalPrice } = req.body;

  if (!name || !quantity || !category || !unitPrice || !totalPrice) {
    return res.status(400).json({ 
      error: 'Name, quantity, category, unitPrice, and totalPrice are required.' 
    });
  }

  try {
    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      return res.status(400).json({ error: `Category '${category}' does not exist.` });
    }

    const product = new Product({ 
      name, 
      stock: quantity, 
      category: existingCategory.name, 
      unitPrice, 
      totalPrice 
    });
    
    // Create initial stock-in transaction
    const dateTime = new Date();
    const transaction = new Transaction({ 
      product: product._id, 
      dateTime, 
      quantity, 
      unitPrice, 
      totalPrice, 
      type: 'in' 
    });

    await Promise.all([product.save(), transaction.save()]);

    res.status(201).json({ 
      message: 'Product created successfully with initial stock transaction.', 
      product,
      transaction 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product.', details: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // No need to populate since category is stored by name
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products.', details: err.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product.', details: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { name, quantity, category, unitPrice, totalPrice } = req.body;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    // Update product fields
    if (name) product.name = name;
    if (unitPrice) product.unitPrice = unitPrice;
    if (totalPrice) product.totalPrice = totalPrice;

    if (quantity !== undefined) {
      const difference = quantity - product.stock;
      if (difference !== 0) {
        // Create a transaction for the stock adjustment
        const transaction = new Transaction({
          product: product._id,
          dateTime: new Date(),
          quantity: Math.abs(difference),
          unitPrice: product.unitPrice,
          totalPrice: Math.abs(difference) * product.unitPrice,
          type: difference > 0 ? 'in' : 'out'
        });
        await transaction.save();
        product.stock = quantity;
      }
    }

    if (category) {
      const existingCategory = await Category.findOne({ name: category });
      if (!existingCategory) {
        return res.status(400).json({ error: `Category '${category}' does not exist.` });
      }
      product.category = existingCategory.name;
    }

    await product.save();
    res.json({ 
      message: 'Product updated successfully.', 
      product 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product.', details: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product.', details: err.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products by category.', details: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories.', details: err.message });
  }
};
// create category 
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  try {
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Category created successfully.', category });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category.', details: err.message });
  }
};