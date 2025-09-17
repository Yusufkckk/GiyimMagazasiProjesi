import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './App.css';
import type { Product } from './types/Product';

function App() {
    const [products, setProducts] = useState<Product[]>([]); // 'any' yerine 'Product' kullan�n

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    // E�er yan�t ba�ar�l� de�ilse (�rne�in, 404 veya 500) bir hata f�rlat.
                    throw new Error(`HTTP hatas�! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error("Veri �ekme s�ras�nda bir hata olu�tu:", error);
            });
    }, []);

    return (
        <div className="container">
            <h1>KOCAK FASHION</h1>
            <div className="product-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default App;