import React from 'react';
import './InfoModal.css';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="info-modal-header">
          <h2>Başarı Endeksi Hakkında</h2>
          <button className="info-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="info-modal-body">
          <div className="info-section">
            <h3>🎯 Başarı Endeksi Nedir?</h3>
            <p>
              Customer Success temsilcilerinin performansını ölçen kapsamlı bir değerlendirme sistemidir. 
              Dört temel metriğin ağırlıklı ortalaması alınarak hesaplanır.
            </p>
          </div>

          <div className="info-section">
            <h3>📊 Hesaplama Metrikleri</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <h4>Çağrı Adedi</h4>
                <p><strong>Ağırlık:</strong> %20</p>
                <p><strong>Hedef:</strong> Daha yüksek değer daha iyi</p>
              </div>
              
              <div className="metric-item">
                <h4>Ortalama Konuşma Süresi</h4>
                <p><strong>Ağırlık:</strong> %20</p>
                <p><strong>Hedef:</strong> Daha düşük değer daha iyi</p>
              </div>
              
              <div className="metric-item">
                <h4>Audit Skoru</h4>
                <p><strong>Ağırlık:</strong> %30</p>
                <p><strong>Hedef:</strong> 0-100 arası, daha yüksek daha iyi</p>
              </div>
              
              <div className="metric-item">
                <h4>Çağrı Değerlendirme (CSAT)</h4>
                <p><strong>Ağırlık:</strong> %30</p>
                <p><strong>Hedef:</strong> 0-5 arası, daha yüksek daha iyi</p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>🔢 Hesaplama Yöntemi</h3>
            <p>
              Her metrik için takım içindeki en yüksek ve en düşük değerler kullanılarak 
              min-max normalizasyonu yapılır. Normalize edilmiş değerler ağırlıklarıyla 
              çarpılarak toplam başarı endeksi hesaplanır.
            </p>
          </div>

          <div className="info-section">
            <h3>🏆 Sıralama</h3>
            <p>
              Temsilciler başarı endekslerine göre sıralanır. En yüksek puana sahip 
              temsilci 1. sırada yer alır ve "Temmuz Ayı Başarı Endeksi Şampiyonu" 
              unvanını kazanır.
            </p>
          </div>

          <div className="info-section">
            <h3>💡 Kullanım</h3>
            <ul>
              <li>Herhangi bir temsilciye tıklayarak detaylı analizi görüntüleyebilirsiniz</li>
              <li>Arama kutusunu kullanarak temsilci arayabilirsiniz</li>
              <li>Detay sayfasında her metriğin nasıl hesaplandığını görebilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal; 