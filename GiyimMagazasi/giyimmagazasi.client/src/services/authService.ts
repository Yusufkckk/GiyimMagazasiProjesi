// src/services/authService.ts

const API_BASE_URL = 'https://localhost:61963/api/auth'; // Kendi API adresinle değiştir.

const handleResponse = async (response: Response) => {
    try {
        const data = await response.json();
        return data;
    } catch {
        const text = await response.text();
        return { message: text || 'Bilinmeyen bir hata oluştu.' };
    }
};

export const login = async (email: string, password: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Giriş başarısız.');
        }

        const token = data.token;
        localStorage.setItem('user_token', token); // Doğru anahtar: "user_token"
        return token;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Bir ağ hatası oluştu.');
    }
};

// Yeni fonksiyonu ekliyoruz
export const getToken = (): string | null => {
    return localStorage.getItem('user_token');
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

        const data = await handleResponse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Kayıt başarısız.');
        }

        await login(email, password);
        return true;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Bir ağ hatası oluştu.');
    }
};
export interface UserInfo {
    email: string;
    role: string;
}

export const logout = (): void => {
    localStorage.removeItem('user_token');
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('user_token');
    return !!token;
};

// getUserInfo fonksiyonunun, UserInfo tipinde bir Promise döndüreceğini belirt
export const getUserInfo = async (): Promise<UserInfo> => {
    const token = localStorage.getItem('user_token');
    if (!token) {
        throw new Error('Kullanıcı oturum açmamış.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kullanıcı bilgisi alınamadı.');
        }

        const data = await response.json();
        // data nesnesinin hem email hem de role içerdiğinden emin olmalısın
        if (!data.email || !data.role) {
            throw new Error('Kullanıcı verisi eksik.');
        }

        return data; // Backend'den gelen veriyi direkt döndür (doğru tipte olduğu varsayılarak)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Kullanıcı bilgisi alınamadı.');
    }
};