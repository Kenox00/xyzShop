// File: models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true }, 
  unitPrice: { type: Number, required: true }, // new field
  totalPrice: { type: Number, required: true }, // new field
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

