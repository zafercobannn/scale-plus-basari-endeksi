import React, { useState, useMemo } from 'react';
import { RepresentativeData, CalculatedRepresentative } from '../types';
import { calculateSuccessIndex, debugCalculation } from '../utils/calculations';
import RepresentativeDetailModal from './RepresentativeDetailModal';
import RepresentativeImage from './RepresentativeImage';
import './SuccessIndexDashboard.css';

interface SuccessIndexDashboardProps {
  representatives: RepresentativeData[];
}

const SuccessIndexDashboard: React.FC<SuccessIndexDashboardProps> = ({ representatives }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepresentative, setSelectedRepresentative] = useState<CalculatedRepresentative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth] = useState(() => {
    const now = new Date();
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    // Temmuz ayını sabit olarak ayarla
    return 'Temmuz';
  });
  const [currentYear] = useState(() => new Date().getFullYear());

  const calculatedData = useMemo(() => {
    const result = calculateSuccessIndex(representatives);
    // Debug için hesaplama detaylarını yazdır
    debugCalculation(representatives);
    return result;
  }, [representatives]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return calculatedData;
    return calculatedData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [calculatedData, searchTerm]);

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return '#ff6b35'; // Turuncu
      case 2: return '#6c757d'; // Gri
      case 3: return '#dc3545'; // Kırmızı
      default: return '#007bff'; // Mavi
    }
  };

  const getProgressBarColor = (value: number): string => {
    if (value >= 0.8) return '#28a745'; // Yeşil
    if (value >= 0.6) return '#ffc107'; // Sarı
    return '#dc3545'; // Kırmızı
  };

  const getAuditScoreColor = (score: number): string => {
    if (score >= 90) return '#28a745'; // Yeşil
    if (score >= 80) return '#ffc107'; // Sarı
    return '#dc3545'; // Kırmızı
  };

  const handleRowClick = (representative: CalculatedRepresentative) => {
    setSelectedRepresentative(representative);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRepresentative(null);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>{currentYear} {currentMonth} Scale Plus Başarı Endeksi</h1>
          <div className="header-info">
            <span>{currentMonth} {currentYear}</span>
            <span>{representatives.length} Temsilci</span>
          </div>
        </div>
        <div className="header-right">
          <button className="info-button">
            <i>i</i>
            Bilgi
          </button>
          <div className="search-container">
            <input
              type="text"
              placeholder="Temsilci Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="search-icon">🔍</i>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>SIRA</th>
              <th>TEMSİLCİ ADI</th>
              <th>BAŞARI ENDEKSİ</th>
              <th>ÇAĞRI ADEDİ</th>
              <th>ORTALAMA KONUŞMA SÜRESİ</th>
              <th>AUDIT PUANI</th>
              <th>ÇAĞRI DEĞERLENDİRME</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.name} onClick={() => handleRowClick(item)} className="clickable-row">
                <td>
                  <div 
                    className="rank-badge"
                    style={{ backgroundColor: getRankColor(item.rank) }}
                  >
                    {item.rank}
                  </div>
                </td>
                <td className="representative-name">
                  <div className="representative-info">
                    <RepresentativeImage name={item.name} size="small" />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>
                  <div className="success-index-cell">
                    <span className="success-value">
                      {isNaN(item.successIndex) ? '0.000' : item.successIndex.toFixed(3)}
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
                <td>{item.callCount} adet</td>
                <td>{item.callDuration} saniye</td>
                <td>
                  <div 
                    className="audit-score"
                    style={{ backgroundColor: getAuditScoreColor(item.auditScore) }}
                  >
                    {item.auditScore.toFixed(1)}/100
                  </div>
                </td>
                <td>{item.surveyResult.toFixed(1)}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="footer-notes">
        <p>Başarı endeksi 0-1 arasında normalize edilmiştir. Daha yüksek değer daha iyi performansı gösterir.</p>
        <p>Başarı endeksi, canlıya alınan hesap sayısı, audit puanı, anket sonucu ve kalite değerlendirme metriklerinin takım ortalamasına göre değerlendirilmesi ile hesaplanmıştır.</p>
        <p>Aylık değerler, her temsilcinin mevcut tüm ay verileri üzerinden hesaplanmıştır.</p>
      </div>

      {/* Detail Modal */}
      <RepresentativeDetailModal
        representative={selectedRepresentative}
        representatives={representatives}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SuccessIndexDashboard; 