import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../api/axiosClient';

const CheckoutPage = () => {
  const {
    cartItems,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [addressForm, setAddressForm] = useState({
    street: shippingAddress.street || user?.address?.street || '',
    city: shippingAddress.city || user?.address?.city || '',
    state: shippingAddress.state || user?.address?.state || '',
    postalCode: shippingAddress.postalCode || user?.address?.postalCode || '',
    country: shippingAddress.country || user?.address?.country || 'India',
  });

  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'Card');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!addressForm.street || !addressForm.city || !addressForm.postalCode) {
      error('Please complete all required shipping address fields.');
      return;
    }

    setPlacingOrder(true);
    try {
      // Save shipping address and payment method to context
      setShippingAddress(addressForm);
      setPaymentMethod(selectedMethod);

      const orderData = {
        orderItems: cartItems.map((item) => ({
          book: item.book,
          title: item.title,
          qty: item.qty,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        shippingAddress: addressForm,
        paymentMethod: selectedMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const { data } = await api.post('/orders', orderData);
      clearCart();
      success('Order placed successfully! Redirecting to receipt...');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <button
        onClick={() => navigate('/cart')}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Return to Cart
      </button>

      <h1 style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>Complete Your Checkout</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Checkout Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping Address Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} style={{ color: 'var(--primary)' }} />
              <span>1. Delivery & Shipping Address</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  className="form-input"
                  required
                  placeholder="House/Apartment #, Street, Colony"
                  value={addressForm.street}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  required
                  placeholder="e.g. Mumbai, Bengaluru"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  required
                  placeholder="e.g. Maharashtra, Karnataka"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN / Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  className="form-input"
                  required
                  placeholder="e.g. 400001"
                  value={addressForm.postalCode}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country *</label>
                <input
                  type="text"
                  name="country"
                  className="form-input"
                  required
                  value={addressForm.country}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
              <span>2. Select Payment Method</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { id: 'Card', label: 'Credit / Debit Card (Visa, Mastercard, Rupay)', icon: <CreditCard size={18} /> },
                { id: 'UPI', label: 'Instant UPI / QR Code (Google Pay, PhonePe, Paytm)', icon: <QrCode size={18} /> },
                { id: 'CashOnDelivery', label: 'Cash on Delivery (Pay upon delivery)', icon: <Truck size={18} /> },
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: `2px solid ${selectedMethod === opt.id ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: selectedMethod === opt.id ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={selectedMethod === opt.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                  />
                  <span style={{ color: selectedMethod === opt.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {opt.icon}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', flex: 1 }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Items Review & Place Order */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Items in Your Order</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.book} style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.15rem' }}>{item.title}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.qty} × ₹{item.price}
                  </span>
                </div>
                <strong style={{ fontSize: '0.9375rem' }}>₹{item.qty * item.price}</strong>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Items Total</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>₹{itemsPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery</span>
              <span style={{ color: shippingPrice === 0 ? 'var(--success)' : 'var(--text-main)', fontWeight: 600 }}>
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>GST (5%)</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>₹{taxPrice}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{totalPrice}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            <Lock size={18} />
            <span>{placingOrder ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
