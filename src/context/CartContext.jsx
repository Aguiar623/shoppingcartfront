import React, { createContext, useContext, useState } from "react";
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  
  const recalculateTotal = (item) => {
    const total = item.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
  };

  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product_id === product.product_id);
      let updatedItems;

      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity}
            : item
        );
      } else {
        updatedItems = [
          ...prevItems,
          { product_id:product.id, 
            name: product.name,
            price: Number(product.price), 
            quantity: quantity },
        ];
      }
      
      recalculateTotal(updatedItems);
      sendCartToBackend(updatedItems);
      return updatedItems;
    });
  };
  
  const sendCartToBackend = async (updatedItems) => {
    try {
      const transformedItems = updatedItems.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      console.log('Enviando carrito al backend:', transformedItems);

      await axios.post('http://127.0.0.1:8000/api/cart', transformedItems);
    } catch (error) {
      console.error("Error al enviar el carrito al backend", error.response?.data || error.message);
    }
  };
  
  const reduceQuantity = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      recalculateTotal(updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = async (productId, quantity) => {
  const newQuantity = Math.max(Number(quantity), 1);

  setCartItems((prevItems) => {
    const updatedItems = prevItems.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    recalculateTotal(updatedItems);
    updateCart(updatedItems);
    return updatedItems;
  });

  try {
    console.log("Cantidad actualizada en el backend.");
  } catch (error) {
    console.error("Error al actualizar la cantidad en el backend:", error);
  }
};

const updateCart = async (cartItems) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el carrito");
    }

    const data = await response.json();
    console.log("Carrito actualizado:", data);
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
  }
};

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/${productId}`);
  
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.product_id !== productId);
        recalculateTotal(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error al eliminar el producto del backend", error.response?.data || error.message);
    }
  };
  
  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        totalItems,
        addToCart,
        reduceQuantity,
        updateQuantity,
        removeFromCart,
        setCartItems,
        sendCartToBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 