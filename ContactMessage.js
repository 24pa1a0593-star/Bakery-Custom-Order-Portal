const mongoose = require('mongoose');
const demoStore = require('../utils/demoStore');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true, maxlength: 1000 },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const MongooseContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
const isConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  create: (data) => isConnected() ? MongooseContactMessage.create(data) : demoStore.createContactMessage(data),
  find: (query) => isConnected() ? MongooseContactMessage.find(query) : demoStore.findContacts(),
  countDocuments: (query) => isConnected() ? MongooseContactMessage.countDocuments(query) : demoStore.countContacts(),
  updateMany: (query, update) => isConnected() ? MongooseContactMessage.updateMany(query, update) : demoStore.markContactsAsRead()
};
