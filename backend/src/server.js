const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security & utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI to render assets cleanly
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger Documentation Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Bookstore API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// API Routes
// Supporting both /api/auth and direct /api for register & login as required by the specification
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Exposes POST /api/register and POST /api/login directly
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Bookstore Management System API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('Bookstore Management System API is running. Visit /api/docs for Swagger documentation.');
});

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      console.log(`[Server] Bookstore API running on http://localhost:${PORT}`);
      console.log(`[Swagger] Documentation available at http://localhost:${PORT}/api/docs`);
    });
  });
}

module.exports = app;
