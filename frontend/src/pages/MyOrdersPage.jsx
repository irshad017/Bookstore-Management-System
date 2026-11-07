import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Eye } from 'lucide-react';
import api from '../api/axiosClient';
import Spinner from '../components/common/Spinner';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-primary">Shipped</span>;
      case 'Processing':
        return <span className="badge badge-warning">Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-secondary">Pending</span>;
    }
  };

  if (loading) return <Spinner message="Loading your purchase history..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Track and review your past book orders and receipts
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '500px', margin: '2rem auto' }}
        >
          <Package size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Discover our latest arrivals and start your collection!
          </p>
          <Link to="/books" className="btn btn-primary">
            Explore Book Catalog
          </Link>
        </div>
      ) : (
        <div className="table-responsive card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (₹)</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      #{order._id.substring(0, 10)}...
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    {order.orderItems?.length} {order.orderItems?.length === 1 ? 'Book' : 'Books'}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>₹{order.totalPrice}</strong>
                  </td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                      <Eye size={14} /> View Receipt
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
