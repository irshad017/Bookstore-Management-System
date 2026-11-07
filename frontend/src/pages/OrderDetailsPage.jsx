import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  Package,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import api from '../api/axiosClient';
import Spinner from '../components/common/Spinner';
import { useNotification } from '../context/NotificationContext';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { success, error } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSimulatePayment = async () => {
    setPaying(true);
    try {
      const { data } = await api.put(`/orders/${id}/pay`, {
        id: `TXN_SIMULATED_${Date.now()}`,
        status: 'COMPLETED',
      });
      success('Payment completed successfully! Order is now being processed.');
      setOrder(data.order);
    } catch (err) {
      error(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Spinner message="Fetching order summary..." />;

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Order Not Found</h2>
        <Link to="/my-orders" className="btn btn-primary">
          View My Orders
        </Link>
      </div>
    );
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/my-orders" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status:</span>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          Order #{order._id}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Details & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping Info Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} /> Shipping Destination
            </h3>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              {order.user?.name}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.state} - {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            <div style={{ marginTop: '0.75rem' }}>
              {order.isDelivered ? (
                <span className="badge badge-success">
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="badge badge-warning">
                  Estimated Delivery in 2-3 Business Days
                </span>
              )}
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} style={{ color: 'var(--primary)' }} /> Payment Details
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Method: <strong>{order.paymentMethod}</strong>
            </p>
            <div>
              {order.isPaid ? (
                <span className="badge badge-success">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-danger">Payment Pending</span>
                  {order.paymentMethod !== 'CashOnDelivery' && (
                    <button
                      onClick={handleSimulatePayment}
                      disabled={paying}
                      className="btn btn-primary btn-sm"
                    >
                      {paying ? 'Processing...' : 'Pay Now (Simulate Checkout)'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} style={{ color: 'var(--primary)' }} /> Ordered Books ({order.orderItems?.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems?.map((item) => (
                <div
                  key={item._id || item.book}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '50px', height: '68px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <Link to={`/books/${item.book}`} style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      {item.title}
                    </Link>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {item.qty} × ₹{item.price}
                    </p>
                  </div>
                  <strong style={{ fontSize: '1rem' }}>₹{item.qty * item.price}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice / Summary */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Payment Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Items Subtotal</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>₹{order.itemsPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Shipping Fee</span>
              <span style={{ color: order.shippingPrice === 0 ? 'var(--success)' : 'var(--text-main)', fontWeight: 600 }}>
                {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tax (5% GST)</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>₹{order.taxPrice}</span>
            </div>
            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Total Paid / Due</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{order.totalPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
