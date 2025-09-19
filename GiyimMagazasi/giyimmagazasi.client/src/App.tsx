import { useEffect, useState } from 'react'; // React importunu kaldýrýn
import ProductCard from './ProductCard';
import './App.css';
import type { Product } from './types/Product';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './ProductDetail';

// Ana sayfa için yeni bir bileþen oluþturuyoruz
function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP hatasý! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Veri çekme sýrasýnda bir hata oluþtu:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Ürünler yükleniyor...</div>;
    }

    return (
        <div className="product-list">
            {products.map(product => (
                <Link to={`/products/${product.id}`} key={product.id}>
                    <ProductCard product={product} />
                </Link>
            ))}
        </div>
    );
}

// Ana App bileþeni artýk sadece yönlendirmeyi yönetiyor
function App() {
    return (
        <Router>
            <div className="container">
                <h1>Koçak Fashion</h1>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;