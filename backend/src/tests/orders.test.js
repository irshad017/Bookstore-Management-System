const request = require('supertest');
const app = require('../server');
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');

require('./setup');

describe('Orders API Endpoints', () => {
  let adminToken;
  let customerToken;
  let customerUser;
  let sampleBook;

  beforeEach(async () => {
    // Admin
    const adminUser = await User.create({
      name: 'Admin Boss',
      email: 'boss@test.com',
      password: 'password123',
      role: 'admin',
    });

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'boss@test.com',
      password: 'password123',
    });
    adminToken = adminLogin.body.token;

    // Customer
    customerUser = await User.create({
      name: 'Buyer Alice',
      email: 'alice@test.com',
      password: 'password123',
      role: 'customer',
    });

    const custLogin = await request(app).post('/api/auth/login').send({
      email: 'alice@test.com',
      password: 'password123',
    });
    customerToken = custLogin.body.token;

    // Book with stock 10
    sampleBook = await Book.create({
      title: 'Domain Driven Design',
      author: 'Eric Evans',
      price: 650,
      genre: 'Technology',
      stock: 10,
      isbn: '978-0321125217',
      description: 'Tackling complexity in the heart of software.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    });
  });

  it('should create order and automatically decrement book stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderItems: [
          {
            book: sampleBook._id,
            title: sampleBook.title,
            qty: 2,
            price: sampleBook.price,
            imageUrl: sampleBook.imageUrl,
          },
        ],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Bangalore',
          state: 'KA',
          postalCode: '560001',
          country: 'India',
        },
        paymentMethod: 'Card',
        itemsPrice: 1300,
        taxPrice: 65,
        shippingPrice: 50,
        totalPrice: 1415,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order.status).toBe('Pending');

    // Check that book stock was decremented from 10 to 8
    const updatedBook = await Book.findById(sampleBook._id);
    expect(updatedBook.stock).toBe(8);
  });

  it('should prevent ordering more items than available in stock', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderItems: [
          {
            book: sampleBook._id,
            title: sampleBook.title,
            qty: 20, // more than stock 10
            price: sampleBook.price,
            imageUrl: sampleBook.imageUrl,
          },
        ],
        shippingAddress: {
          street: '123 Test Street',
          city: 'Bangalore',
          state: 'KA',
          postalCode: '560001',
          country: 'India',
        },
        paymentMethod: 'Card',
        itemsPrice: 13000,
        taxPrice: 650,
        shippingPrice: 50,
        totalPrice: 13700,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to update order status', async () => {
    const order = await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          book: sampleBook._id,
          title: sampleBook.title,
          qty: 1,
          price: sampleBook.price,
          imageUrl: sampleBook.imageUrl,
        },
      ],
      shippingAddress: {
        street: '123 Street',
        city: 'City',
        state: 'State',
        postalCode: '123456',
        country: 'India',
      },
      paymentMethod: 'Card',
      totalPrice: 650,
      status: 'Pending',
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Delivered' });

    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe('Delivered');
    expect(res.body.order.isDelivered).toBe(true);
  });
});
