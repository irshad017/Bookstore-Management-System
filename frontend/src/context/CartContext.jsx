import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { success, warning } = useNotification();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('bookstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem('bookstore_shipping');
    return saved
      ? JSON.parse(saved)
      : { street: '', city: '', state: '', postalCode: '', country: 'India' };
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const saved = localStorage.getItem('bookstore_payment_method');
    return saved ? JSON.parse(saved) : 'Card';
  });

  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('bookstore_shipping', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('bookstore_payment_method', JSON.stringify(paymentMethod));
  }, [paymentMethod]);

  const addToCart = (book, qty = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.book === book._id);

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].qty;
      const newQty = currentQty + qty;

      if (newQty > book.stock) {
        warning(`Cannot add more. Only ${book.stock} copies left in stock!`);
        return;
      }

      const updated = [...cartItems];
      updated[existingIndex].qty = newQty;
      setCartItems(updated);
      success(`Updated quantity of "${book.title}" in cart!`);
    } else {
      if (qty > book.stock) {
        warning(`Cannot add. Only ${book.stock} copies left in stock!`);
        return;
      }

      setCartItems((prev) => [
        ...prev,
        {
          book: book._id,
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
          price: book.price,
          stock: book.stock,
          qty,
        },
      ]);
      success(`Added "${book.title}" to cart!`);
    }
  };

  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.book !== bookId));
    success('Item removed from cart');
  };

  const updateQuantity = (bookId, qty) => {
    if (qty <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.book === bookId) {
          if (qty > item.stock) {
            warning(`Only ${item.stock} items available in stock.`);
            return item;
          }
          return { ...item, qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('bookstore_cart');
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  // Free shipping over ₹999, else ₹50
  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 50;
  // 5% standard GST
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        totalItemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
