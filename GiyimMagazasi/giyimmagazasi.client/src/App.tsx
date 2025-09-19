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
    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('priceAsc');

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
        return <div style={{ textAlign: 'center', padding: '50px' }}>Ürünler yükleniyor...</div>;
    }

    const filteredAndSortedProducts = products
        .filter(product => product.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'priceAsc') {
                return a.price - b.price;
            } else if (sort === 'priceDesc') {
                return b.price - a.price;
            }
            return 0;
        });

    return (
        <>
            <div className="container">
                {/* Filtreleme ve Sýralama Bölümü */}
                <section className="filter-sort-section">
                    <input
                        type="text"
                        placeholder="Ürün Ara..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em', flexGrow: 1, marginRight: '20px' }}
                    />
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="priceAsc">Fiyata Göre Artan</option>
                        <option value="priceDesc">Fiyata Göre Azalan</option>
                    </select>
                </section>

                <div className="product-list">
                    {filteredAndSortedProducts.length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>Aradýðýnýz kriterlere uygun ürün bulunamadý.</p>
                    ) : (
                        filteredAndSortedProducts.map(product => (
                            <Link to={`/products/${product.id}`} key={product.id}>
                                <ProductCard product={product} />
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
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
    const { itemCount } = useCart();

    return (
        <Router>
            <div className="container">
                <div className="header">
                    <h1>Kocak Fashion</h1>
                    <nav>
                        <Link to="/">Anasayfa</Link>
                        <Link to="/cart">Sepetim ({itemCount})</Link>
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