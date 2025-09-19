import { useEffect, useState } from 'react'; // React importunu kaldýrýn
import { useParams } from 'react-router-dom';
import type { Product } from './types/Product';


const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP hatasý! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Veri çekme sýrasýnda bir hata oluþtu:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!product) {
        return <div>Ürün bulunamadý.</div>;
    }

    return (
        <div className="product-detail-container">
            <img src={product.imageUrl} alt={product.name} style={{ width: '400px', height: 'auto' }} />
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Fiyat:</strong> ${product.price}</p>
            <p><strong>Stok:</strong> {product.stock}</p>
            <p><strong>Kategori:</strong> {product.category}</p>
        </div>
    );
};

export default ProductDetail;
