const API_URL = "http://127.0.0.1:8000"; // URL del backend

// Obtener productos desde el backend
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Error al obtener los productos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    return [];
  }
};
