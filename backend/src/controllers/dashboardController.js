const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get admin dashboard metrics & stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();

    // Total revenue from paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Order status counts
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Low stock books (stock <= 5)
    const lowStockBooks = await Book.find({ stock: { $lte: 5 } })
      .select('title author stock price imageUrl')
      .limit(8);

    // Recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Sales by genre aggregation
    const genreStats = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalBooks,
        totalUsers,
        ordersByStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        lowStockBooks,
        recentOrders,
        genreStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
