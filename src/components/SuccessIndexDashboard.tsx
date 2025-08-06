import React, { useState, useMemo } from 'react';
import { RepresentativeData, CalculatedRepresentative, KPIWeights } from '../types';
import { calculateSuccessIndex, calculateTeamStats, debugCalculation } from '../utils/calculations';
import RepresentativeDetailModal from './RepresentativeDetailModal';
import RepresentativeImage from './RepresentativeImage';
import InfoModal from './InfoModal';
import './SuccessIndexDashboard.css';

interface SuccessIndexDashboardProps {
  representatives: RepresentativeData[];
  kpiWeights: KPIWeights;
}

const SuccessIndexDashboard: React.FC<SuccessIndexDashboardProps> = ({ representatives, kpiWeights }) => {
  const [selectedRepresentative, setSelectedRepresentative] = useState<CalculatedRepresentative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [currentMonth] = useState('Temmuz');
  const [currentYear] = useState(2025);

  const calculatedData = useMemo(() => {
    const result = calculateSuccessIndex(representatives, kpiWeights);
    // Debug için hesaplama detaylarını yazdır
    debugCalculation(representatives);
    return result;
  }, [representatives, kpiWeights]);

  const teamStats = useMemo(() => {
    return calculateTeamStats(representatives);
  }, [representatives]);



  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return '#FFD700'; // Altın sarısı
      case 2: return '#E5E4E2'; // Gümüş
      case 3: return '#CD7F32'; // Bronz
      default: return '#4F46E5'; // Modern indigo
    }
  };

  const getRankDisplay = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getProgressBarColor = (value: number): string => {
    const score = value * 100; // 0-1 aralığını 0-100'e çevir
    if (score >= 90) return '#10B981'; // Modern yeşil (90 ve üzeri)
    if (score >= 80) return '#F59E0B'; // Modern turuncu (80-89.9)
    if (score >= 60) return '#FCD34D'; // Sarı (60-79.9)
    return '#EF4444'; // Modern kırmızı (60'ın altı)
  };

  const getSuccessIndexColor = (score: number): string => {
    if (score >= 85) return '#111827'; // En iyi - çok koyu gri
    if (score >= 70) return '#111827'; // Orta - çok koyu gri
    return '#111827'; // Düşük - çok koyu gri
  };

  const getAuditScoreColor = (score: number): string => {
    if (score >= 90) return '#059669'; // Koyu yeşil
    if (score >= 80) return '#D97706'; // Turuncu
    return '#DC2626'; // Koyu kırmızı
  };

  const getSuccessIndexCellBackground = (successIndex: number): string => {
    return 'transparent'; // Her zaman şeffaf arka plan
  };



  const handleRowClick = (representative: CalculatedRepresentative) => {
    setSelectedRepresentative(representative);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRepresentative(null);
  };



  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <img 
            src={process.env.PUBLIC_URL + "/ikas-logo.png"} 
            alt="İKAS Logo" 
            className="ikas-logo"
          />
          <h1>{currentYear} {currentMonth} Scale Plus Başarı Endeksi</h1>
        </div>

      </div>

      {/* Team Statistics */}
      {teamStats && (
        <div className="team-stats-container">
          <div className="team-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.5 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{Math.round(teamStats.liveCompanyCount.avg).toLocaleString()}</div>
                <div className="stat-label">Ortalama Canlıya Alınan Firma Adedi</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C12 4 12 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{teamStats.auditScore.avg.toFixed(1)}</div>
                <div className="stat-label">Audit Ortalaması</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">130</div>
                <div className="stat-label">Canlıya Alınan Hesap Sayısı Hedefi</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.5 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">137</div>
                <div className="stat-label">Canlıya Alınan Hesap Sayısı</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{teamStats.successIndex.avg.toFixed(1)}</div>
                <div className="stat-label">Başarı Endeksi Ortalaması</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>SIRA</th>
              <th>TEMSİLCİ ADI</th>
              <th>BAŞARI ENDEKSİ</th>
              <th>CANLIYA ALINAN FİRMA ADEDİ</th>
              <th>HEDEF</th>
              <th>AUDIT PUANI</th>
                              <th>NPS Call Score</th>
              <th>TOPLANTI DEĞERLENDİRMESİ</th>
            </tr>
          </thead>
          <tbody>
            {calculatedData.map((item) => (
              <tr 
                key={item.name} 
                onClick={() => handleRowClick(item)} 
                className="clickable-row"
              >
                <td>
                  <div 
                    className="rank-badge"
                    style={{ backgroundColor: getRankColor(item.rank) }}
                  >
                    {getRankDisplay(item.rank)}
                  </div>
                </td>
                <td className="representative-name">
                  <div className="representative-info">
                    <RepresentativeImage name={item.name} size="small" />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td style={{ backgroundColor: getSuccessIndexCellBackground(item.successIndex) }}>
                  <div className="success-index-cell">
                    <span 
                      className="success-value"
                      style={{ 
                        color: getSuccessIndexColor(isNaN(item.successIndex) ? 0 : item.successIndex * 100)
                      }}
                    >
                      {isNaN(item.successIndex) ? '0.0' : (item.successIndex * 100).toFixed(1)}
                    </span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${isNaN(item.successIndex) ? 0 : item.successIndex * 100}%`,
                          backgroundColor: getProgressBarColor(isNaN(item.successIndex) ? 0 : item.successIndex)
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>{item.liveCompanyCount} adet</td>
                                  <td>
                    <div className="target-cell">
                      <div className="target-value">{item.liveCompanyCount}/{item.liveCompanyTarget}</div>
                      <div className="target-progress">
                        <div 
                          className="target-progress-fill"
                          style={{ 
                            width: `${Math.min((item.liveCompanyCount / item.liveCompanyTarget) * 100, 100)}%`,
                            backgroundColor: item.liveCompanyCount > item.liveCompanyTarget ? '#10B981' : item.liveCompanyCount === item.liveCompanyTarget ? '#10B981' : '#F59E0B'
                          }}
                        />
                      </div>
                      <div className="target-status">
                        {item.liveCompanyCount > item.liveCompanyTarget ? 'Hedef Aşıldı' : item.liveCompanyCount === item.liveCompanyTarget ? 'Hedefe Ulaştı' : 'Hedef Altında'}
                      </div>
                    </div>
                  </td>
                <td>
                  <div 
                    className="audit-score"
                    style={{ backgroundColor: getAuditScoreColor(item.auditScore) }}
                  >
                    {item.auditScore.toFixed(1)}/100
                  </div>
                </td>
                                  <td>
                    <div className="score-cell">
                      <div className="score-value">{item.originalOnboardingScore.toFixed(2)}/5</div>
                      <div className="score-progress">
                        <div 
                          className="score-progress-fill"
                          style={{ 
                            width: `${(item.originalOnboardingScore / 5) * 100}%`,
                            backgroundColor: item.originalOnboardingScore === 5 ? '#10B981' : '#F59E0B'
                          }}
                        />
                      </div>
                      <div className="score-label">
                        {item.originalOnboardingScore === 5 ? 'Mükemmel' : 'İyi'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="score-cell">
                      <div className="score-value">{item.originalMeetingEvaluation.toFixed(2)}/5</div>
                      <div className="score-progress">
                        <div 
                          className="score-progress-fill"
                          style={{ 
                            width: `${(item.originalMeetingEvaluation / 5) * 100}%`,
                            backgroundColor: item.originalMeetingEvaluation === 5 ? '#10B981' : '#F59E0B'
                          }}
                        />
                      </div>
                      <div className="score-label">
                        {item.originalMeetingEvaluation === 5 ? 'Mükemmel' : 'İyi'}
                      </div>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Detail Modal */}
                  <RepresentativeDetailModal
              representative={selectedRepresentative}
              representatives={representatives}
              kpiWeights={kpiWeights}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
            <InfoModal
              isOpen={isInfoModalOpen}
              onClose={handleCloseInfoModal}
            />
    </div>
  );
};

export default SuccessIndexDashboard; 