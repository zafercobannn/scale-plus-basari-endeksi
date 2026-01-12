import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SuccessIndexDashboard from './SuccessIndexDashboard';
import { RepresentativeData, KPIWeights } from '../types';
import { calculateSuccessIndex, defaultKPIWeights, calculateYearlyAverages } from '../utils/calculations';
import RepresentativeImage from './RepresentativeImage';
import KPISettingsModal from './KPISettingsModal';
import { getAllMonths, MonthData, subscribeToKPIWeights } from '../services/dataService';

// Statik veri importları (fallback)
import temmuzData from '../data/temmuz-2025.json';
import agustosData from '../data/agustos-2025.json';
import eylulData from '../data/eylul-2025.json';
import ekimData from '../data/ekim-2025.json';
import kasimData from '../data/kasim-2025.json';
import aralikData from '../data/aralik-2025.json';

type MonthKey = string;

interface MonthOption {
  key: string;
  label: string;
}

const staticMonthDataMap: Record<string, RepresentativeData[]> = {
  'temmuz-2025': temmuzData as RepresentativeData[],
  'agustos-2025': agustosData as RepresentativeData[],
  'eylul-2025': eylulData as RepresentativeData[],
  'ekim-2025': ekimData as RepresentativeData[],
  'kasim-2025': kasimData as RepresentativeData[],
  'aralik-2025': aralikData as RepresentativeData[],
};

const staticMonthNames: Record<string, string> = {
  'temmuz-2025': 'Temmuz 2025',
  'agustos-2025': 'Ağustos 2025',
  'eylul-2025': 'Eylül 2025',
  'ekim-2025': 'Ekim 2025',
  'kasim-2025': 'Kasım 2025',
  'aralik-2025': 'Aralık 2025',
};

