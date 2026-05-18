import { useCart } from "../../context/CartContext";
import { formatIDR } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export const useCartLogic = () => {
  const {
    cartItems,
    cartSummary,
    addToCart,
    removeFromCart,
    removeItem,
    clearCart,
    updateQuantity,
  } = useCart();

  const handleIncrement = (item) => addToCart(item);
  const handleDecrement = (item) => removeFromCart(item.id);
  const handleQuantityChange = (itemId, newQty) =>
    updateQuantity(itemId, newQty);
  const handleRemove = async (itemId) => {
    await removeItem(itemId);
    toast.success("Item dihapus dari keranjang");
  };

  const normalSubtotal =
    cartSummary?.normal_subtotal ??
    cartItems.reduce(
      (acc, item) => acc + (item.original_price || item.price) * item.quantity,
      0,
    );

  const discountTotal = cartSummary?.discount_total ?? 0;

  const subtotalAfterDiscount =
    cartSummary?.subtotal ??
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const grandTotal = cartSummary?.grand_total ?? subtotalAfterDiscount; 

  const hasDiscount = discountTotal > 0;

  return {
    cartItems,
    cartSummary,
    subtotal: formatIDR(subtotalAfterDiscount),
    total: formatIDR(grandTotal), 
    normalSubtotal: formatIDR(normalSubtotal),
    discountTotal: formatIDR(discountTotal),
    hasDiscount,
    handleIncrement,
    handleDecrement,
    handleQuantityChange,
    handleRemove,
    clearCart,
    isEmpty: cartItems.length === 0,
  };
};
