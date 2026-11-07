const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address',
      });
    }

    // Verify stock availability for each item and decrement
    for (const item of orderItems) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book "${item.title}" no longer exists`,
        });
      }
      if (book.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
      }
    }

    // Decrement stock
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.qty },
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Card',
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      status: 'Pending',
      paymentStatus: 'Pending',
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.book', 'title author imageUrl price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure only the user who made the order or an admin can access it
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only) with pagination and filter
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const query = {};
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    if (req.query.search) {
      // Search by Order ID if valid ObjectId
      if (req.query.search.match(/^[0-9a-fA-F]{24}$/)) {
        query._id = req.query.search;
      }
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      orders,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalOrders: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      // If payment was cash on delivery, mark paid
      if (order.paymentMethod === 'CashOnDelivery') {
        order.isPaid = true;
        order.paymentStatus = 'Completed';
        order.paidAt = Date.now();
      }
    }

    // If order is cancelled, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Book.findByIdAndUpdate(item.book, {
          $inc: { stock: item.qty },
        });
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid (simulate payment completion)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify authorized user
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order',
      });
    }

    order.isPaid = true;
    order.paymentStatus = 'Completed';
    order.paidAt = Date.now();
    order.status = order.status === 'Pending' ? 'Processing' : order.status;
    order.paymentResult = {
      id: req.body.id || `TXN_${Date.now()}`,
      status: req.body.status || 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.body.email_address || req.user.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid,
};
