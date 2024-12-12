import { FaEarlybirds,FaShoppingCart } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import './styles.css';

  const CartModal = ({ product, onAddToCart, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity > 0) {
      onAddToCart(product, quantity)
      onClose();
    } else {
      alert("Por favor, ingresa una cantidad válida.");
    }
  };

  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose}></div>
      <div className="cart-modal">
        <h2>Agregar al Carrito <FaShoppingCart /></h2>
        <p><strong>Producto:</strong> {product.name}</p>
        <p><strong>Descripción:</strong> {product.description}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
          <button type="submit">Agregar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product, quantity) => {
    console.log(`Agregando ${quantity} unidades de ${product.name} al carrito`);
    addToCart(product, quantity);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const goToCart = () => {
    navigate("/cart");
  };
  
  
  return (
    <div>
      <header className="header">
        <h1><FaEarlybirds size={40} /> Tech Solutions</h1>
      </header>
      <div className="container">
      <div className="button-container">
        <button className="carrito" onClick={goToCart}><FaShoppingCart /> Ir al Carrito</button>
      </div>
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <button onClick={() => handleOpenModal(product)}>Agregar al Carrito <FaShoppingCart /></button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <CartModal
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;
