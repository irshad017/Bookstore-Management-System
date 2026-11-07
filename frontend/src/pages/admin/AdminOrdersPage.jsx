import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Eye, Filter } from 'lucide-react';
import api from '../../api/axiosClient';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { useNotification } from '../../context/NotificationContext';

const AdminOrdersPage = () => {
  const { success, error } = useNotification();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', 10);

      const { data } = await api.get(`/orders?${params.toString()}`);
      setOrders(data.orders || []);
      setPages(data.pages || 1);
      setTotalOrders(data.totalOrders || 0);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, error]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      error(err.message);
    }
  };

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

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2.25rem' }}>Customer Orders Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage order fulfillment, delivery statuses, and customer orders ({totalOrders} total)
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        className="card"
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflowX: 'auto',
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
          <Filter size={15} /> Filter:
        </span>
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <Spinner message="Fetching customer orders..." />
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No orders found matching the filter "{statusFilter}".</p>
        </div>
      ) : (
        <div className="table-responsive card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (₹)</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      #{ord._id.substring(0, 10)}...
                    </span>
                  </td>
                  <td>
                    <strong>{ord.user?.name || 'Customer'}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.user?.email}
                    </span>
                  </td>
                  <td>
                    {new Date(ord.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td>{ord.orderItems?.length} items</td>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>₹{ord.totalPrice}</strong>
                  </td>
                  <td>
                    <span className={`badge ${ord.isPaid ? 'badge-success' : 'badge-danger'}`}>
                      {ord.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.8125rem',
                        width: '130px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/orders/${ord._id}`} className="btn btn-secondary btn-sm">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default AdminOrdersPage;
