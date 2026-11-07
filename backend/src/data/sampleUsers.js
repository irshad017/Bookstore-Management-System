const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123Password!',
    role: 'admin',
    phone: '+91 9876543210',
    address: {
      street: '123 Tech Park Avenue',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 9123456780',
    address: {
      street: '45 Garden Road, Greenview',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
  },
  {
    name: 'Emily Smith',
    email: 'emily@example.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 9988776655',
    address: {
      street: '78 Pine Hills Lane',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
    },
  },
];

module.exports = sampleUsers;
