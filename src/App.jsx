import React from "react";
import AppRouter from "./routes/AppRouter"; // Importar las rutas de la aplicación
import { CartProvider } from "./context/CartContext"; // Importar el proveedor del carrito

const App = () => {
  return (
    <CartProvider>
      <AppRouter /> {/* Rutas de la aplicación */}
    </CartProvider>
  );
};

export default App;
