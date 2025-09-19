import { useEffect, useState } from 'react'; // React importunu kald�r�n
import ProductCard from './ProductCard';
import './App.css';
import type { Product } from './types/Product';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './ProductDetail';

// Ana sayfa i�in yeni bir bile�en olu�turuyoruz
function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP hatas�! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Veri �ekme s�ras�nda bir hata olu�tu:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>�r�nler y�kleniyor...</div>;
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

// Ana App bile�eni art�k sadece y�nlendirmeyi y�netiyor
function App() {
    return (
        <Router>
            <div className="container">
                <h1>Ko�ak Fashion</h1>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;