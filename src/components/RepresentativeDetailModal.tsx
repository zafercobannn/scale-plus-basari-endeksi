import React from 'react';
import { CalculatedRepresentative, RepresentativeData, KPIWeights } from '../types';
import { calculateTeamStats } from '../utils/calculations';
import RepresentativeImage from './RepresentativeImage';
import './RepresentativeDetailModal.css';

interface RepresentativeDetailModalProps {
  representative: CalculatedRepresentative | null;
  representatives: RepresentativeData[];
  kpiWeights: KPIWeights;
  isOpen: boolean;
  onClose: () => void;
}

const RepresentativeDetailModal: React.FC<RepresentativeDetailModalProps> = ({
  representative,
  representatives,
  kpiWeights,
  isOpen,
  onClose
}) => {
  if (!isOpen || !representative) return null;

  const teamStats = calculateTeamStats(representatives);

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return '#28a745';
    if (score >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 0.8) return 'Mükemmel';
    if (score >= 0.6) return 'İyi';
    return 'Geliştirilmeli';
  };

  const getCallCountPerformance = (count: number): { label: string; color: string } => {
    // En yüksek çağrı adedini bul
    const maxCallCount = Math.max(...representatives
      .filter(r => r["Audit Skoru"] !== "N/A" && r["Çağrı Değerlendirme Ortalaması"] !== "N/A")
      .map(r => Number(r["Toplam Çağrı Adedi"]) || 0)
    );
    
    // Yüzde hesapla
    const percentage = maxCallCount > 0 ? (count / maxCallCount) * 100 : 0;
    
    if (percentage >= 90) return { label: 'Mükemmel', color: '#28a745' };
    if (percentage >= 70) return { label: 'İyi', color: '#ffc107' };
    if (percentage >= 50) return { label: 'Orta', color: '#fd7e14' };
    return { label: 'Geliştirilmeli', color: '#dc3545' };
  };

  const getCallDurationPerformance = (duration: number): { label: string; color: string } => {
    if (duration <= 350) return { label: 'Mükemmel', color: '#28a745' };
    if (duration <= 450) return { label: 'İyi', color: '#ffc107' };
    if (duration <= 550) return { label: 'Orta', color: '#fd7e14' };
    return { label: 'Geliştirilmeli', color: '#dc3545' };
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="representative-header">
            <RepresentativeImage name={representative.name} size="large" />
            <div className="representative-title">
              <h2>{representative.name}</h2>
              <p className="representative-rank">
                {representative.rank === 1 
                  ? `En yüksek Performans ⭐`
                  : `Başarı Endeksi Sıralaması: ${representative.rank}`
                }
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Başarı Endeksi Özeti */}
          <div className="success-summary">
            <div className="success-index-display">
              <span className="success-value">{(representative.successIndex * 100).toFixed(1)}</span>
              <span className="success-label">Başarı Endeksi</span>
            </div>
          </div>

          {/* Hesaplama Detayları */}
          <div className="calculation-details">
            
            <div className="metric-grid">
              {/* Çağrı Adedi */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Çağrı Adedi</h4>
                  <span className="weight">%{(kpiWeights.callCount * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.callCount} adet</span>
                  <span className="score" style={{ color: getCallCountPerformance(representative.callCount).color }}>
                    {getCallCountPerformance(representative.callCount).label}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.callCountScore * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.callCountScore * 100}%`,
                        backgroundColor: getScoreColor(representative.callCountScore * 5)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Konuşma Süresi */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Ortalama Konuşma Süresi</h4>
                  <span className="weight">%{(kpiWeights.callDuration * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.callDuration} saniye</span>
                  <span className="score" style={{ color: getCallDurationPerformance(representative.callDuration).color }}>
                    {getCallDurationPerformance(representative.callDuration).label}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.callDurationScore * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.callDurationScore * 100}%`,
                        backgroundColor: getScoreColor(representative.callDurationScore * 5)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Audit Skoru */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Audit Skoru</h4>
                  <span className="weight">%{(kpiWeights.auditScore * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.auditScore}/100</span>
                  <span className="score" style={{ color: getScoreColor(representative.auditScoreNormalized * 3.33) }}>
                    {getScoreLabel(representative.auditScoreNormalized * 3.33)}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.auditScoreNormalized * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.auditScoreNormalized * 100}%`,
                        backgroundColor: getScoreColor(representative.auditScoreNormalized * 3.33)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* CSAT */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Çağrı Değerlendirme (CSAT)</h4>
                  <span className="weight">%{(kpiWeights.csatScore * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.surveyResult}/5</span>
                  <span className="score" style={{ color: getScoreColor(representative.csatScoreNormalized * 3.33) }}>
                    {getScoreLabel(representative.csatScoreNormalized * 3.33)}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.csatScoreNormalized * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.csatScoreNormalized * 100}%`,
                        backgroundColor: getScoreColor(representative.csatScoreNormalized * 3.33)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

                         {/* Toplam Hesaplama */}
             <div className="total-calculation">
               <h4>Başarı Endeksi</h4>
               <div className="calculation-formula">
                 <div className="formula-line">
                   <span>Çağrı Adedi Puanı:</span>
                   <span>{representative.callCount} adet (Takım: {teamStats?.callCount.min}-{teamStats?.callCount.max}) → {((representative.callCountScore / kpiWeights.callCount) * 100).toFixed(1)}% × {(kpiWeights.callCount * 100).toFixed(0)}% = {(representative.callCountScore * 100).toFixed(1)}%</span>
                 </div>
                 <div className="formula-line">
                   <span>Konuşma Süresi Puanı:</span>
                   <span>{representative.callDuration} saniye (Takım: {teamStats?.callDuration.min}-{teamStats?.callDuration.max}) → {((representative.callDurationScore / kpiWeights.callDuration) * 100).toFixed(1)}% × {(kpiWeights.callDuration * 100).toFixed(0)}% = {(representative.callDurationScore * 100).toFixed(1)}%</span>
                 </div>
                 <div className="formula-line">
                   <span>Audit Skoru Puanı:</span>
                   <span>{representative.auditScore}/100 (Takım: {teamStats?.auditScore.min}-{teamStats?.auditScore.max}) → {((representative.auditScoreNormalized / kpiWeights.auditScore) * 100).toFixed(1)}% × {(kpiWeights.auditScore * 100).toFixed(0)}% = {(representative.auditScoreNormalized * 100).toFixed(1)}%</span>
                 </div>
                 <div className="formula-line">
                   <span>CSAT Puanı:</span>
                   <span>{representative.surveyResult}/5 (Takım: {teamStats?.csatScore.min}-{teamStats?.csatScore.max}) → {((representative.csatScoreNormalized / kpiWeights.csatScore) * 100).toFixed(1)}% × {(kpiWeights.csatScore * 100).toFixed(0)}% = {(representative.csatScoreNormalized * 100).toFixed(1)}%</span>
                 </div>
                 <div className="formula-total">
                   <span>Başarı Endeksi:</span>
                   <span>{(representative.successIndex * 100).toFixed(1)}%</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentativeDetailModal; 