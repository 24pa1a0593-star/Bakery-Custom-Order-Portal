const bcrypt = require('bcryptjs');

// 16 Initial Products
const INITIAL_PRODUCTS = [
  {
    _id: '64f1a2b3c4d5e6f7a8b9c001',
    name: 'Classic Chocolate Cake',
    description: 'Rich moist layers of chocolate sponge with velvety chocolate buttercream',
    price: 850,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: true,
    createdAt: new Date('2026-01-01T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c002',
    name: 'Vanilla Dream Cake',
    description: 'Light fluffy vanilla sponge with whipped cream and fresh fruits',
    price: 750,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: true,
    createdAt: new Date('2026-01-02T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c003',
    name: 'Red Velvet Cake',
    description: 'Classic red velvet with cream cheese frosting and a hint of cocoa',
    price: 950,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-03T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c004',
    name: 'Strawberry Delight',
    description: 'Fresh strawberry cream cake with seasonal fruits and light sponge',
    price: 900,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-04T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c005',
    name: 'Black Forest Cake',
    description: 'German-style chocolate cake with cherries, whipped cream, dark chocolate shavings',
    price: 1100,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-05T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c006',
    name: 'Chocolate Cupcakes (6-pack)',
    description: 'Mini indulgences with rich chocolate cake and swirled buttercream',
    price: 350,
    category: 'Cupcakes',
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: true,
    createdAt: new Date('2026-01-06T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c007',
    name: 'Vanilla Cupcakes (6-pack)',
    description: 'Soft vanilla cupcakes topped with colorful frosting rosettes',
    price: 300,
    category: 'Cupcakes',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-07T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c008',
    name: 'Red Velvet Cupcakes (6-pack)',
    description: 'Bite-sized red velvet cupcakes with cream cheese frosting swirls',
    price: 400,
    category: 'Cupcakes',
    imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-08T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c009',
    name: 'Chocolate Chip Cookies (12-pack)',
    description: 'Classic American-style cookies loaded with chocolate chips',
    price: 280,
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-09T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c010',
    name: 'Butter Cookies (12-pack)',
    description: 'Melt-in-your-mouth shortbread butter cookies, perfect with tea',
    price: 250,
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-10T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c011',
    name: 'Oatmeal Raisin Cookies (12-pack)',
    description: 'Chewy oatmeal cookies with plump raisins and warming spices',
    price: 260,
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-11T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c012',
    name: 'Butter Croissant',
    description: 'Flaky buttery French-style croissant freshly baked every morning',
    price: 120,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-12T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c013',
    name: 'Almond Danish',
    description: 'Puff pastry filled with almond cream and topped with sliced almonds',
    price: 150,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-13T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c014',
    name: 'Cinnamon Roll',
    description: 'Soft gooey cinnamon roll with cream cheese glaze',
    price: 130,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-14T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c015',
    name: 'Sourdough Loaf',
    description: 'Tangy crispy-crusted sourdough with an airy crumb, long-fermented dough',
    price: 180,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-15T10:00:00Z')
  },
  {
    _id: '64f1a2b3c4d5e6f7a8b9c016',
    name: 'Multigrain Bread',
    description: 'Wholesome loaf packed with seeds and grains for nutty hearty flavor',
    price: 160,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    available: true,
    featured: false,
    createdAt: new Date('2026-01-16T10:00:00Z')
  }
];

class QueryBuilder {
  constructor(dataPromise) {
    this.promise = Promise.resolve(dataPromise);
  }

  sort(sortRules) {
    this.promise = this.promise.then(items => {
      if (!Array.isArray(items)) return items;
      return [...items].sort((a, b) => {
        for (const [key, dir] of Object.entries(sortRules)) {
          let valA = a[key];
          let valB = b[key];
          if (valA instanceof Date) valA = valA.getTime();
          if (valB instanceof Date) valB = valB.getTime();
          if (valA < valB) return dir === 1 ? -1 : 1;
          if (valA > valB) return dir === 1 ? 1 : -1;
        }
        return 0;
      });
    });
    return this;
  }

  skip(n) {
    this.promise = this.promise.then(items => {
      if (!Array.isArray(items)) return items;
      return items.slice(n);
    });
    return this;
  }

  limit(n) {
    this.promise = this.promise.then(items => {
      if (!Array.isArray(items)) return items;
      return items.slice(0, n);
    });
    return this;
  }

  then(resolve, reject) {
    return this.promise.then(resolve, reject);
  }

  catch(reject) {
    return this.promise.catch(reject);
  }
}

class DemoStore {
  constructor() {
    this.products = [...INITIAL_PRODUCTS];
    this.orders = [];
    this.adminUsers = [];
    this.contactMessages = [];
    this.isDemo = true;
    this.initAdmin();
  }

  async initAdmin() {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    this.adminUsers.push({
      _id: '64f1a2b3c4d5e6f7a8b9c999',
      username: 'admin',
      email: 'admin@sweetbliss.com',
      passwordHash,
      role: 'superadmin',
      createdAt: new Date()
    });
  }

  generateId() {
    return 'demo_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  // --- Product Operations ---
  findProducts(query = {}) {
    let result = [...this.products];
    if (query.available !== undefined) {
      result = result.filter(p => p.available === query.available);
    }
    if (query.category && query.category !== 'All') {
      result = result.filter(p => p.category === query.category);
    }
    if (query.featured !== undefined) {
      result = result.filter(p => p.featured === query.featured);
    }
    if (query.$or) {
      result = result.filter(p => {
        return query.$or.some(clause => {
          if (clause.name && clause.name.$regex) {
            const re = new RegExp(clause.name.$regex, clause.name.$options || 'i');
            if (re.test(p.name)) return true;
          }
          if (clause.description && clause.description.$regex) {
            const re = new RegExp(clause.description.$regex, clause.description.$options || 'i');
            if (re.test(p.description)) return true;
          }
          return false;
        });
      });
    }
    return new QueryBuilder(result);
  }

  findProductById(id) {
    return new QueryBuilder(this.products.find(p => p._id.toString() === id.toString()) || null);
  }

  countProducts(query = {}) {
    return this.findProducts(query).then(items => items.length);
  }

  createProduct(data) {
    const product = {
      _id: this.generateId(),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      imageUrl: data.imageUrl || '',
      available: data.available !== undefined ? Boolean(data.available) : true,
      featured: data.featured !== undefined ? Boolean(data.featured) : false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(product);
    return Promise.resolve(product);
  }

  updateProductById(id, data) {
    const idx = this.products.findIndex(p => p._id.toString() === id.toString());
    if (idx === -1) return Promise.resolve(null);
    this.products[idx] = {
      ...this.products[idx],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.products[idx]);
  }

  deleteProductById(id) {
    const idx = this.products.findIndex(p => p._id.toString() === id.toString());
    if (idx === -1) return Promise.resolve(null);
    const deleted = this.products.splice(idx, 1)[0];
    return Promise.resolve(deleted);
  }

  // --- Order Operations ---
  findOrders(filter = {}) {
    let result = [...this.orders];
    if (filter.status && filter.status !== 'All') {
      result = result.filter(o => o.status === filter.status);
    }
    return new QueryBuilder(result);
  }

  findOrderById(id) {
    return new QueryBuilder(this.orders.find(o => o._id.toString() === id.toString() || o.orderId === id) || null);
  }

  findOrderByQuery(query = {}) {
    let result = this.orders.find(o => {
      let match = true;
      if (query.orderId && o.orderId !== query.orderId) match = false;
      if (query['customer.phone'] && o.customer?.phone !== query['customer.phone']) match = false;
      return match;
    });
    return new QueryBuilder(result || null);
  }

  countOrders(filter = {}) {
    return this.findOrders(filter).then(items => items.length);
  }

  createOrder(data) {
    const order = {
      _id: this.generateId(),
      ...data,
      status: data.status || 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      save: function () {
        return Promise.resolve(this);
      }
    };
    this.orders.unshift(order);
    return order;
  }

  updateOrderById(id, data) {
    const idx = this.orders.findIndex(o => o._id.toString() === id.toString() || o.orderId === id);
    if (idx === -1) return Promise.resolve(null);
    this.orders[idx] = {
      ...this.orders[idx],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.orders[idx]);
  }

  // --- AdminUser Operations ---
  findAdminByEmail(email) {
    const admin = this.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(admin || null);
  }

  createAdminUser(data) {
    const user = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date()
    };
    this.adminUsers.push(user);
    return Promise.resolve(user);
  }

  // --- Contact Operations ---
  createContactMessage(data) {
    const msg = {
      _id: this.generateId(),
      ...data,
      read: false,
      createdAt: new Date()
    };
    this.contactMessages.unshift(msg);
    return Promise.resolve(msg);
  }

  findContacts() {
    return new QueryBuilder([...this.contactMessages]);
  }

  countContacts() {
    return Promise.resolve(this.contactMessages.length);
  }

  markContactsAsRead() {
    this.contactMessages.forEach(m => { m.read = true; });
    return Promise.resolve({ modifiedCount: this.contactMessages.length });
  }
}

const demoStore = new DemoStore();
module.exports = demoStore;
