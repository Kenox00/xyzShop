const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    dateTime: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    type: { type: String, required: true, enum: ['in', 'out'] }
  });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  
  module.exports = Transaction;