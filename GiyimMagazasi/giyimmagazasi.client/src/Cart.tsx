import { useCart } from './useCart';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart(); // clearCart'ı içe aktar

    return (
        <div className="cart-container">
            <h2>Sepetim</h2>
            {cart.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Sepetinizde ürün bulunmamaktadır.</p>
            ) : (
                <ul className="cart-list">
                    {cart.map((item) => (
                        <li key={item.product.id} className="cart-item">
                            <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <p className="cart-item-name">{item.product.name}</p>
                                <p className="cart-item-price">Fiyat: ${item.product.price.toFixed(2)}</p>
                            </div>
                            <div className="quantity-controls">
                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                                <span className="cart-item-quantity">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="remove-button"
                            >
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {/* Sepet toplamını ve boşaltma butonunu gösteren bölüm */}
            {cart.length > 0 && (
                <div className="cart-summary">
                    <h3>Toplam: ${cartTotal.toFixed(2)}</h3>
                    <button onClick={clearCart} className="clear-cart-button">Sepeti Boşalt</button>
                </div>
            )}
        </div>
    );
};

export default Cart;