const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide book title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
      maxlength: [120, 'Author name cannot exceed 120 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide book price'],
      min: [0, 'Price must be positive'],
    },
    genre: {
      type: String,
      required: [true, 'Please provide genre'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isbn: {
      type: String,
      required: [true, 'Please provide ISBN'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a book description'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedYear: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    pages: {
      type: Number,
      default: 300,
    },
    publisher: {
      type: String,
      default: 'SkyBrisk Publishing',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance search & filtering
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ genre: 1, price: 1 });
bookSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Book', bookSchema);
