const express = require('express');
const router = express.Router();
const {
  getBooks,
  getFeaturedBooks,
  getGenres,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBooks).post(protect, admin, createBook);
router.get('/featured', getFeaturedBooks);
router.get('/genres', getGenres);
router
  .route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);
router.post('/:id/reviews', protect, createBookReview);

module.exports = router;
