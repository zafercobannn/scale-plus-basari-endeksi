import React, { useState } from 'react';
import './App.css';
import SuccessIndexDashboard from './components/SuccessIndexDashboard';
import { RepresentativeData, KPIWeights } from './types';
import { calculateSuccessIndex, defaultKPIWeights } from './utils/calculations';
import RepresentativeImage from './components/RepresentativeImage';
import KPISettingsModal from './components/KPISettingsModal';

function App() {
  // Temmuz verileri (gerçek veriler)
  const defaultData: RepresentativeData[] = [
    {
      "MT Adı": "Adil Hanedan",
      "Audit Skoru": 55,
      "Toplam Çağrı Adedi": 343,
      "Ortalama Konuşma Süresi": "601,54",
      "Lokal Kapatma Oranı": "76,68%",
      "Kaçan Çağrılar": 2,
      "Çağrı Değerlendirme Ortalaması": "4,81",
      "Çağrı Değerlendirme Adet": 74
    },
    {
      "MT Adı": "Afra Sak",
      "Audit Skoru": 85,
      "Toplam Çağrı Adedi": 635,
      "Ortalama Konuşma Süresi": "399,02",
      "Lokal Kapatma Oranı": "93,86%",
      "Kaçan Çağrılar": 6,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 111
    },
    {
      "MT Adı": "Aleyna Özata",
      "Audit Skoru": 80,
      "Toplam Çağrı Adedi": 875,
      "Ortalama Konuşma Süresi": "307,13",
      "Lokal Kapatma Oranı": "89,94%",
      "Kaçan Çağrılar": 9,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 110
    },
    {
      "MT Adı": "Ayça Tokkuşoğlu",
      "Audit Skoru": "N/A",
      "Toplam Çağrı Adedi": 143,
      "Ortalama Konuşma Süresi": "606,83",
      "Lokal Kapatma Oranı": "31,47%",
      "Kaçan Çağrılar": 9,
      "Çağrı Değerlendirme Ortalaması": "N/A",
      "Çağrı Değerlendirme Adet": "N/A"
    },
    {
      "MT Adı": "Aysel Şebnem Palta",
      "Audit Skoru": 90,
      "Toplam Çağrı Adedi": 519,
      "Ortalama Konuşma Süresi": "355,68",
      "Lokal Kapatma Oranı": "94,61%",
      "Kaçan Çağrılar": 10,
      "Çağrı Değerlendirme Ortalaması": "4,93",
      "Çağrı Değerlendirme Adet": 85
    },
    {
      "MT Adı": "Barış Bayraktar",
      "Audit Skoru": 75,
      "Toplam Çağrı Adedi": 580,
      "Ortalama Konuşma Süresi": "391,79",
      "Lokal Kapatma Oranı": "89,14%",
      "Kaçan Çağrılar": 10,
      "Çağrı Değerlendirme Ortalaması": "4,88",
      "Çağrı Değerlendirme Adet": 96
    },
    {
      "MT Adı": "Batuhan Demirci",
      "Audit Skoru": 70,
      "Toplam Çağrı Adedi": 454,
      "Ortalama Konuşma Süresi": "434,14",
      "Lokal Kapatma Oranı": "88,55%",
      "Kaçan Çağrılar": 1,
      "Çağrı Değerlendirme Ortalaması": "4,88",
      "Çağrı Değerlendirme Adet": 83
    },
    {
      "MT Adı": "Betül Şahin",
      "Audit Skoru": "N/A",
      "Toplam Çağrı Adedi": 107,
      "Ortalama Konuşma Süresi": "517,93",
      "Lokal Kapatma Oranı": "85,05%",
      "Kaçan Çağrılar": 3,
      "Çağrı Değerlendirme Ortalaması": "N/A",
      "Çağrı Değerlendirme Adet": "N/A"
    },
    {
      "MT Adı": "Busenur Alagöz",
      "Audit Skoru": 70,
      "Toplam Çağrı Adedi": 420,
      "Ortalama Konuşma Süresi": "593,54",
      "Lokal Kapatma Oranı": "77,14%",
      "Kaçan Çağrılar": 4,
      "Çağrı Değerlendirme Ortalaması": "4,71",
      "Çağrı Değerlendirme Adet": 65
    },
    {
      "MT Adı": "Ecenaz Geleş",
      "Audit Skoru": 70,
      "Toplam Çağrı Adedi": 458,
      "Ortalama Konuşma Süresi": "400,44",
      "Lokal Kapatma Oranı": "90,61%",
      "Kaçan Çağrılar": 1,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 83
    },
    {
      "MT Adı": "Ege Beşik",
      "Audit Skoru": "N/A",
      "Toplam Çağrı Adedi": 152,
      "Ortalama Konuşma Süresi": "564,61",
      "Lokal Kapatma Oranı": "84,21%",
      "Kaçan Çağrılar": 0,
      "Çağrı Değerlendirme Ortalaması": "N/A",
      "Çağrı Değerlendirme Adet": "N/A"
    },
    {
      "MT Adı": "Evren Yavuz",
      "Audit Skoru": "N/A",
      "Toplam Çağrı Adedi": 107,
      "Ortalama Konuşma Süresi": "738,46",
      "Lokal Kapatma Oranı": "85,98%",
      "Kaçan Çağrılar": 0,
      "Çağrı Değerlendirme Ortalaması": "N/A",
      "Çağrı Değerlendirme Adet": "N/A"
    },
    {
      "MT Adı": "Fatih Aktaş",
      "Audit Skoru": 70,
      "Toplam Çağrı Adedi": 432,
      "Ortalama Konuşma Süresi": "364,29",
      "Lokal Kapatma Oranı": "85,42%",
      "Kaçan Çağrılar": 0,
      "Çağrı Değerlendirme Ortalaması": "4,89",
      "Çağrı Değerlendirme Adet": 70
    },
    {
      "MT Adı": "Furkan Er",
      "Audit Skoru": 60,
      "Toplam Çağrı Adedi": 561,
      "Ortalama Konuşma Süresi": "465,8",
      "Lokal Kapatma Oranı": "86,45%",
      "Kaçan Çağrılar": 2,
      "Çağrı Değerlendirme Ortalaması": "4,92",
      "Çağrı Değerlendirme Adet": 109
    },
    {
      "MT Adı": "Göktürk Şafak",
      "Audit Skoru": 55,
      "Toplam Çağrı Adedi": 504,
      "Ortalama Konuşma Süresi": "623,56",
      "Lokal Kapatma Oranı": "93,65%",
      "Kaçan Çağrılar": 0,
      "Çağrı Değerlendirme Ortalaması": "4,78",
      "Çağrı Değerlendirme Adet": 116
    },
    {
      "MT Adı": "Hikmet Ertem Çiftlik",
      "Audit Skoru": 90,
      "Toplam Çağrı Adedi": 408,
      "Ortalama Konuşma Süresi": "425,62",
      "Lokal Kapatma Oranı": "89,22%",
      "Kaçan Çağrılar": 7,
      "Çağrı Değerlendirme Ortalaması": "4,78",
      "Çağrı Değerlendirme Adet": 73
    },
    {
      "MT Adı": "Manolya Yilmaz",
      "Audit Skoru": 60,
      "Toplam Çağrı Adedi": 372,
      "Ortalama Konuşma Süresi": "522,64",
      "Lokal Kapatma Oranı": "95,70%",
      "Kaçan Çağrılar": 1,
      "Çağrı Değerlendirme Ortalaması": "4,76",
      "Çağrı Değerlendirme Adet": 73
    },
    {
      "MT Adı": "Mehmet Onur Aykut",
      "Audit Skoru": 90,
      "Toplam Çağrı Adedi": 413,
      "Ortalama Konuşma Süresi": "537,19",
      "Lokal Kapatma Oranı": "84,50%",
      "Kaçan Çağrılar": 2,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 86
    },
    {
      "MT Adı": "Mehmet Sevay",
      "Audit Skoru": 60,
      "Toplam Çağrı Adedi": 569,
      "Ortalama Konuşma Süresi": "425,14",
      "Lokal Kapatma Oranı": "82,60%",
      "Kaçan Çağrılar": 1,
      "Çağrı Değerlendirme Ortalaması": "4,89",
      "Çağrı Değerlendirme Adet": 75
    },
    {
      "MT Adı": "Mehmet Tugay Kasap",
      "Audit Skoru": 85,
      "Toplam Çağrı Adedi": 356,
      "Ortalama Konuşma Süresi": "438,68",
      "Lokal Kapatma Oranı": "83,99%",
      "Kaçan Çağrılar": 1,
      "Çağrı Değerlendirme Ortalaması": "4,94",
      "Çağrı Değerlendirme Adet": 65
    },
    {
      "MT Adı": "Melike Akın",
      "Audit Skoru": "N/A",
      "Toplam Çağrı Adedi": 20,
      "Ortalama Konuşma Süresi": "523,85",
      "Lokal Kapatma Oranı": "80,00%",
      "Kaçan Çağrılar": 0,
      "Çağrı Değerlendirme Ortalaması": "N/A",
      "Çağrı Değerlendirme Adet": "N/A"
    },
    {
      "MT Adı": "Melike Er",
      "Audit Skoru": 90,
      "Toplam Çağrı Adedi": 549,
      "Ortalama Konuşma Süresi": "315,06",
      "Lokal Kapatma Oranı": "94,72%",
      "Kaçan Çağrılar": 1,
      "Çağrı Değerlendirme Ortalaması": "4,91",
      "Çağrı Değerlendirme Adet": 85
    },
    {
      "MT Adı": "Mert Karaalioğlu",
      "Audit Skoru": 90,
      "Toplam Çağrı Adedi": 437,
      "Ortalama Konuşma Süresi": "498,03",
      "Lokal Kapatma Oranı": "88,56%",
      "Kaçan Çağrılar": 2,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 72
    },
    {
      "MT Adı": "Mustafa Pekdemir",
      "Audit Skoru": "N/A",
      "Toplam Çağrı Adedi": 114,
      "Ortalama Konuşma Süresi": "543,08",
      "Lokal Kapatma Oranı": "85,09%",
      "Kaçan Çağrılar": 3,
      "Çağrı Değerlendirme Ortalaması": "N/A",
      "Çağrı Değerlendirme Adet": "N/A"
    },
    {
      "MT Adı": "Ömer Bekin",
      "Audit Skoru": 85,
      "Toplam Çağrı Adedi": 397,
      "Ortalama Konuşma Süresi": "428,24",
      "Lokal Kapatma Oranı": "84,13%",
      "Kaçan Çağrılar": 3,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 55
    },
    {
      "MT Adı": "Özgün Kazan",
      "Audit Skoru": 50,
      "Toplam Çağrı Adedi": 615,
      "Ortalama Konuşma Süresi": "365,97",
      "Lokal Kapatma Oranı": "95,93%",
      "Kaçan Çağrılar": 13,
      "Çağrı Değerlendirme Ortalaması": "4,90",
      "Çağrı Değerlendirme Adet": 118
    },
    {
      "MT Adı": "Selen Kılınç",
      "Audit Skoru": 90,
      "Toplam Çağrı Adedi": 638,
      "Ortalama Konuşma Süresi": "250,5",
      "Lokal Kapatma Oranı": "74,76%",
      "Kaçan Çağrılar": 5,
      "Çağrı Değerlendirme Ortalaması": "4,69",
      "Çağrı Değerlendirme Adet": 78
    },
    {
      "MT Adı": "Tahir Buğra Tüzün",
      "Audit Skoru": 80,
      "Toplam Çağrı Adedi": 386,
      "Ortalama Konuşma Süresi": "275,06",
      "Lokal Kapatma Oranı": "95,85%",
      "Kaçan Çağrılar": 4,
      "Çağrı Değerlendirme Ortalaması": "4,96",
      "Çağrı Değerlendirme Adet": 56
    },
    {
      "MT Adı": "Uğurhan Özkeleş",
      "Audit Skoru": 85,
      "Toplam Çağrı Adedi": 281,
      "Ortalama Konuşma Süresi": "455,09",
      "Lokal Kapatma Oranı": "87,19%",
      "Kaçan Çağrılar": 10,
      "Çağrı Değerlendirme Ortalaması": "5,00",
      "Çağrı Değerlendirme Adet": 43
    },
    {
      "MT Adı": "Yaren Ece Koçak",
      "Audit Skoru": 60,
      "Toplam Çağrı Adedi": 610,
      "Ortalama Konuşma Süresi": "408,16",
      "Lokal Kapatma Oranı": "82,95%",
      "Kaçan Çağrılar": 0,
      "Çağrı Değerlendirme Ortalaması": "4,94",
      "Çağrı Değerlendirme Adet": 71
    }
  ];

  const [representatives] = useState<RepresentativeData[]>(defaultData);
  const [kpiWeights, setKpiWeights] = useState<KPIWeights>(defaultKPIWeights);
  const [isKPISettingsOpen, setIsKPISettingsOpen] = useState(false);

  // 1. olan kişiyi bul
  const calculatedData = calculateSuccessIndex(representatives, kpiWeights);
  const topPerformer = calculatedData.length > 0 ? calculatedData[0] : null;

  const handleKPISettingsSave = (newWeights: KPIWeights) => {
    setKpiWeights(newWeights);
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
                <p className="champion-title">Temmuz<br />Başarı Endeksi Şampiyonu! 🏆</p>
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
                  <span>Çağrı Adedi:</span>
                  <span>{(kpiWeights.callCount * 100).toFixed(0)}%</span>
                </div>
                <div className="weight-item">
                  <span>Konuşma Süresi:</span>
                  <span>{(kpiWeights.callDuration * 100).toFixed(0)}%</span>
                </div>
                <div className="weight-item">
                  <span>Audit Skoru:</span>
                  <span>{(kpiWeights.auditScore * 100).toFixed(0)}%</span>
                </div>
                <div className="weight-item">
                  <span>CSAT:</span>
                  <span>{(kpiWeights.csatScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">📈 Hızlı İstatistikler</h3>
              <div className="quick-stats">
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Toplam Temsilci</span>
                  <span className="quick-stat-value">{representatives.length}</span>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Aktif Temsilci</span>
                  <span className="quick-stat-value">{representatives.filter(r => r["Audit Skoru"] !== "N/A").length}</span>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Ortalama Audit</span>
                  <span className="quick-stat-value">76.8</span>
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

            <div className="sidebar-section">
              <h3 className="sidebar-title">📅 Güncelleme Bilgisi</h3>
              <div className="update-info">
                <p className="update-date">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
                <p className="update-period">Temmuz 2025 Verileri</p>
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