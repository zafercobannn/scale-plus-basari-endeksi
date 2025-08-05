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

  const getLiveCompanyPerformance = (count: number): { label: string; color: string } => {
    // Hedef kontrolü (her temsilcinin kendi hedefi)
    if (count > representative.liveCompanyTarget) {
      return { label: 'Hedef Aşıldı', color: '#28a745' };
    }
    if (count === representative.liveCompanyTarget) {
      return { label: 'Hedefe Ulaştı', color: '#28a745' };
    }
    
    // En yüksek canlıya alınan firma adedini bul
    const maxLiveCompanyCount = Math.max(...representatives
      .filter(r => r["Audit Skoru"] !== "N/A" && r["Canlıya Alınan Firma Adedi"] !== undefined)
      .map(r => Number(r["Canlıya Alınan Firma Adedi"]) || 0)
    );
    
    // Yüzde hesapla
    const percentage = maxLiveCompanyCount > 0 ? (count / maxLiveCompanyCount) * 100 : 0;
    
    if (percentage >= 70) return { label: 'İyi', color: '#ffc107' };
    if (percentage >= 50) return { label: 'Orta', color: '#fd7e14' };
    return { label: 'Geliştirilmeli', color: '#dc3545' };
  };

  const getOnboardingPerformance = (score: number): { label: string; color: string } => {
    // 0-100 aralığında değerlendir (5 tam puan = 100)
    const originalScore = score / 20; // 100'ü 5'e çevir
    
    if (originalScore === 5) return { label: 'Mükemmel', color: '#28a745' };
    return { label: 'İyi', color: '#ffc107' };
  };

  const getMeetingPerformance = (score: number): { label: string; color: string } => {
    // 0-100 aralığında değerlendir (5 tam puan = 100)
    const originalScore = score / 20; // 100'ü 5'e çevir
    
    if (originalScore === 5) return { label: 'Mükemmel', color: '#28a745' };
    return { label: 'İyi', color: '#ffc107' };
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
              {/* Canlıya Alınan Firma Adedi */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Canlıya Alınan Firma Adedi</h4>
                  <span className="weight">%{(kpiWeights.liveCompanyCount * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.liveCompanyCount} adet</span>
                  <span className="score" style={{ color: getLiveCompanyPerformance(representative.liveCompanyCount).color }}>
                    {getLiveCompanyPerformance(representative.liveCompanyCount).label}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.liveCompanyScore * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.liveCompanyScore * 100}%`,
                        backgroundColor: getScoreColor(representative.liveCompanyScore * 5)
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

              {/* Onboarding Anket Skoru */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>NPS Call Score</h4>
                  <span className="weight">%{(kpiWeights.onboardingScore * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.originalOnboardingScore.toFixed(2)}/5</span>
                  <span className="score" style={{ color: getOnboardingPerformance(representative.onboardingScore).color }}>
                    {getOnboardingPerformance(representative.onboardingScore).label}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.onboardingScoreNormalized * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.onboardingScoreNormalized * 100}%`,
                        backgroundColor: getScoreColor(representative.onboardingScoreNormalized * 5)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Toplantı Değerlendirmesi */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Toplantı Değerlendirmesi</h4>
                  <span className="weight">%{(kpiWeights.meetingEvaluation * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.originalMeetingEvaluation.toFixed(2)}/5</span>
                  <span className="score" style={{ color: getMeetingPerformance(representative.meetingEvaluation).color }}>
                    {getMeetingPerformance(representative.meetingEvaluation).label}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.meetingEvaluationNormalized * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.meetingEvaluationNormalized * 100}%`,
                        backgroundColor: getScoreColor(representative.meetingEvaluationNormalized * 5)
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
                  <span>Canlıya Alınan Firma Adedi Puanı:</span>
                  <span>{representative.liveCompanyCount} adet → {((representative.liveCompanyScore / kpiWeights.liveCompanyCount) * 100).toFixed(1)}% × {(kpiWeights.liveCompanyCount * 100).toFixed(0)}% = {(representative.liveCompanyScore * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-line">
                  <span>Audit Skoru Puanı:</span>
                  <span>{representative.auditScore}/100 → {((representative.auditScoreNormalized / kpiWeights.auditScore) * 100).toFixed(1)}% × {(kpiWeights.auditScore * 100).toFixed(0)}% = {(representative.auditScoreNormalized * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-line">
                  <span>NPS Call Score Puanı:</span>
                  <span>{representative.originalOnboardingScore.toFixed(2)}/5 → {((representative.onboardingScoreNormalized / kpiWeights.onboardingScore) * 100).toFixed(1)}% × {(kpiWeights.onboardingScore * 100).toFixed(0)}% = {(representative.onboardingScoreNormalized * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-line">
                  <span>Toplantı Değerlendirmesi Puanı:</span>
                  <span>{representative.originalMeetingEvaluation.toFixed(2)}/5 → {((representative.meetingEvaluationNormalized / kpiWeights.meetingEvaluation) * 100).toFixed(1)}% × {(kpiWeights.meetingEvaluation * 100).toFixed(0)}% = {(representative.meetingEvaluationNormalized * 100).toFixed(1)}%</span>
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