import React from 'react';
import type { Product } from './types/Product';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-card-image" />
            <div className="product-card-content">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-details">{product.description}</p>
                <p className="product-card-price">${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;
