import React from 'react';
import type { Product } from './types/Product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // 👇️ YENİ: Stok kontrolü
    const hasStock = product.stock > 0;

    return (
        // Kartın tamamını ProductDetail sayfasına yönlendiren Link yaptık
        <Link to={`/products/${product.id}`} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-card-image" />
            <div className="product-card-content">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-details">{product.description}</p>
                <p className="product-card-price">₺{product.price.toFixed(2)}</p>

                {/* 👇️ YENİ: Stok Yoksa Uyarı Ekliyoruz */}
                {!hasStock && (
                    <div style={{
                        color: 'white',
                        backgroundColor: 'red',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        marginTop: '5px',
                        fontWeight: 'bold'
                    }}>
                        STOK TÜKENDİ
                    </div>
                )}
            </div>
        </Link>
    );
};
export default ProductCard;
