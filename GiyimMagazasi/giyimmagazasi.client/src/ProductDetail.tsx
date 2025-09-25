import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from './types/Product';
import { useCart } from './useCart';

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP hatası! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Product) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => {
                console.error('Veri çekme sırasında bir hata oluştu');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!product) {
        return <div>Ürün bulunamadı.</div>;
    }
    // 👇️ YENİ: Stok kontrolü
    const hasStock = product.stock > 0;

    const handleAddToCart = () => {
        if (!hasStock) {
            alert(`${product.name} stokta kalmadı. Sepete eklenemiyor.`);
            return;
        }

        addToCart(product, 1);
        alert(`${product.name} sepete eklendi!`);
    };

    return (
        <div className="product-detail-container">
            <div className="product-detail-image-container">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-detail-image"
                />
            </div>
            <div className="product-detail-info">
                <h1 className="product-detail-name">{product.name}</h1>
                <p className="product-detail-description">{product.description}</p>
                <p className="product-detail-price">Fiyat: ${product.price.toFixed(2)}</p>

                {/* 👇️ YENİ: Stok bilgisini renklendir */}
                <p className="product-detail-stock" style={{ color: hasStock ? 'green' : 'red', fontWeight: 'bold' }}>
                    Stok: {hasStock ? product.stock : 'TÜKENDİ'}
                </p>

                <p className="product-detail-category">Kategori: {product.category}</p>

                <button
                    // 👇️ YENİ: Stok yoksa disabled ve farklı class
                    className={`add-to-cart-button ${!hasStock ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!hasStock}
                >
                    {hasStock ? 'Sepete Ekle' : 'Stok Tükendi'}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;