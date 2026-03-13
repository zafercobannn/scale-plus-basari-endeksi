import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      setError('Firebase yapılandırması eksik. Lütfen .env.local dosyasını kontrol edin.');
      return;
    }

    if (!email || !password) {
      setError('Lütfen email ve şifre giriniz');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Kullanıcı bulunamadı');
      } else if (err.code === 'auth/wrong-password') {
        setError('Hatalı şifre');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz email formatı');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Geçersiz email veya şifre');
      } else {
        setError('Giriş yapılırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Scale Plus</h1>
          <p>Admin Paneli Girişi</p>
        </div>

        {!isConfigured && (
          <div className="login-warning">
            <strong>Firebase Yapılandırması Eksik</strong>
            <p>Admin panelini kullanmak için Firebase yapılandırmanız gerekiyor.</p>
            <ol>
              <li>Firebase Console'da proje oluşturun</li>
              <li>.env.local dosyasını Firebase bilgileriyle doldurun</li>
              <li>Uygulamayı yeniden başlatın</li>
            </ol>
          </div>
        )}
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={loading || !isConfigured}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading || !isConfigured}
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading || !isConfigured}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        
        <div className="login-footer">
          <Link to="/">← Dashboard'a Dön</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
