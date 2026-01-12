import React, { useState, useEffect } from 'react';
import { KPIWeights } from '../types';
import { defaultKPIWeights } from '../utils/calculations';
import { getKPIWeights, saveKPIWeights } from '../services/dataService';
import './KPISettings.css';

interface KPISettingsProps {
  onSave: (weights: KPIWeights) => void;
}

const KPISettings: React.FC<KPISettingsProps> = ({ onSave }) => {
  const [weights, setWeights] = useState<KPIWeights>(defaultKPIWeights);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Firebase'den mevcut ayarları yükle
  useEffect(() => {
    const loadWeights = async () => {
      try {
        const storedWeights = await getKPIWeights();
        setWeights(storedWeights);
      } catch (e) {
        console.error('KPI weights load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadWeights();
  }, []);

  const totalWeight = 
    weights.liveCompanyCount + 
    weights.auditScore + 
    weights.onboardingScore + 
    weights.meetingEvaluation;

  const handleChange = (key: keyof KPIWeights, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: value / 100 // Yüzdeyi orana çevir
    }));
    setSaved(false);
    setError('');
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Toplam %100 kontrolü (küçük tolerans ile)
    if (Math.abs(totalWeight - 1) > 0.01) {
      setError(`Toplam ağırlık %100 olmalı. Şu an: %${(totalWeight * 100).toFixed(0)}`);
      return;
    }

    try {
      setSaving(true);
      setError('');
      await saveKPIWeights(weights);
      onSave(weights);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('KPI save error:', e);
      setError('Kaydetme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setWeights(defaultKPIWeights);
    setSaved(false);
    setError('');
  };

  const kpiItems = [
    { key: 'liveCompanyCount' as keyof KPIWeights, label: 'Canlıya Alınan Hesap Sayısı', icon: '🏢', color: '#22c55e' },
    { key: 'auditScore' as keyof KPIWeights, label: 'Audit Puanı', icon: '📋', color: '#3b82f6' },
    { key: 'onboardingScore' as keyof KPIWeights, label: 'NPS Anket Skoru', icon: '⭐', color: '#f59e0b' },
    { key: 'meetingEvaluation' as keyof KPIWeights, label: 'Toplantı Değerlendirmesi', icon: '🤝', color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className="kpi-settings">
        <div className="kpi-settings-header">
          <h2>KPI Ağırlık Ayarları</h2>
          <p>Yükleniyor...</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-settings">
      <div className="kpi-settings-header">
        <h2>KPI Ağırlık Ayarları</h2>
        <p>Başarı endeksi hesaplamasında kullanılan metriklerin ağırlıklarını ayarlayın</p>
      </div>

      {saved && (
        <div className="kpi-success">
          ✓ Ayarlar başarıyla kaydedildi!
        </div>
      )}

      {error && (
        <div className="kpi-error">
          {error}
        </div>
      )}

      <div className="kpi-total-bar">
        <div className="total-label">
          <span>Toplam Ağırlık</span>
          <span className={`total-value ${Math.abs(totalWeight - 1) > 0.01 ? 'invalid' : 'valid'}`}>
            %{(totalWeight * 100).toFixed(0)}
          </span>
        </div>
        <div className="total-progress">
          <div 
            className={`total-progress-fill ${Math.abs(totalWeight - 1) > 0.01 ? 'invalid' : 'valid'}`}
            style={{ width: `${Math.min(totalWeight * 100, 100)}%` }}
          />
        </div>
        {Math.abs(totalWeight - 1) > 0.01 && (
          <p className="total-hint">
            {totalWeight < 1 
              ? `%${((1 - totalWeight) * 100).toFixed(0)} daha ekleyin` 
              : `%${((totalWeight - 1) * 100).toFixed(0)} azaltın`}
          </p>
        )}
      </div>

      <div className="kpi-items">
        {kpiItems.map((item) => (
          <div key={item.key} className="kpi-item">
            <div className="kpi-item-header">
              <span className="kpi-icon">{item.icon}</span>
              <span className="kpi-label">{item.label}</span>
            </div>
            <div className="kpi-slider-container">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights[item.key] * 100}
                onChange={(e) => handleChange(item.key, parseInt(e.target.value))}
                className="kpi-slider"
                style={{ '--slider-color': item.color } as React.CSSProperties}
              />
              <div className="kpi-value-display">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(weights[item.key] * 100)}
                  onChange={(e) => handleChange(item.key, parseInt(e.target.value) || 0)}
                  className="kpi-number-input"
                />
                <span>%</span>
              </div>
            </div>
            <div 
              className="kpi-bar"
              style={{ 
                width: `${weights[item.key] * 100}%`,
                backgroundColor: item.color 
              }}
            />
          </div>
        ))}
      </div>

      <div className="kpi-visualization">
        <h3>Ağırlık Dağılımı</h3>
        <div className="kpi-pie-container">
          <div className="kpi-pie">
            {kpiItems.map((item, index) => {
              const startAngle = kpiItems
                .slice(0, index)
                .reduce((sum, i) => sum + weights[i.key] * 360, 0);
              const angle = weights[item.key] * 360;
              
              return (
                <div
                  key={item.key}
                  className="kpi-pie-segment"
                  style={{
                    background: `conic-gradient(${item.color} 0deg, ${item.color} ${angle}deg, transparent ${angle}deg)`,
                    transform: `rotate(${startAngle}deg)`,
                  }}
                />
              );
            })}
          </div>
          <div className="kpi-legend">
            {kpiItems.map((item) => (
              <div key={item.key} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: item.color }} />
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">%{Math.round(weights[item.key] * 100)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-actions">
        <button className="btn-reset" onClick={handleReset} disabled={saving}>
          Varsayılana Dön
        </button>
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={Math.abs(totalWeight - 1) > 0.01 || saving}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
};

export default KPISettings;
