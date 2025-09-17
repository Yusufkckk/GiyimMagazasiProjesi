import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './App.css';

function App() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    // Eðer yanýt baþarýlý deðilse (örneðin, 404 veya 500) bir hata fýrlat.
                    throw new Error(`HTTP hatasý! Durum kodu: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error("Veri çekme sýrasýnda bir hata oluþtu:", error);
            });
    }, []);

    return (
        <div className="container">
            <h1>Giyim Maðazasý</h1>
            <div className="product-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default App;