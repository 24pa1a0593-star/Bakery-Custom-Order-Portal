const mongoose = require('mongoose');
const demoStore = require('../utils/demoStore');

const adminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] }
}, { timestamps: true });

const MongooseAdminUser = mongoose.model('AdminUser', adminUserSchema);
const isConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  findOne: (query) => isConnected() ? MongooseAdminUser.findOne(query) : (query.email ? demoStore.findAdminByEmail(query.email) : Promise.resolve(null)),
  create: (data) => isConnected() ? MongooseAdminUser.create(data) : demoStore.createAdminUser(data),
  deleteMany: (query) => isConnected() ? MongooseAdminUser.deleteMany(query) : Promise.resolve()
};
