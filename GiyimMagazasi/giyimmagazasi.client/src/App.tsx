import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './App.css';
import type { Product } from './types/Product';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { CartProvider } from './CartContext.tsx';
import Cart from './Cart';
import { useCart } from './useCart';


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

// Ana App bileþeni sadece CartProvider'ý sarar
function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}

// Yeni bileþen, sepet sayacýna eriþim için CartProvider'ýn içine yerleþtirildi
const AppContent = () => {
    const { itemCount } = useCart(); // useCart hook'u burada kullanýlýr

    return (
        <Router>
            <div className="container">
                <div className="header">
                    <h1>Kocak Fashion</h1>
                    <nav>
                        <Link to="/">Anasayfa</Link>
                        <Link to="/cart">Sepetim ({itemCount})</Link> {/* Sayaç buraya eklendi */}
                    </nav>
                </div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;