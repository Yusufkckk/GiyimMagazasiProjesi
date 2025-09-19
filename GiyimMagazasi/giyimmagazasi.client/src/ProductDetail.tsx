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
                    throw new Error(`HTTP hatasý! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Product) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => {
                console.error('Veri çekme sýrasýnda bir hata oluþtu');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!product) {
        return <div>Ürün bulunamadý.</div>;
    }

    const handleAddToCart = () => {
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
                <p className="product-detail-stock">Stok: {product.stock}</p>
                <p className="product-detail-category">Kategori: {product.category}</p>

                <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                >
                    Sepete Ekle
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;