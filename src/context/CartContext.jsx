import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/user/cartService";
import { API_URL } from "../utils/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const buildImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const mapItems = (items = []) =>
    items.map((item) => ({
      id: item.product_id,
      cartItemId: item.id,
      name: item.name,
      image_url: buildImageUrl(item.image_url),
      price: Number(item.final_price ?? item.price) || 0,
      original_price: Number(item.price) || 0,
      discount_amount: Number(item.discount_amount) || 0,
      quantity: Number(item.quantity) || 0,
      stock: item.stock,
      category: item.category ?? "",
    }));

  const syncCart = (data) => {
    if (data?.items) setCartItems(mapItems(data.items));
    if (data?.summary) setCartSummary(data.summary);
  };

  const loadCart = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await cartService.getCart();
      syncCart(res.data);
    } catch (err) {
      console.error("Load cart error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setCartSummary(null);
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) return;
    const existing = cartItems.find((i) => i.id === product.id);
    try {
      const res = existing
        ? await cartService.updateItem(product.id, existing.quantity + quantity)
        : await cartService.addItem(product.id, quantity);
      syncCart(res.data);
    } catch (err) {
      toast.error("Gagal menambah ke keranjang");
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    const existing = cartItems.find((i) => i.id === productId);
    if (!existing) return;
    try {
      const res = existing.quantity <= 1
        ? await cartService.deleteItem(productId)
        : await cartService.updateItem(productId, existing.quantity - 1);
      syncCart(res.data);
    } catch (err) {
      toast.error("Gagal update keranjang");
    }
  };

  const removeItem = async (productId) => {
    if (!user) return;
    try {
      const res = await cartService.deleteItem(productId);
      syncCart(res.data);
    } catch (err) {
      toast.error("Gagal menghapus item");
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (!user) return;
    try {
      const res = await cartService.updateItem(productId, Math.max(1, newQty));
      syncCart(res.data);
    } catch (err) {
      toast.error("Gagal update quantity");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartService.clearCart();
      setCartItems([]);
      setCartSummary(null);
    } catch (err) {
      toast.error("Gagal mengosongkan keranjang");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        isLoading,
        addToCart,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems: cartItems.length,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);