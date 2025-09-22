// src/services/authService.ts

const API_BASE_URL = 'https://localhost:61963/api/auth'; // Kendi API adresinle değiştir.

export const login = async (email: string, password: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Giriş başarısız.');
        }

        const data = await response.json();
        const token = data.token; // Backend'in döndürdüğü token'ı al

        localStorage.setItem('user_token', token);
        return token;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Bir ağ hatası oluştu.');
    }
};

export const register = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kayıt başarısız.');
        }

        // Başarılı kayıt sonrası otomatik giriş yap
        await login(email, password);
        return true;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Bir ağ hatası oluştu.');
    }
};

export const logout = (): void => {
    localStorage.removeItem('user_token');
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('user_token');
    return !!token;
};

// Güncellenmiş getUserInfo fonksiyonu
export const getUserInfo = async (): Promise<{ email: string }> => {
    const token = localStorage.getItem('user_token');
    if (!token) {
        throw new Error('Kullanıcı oturum açmamış.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token'ı başlığa ekle
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kullanıcı bilgisi alınamadı.');
        }

        const data = await response.json();
        return data; // Backend'den gelen veriyi direkt döndür
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Kullanıcı bilgisi alınamadı.');
    }
};