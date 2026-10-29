const mongoose = require('mongoose');
const demoStore = require('../utils/demoStore');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name required'], trim: true, maxlength: 100 },
  description: { type: String, required: [true, 'Description required'], maxlength: 500 },
  price: { type: Number, required: [true, 'Price required'], min: 0 },
  category: { type: String, required: [true, 'Category required'], enum: ['Cakes', 'Cupcakes', 'Cookies', 'Pastries', 'Breads'] },
  imageUrl: { type: String, default: '' },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ category: 1, available: 1 });
productSchema.index({ featured: 1 });

const MongooseProduct = mongoose.model('Product', productSchema);
const isConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  find: (query) => isConnected() ? MongooseProduct.find(query) : demoStore.findProducts(query),
  findById: (id) => isConnected() ? MongooseProduct.findById(id) : demoStore.findProductById(id),
  countDocuments: (query) => isConnected() ? MongooseProduct.countDocuments(query) : demoStore.countProducts(query),
  create: (data) => isConnected() ? MongooseProduct.create(data) : demoStore.createProduct(data),
  findByIdAndUpdate: (id, data, opt) => isConnected() ? MongooseProduct.findByIdAndUpdate(id, data, opt) : demoStore.updateProductById(id, data),
  findByIdAndDelete: (id) => isConnected() ? MongooseProduct.findByIdAndDelete(id) : demoStore.deleteProductById(id),
  insertMany: (items) => isConnected() ? MongooseProduct.insertMany(items) : Promise.resolve(items),
  deleteMany: (query) => isConnected() ? MongooseProduct.deleteMany(query) : Promise.resolve()
};
