const mongoose = require('mongoose');
const demoStore = require('../utils/demoStore');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['regular', 'custom'], required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: { type: Number, min: 1 },
    price: { type: Number, min: 0 }
  }],
  customDetails: {
    cakeType: String,
    size: String,
    flavor: String,
    frosting: String,
    theme: String,
    message: String,
    quantity: { type: Number, default: 1 }
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  deliveryDate: Date,
  deliveryTime: String,
  instructions: { type: String, maxlength: 500 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'], default: 'Pending' },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, default: 'Cash on Delivery' }
}, { timestamps: true });

orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const MongooseOrder = mongoose.model('Order', orderSchema);
const isConnected = () => mongoose.connection.readyState === 1;

function OrderWrapper(data) {
  if (isConnected()) {
    return new MongooseOrder(data);
  }
  return demoStore.createOrder(data);
}

OrderWrapper.find = (query) => isConnected() ? MongooseOrder.find(query) : demoStore.findOrders(query);
OrderWrapper.findById = (id) => isConnected() ? MongooseOrder.findById(id) : demoStore.findOrderById(id);
OrderWrapper.findOne = (query) => isConnected() ? MongooseOrder.findOne(query) : demoStore.findOrderByQuery(query);
OrderWrapper.countDocuments = (query) => isConnected() ? MongooseOrder.countDocuments(query) : demoStore.countOrders(query);
OrderWrapper.findByIdAndUpdate = (id, data, opt) => isConnected() ? MongooseOrder.findByIdAndUpdate(id, data, opt) : demoStore.updateOrderById(id, data);
OrderWrapper.deleteMany = (query) => isConnected() ? MongooseOrder.deleteMany(query) : Promise.resolve();

module.exports = OrderWrapper;
