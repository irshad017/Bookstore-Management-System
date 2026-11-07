const request = require('supertest');
const app = require('../server');
const Book = require('../models/Book');
const User = require('../models/User');

require('./setup');

describe('Books API Endpoints', () => {
  let adminToken;
  let customerToken;
  let sampleBook;

  beforeEach(async () => {
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'adminPassword123',
      role: 'admin',
    });

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'adminPassword123',
    });
    adminToken = adminLogin.body.token;

    // Create customer user
    const customerUser = await User.create({
      name: 'Customer Test',
      email: 'customer@test.com',
      password: 'custPassword123',
      role: 'customer',
    });

    const custLogin = await request(app).post('/api/auth/login').send({
      email: 'customer@test.com',
      password: 'custPassword123',
    });
    customerToken = custLogin.body.token;

    // Create a sample book
    sampleBook = await Book.create({
      title: 'JavaScript The Good Parts',
      author: 'Douglas Crockford',
      price: 499,
      genre: 'Technology',
      stock: 15,
      isbn: '978-0596517748',
      description: 'An authoritative guide to JavaScript fundamentals.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      isFeatured: true,
    });
  });

  it('should fetch list of books with pagination', async () => {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.books.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('pages');
    expect(res.body).toHaveProperty('totalBooks');
  });

  it('should filter books by genre', async () => {
    const res = await request(app).get('/api/books?genre=Technology');

    expect(res.statusCode).toBe(200);
    expect(res.body.books[0].genre).toBe('Technology');
  });

  it('should get single book by ID', async () => {
    const res = await request(app).get(`/api/books/${sampleBook._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.book.title).toBe('JavaScript The Good Parts');
  });

  it('should allow admin to create a new book', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Refactoring',
        author: 'Martin Fowler',
        price: 850,
        genre: 'Technology',
        stock: 12,
        isbn: '978-0134757599',
        description: 'Improving the design of existing code.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.book.title).toBe('Refactoring');
  });

  it('should deny non-admin users from creating books', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        title: 'Unauthorized Book',
        author: 'Nobody',
        price: 100,
        genre: 'Fiction',
        stock: 5,
        isbn: '978-0000000000',
        description: 'Should fail',
      });

    expect(res.statusCode).toBe(403);
  });

  it('should allow customer to submit a review', async () => {
    const res = await request(app)
      .post(`/api/books/${sampleBook._id}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        rating: 5,
        comment: 'Super informative, transformed my coding!',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.rating).toBe(5);
  });
});
