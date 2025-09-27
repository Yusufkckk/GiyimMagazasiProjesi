import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

const ORDER_API_ENDPOINT = 'https://localhost:61963/api/Orders';

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    product: {
        name: string;
        price: number;
    };
}

interface Order {
    id: number;
    customerName: string;
    // 🚀 DÜZELTME: Bu alanları ekleyin
    customerAddress: string;
    customerCity: string;
    // ----------------------
    customerEmail: string;
    orderDate: string;
    totalAmount: number;
    orderItems: OrderItem[];
}

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ... (Kodun geri kalanı aynı kalacak) ...
        const fetchOrders = async () => {
            try {
                const response = await fetch(ORDER_API_ENDPOINT);
                if (!response.ok) {
                    throw new Error('Siparişler yüklenirken bir hata oluştu.');
                }
                const data: Order[] = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Sipariş geçmişi çekme hatası:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Siparişler yükleniyor...</div>;
    }

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '50px auto' }}>
            <h2>Tüm Siparişler</h2>
            {orders.length === 0 ? (
                <p>Henüz sipariş bulunmamaktadır.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '20px', marginBottom: '20px' }}>
                        <h3>Sipariş ID: {order.id}</h3>
                        <p><strong>Müşteri:</strong> {order.customerName}</p>
                        <p><strong>E-posta:</strong> {order.customerEmail}</p>
                        {/* 🚀 DÜZELTME: Bu satır şimdi doğru çalışacak */}
                        <p><strong>Adres:</strong> {order.customerAddress}, {order.customerCity}</p>
                        {/* ------------------------------------------- */}
                        <p><strong>Tarih:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <h4>Sipariş Kalemleri:</h4>
                        <ul>
                            {order.orderItems.map((item) => (
                                <li key={item.id}>
                                    {item.product.name} (x{item.quantity}) - ₺{(item.product.price * item.quantity).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>Toplam: ₺{order.totalAmount.toFixed(2)}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistoryPage;