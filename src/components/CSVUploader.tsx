import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { saveMonthData, parseCSVToRepresentativeData, validateRepresentativeData } from '../services/dataService';
import { RepresentativeData } from '../types';
import './CSVUploader.css';

interface CSVUploaderProps {
  onUploadSuccess: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadSuccess }) => {
  const [monthName, setMonthName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<RepresentativeData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);
    setSuccess(false);
    setPreview([]);

    Papa.parse<Record<string, unknown>>(selectedFile, {
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = parseCSVToRepresentativeData(results.data as any[]);
        const validationErrors = validateRepresentativeData(parsedData);
        
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        } else {
          setPreview(parsedData);
        }
      },
      error: (error) => {
        setErrors([`CSV parse hatası: ${error.message}`]);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!monthName.trim()) {
      setErrors(['Lütfen ay adı giriniz (örn: Ocak 2026)']);
      return;
    }
    
    if (preview.length === 0) {
      setErrors(['Lütfen geçerli bir CSV dosyası yükleyiniz']);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      await saveMonthData(monthName, preview);
      setSuccess(true);
      setMonthName('');
      setFile(null);
      setPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    } catch (error: any) {
      setErrors([`Kayıt hatası: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMonthName('');
    setFile(null);
    setPreview([]);
    setErrors([]);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="csv-uploader">
      <div className="uploader-header">
        <h2>CSV Dosyası Yükle</h2>
        <p>Yeni ay verisi eklemek için CSV dosyası yükleyin</p>
      </div>

      {success && (
        <div className="upload-success">
          Veri başarıyla kaydedildi!
        </div>
      )}

      {errors.length > 0 && (
        <div className="upload-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-item">{error}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="monthName">Ay Adı</label>
          <input
            type="text"
            id="monthName"
            value={monthName}
            onChange={(e) => setMonthName(e.target.value)}
            placeholder="Örn: Ocak 2026"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="csvFile">CSV Dosyası</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="csvFile"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
            />
            <div className="file-input-text">
              {file ? file.name : 'Dosya seçin veya sürükleyin'}
            </div>
          </div>
        </div>

        {preview.length > 0 && (
          <div className="preview-section">
            <h3>Önizleme ({preview.length} kayıt)</h3>
            <div className="preview-table-wrapper">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>MT Adı</th>
                    <th>Audit Skoru</th>
                    <th>Canlıya Alınan Firma</th>
                    <th>Onboarding Skoru</th>
                    <th>Toplantı Değ.</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      <td>{row["MT Adı"]}</td>
                      <td>{row["Audit Skoru"]}</td>
                      <td>{row["Canlıya Alınan Firma Adedi"]}</td>
                      <td>{row["Onboarding Anket Skoru"]}</td>
                      <td>{row["Toplantı Değerlendirmesi"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 5 && (
                <p className="preview-more">... ve {preview.length - 5} kayıt daha</p>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Temizle
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || preview.length === 0}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>

      <div className="csv-format-info">
        <h4>CSV Format Bilgisi</h4>
        <p>CSV dosyanız aşağıdaki sütunları içermelidir:</p>
        <ul>
          <li><code>MT Adı</code> - Temsilci adı (zorunlu)</li>
          <li><code>Audit Skoru</code> - Audit puanı</li>
          <li><code>Canlıya Alınan Firma Adedi</code> - Firma sayısı</li>
          <li><code>Canlıya Alınan Hesap Sayısı Hedefi</code> - Hedef</li>
          <li><code>Onboarding Anket Skoru</code> - Anket puanı</li>
          <li><code>Toplantı Değerlendirmesi</code> - Toplantı puanı</li>
        </ul>
      </div>
    </div>
  );
};

export default CSVUploader;
