const mongoose = require('mongoose');
const dotenv = require('dotenv');
const sampleUsers = require('./data/sampleUsers');
const sampleBooks = require('./data/sampleBooks');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
const { connectDB } = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing existing collections...');
    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Inserting sample users...');
    // Create users individually so pre('save') password hashing runs
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const customerUser = createdUsers.find((u) => u.role === 'customer');

    console.log('[Seeder] Inserting sample books...');
    // Insert books with some initial reviews attached
    const booksToInsert = sampleBooks.map((book, idx) => {
      return {
        ...book,
        reviews: [
          {
            user: customerUser._id,
            name: customerUser.name,
            rating: 5,
            comment: 'Absolutely fantastic read! Highly recommended to everyone.',
          },
        ],
      };
    });

    const createdBooks = await Book.insertMany(booksToInsert);

    console.log('[Seeder] Creating sample customer order...');
    await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          book: createdBooks[0]._id,
          title: createdBooks[0].title,
          qty: 1,
          price: createdBooks[0].price,
          imageUrl: createdBooks[0].imageUrl,
        },
        {
          book: createdBooks[1]._id,
          title: createdBooks[1].title,
          qty: 1,
          price: createdBooks[1].price,
          imageUrl: createdBooks[1].imageUrl,
        },
      ],
      shippingAddress: customerUser.address,
      paymentMethod: 'Card',
      paymentResult: {
        id: 'TXN_SAMPLE_001',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: customerUser.email,
      },
      itemsPrice: createdBooks[0].price + createdBooks[1].price,
      taxPrice: Math.round((createdBooks[0].price + createdBooks[1].price) * 0.05),
      shippingPrice: 50,
      totalPrice:
        createdBooks[0].price +
        createdBooks[1].price +
        Math.round((createdBooks[0].price + createdBooks[1].price) * 0.05) +
        50,
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
      paymentStatus: 'Completed',
    });

    console.log('[Seeder] Data imported successfully!');
    console.log(`[Seeder] Seeded ${createdUsers.length} users, ${createdBooks.length} books, and 1 order.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder] Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] All bookstore data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder] Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
