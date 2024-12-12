import React from "react";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, cartTotal, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h2>No hay productos en el carrito.</h2>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Resumen del Pedido</h2>
      <p>Total de artículos: {totalItems}</p>
      <div className="checkout-items">
        {cartItems.map((item) => (
        <div key={item.product_id}>  
          <div key={item.id} className="checkout-item">
            <div className="checkout-item-details">
              <h4>{item.name}</h4>
              <p>Precio Unitario: ${item.price.toFixed(2)}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Subtotal: ${(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
        ))}
      </div>
      <div className="checkout-summary">
        <h3>Total a Pagar: ${cartTotal.toFixed(2)}</h3>
        <button className="checkout-button">Pagar Ahora</button>
      </div>
    </div>
  );
};

export default Checkout;
