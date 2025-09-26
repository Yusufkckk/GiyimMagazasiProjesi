import React, { useState, useEffect } from 'react';
import './AdminPage.css';

// Kategori Listesi (Veritabanınızdaki/API'nizdeki kategorilerle eşleşmeli)
const ALL_CATEGORIES = ['sweat', 'sweatshirt', 'mont', 'kaban', 'eşofman', 'gomlek', 't-shirt', 'pantolon', 'canta', 'ayakkabi'];

// Interface'i güncelliyoruz, category ve stock zaten API'den geldiği için ekliyoruz
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    stock: number;
}

// Form state'i de yeni alanları içerecek şekilde güncellenmeli
interface NewProductState {
    name: string;
    price: string;
    description: string;
    imageUrl: string;
    category: string;
    stock: string;
}

const AdminPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [newProduct, setNewProduct] = useState<NewProductState>({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        category: ALL_CATEGORIES[0] || '', // Varsayılan kategori
        stock: '0', // Varsayılan stok
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);

    // API istekleri için yetkilendirme başlığını al
    const getAuthHeaders = () => {
        const token = localStorage.getItem('user_token'); // Buradaki anahtar "user_token" olmalı
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Ürünleri API'den çekme
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products', {
                headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error('API hatası!');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Ürünler yüklenirken bir hata oluştu:', error);
            setLoading(false);
        }
    };

    // Yüklenme anında ürünleri çek
    useEffect(() => {
        fetchProducts();
    }, []); // 👈️ Hata çözüldü: useEffect artık kullanılıyor

    // Form değerlerini güncelleme (select ve number inputları destekler)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Formu sıfırlama
    const resetForm = () => {
        setIsEditing(false);
        setCurrentProductId(null);
        setNewProduct({
            name: '',
            price: '',
            description: '',
            imageUrl: '',
            category: ALL_CATEGORIES[0] || '', // Resetlerken varsayılan kategoriye dön
            stock: '0'
        });
    };

    // Ürünü silme
    const handleDelete = async (id: number) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                });
                if (!response.ok) throw new Error('Silme işlemi başarısız oldu!');

                
                alert('✅ Ürün başarıyla silindi!');

                fetchProducts(); // Listeyi yeniden çek (veya setProducts ile güncelleyebiliriz)
            } catch (error) {
                console.error('Ürünü silerken bir hata oluştu:', error);
                
                alert('❌ Ürünü silerken bir hata oluştu. Yetkilerinizi kontrol edin.');
            }
        }
    };

    // Yeni ürün ekleme veya mevcut ürünü güncelleme
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Gönderilecek veriyi hazırlama ve string'leri sayıya çevirme
        const productToSubmit = {
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            description: newProduct.description,
            imageUrl: newProduct.imageUrl,
            category: newProduct.category,
            stock: parseInt(newProduct.stock),
            id: currentProductId || undefined,
        };

        // Hata kontrolü
        if (isNaN(productToSubmit.price) || productToSubmit.price <= 0 || isNaN(productToSubmit.stock)) {
            alert('Lütfen fiyat ve stok alanlarını geçerli sayılarla doldurun.');
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/products/${currentProductId}` : '/api/products';

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(productToSubmit),
            });

            if (!response.ok) throw new Error('İşlem başarısız oldu!');

            // 🟢 BAŞARI BİLDİRİMİ EKLE
            const successMessage = isEditing ? '✅ Ürün başarıyla güncellendi!' : '✅ Yeni ürün başarıyla eklendi!';
            alert(successMessage);

            fetchProducts();
            resetForm();

        } catch (error) {
            console.error('Ürün işlemi sırasında bir hata oluştu:', error);
            // 🔴 HATA BİLDİRİMİ
            alert('❌ Ürün işlemi sırasında bir hata oluştu. Yetkilerinizi kontrol edin.');
        }
    };

    // Ürünü düzenleme moduna geçirme
    const handleEdit = (product: Product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setNewProduct({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock.toString(),
        });
    };

    if (loading) {
        return <div className="loading-message">Ürünler yükleniyor...</div>;
    }

    return (
        <div className="admin-container">
            <h2>Ürün Yönetimi</h2>

            <div className="admin-content-wrapper">

                {/* SOL SÜTUN: Form */}
                <form onSubmit={handleSubmit} className="admin-form">
                    <h3>{isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>

                    {/* Mevcut Inputlar */}
                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Ürün Adı" required />
                    <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Fiyat" step="0.01" required />
                    <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Açıklama" rows={4} required></textarea>
                    <input type="text" name="imageUrl" value={newProduct.imageUrl} onChange={handleInputChange} placeholder="Görsel URL'si" required />

                    {/* Kategori Seçimi */}
                    <select name="category" value={newProduct.category} onChange={handleInputChange} required>
                        <option value="" disabled>Kategori Seçiniz</option>
                        {ALL_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {/* Kategorinin ilk harfini büyük yapıyoruz */}
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* Stok Miktarı */}
                    <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="Stok Miktarı" required />

                    {/* Butonlar */}
                    <button type="submit">{isEditing ? 'Ürünü Güncelle' : 'Ürünü Ekle'}</button>
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="cancel-button">
                            İptal
                        </button>
                    )}
                </form>

                {/* SAĞ SÜTUN: Mevcut Ürünler Listesi */}
                <div className="admin-product-list">
                    <h3>Mevcut Ürünler</h3>
                    {products.length === 0 ? (
                        <p>Henüz ürün bulunmuyor.</p>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="admin-product-item">
                                <img src={product.imageUrl} alt={product.name} />
                                <div className="admin-product-info">
                                    <h4>{product.name}</h4>
                                    <p>₺{product.price.toFixed(2)}</p>
                                    <p>Stok: {product.stock}</p>
                                    <p>Kategori: {product.category}</p>
                                </div>
                                <div className="admin-buttons">
                                    <button onClick={() => handleEdit(product)} className="edit-button">Düzenle</button>
                                    <button onClick={() => handleDelete(product.id)} className="delete-button">Sil</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPage;