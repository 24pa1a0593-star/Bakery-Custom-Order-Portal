import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bakery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse bakery_cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bakery_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save bakery_cart to localStorage', e);
    }
  }, [items]);

  const getProductId = (product) => {
    if (!product) return null;
    return product._id || product.id;
  };

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const targetId = getProductId(product);
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => getProductId(item.product) === targetId
      );
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => getProductId(item.product) !== productId)
    );
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        getProductId(item.product) === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const price = Number(item.product?.price) || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
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
