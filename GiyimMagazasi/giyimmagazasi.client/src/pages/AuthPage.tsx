// src/pages/AuthPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import './AuthPage.css';

interface AuthPageProps {
    onAuthChange: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthChange }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            onAuthChange(); // Başarılı giriş sonrası parent bileşeni bilgilendir
            navigate('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert('Giriş başarısız: ' + error.message);
            } else {
                alert('Giriş başarısız: Bilinmeyen bir hata oluştu.');
            }
        }
    };

    const handleRegister = async () => {
        try {
            await register(email, password);
            alert('Hesabınız başarıyla oluşturuldu!');
            onAuthChange(); // Başarılı kayıt sonrası parent bileşeni bilgilendir
            navigate('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert('Kayıt başarısız: ' + error.message);
            } else {
                alert('Kayıt başarısız: Bilinmeyen bir hata oluştu.');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2>{isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email"
                        placeholder="E-posta"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-submit-button">
                        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    </button>
                </form>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="toggle-button"
                >
                    {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;