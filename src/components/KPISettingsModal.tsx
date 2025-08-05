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
    const total = weights.callCount + weights.callDuration + weights.auditScore + weights.csatScore + 
                  weights.liveCompanyCount + weights.onboardingScore + weights.meetingEvaluation;
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
      callCount: 0.0,         // Artık kullanılmıyor
      callDuration: 0.0,      // Artık kullanılmıyor
      auditScore: 0.3,        // %30
      csatScore: 0.0,         // Artık kullanılmıyor
      // Scale Plus için yeni ağırlıklar
      liveCompanyCount: 0.3,      // %30 - Canlıya alınan firma adedi
      onboardingScore: 0.2,       // %20 - Onboarding anket skoru
      meetingEvaluation: 0.2      // %20 - Toplantı değerlendirmesi
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
          <h2>Scale Plus KPI Ağırlık Ayarları</h2>
          <button className="kpi-close-button" onClick={onClose}>×</button>
        </div>

        <div className="kpi-modal-body">
          <div className="kpi-description">
            <p>Scale Plus başarı endeksi hesaplamasında kullanılan KPI ağırlıklarını ayarlayın.</p>
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
            {/* Canlıya Alınan Firma Adedi */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Canlıya Alınan Firma Adedi</h3>
                <span className="kpi-weight-percentage">{(weights.liveCompanyCount * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.liveCompanyCount}
                  onChange={(e) => handleWeightChange('liveCompanyCount', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.liveCompanyCount) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.liveCompanyCount}
                  onChange={(e) => handleWeightChange('liveCompanyCount', parseFloat(e.target.value))}
                  className="kpi-weight-input"
                />
              </div>
              <p className="kpi-description-text">Daha çok canlıya alınan firma = Daha iyi puan</p>
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

            {/* Onboarding Anket Skoru */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Onboarding Anket Skoru (NPS CALL)</h3>
                <span className="kpi-weight-percentage">{(weights.onboardingScore * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.onboardingScore}
                  onChange={(e) => handleWeightChange('onboardingScore', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.onboardingScore) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.onboardingScore}
                  onChange={(e) => handleWeightChange('onboardingScore', parseFloat(e.target.value))}
                  className="kpi-weight-input"
                />
              </div>
              <p className="kpi-description-text">Daha yüksek skor = Daha iyi puan</p>
            </div>

            {/* Toplantı Değerlendirmesi */}
            <div className="kpi-weight-item">
              <div className="kpi-weight-header">
                <h3>Toplantı Değerlendirmesi</h3>
                <span className="kpi-weight-percentage">{(weights.meetingEvaluation * 100).toFixed(1)}%</span>
              </div>
              <div className="kpi-weight-controls">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.meetingEvaluation}
                  onChange={(e) => handleWeightChange('meetingEvaluation', parseFloat(e.target.value))}
                  style={{ accentColor: getWeightColor(weights.meetingEvaluation) }}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.meetingEvaluation}
                  onChange={(e) => handleWeightChange('meetingEvaluation', parseFloat(e.target.value))}
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