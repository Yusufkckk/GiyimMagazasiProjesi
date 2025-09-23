import React, { useState, useEffect } from 'react';
import './AdminPage.css'; // Yeni CSS dosyası oluşturacağız

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

const AdminPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
    });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);

    // Ürünleri API'den çekme
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('API hatası!');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Ürünler yüklenirken bir hata oluştu:', error);
            setLoading(false);
        }
    };

    // Form değerlerini güncelleme
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Yeni ürün ekleme veya mevcut ürünü güncelleme
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productToSubmit = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            id: currentProductId || undefined,
        };

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/products/${currentProductId}` : '/api/products';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSubmit),
            });

            if (!response.ok) throw new Error('İşlem başarısız oldu!');
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Ürün işlemi sırasında bir hata oluştu:', error);
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
        });
    };

    // Ürünü silme
    const handleDelete = async (id: number) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Silme işlemi başarısız oldu!');
                fetchProducts();
            } catch (error) {
                console.error('Ürünü silerken bir hata oluştu:', error);
            }
        }
    };

    // Formu sıfırlama
    const resetForm = () => {
        setIsEditing(false);
        setCurrentProductId(null);
        setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
    };

    if (loading) {
        return <div className="loading-message">Ürünler yükleniyor...</div>;
    }

    return (
        <div className="admin-container">
            <h2>Ürün Yönetimi</h2>

            <form onSubmit={handleSubmit} className="admin-form">
                <h3>{isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Ürün Adı"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Fiyat"
                    step="0.01"
                    required
                />
                <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Açıklama"
                    rows={4}
                    required
                ></textarea>
                <input
                    type="text"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Görsel URL'si"
                    required
                />
                <button type="submit">{isEditing ? 'Ürünü Güncelle' : 'Ürünü Ekle'}</button>
                {isEditing && (
                    <button type="button" onClick={resetForm} className="cancel-button">
                        İptal
                    </button>
                )}
            </form>

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
                                <p>${product.price.toFixed(2)}</p>
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
    );
};

export default AdminPage;