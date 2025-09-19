import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './App.css';
import type { Product } from './types/Product';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { CartProvider } from './CartContext.tsx';
import Cart from './Cart';
import { useCart } from './useCart';


// Ana sayfa i�in yeni bir bile�en olu�turuyoruz
function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('priceAsc');

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
        return <div style={{ textAlign: 'center', padding: '50px' }}>�r�nler y�kleniyor...</div>;
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
                {/* Filtreleme ve S�ralama B�l�m� */}
                <section className="filter-sort-section">
                    <input
                        type="text"
                        placeholder="�r�n Ara..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em', flexGrow: 1, marginRight: '20px' }}
                    />
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="priceAsc">Fiyata G�re Artan</option>
                        <option value="priceDesc">Fiyata G�re Azalan</option>
                    </select>
                </section>

                <div className="product-list">
                    {filteredAndSortedProducts.length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>Arad���n�z kriterlere uygun �r�n bulunamad�.</p>
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

// Ana App bile�eni sadece CartProvider'� sarar
function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}

// Yeni bile�en, sepet sayac�na eri�im i�in CartProvider'�n i�ine yerle�tirildi
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