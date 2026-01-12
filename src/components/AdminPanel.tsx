import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CSVUploader from './CSVUploader';
import DataManager from './DataManager';
import KPISettings from './KPISettings';
import { KPIWeights } from '../types';
import './AdminPanel.css';

type TabType = 'upload' | 'manage' | 'kpi';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleKPISave = (weights: KPIWeights) => {
    console.log('KPI weights saved:', weights);
    // Dashboard otomatik olarak localStorage'dan okuyacak
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="header-left">
          <h1>Scale Plus Admin</h1>
          <nav className="admin-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
          </nav>
        </div>
        <div className="header-right">
          <span className="user-email">{currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 CSV Yükle
          </button>
          <button 
            className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📊 Verileri Yönet
          </button>
          <button 
            className={`tab-button ${activeTab === 'kpi' ? 'active' : ''}`}
            onClick={() => setActiveTab('kpi')}
          >
            ⚙️ KPI Ayarları
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'upload' && (
            <CSVUploader onUploadSuccess={handleUploadSuccess} />
          )}
          {activeTab === 'manage' && (
            <DataManager 
              refreshTrigger={refreshTrigger} 
              onDataChange={handleDataChange}
            />
          )}
          {activeTab === 'kpi' && (
            <KPISettings onSave={handleKPISave} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
