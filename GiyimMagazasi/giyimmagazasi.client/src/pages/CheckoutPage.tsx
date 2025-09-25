import React, { useState } from 'react';
import { useCart } from '../useCart';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';

// Sepet öğesi tipini tanımlıyoruz (TS7006 hatasını çözmek için)
interface CartItem {
    product: Product;
    quantity: number;
}

const CheckoutPage: React.FC = () => {
    // Sepet verilerini (cart ve cartTotal) kullanıyoruz
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        email: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Sepetinizde ürün bulunmamaktadır.');
            return;
        }

        setIsProcessing(true);

        setTimeout(() => {
            console.log('Sipariş Tamamlandı:', {
                ...formData,
                items: cart,
                total: cartTotal
            });

            clearCart();
            setIsProcessing(false);

            // cartTotal kullanıldı
            alert(`Siparişiniz başarıyla alındı! Toplam Tutar: $${cartTotal.toFixed(2)}`);
            navigate('/');

        }, 2000);
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '50px auto' }}>
            <h2>Ödeme ve Adres Bilgileri</h2>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px' }}>
                <h3>Sipariş Özeti</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {/* HATA ÇÖZÜMÜ 2: 'item' parametresine CartItem tipi eklendi */}
                    {cart.map((item: CartItem) => (
                        <li key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em' }}>
                    <span>Toplam Tutar:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="E-posta Adresi"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Tam Adresiniz"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="Şehir/İlçe"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />

                <button
                    type="submit"
                    disabled={isProcessing || cart.length === 0}
                    style={{
                        padding: '15px',
                        backgroundColor: '#FF4D4F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1em',
                        cursor: isProcessing || cart.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: isProcessing || cart.length === 0 ? 0.6 : 1
                    }}
                >
                    {isProcessing ? 'Sipariş İşleniyor...' : `Siparişi Tamamla (Toplam: $${cartTotal.toFixed(2)})`}
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;