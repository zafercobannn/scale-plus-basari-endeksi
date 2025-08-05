import React, { useState } from 'react';
import './App.css';
import SuccessIndexDashboard from './components/SuccessIndexDashboard';
import { RepresentativeData, KPIWeights } from './types';
import { calculateSuccessIndex, defaultKPIWeights } from './utils/calculations';
import RepresentativeImage from './components/RepresentativeImage';
import KPISettingsModal from './components/KPISettingsModal';
import testData from './test-data.json';

function App() {
  // Scale Plus test verileri
  const defaultData: RepresentativeData[] = testData;

  const [representatives] = useState<RepresentativeData[]>(defaultData);
  // localStorage'dan kaydedilmiş ağırlıkları al veya default değerleri kullan
  const getStoredWeights = (): KPIWeights => {
    // Her zaman localStorage'ı temizle ve yeni ağırlıkları kullan
    localStorage.removeItem('kpiWeights');
    localStorage.removeItem('representatives');
    return defaultKPIWeights;
  };

  const [kpiWeights, setKpiWeights] = useState<KPIWeights>(getStoredWeights);
  const [isKPISettingsOpen, setIsKPISettingsOpen] = useState(false);

  // 1. olan kişiyi bul
  const calculatedData = calculateSuccessIndex(representatives, kpiWeights);
  const topPerformer = calculatedData.length > 0 ? calculatedData[0] : null;

  const handleKPISettingsSave = (newWeights: KPIWeights) => {
    setKpiWeights(newWeights);
    // Ağırlıkları localStorage'a kaydet
    localStorage.setItem('kpiWeights', JSON.stringify(newWeights));
  };

  return (
    <div className="App">
      <div className="main-container">
        {/* Sol Sidebar - Sadece Şampiyon Kartı */}
        <div className="left-sidebar">
          {topPerformer && (
            <div className="champion-card">
              <div className="champion-image">
                <RepresentativeImage name={topPerformer.name} size="large" />
              </div>
              <div className="champion-info">
                <h2 className="champion-name">{topPerformer.name}</h2>
                <p className="champion-title">En Yüksek Performans ⭐</p>
                <div className="champion-stats">
                  <div className="champion-stat-item">
                    <span className="champion-stat-label">Başarı Endeksi:</span>
                    <span className="champion-stat-value">{(topPerformer.successIndex * 100).toFixed(2)}%</span>
                  </div>
                  <div className="champion-stat-item">
                    <span className="champion-stat-label">Sıralama:</span>
                    <span className="champion-stat-value">#{topPerformer.rank}</span>
                  </div>
                </div>
                

              </div>
            </div>
          )}
        </div>

        {/* Orta Alan - Sadece Tablo */}
        <div className="content-area">
          <div className="table-only-container">
            <SuccessIndexDashboard representatives={representatives} kpiWeights={kpiWeights} />
          </div>
        </div>

        {/* Sağ Sidebar - İstatistikler ve Diğer Bilgiler */}
        <div className="sidebar">
          <div className="sidebar-content">

            <div className="sidebar-section">
              <h3 className="sidebar-title">⚙️ KPI Ayarları</h3>
              <button 
                className="kpi-settings-button"
                onClick={() => setIsKPISettingsOpen(true)}
              >
                Ağırlıkları Düzenle
              </button>
              <div className="current-weights">
                <div className="weight-item">
                  <span>Canlıya Alınan Firma Adedi:</span>
                  <span>{(kpiWeights.liveCompanyCount * 100).toFixed(0)}%</span>
                </div>
                <div className="weight-item">
                  <span>Audit Skoru:</span>
                  <span>{(kpiWeights.auditScore * 100).toFixed(0)}%</span>
                </div>
                <div className="weight-item">
                  <span>Onboarding Anket Skoru:</span>
                  <span>{(kpiWeights.onboardingScore * 100).toFixed(0)}%</span>
                </div>
                <div className="weight-item">
                  <span>Toplantı Değerlendirmesi:</span>
                  <span>{(kpiWeights.meetingEvaluation * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>



            <div className="sidebar-section">
              <h3 className="sidebar-title">🏆 En İyi Performanslar</h3>
              <div className="top-performances">
                {calculatedData.slice(0, 3).map((rep, index) => (
                  <div key={rep.name} className="top-performance-item">
                    <div className="performance-rank">#{rep.rank}</div>
                    <div className="performance-info">
                      <div className="performance-name">{rep.name}</div>
                      <div className="performance-score">{(rep.successIndex * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>




          </div>
        </div>
      </div>

      {/* KPI Ayarları Modal */}
      <KPISettingsModal
        isOpen={isKPISettingsOpen}
        onClose={() => setIsKPISettingsOpen(false)}
        onSave={handleKPISettingsSave}
        currentWeights={kpiWeights}
      />
    </div>
  );
  }
  
export default App; 