import React, { useState, useEffect } from 'react';
import { getAllMonths, deleteMonthData, MonthData } from '../services/dataService';
import './DataManager.css';

interface DataManagerProps {
  refreshTrigger: number;
  onDataChange: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ refreshTrigger, onDataChange }) => {
  const [months, setMonths] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const fetchMonths = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllMonths();
      setMonths(data);
    } catch (err: any) {
      setError('Veriler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonths();
  }, [refreshTrigger]);

  const handleDelete = async (monthId: string) => {
    try {
      setDeleting(true);
      await deleteMonthData(monthId);
      setDeleteConfirm(null);
      await fetchMonths();
      onDataChange();
    } catch (err: any) {
      setError('Silme işlemi başarısız oldu');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="data-manager">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-manager">
      <div className="manager-header">
        <h2>Mevcut Veriler</h2>
        <p>Yüklenen ay verilerini görüntüleyin ve yönetin</p>
      </div>

      {error && (
        <div className="manager-error">{error}</div>
      )}

      {months.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Henüz veri yok</h3>
          <p>CSV dosyası yükleyerek yeni veri ekleyebilirsiniz</p>
        </div>
      ) : (
        <div className="months-list">
          {months.map((month) => (
            <div key={month.id} className="month-card">
              <div className="month-header" onClick={() => setExpandedMonth(expandedMonth === month.id ? null : month.id)}>
                <div className="month-info">
                  <h3>{month.name}</h3>
                  <div className="month-meta">
                    <span className="meta-item">
                      <span className="meta-label">Kayıt:</span> {month.data.length} temsilci
                    </span>
                    <span className="meta-item">
                      <span className="meta-label">Eklendi:</span> {formatDate(month.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="month-actions">
                  <button 
                    className="btn-expand"
                    title={expandedMonth === month.id ? 'Daralt' : 'Genişlet'}
                  >
                    {expandedMonth === month.id ? '▲' : '▼'}
                  </button>
                  {deleteConfirm === month.id ? (
                    <div className="delete-confirm">
                      <span>Emin misiniz?</span>
                      <button 
                        className="btn-confirm-yes"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(month.id);
                        }}
                        disabled={deleting}
                      >
                        {deleting ? '...' : 'Evet'}
                      </button>
                      <button 
                        className="btn-confirm-no"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(null);
                        }}
                      >
                        Hayır
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(month.id);
                      }}
                    >
                      Sil
                    </button>
                  )}
                </div>
              </div>

              {expandedMonth === month.id && (
                <div className="month-details">
                  <table className="details-table">
                    <thead>
                      <tr>
                        <th>MT Adı</th>
                        <th>Audit</th>
                        <th>Canlı Firma</th>
                        <th>Hedef</th>
                        <th>Onboarding</th>
                        <th>Toplantı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {month.data.map((rep, index) => (
                        <tr key={index}>
                          <td>{rep["MT Adı"]}</td>
                          <td>{rep["Audit Skoru"]}</td>
                          <td>{rep["Canlıya Alınan Firma Adedi"]}</td>
                          <td>{rep["Canlıya Alınan Hesap Sayısı Hedefi"]}</td>
                          <td>{rep["Onboarding Anket Skoru"]}</td>
                          <td>{rep["Toplantı Değerlendirmesi"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="btn-refresh" onClick={fetchMonths}>
        Yenile
      </button>
    </div>
  );
};

export default DataManager;
