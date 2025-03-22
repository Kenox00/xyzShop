// File: models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique name for each category
});

module.exports = mongoose.model('Category', categorySchema);