const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('aralik-2025');
  const [representatives, setRepresentatives] = useState<RepresentativeData[]>(aralikData as RepresentativeData[]);
  const [isYearlyView, setIsYearlyView] = useState(false);
  const [monthDataMap, setMonthDataMap] = useState<Record<string, RepresentativeData[]>>(staticMonthDataMap);
  const [monthNames, setMonthNames] = useState<Record<string, string>>(staticMonthNames);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [kpiWeights, setKpiWeights] = useState<KPIWeights>(defaultKPIWeights);
  const [isKPISettingsOpen, setIsKPISettingsOpen] = useState(false);

  // Firebase'den KPI ağırlıklarını dinle (realtime)
  useEffect(() => {
    const unsubscribe = subscribeToKPIWeights((weights) => {
      setKpiWeights(weights);
    });

    return () => unsubscribe();
  }, []);

  // Firebase'den verileri yükle
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        const firebaseMonths = await getAllMonths();
        
        if (firebaseMonths.length > 0) {
          // Firebase verilerini monthDataMap'e ekle
          const newMonthDataMap: Record<string, RepresentativeData[]> = { ...staticMonthDataMap };
          const newMonthNames: Record<string, string> = { ...staticMonthNames };
          
          firebaseMonths.forEach((month: MonthData) => {
            newMonthDataMap[month.key] = month.data;
            newMonthNames[month.key] = month.name;
          });
          
          setMonthDataMap(newMonthDataMap);
          setMonthNames(newMonthNames);
          
          // En son eklenen Firebase verisini seç
          const latestMonth = firebaseMonths[0];
          setSelectedMonth(latestMonth.key);
          setRepresentatives(latestMonth.data);
        }
      } catch (error) {
        console.error('Firebase veri yükleme hatası:', error);
        // Hata durumunda statik verileri kullan
      } finally {
        setLoading(false);
      }
    };

    loadFirebaseData();
  }, []);

  // Mevcut ayları güncelle
  useEffect(() => {
    const months: MonthOption[] = Object.keys(monthDataMap).map(key => ({
      key,
      label: monthNames[key] || key
    }));
    months.push({ key: 'yearly', label: 'Yıllık Ortalama' });
    setAvailableMonths(months);
  }, [monthDataMap, monthNames]);

  // Ay değiştiğinde verileri güncelle
  useEffect(() => {
    if (selectedMonth === 'yearly') {
      setIsYearlyView(true);
      const yearlyData = calculateYearlyAverages(monthDataMap, kpiWeights);
      const yearlyRepresentatives: RepresentativeData[] = yearlyData.map(rep => ({
        "MT Adı": rep.name,
        "Audit Skoru": rep.auditScore,
        "Toplam Çağrı Adedi": 0,
        "Ortalama Konuşma Süresi": "0",
        "Lokal Kapatma Oranı": "0%",
        "Kaçan Çağrılar": 0,
        "Çağrı Değerlendirme Ortalaması": "0",
        "Çağrı Değerlendirme Adet": 0,
        "Canlıya Alınan Firma Adedi": Math.round(rep.liveCompanyCount),
        "Canlıya Alınan Hesap Sayısı Hedefi": Math.round(rep.liveCompanyTarget),
        "Onboarding Anket Skoru": rep.originalOnboardingScore,
        "Toplantı Değerlendirmesi": rep.originalMeetingEvaluation
      }));
      setRepresentatives(yearlyRepresentatives);
    } else if (monthDataMap[selectedMonth]) {
      setIsYearlyView(false);
      setRepresentatives(monthDataMap[selectedMonth]);
    }
  }, [selectedMonth, kpiWeights, monthDataMap]);

  const calculatedData = calculateSuccessIndex(representatives, kpiWeights);
  const topPerformers = calculatedData.filter(rep => rep.rank === 1);
  const primaryTopPerformer = topPerformers.length > 0 ? topPerformers[0] : null;

  const handleKPISettingsSave = (newWeights: KPIWeights) => {
    setKpiWeights(newWeights);
    localStorage.setItem('kpiWeights', JSON.stringify(newWeights));
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="main-container">
        {/* Sol Sidebar - Sadece Şampiyon Kartı */}
        <div className="left-sidebar">
          {primaryTopPerformer && (
            <div className="champion-card">
              <div className="champion-image">
                {topPerformers.map(rep => (
                  <RepresentativeImage key={rep.name} name={rep.name} size="large" />
                ))}
              </div>
              <div className="champion-info">
                {topPerformers.length === 1 ? (
                  <>
                    <h2 className="champion-name">{primaryTopPerformer.name}</h2>
                    <p className="champion-title">En Yüksek Performans ⭐</p>
                  </>
                ) : (
                  <>
                    <h2 className="champion-name">En Yüksek Performans Sahipleri</h2>
                    <p className="champion-title">
                      {topPerformers.map(rep => rep.name).join(' & ')}
                    </p>
                  </>
                )}
                <div className="champion-stats">
                  <div className="champion-stat-item">
                    <span className="champion-stat-label">Başarı Endeksi:</span>
                    <span className="champion-stat-value">{(primaryTopPerformer.successIndex * 100).toFixed(2)}%</span>
                  </div>
                  <div className="champion-stat-item">
                    <span className="champion-stat-label">Sıralama:</span>
                    <span className="champion-stat-value">#{primaryTopPerformer.rank}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Linki */}
          <div className="admin-link-container">
            <Link to="/login" className="admin-link">
              Admin Paneli
            </Link>
          </div>
        </div>

        {/* Orta Alan - Sadece Tablo */}
        <div className="content-area">
          <div className="table-only-container">
            <SuccessIndexDashboard 
              representatives={representatives} 
              kpiWeights={kpiWeights}
              selectedMonth={selectedMonth === 'yearly' ? 'Yıllık Ortalama' : (monthNames[selectedMonth] || selectedMonth)}
              isYearlyView={isYearlyView}
              onMonthChange={(monthKey) => setSelectedMonth(monthKey)}
              availableMonths={availableMonths}
              allMonthsData={monthDataMap}
            />
          </div>
        </div>

        {/* Sağ Sidebar */}
        <div className="sidebar" style={{ display: 'none' }}>
          <div className="sidebar-content">
            <div className="sidebar-section" style={{ display: 'none' }}>
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
                {calculatedData
                  .filter(rep => rep.rank === 1)
                  .map((rep) => (
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

      <KPISettingsModal
        isOpen={isKPISettingsOpen}
        onClose={() => setIsKPISettingsOpen(false)}
        onSave={handleKPISettingsSave}
        currentWeights={kpiWeights}
      />
    </div>
  );
};

export default Dashboard;
