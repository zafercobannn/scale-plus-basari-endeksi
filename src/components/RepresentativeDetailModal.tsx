import React from 'react';
import { CalculatedRepresentative, RepresentativeData, KPIWeights } from '../types';
import RepresentativeImage from './RepresentativeImage';
import './RepresentativeDetailModal.css';

interface RepresentativeDetailModalProps {
  representative: CalculatedRepresentative | null;
  representatives: RepresentativeData[];
  kpiWeights: KPIWeights;
  isOpen: boolean;
  onClose: () => void;
  isYearlyView?: boolean;
}

const RepresentativeDetailModal: React.FC<RepresentativeDetailModalProps> = ({
  representative,
  representatives,
  kpiWeights,
  isOpen,
  onClose,
  isYearlyView = false
}) => {
  if (!isOpen || !representative) return null;

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

    // Kişisel hedefe yakınlık (%90 ve üzeri)
    const personalTargetRatio = representative.liveCompanyTarget > 0 
      ? (count / representative.liveCompanyTarget) * 100 
      : 0;
    if (personalTargetRatio >= 90) {
      return { label: 'Hedefe Yakın', color: '#F59E0B' };
    }

    // En yüksek canlıya alınan firma adedini bul (referans amaçlı)
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="representative-header">
            <RepresentativeImage name={representative.name} size="large" />
            <div className="representative-title">
              <h2>{representative.name}</h2>
              <p className="representative-rank">
                {isYearlyView ? (
                  `Yıllık Ortalama - Başarı Endeksi Sıralaması: ${representative.rank}`
                ) : (
                  representative.rank === 1 
                    ? `En yüksek Performans ⭐`
                    : `Başarı Endeksi Sıralaması: ${representative.rank}`
                )}
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Başarı Endeksi Özeti */}
          <div className="success-summary">
            <div className="success-index-display">
              <span className="success-value">{isYearlyView ? Math.round(representative.successIndex * 100) : (representative.successIndex * 100).toFixed(1)}</span>
              <span className="success-label">Başarı Endeksi</span>
            </div>
          </div>

          {/* Hesaplama Detayları */}
          <div className="calculation-details">
            
            <div className="metric-grid">
              {/* Canlıya Alınan Firma Adedi */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Canlıya Alınan Firma Adedi {isYearlyView && <span className="yearly-badge-small">(Yıllık Ortalama)</span>}</h4>
                  <span className="weight">%{(kpiWeights.liveCompanyCount * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{isYearlyView ? representative.liveCompanyCount.toFixed(2) : representative.liveCompanyCount.toFixed(1)} adet</span>
                  <span className="score" style={{ color: getLiveCompanyPerformance(representative.liveCompanyCount).color }}>
                    {getLiveCompanyPerformance(representative.liveCompanyCount).label}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {((representative.liveCompanyScore / kpiWeights.liveCompanyCount) * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min((representative.liveCompanyScore / kpiWeights.liveCompanyCount) * 100, 100)}%`,
                        backgroundColor: getScoreColor(representative.liveCompanyScore / kpiWeights.liveCompanyCount)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Audit Skoru */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Audit Skoru {isYearlyView && <span className="yearly-badge-small">(Yıllık Ortalama)</span>}</h4>
                  <span className="weight">%{(kpiWeights.auditScore * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{isYearlyView ? representative.auditScore.toFixed(2) : representative.auditScore.toFixed(1)}/100</span>
                  <span className="score" style={{ color: getScoreColor(representative.auditScore / 100) }}>
                    {getScoreLabel(representative.auditScore / 100)}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {representative.auditScore.toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${representative.auditScore}%`,
                        backgroundColor: getScoreColor(representative.auditScore / 100)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Onboarding Anket Skoru */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>NPS Score {isYearlyView && <span className="yearly-badge-small">(Yıllık Ortalama)</span>}</h4>
                  <span className="weight">%{(kpiWeights.onboardingScore * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.originalOnboardingScore.toFixed(2)}/5</span>
                  <span className="score" style={{ color: getScoreColor(representative.originalOnboardingScore / 5) }}>
                    {representative.originalOnboardingScore >= 4.5 ? 'Mükemmel' : representative.originalOnboardingScore >= 4 ? 'İyi' : 'Geliştirilmeli'}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.originalOnboardingScore / 5 * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(representative.originalOnboardingScore / 5) * 100}%`,
                        backgroundColor: getScoreColor(representative.originalOnboardingScore / 5)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Toplantı Değerlendirmesi */}
              <div className="metric-card">
                <div className="metric-header">
                  <h4>Toplantı Değerlendirmesi {isYearlyView && <span className="yearly-badge-small">(Yıllık Ortalama)</span>}</h4>
                  <span className="weight">%{(kpiWeights.meetingEvaluation * 100).toFixed(0)} Ağırlık</span>
                </div>
                <div className="metric-value">
                  <span className="value">{representative.originalMeetingEvaluation.toFixed(2)}/5</span>
                  <span className="score" style={{ color: getScoreColor(representative.originalMeetingEvaluation / 5) }}>
                    {representative.originalMeetingEvaluation >= 4.5 ? 'Mükemmel' : representative.originalMeetingEvaluation >= 4 ? 'İyi' : 'Geliştirilmeli'}
                  </span>
                </div>
                <div className="metric-score">
                  <span>Puan: {(representative.originalMeetingEvaluation / 5 * 100).toFixed(1)}%</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(representative.originalMeetingEvaluation / 5) * 100}%`,
                        backgroundColor: getScoreColor(representative.originalMeetingEvaluation / 5)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Toplam Hesaplama */}
            <div className="total-calculation">
              <h4>Başarı Endeksi {isYearlyView && <span className="yearly-badge-small">(Yıllık Ortalama)</span>}</h4>
              {isYearlyView && (
                <p className="yearly-explanation">
                  Yıllık ortalama: Her ayın başarı endeksi hesaplanıp, aylık başarı endekslerinin ortalaması alınmıştır.
                </p>
              )}
              <div className="calculation-formula">
                <div className="formula-line">
                  <span>Canlıya Alınan Firma Adedi Puanı:</span>
                  <span>{isYearlyView ? representative.liveCompanyCount.toFixed(2) : representative.liveCompanyCount.toFixed(1)} adet {isYearlyView ? '(ortalama)' : ''} → {((representative.liveCompanyScore / kpiWeights.liveCompanyCount) * 100).toFixed(1)}% × {(kpiWeights.liveCompanyCount * 100).toFixed(0)}% = {(representative.liveCompanyScore * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-line">
                  <span>Audit Skoru Puanı:</span>
                  <span>{isYearlyView ? representative.auditScore.toFixed(2) : representative.auditScore.toFixed(1)}/100 {isYearlyView ? '(ortalama)' : ''} → {((representative.auditScoreNormalized / kpiWeights.auditScore) * 100).toFixed(1)}% × {(kpiWeights.auditScore * 100).toFixed(0)}% = {(representative.auditScoreNormalized * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-line">
                  <span>NPS Score Puanı:</span>
                  <span>{representative.originalOnboardingScore.toFixed(2)}/5 {isYearlyView ? '(ortalama)' : ''} → {((representative.onboardingScoreNormalized / kpiWeights.onboardingScore) * 100).toFixed(1)}% × {(kpiWeights.onboardingScore * 100).toFixed(0)}% = {(representative.onboardingScoreNormalized * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-line">
                  <span>Toplantı Değerlendirmesi Puanı:</span>
                  <span>{representative.originalMeetingEvaluation.toFixed(2)}/5 {isYearlyView ? '(ortalama)' : ''} → {((representative.meetingEvaluationNormalized / kpiWeights.meetingEvaluation) * 100).toFixed(1)}% × {(kpiWeights.meetingEvaluation * 100).toFixed(0)}% = {(representative.meetingEvaluationNormalized * 100).toFixed(1)}%</span>
                </div>
                <div className="formula-total">
                  <span>Başarı Endeksi {isYearlyView && '(Aylık Ortalamaların Ortalaması)'}:</span>
                  <span>{isYearlyView ? Math.round(representative.successIndex * 100) : (representative.successIndex * 100).toFixed(2)}%</span>
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