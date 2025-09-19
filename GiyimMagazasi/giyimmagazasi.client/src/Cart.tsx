import { useCart } from './useCart';

const Cart = () => {
    const { cart, removeFromCart } = useCart(); // removeFromCart'ý içe aktar

    return (
        <div className="cart-container">
            <h2>Sepetim</h2>
            {cart.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Sepetinizde ürün bulunmamaktadýr.</p>
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
                            <span className="cart-item-quantity">Adet: {item.quantity}</span>
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
        </div>
    );
};

export default Cart;