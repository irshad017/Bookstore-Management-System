const Book = require('../models/Book');

// @desc    Fetch all books with search, filter, sort and pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    // Build filter query
    const query = {};

    // Keyword search over title, author, description
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { isbn: searchRegex },
      ];
    }

    // Filter by genre
    if (req.query.genre && req.query.genre !== 'All') {
      query.genre = req.query.genre;
    }

    // Filter by author
    if (req.query.author) {
      query.author = new RegExp(req.query.author.trim(), 'i');
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by in-stock only
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'title-asc':
          sortOption = { title: 1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
          break;
      }
    }

    const count = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      books,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalBooks: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch featured books for homepage
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = async (req, res, next) => {
  try {
    const featured = await Book.find({ isFeatured: true }).limit(6);
    // If fewer than 4 featured, pull highest rated books
    let books = featured;
    if (books.length < 4) {
      books = await Book.find({}).sort({ rating: -1, createdAt: -1 }).limit(6);
    }
    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch all distinct genres
// @route   GET /api/books/genres
// @access  Public
const getGenres = async (req, res, next) => {
  try {
    const genres = await Book.distinct('genre');
    res.status(200).json({
      success: true,
      genres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found with the specified ID',
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      price,
      genre,
      stock,
      isbn,
      description,
      imageUrl,
      isFeatured,
      publishedYear,
      pages,
      publisher,
    } = req.body;

    // Check if ISBN already exists
    const existingIsbn = await Book.findOne({ isbn });
    if (existingIsbn) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists',
      });
    }

    const book = await Book.create({
      title,
      author,
      price: Number(price),
      genre,
      stock: Number(stock),
      isbn,
      description,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      isFeatured: Boolean(isFeatured),
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      pages: pages ? Number(pages) : undefined,
      publisher,
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // If changing ISBN, check for duplicate
    if (req.body.isbn && req.body.isbn !== book.isbn) {
      const existing = await Book.findOne({ isbn: req.body.isbn });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another book with this ISBN already exists',
        });
      }
    }

    book.title = req.body.title !== undefined ? req.body.title : book.title;
    book.author = req.body.author !== undefined ? req.body.author : book.author;
    book.price = req.body.price !== undefined ? Number(req.body.price) : book.price;
    book.genre = req.body.genre !== undefined ? req.body.genre : book.genre;
    book.stock = req.body.stock !== undefined ? Number(req.body.stock) : book.stock;
    book.isbn = req.body.isbn !== undefined ? req.body.isbn : book.isbn;
    book.description =
      req.body.description !== undefined ? req.body.description : book.description;
    book.imageUrl =
      req.body.imageUrl !== undefined ? req.body.imageUrl : book.imageUrl;
    book.isFeatured =
      req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : book.isFeatured;
    if (req.body.publishedYear !== undefined) {
      book.publishedYear = Number(req.body.publishedYear);
    }
    if (req.body.pages !== undefined) {
      book.pages = Number(req.body.pages);
    }
    if (req.body.publisher !== undefined) {
      book.publisher = req.body.publisher;
    }

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new review for a book
// @route   POST /api/books/:id/reviews
// @access  Private/Customer
const createBookReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this book',
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      rating: book.rating,
      numReviews: book.numReviews,
      reviews: book.reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getFeaturedBooks,
  getGenres,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
};
