const ProductCard = ({ product }: { product: any }) => {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>Fiyat:</strong> ${product.price}</p>
            <p><strong>Stok:</strong> {product.stock}</p>
        </div>
    );
};

export default ProductCard;