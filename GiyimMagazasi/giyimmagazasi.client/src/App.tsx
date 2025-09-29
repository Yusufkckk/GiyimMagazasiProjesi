import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './App.css';
import type { Product } from './types/Product';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { CartProvider } from './CartContext.tsx';
import Cart from './Cart';
import CheckoutPage from './pages/CheckoutPage';
import { useCart } from './useCart';
import { logout, isAuthenticated, getUserInfo } from './services/authService';
import type { UserInfo } from './services/authService';
import AuthPage from './pages/AuthPage';
import AdminPage from './AdminPage';
import { FaSearch, FaShoppingBag, FaCog } from 'react-icons/fa';
import OrderHistoryPage from './pages/OrderHistoryPage';


// Ana sayfa içeriğini doğrudan App.tsx'in içinde tanımlıyoruz
function HomePageContent() {
    const { categoryName } = useParams<{ categoryName?: string }>(); // YENİ: Kategori adını URL'den al

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('priceAsc');

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP hatası! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Product[]) => {

                
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Veri çekme sırasında bir hata oluştu:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Ürünler yükleniyor...</div>;
    }

    // YENİ: Kategori ve arama filtrelemesini birleştirme
    const filteredAndSortedProducts = products
        .filter(product => {
            // Kategori filtresi
            const isCategoryMatch = !categoryName || product.category.toLowerCase() === categoryName.toLowerCase();
            // Arama filtresi
            const isSearchMatch = product.name.toLowerCase().includes(filter.toLowerCase());
            return isCategoryMatch && isSearchMatch;
        })
        .sort((a, b) => {
            if (sort === 'priceAsc') {
                return a.price - b.price;
            } else if (sort === 'priceDesc') {
                return b.price - a.price;
            }
            return 0;
        });

    const pageTitle = categoryName
        ? `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Kategorisi Ürünleri`
        : 'Tüm Ürünlerimiz';

    return (
        <>
            <div className="container">
                <section className="filter-sort-section">
                    <h2>{pageTitle}</h2> {/* Başlığı buraya taşıdık */}
                    <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Ürün Ara..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1em', flexGrow: 1 }}
                        />
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="priceAsc">Fiyata Göre Artan</option>
                            <option value="priceDesc">Fiyata Göre Azalan</option>
                        </select>
                    </div>
                </section>
                <div className="product-list">
                    {filteredAndSortedProducts.length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%' }}>Aradığınız kriterlere uygun ürün bulunamadı.</p>
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

function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}

const AppContent = () => {
    const { itemCount } = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    // ⚙️ YENİ STATE: Ayarlar menüsünün açık/kapalı durumu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = isAuthenticated();
            setIsLoggedIn(loggedIn);
            if (loggedIn) {
                try {
                    const userInfo: UserInfo = await getUserInfo();
                    const name = userInfo.email.split('@')[0];
                    setUserName(name);
                    setUserRole(userInfo.role);
                } catch (error) {
                    console.error('Kullanıcı bilgisi alınamadı:', error);
                }
            }
        };
        checkAuth();
    }, []);

    const handleAuthChange = () => {
        setIsLoggedIn(isAuthenticated());
    };

    const handleSignOut = () => {
        logout();
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
        setIsDropdownOpen(false); 
        // alert yerine konsol logu kullanıldı
        console.log("Başarıyla çıkış yapıldı!");
    };

    // ⚙️ YENİ FONKSİYON: Dropdown menüyü açıp kapama
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    // Menü dışına tıklayınca menüyü kapatmak için useEffect
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const dropdown = document.querySelector('.settings-dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isDropdownOpen]);

    return (
        <Router>
            <div className="main-content">
                <header className="header">
                    <div className="header-logo">
                        <h1><Link to="/">Kocak Fashion</Link></h1>
                    </div>

                    <nav className="header-nav-center">
                        <ul>
                            <li><Link to="/">Anasayfa</Link></li>
                            <li className="dropdown">
                                <Link to="/categories/giyim">Giyim</Link>
                                <div className="dropdown-content">
                                    <Link to="/categories/sweat">Sweat</Link>
                                    <Link to="/categories/sweatshirt">Sweatshirt</Link>
                                    <Link to="/categories/mont">Mont</Link>
                                    <Link to="/categories/kaban">Kaban</Link>
                                    <Link to="/categories/eşofman">Eşofman</Link>
                                    <Link to="/categories/gomlek">Gömlek</Link>
                                    <Link to="/categories/t-shirt">T-shirt</Link>
                                    <Link to="/categories/pantolon">Pantolon</Link>
                                </div>
                            </li>
                            <li className="dropdown">
                                <Link to="/categories/aksesuar">Aksesuar</Link>
                                <div className="dropdown-content">
                                    <Link to="/categories/canta">Çanta</Link>
                                    <Link to="/categories/ayakkabi">Ayakkabı</Link>
                                </div>
                            </li>
                        </ul>
                    </nav>

                    <div className="header-actions">
                        <Link to="/search" className="icon"><FaSearch /></Link>
                        <Link to="/cart" className="icon"><FaShoppingBag /> ({itemCount})</Link>

                        {/* ⚙️ YENİ AYARLAR DROPDOWN MENÜSÜ */}
                        {isLoggedIn ? (
                            <div className="settings-dropdown">
                                <button onClick={toggleDropdown} className="settings-button" title="Ayarlar ve Profil">
                                    <FaCog />
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#555' }}>
                                            Hoşgeldin, {userName}
                                        </div>

                                        {/* SADECE ADMIN HESAPLARI İÇİN GÖSTERİLECEK KISIM */}
                                        {userRole === 'admin' && (
                                            <>
                                                <Link
                                                    to="/order-history"
                                                    className="dropdown-item"
                                                    onClick={() => setIsDropdownOpen(false)} // Tıklayınca menüyü kapat
                                                >
                                                    Sipariş Geçmişi
                                                </Link>
                                                <Link
                                                    to="/admin"
                                                    className="dropdown-item"
                                                    onClick={() => setIsDropdownOpen(false)} // Tıklayınca menüyü kapat
                                                >
                                                    Yönetim Paneli
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : null}


                        {/* Giriş/Çıkış Butonu */}
                        {isLoggedIn ? (
                            <button onClick={handleSignOut} className="logout-button">Çıkış Yap</button>
                        ) : (
                            <Link to="/auth" className="login-button">Giriş Yap</Link>
                        )}
                    </div>
                </header>

                <div className="container">
                    <Routes>
                        <Route path="/" element={<HomePageContent />} />
                        <Route path="/categories/:categoryName" element={<HomePageContent />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/auth" element={<AuthPage onAuthChange={handleAuthChange} />} />
                        {userRole === 'admin' && <Route path="/admin" element={<AdminPage />} />}
                        <Route path="/order-history" element={<OrderHistoryPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
