
import { useCart } from './useCart';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    // useNavigate hook'unu tanımlıyoruz
    const navigate = useNavigate();

    // useCart hook'undan gerekli değerleri içe aktar
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

    // Sepet boşsa kullanıcıyı ana sayfaya yönlendirecek bir Link ekleyelim
    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Sepetiniz Boş</h2>
                <p>Hemen ürünlerimizi incelemeye başlayın!</p>
                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#333',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Alışverişe Başla
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Sepetim</h2>

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
                            <p className="cart-item-price">Fiyat: ₺{item.product.price.toFixed(2)}</p>
                        </div>
                        <div className="quantity-controls">
                            <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                // Miktarın 1'den az olmasını engelle
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span className="cart-item-quantity">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                        </div>
                        <p className="cart-item-subtotal">Ara Toplam: ₺{(item.product.price * item.quantity).toFixed(2)}</p>
                        <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="remove-button"
                        >
                            Sil
                        </button>
                    </li>
                ))}
            </ul>

            {/* Sepet toplamını ve butonları gösteren bölüm */}
            <div className="cart-summary" style={{ textAlign: 'right', marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>Toplam Tutar: ₺{cartTotal.toFixed(2)}</h3>

                {/* 🚀 ÖDEME BUTONU */}
                <button
                    onClick={() => navigate('/checkout')}
                    className="checkout-button" // Yeni bir CSS sınıfı ekleyelim
                    style={{
                        padding: '12px 25px',
                        backgroundColor: '#4CAF50', // Yeşil renk
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1em',
                        cursor: 'pointer',
                        marginRight: '15px'
                    }}
                >
                    Ödemeye Geç
                </button>

                {/* Sepeti Boşalt Butonu */}
                <button
                    onClick={clearCart}
                    className="clear-cart-button"
                    style={{
                        padding: '12px 25px',
                        backgroundColor: '#FF4D4F', // Kırmızı renk
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1em',
                        cursor: 'pointer',
                    }}
                >
                    Sepeti Boşalt
                </button>
            </div>

        </div>
    );
};

export default Cart;