import { useCart } from "../../context/CartContext";
import { formatIDR } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export const useCartLogic = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    removeItem,
    clearCart,
    updateQuantity,
  } = useCart();

  const rawSubtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);

  const handleIncrement = (item) => addToCart(item);
  const handleDecrement = (item) => removeFromCart(item.id);
  const handleQuantityChange = (itemId, newQty) => updateQuantity(itemId, newQty);
  const handleRemove = async (itemId) => {
    await removeItem(itemId);
    toast.success("Item dihapus dari keranjang");
  };

  return {
    cartItems,
    subtotal: formatIDR(rawSubtotal),
    total: formatIDR(rawSubtotal), 
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
    handleRemove,
    clearCart,
    isEmpty: cartItems.length === 0,
  };
};