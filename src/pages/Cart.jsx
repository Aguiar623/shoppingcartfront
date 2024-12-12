import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    totalItems,
    updateQuantity,
    reduceQuantity,
    removeFromCart,
    sendCartToBackend,
  } = useCart();
  
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Tu carrito está vacío.</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      <p>Total de ítems: {totalItems}</p>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.product_id}>
            <div className="cart-item">
              <div className="cart-item-details">
                <p>{item.name}</p>
                <p>Precio: ${item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => reduceQuantity(item.product_id)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                  />
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.product_id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <h3 className="cart-total">Total: ${cartTotal.toFixed(2)}</h3>
      <button
        className="checkout-button"
        onClick={async () => {
          try {
            await sendCartToBackend(cartItems);
            navigate("/checkout");
          } catch (error) {
            console.error("Error al actualizar el carrito antes del pago:", error);
          }
        }}
      >
        Proceder al Pago
      </button>
    </div>
  );
};

export default Cart;
