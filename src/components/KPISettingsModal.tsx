import React, { useState, useEffect } from 'react';
import { KPIWeights } from '../types';
import './KPISettingsModal.css';

interface KPISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weights: KPIWeights) => void;
  currentWeights: KPIWeights;
}

const KPISettingsModal: React.FC<KPISettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentWeights
}) => {
  const [weights, setWeights] = useState<KPIWeights>(currentWeights);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    setWeights(currentWeights);
  }, [currentWeights]);

  useEffect(() => {
    const total = weights.callCount + weights.callDuration + weights.auditScore + weights.csatScore;
    setTotalWeight(total);
  }, [weights]);

  const handleWeightChange = (key: keyof KPIWeights, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(1, value))
    }));
  };

  const handleSave = () => {
    if (Math.abs(totalWeight - 1) < 0.01) {
      onSave(weights);
      onClose();
    }
  };

  const handleReset = () => {
    setWeights({
      callCount: 0.2,
      callDuration: 0.2,
      auditScore: 0.3,
      csatScore: 0.3
    });
  };

  const getWeightColor = (weight: number) => {
    if (weight > 0.4) return '#dc3545'; // Kırmızı - çok yüksek
    if (weight > 0.3) return '#fd7e14'; // Turuncu - yüksek
    if (weight > 0.2) return '#ffc107'; // Sarı - orta
    return '#28a745'; // Yeşil - düşük
  };

  if (!isOpen) return null;

  return (
    <div className="kpi-modal-overlay" onClick={onClose}>
      <div className="kpi-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="kpi-modal-header">
          <h2>KPI Ağırlık Ayarları</h2>
          <button className="kpi-close-button" onClick={onClose}>×</button>
        </div>

        <div className="kpi-modal-body">
          <div className="kpi-description">
            <p>Başarı endeksi hesaplamasında kullanılan KPI ağırlıklarını ayarlayın.</p>
            <p className="kpi-total">
              Toplam Ağırlık: <span style={{ color: totalWeight === 1 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                {(totalWeight * 100).toFixed(1)}%
              </span>
              {totalWeight !== 1 && (
                <span className="kpi-warning"> (Toplam %100 olmalıdır)</span>
              )}
            </p>
          </div>

          <div className="kpi-weights-container">
            {/* Çağrı Adedi */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Çağrı Adedi</h3>
                <span className="kpi-weight-percentage">{(weights.callCount * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.callCount}
                  onChange={(e) => handleWeightChange('callCount', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.callCount) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.callCount}
                  onChange={(e) => handleWeightChange('callCount', parseFloat(e.target.value))}
                  className="kpi-weight-input"
                />
              </div>
              <p className="kpi-description-text">Daha çok çağrı = Daha iyi puan</p>
            </div>

            {/* Konuşma Süresi */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Ortalama Konuşma Süresi</h3>
                <span className="kpi-weight-percentage">{(weights.callDuration * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.callDuration}
                  onChange={(e) => handleWeightChange('callDuration', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.callDuration) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.callDuration}
                  onChange={(e) => handleWeightChange('callDuration', parseFloat(e.target.value))}
                  className="kpi-weight-input"
                />
              </div>
              <p className="kpi-description-text">Daha kısa süre = Daha iyi puan</p>
            </div>

            {/* Audit Skoru */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Audit Skoru</h3>
                <span className="kpi-weight-percentage">{(weights.auditScore * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.auditScore}
                  onChange={(e) => handleWeightChange('auditScore', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.auditScore) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.auditScore}
                  onChange={(e) => handleWeightChange('auditScore', parseFloat(e.target.value))}
                  className="kpi-weight-input"
                />
              </div>
              <p className="kpi-description-text">Daha yüksek skor = Daha iyi puan</p>
            </div>

            {/* CSAT */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Çağrı Değerlendirme (CSAT)</h3>
                <span className="kpi-weight-percentage">{(weights.csatScore * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.csatScore}
                  onChange={(e) => handleWeightChange('csatScore', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.csatScore) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.csatScore}
                  onChange={(e) => handleWeightChange('csatScore', parseFloat(e.target.value))}
                  className="kpi-weight-input"
                />
              </div>
              <p className="kpi-description-text">Daha yüksek skor = Daha iyi puan</p>
            </div>
          </div>
        </div>

        <div className="kpi-modal-footer">
          <button className="kpi-reset-button" onClick={handleReset}>
            Varsayılana Döndür
          </button>
          <div className="kpi-action-buttons">
            <button className="kpi-cancel-button" onClick={onClose}>
              İptal
            </button>
            <button 
              className="kpi-save-button" 
              onClick={handleSave}
              disabled={Math.abs(totalWeight - 1) >= 0.01}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPISettingsModal; 