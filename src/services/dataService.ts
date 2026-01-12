import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { RepresentativeData, KPIWeights } from '../types';
import { defaultKPIWeights } from '../utils/calculations';

export interface MonthData {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  data: RepresentativeData[];
}

const MONTHS_COLLECTION = 'months';

// Tüm ayları getir
export const getAllMonths = async (): Promise<MonthData[]> => {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const monthsRef = collection(db, MONTHS_COLLECTION);
    const q = query(monthsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        key: data.key,
        createdAt: data.createdAt?.toDate() || new Date(),
        data: data.data || [],
      };
    });
  } catch (error) {
    console.error('Error fetching months:', error);
    return [];
  }
};

// Belirli bir ayın verisini getir
export const getMonthData = async (monthId: string): Promise<MonthData | null> => {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const docRef = doc(db, MONTHS_COLLECTION, monthId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        key: data.key,
        createdAt: data.createdAt?.toDate() || new Date(),
        data: data.data || [],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching month data:', error);
    return null;
  }
};

// Yeni ay verisi ekle veya güncelle
export const saveMonthData = async (
  monthName: string, 
  data: RepresentativeData[]
): Promise<string> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase yapılandırması eksik');
  }

  try {
    // Ay isminden key oluştur (örn: "Ocak 2026" -> "ocak-2026")
    const key = monthName
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-');
    
    const docRef = doc(db, MONTHS_COLLECTION, key);
    
    await setDoc(docRef, {
      name: monthName,
      key: key,
      createdAt: Timestamp.now(),
      data: data,
    });
    
    return key;
  } catch (error) {
    console.error('Error saving month data:', error);
    throw error;
  }
};

// Ay verisini sil
export const deleteMonthData = async (monthId: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase yapılandırması eksik');
  }

  try {
    const docRef = doc(db, MONTHS_COLLECTION, monthId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting month data:', error);
    throw error;
  }
};

// Sütun adını bul (farklı varyasyonları destekle)
const findColumnValue = (row: any, ...possibleNames: string[]): any => {
  // Önce direkt eşleşme dene
  for (const name of possibleNames) {
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return row[name];
    }
  }
  
  // Trim edilmiş ve lowercase karşılaştırma
  const rowKeys = Object.keys(row);
  for (const name of possibleNames) {
    const normalizedName = name.toLowerCase().trim();
    for (const key of rowKeys) {
      // BOM karakterini temizle ve normalize et
      const cleanKey = key.replace(/^\uFEFF/, '').trim().toLowerCase();
      if (cleanKey === normalizedName || cleanKey.includes(normalizedName) || normalizedName.includes(cleanKey)) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return row[key];
        }
      }
    }
  }
  
  return null;
};

// CSV verisini RepresentativeData formatına dönüştür
export const parseCSVToRepresentativeData = (csvData: any[]): RepresentativeData[] => {
  // İlk satırı debug için logla
  if (csvData.length > 0) {
    console.log('CSV sütun başlıkları:', Object.keys(csvData[0]));
    console.log('İlk satır:', csvData[0]);
  }

  return csvData.map(row => ({
    "MT Adı": findColumnValue(row, "MT Adı", "MT Adi", "Temsilci", "Ad", "İsim", "Isim", "Name") || "",
    "Audit Skoru": parseNumber(findColumnValue(row, "Audit Skoru", "Audit Puanı", "Audit Puani", "Audit")),
    "Toplam Çağrı Adedi": parseNumber(findColumnValue(row, "Toplam Çağrı Adedi", "Toplam Cagri Adedi", "Çağrı Adedi", "Cagri Adedi")),
    "Ortalama Konuşma Süresi": findColumnValue(row, "Ortalama Konuşma Süresi", "Ortalama Konusma Suresi", "Konuşma Süresi") || "0",
    "Lokal Kapatma Oranı": findColumnValue(row, "Lokal Kapatma Oranı", "Lokal Kapatma Orani") || "0%",
    "Kaçan Çağrılar": parseNumber(findColumnValue(row, "Kaçan Çağrılar", "Kacan Cagrilar")),
    "Çağrı Değerlendirme Ortalaması": findColumnValue(row, "Çağrı Değerlendirme Ortalaması", "Cagri Degerlendirme Ortalamasi") || "0",
    "Çağrı Değerlendirme Adet": parseNumber(findColumnValue(row, "Çağrı Değerlendirme Adet", "Cagri Degerlendirme Adet")),
    "Canlıya Alınan Firma Adedi": parseNumber(findColumnValue(row, "Canlıya Alınan Firma Adedi", "Canlıya Alınan Hesap Sayısı", "Canliya Alinan Hesap Sayisi", "Canlı Firma", "Firma Adedi")),
    "Canlıya Alınan Hesap Sayısı Hedefi": parseNumber(findColumnValue(row, "Canlıya Alınan Hesap Sayısı Hedefi", "Canliya Alinan Hesap Sayisi Hedefi", "Hedef", "Hesap Hedefi")),
    "Onboarding Anket Skoru": parseNumber(findColumnValue(row, "Onboarding Anket Skoru", "NPS Anket Skoru", "NPS", "Anket Skoru", "Onboarding")),
    "Toplantı Değerlendirmesi": parseNumber(findColumnValue(row, "Toplantı Değerlendirmesi", "Toplanti Degerlendirmesi", "Toplantı", "Toplanti")),
  }));
};

// Sayı parse helper
const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(',', '.').replace('%', '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Veri validasyonu
export const validateRepresentativeData = (data: RepresentativeData[]): string[] => {
  const errors: string[] = [];
  
  if (!Array.isArray(data) || data.length === 0) {
    errors.push('Veri boş veya geçersiz format');
    return errors;
  }
  
  // İlk 3 satırda MT Adı yoksa, sütun eşleşmesi sorunu var demektir
  let emptyNameCount = 0;
  data.slice(0, 3).forEach((row) => {
    if (!row["MT Adı"] || row["MT Adı"].trim() === '') {
      emptyNameCount++;
    }
  });
  
  if (emptyNameCount >= 3) {
    errors.push('CSV sütun başlıkları eşleşmiyor. "MT Adı" veya benzeri bir sütun bulunamadı.');
    errors.push('Beklenen sütunlar: MT Adı, Audit Skoru, Canlıya Alınan Firma Adedi, Onboarding Anket Skoru, Toplantı Değerlendirmesi');
    return errors;
  }
  
  // Normal validasyon
  data.forEach((row, index) => {
    if (!row["MT Adı"] || row["MT Adı"].trim() === '') {
      errors.push(`Satır ${index + 1}: MT Adı boş`);
    }
  });
  
  return errors;
};

// ==================== KPI AYARLARI ====================

const SETTINGS_COLLECTION = 'settings';
const KPI_WEIGHTS_DOC = 'kpiWeights';

// KPI ağırlıklarını getir
export const getKPIWeights = async (): Promise<KPIWeights> => {
  if (!isFirebaseConfigured || !db) {
    // Firebase yoksa localStorage'dan oku
    const stored = localStorage.getItem('kpiWeights');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultKPIWeights;
      }
    }
    return defaultKPIWeights;
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, KPI_WEIGHTS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        callCount: data.callCount ?? 0,
        callDuration: data.callDuration ?? 0,
        auditScore: data.auditScore ?? 0.3,
        csatScore: data.csatScore ?? 0,
        liveCompanyCount: data.liveCompanyCount ?? 0.3,
        onboardingScore: data.onboardingScore ?? 0.2,
        meetingEvaluation: data.meetingEvaluation ?? 0.2,
      };
    }
    return defaultKPIWeights;
  } catch (error) {
    console.error('Error fetching KPI weights:', error);
    return defaultKPIWeights;
  }
};

// KPI ağırlıklarını kaydet
export const saveKPIWeights = async (weights: KPIWeights): Promise<void> => {
  // Her zaman localStorage'a da kaydet (fallback için)
  localStorage.setItem('kpiWeights', JSON.stringify(weights));

  if (!isFirebaseConfigured || !db) {
    return;
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, KPI_WEIGHTS_DOC);
    await setDoc(docRef, {
      ...weights,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving KPI weights:', error);
    throw error;
  }
};

// KPI ağırlıklarını dinle (realtime)
export const subscribeToKPIWeights = (
  callback: (weights: KPIWeights) => void
): (() => void) => {
  if (!isFirebaseConfigured || !db) {
    // Firebase yoksa bir kere localStorage'dan oku
    const stored = localStorage.getItem('kpiWeights');
    if (stored) {
      try {
        callback(JSON.parse(stored));
      } catch (e) {
        callback(defaultKPIWeights);
      }
    } else {
      callback(defaultKPIWeights);
    }
    return () => {}; // Empty unsubscribe
  }

  const docRef = doc(db, SETTINGS_COLLECTION, KPI_WEIGHTS_DOC);
  
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        callCount: data.callCount ?? 0,
        callDuration: data.callDuration ?? 0,
        auditScore: data.auditScore ?? 0.3,
        csatScore: data.csatScore ?? 0,
        liveCompanyCount: data.liveCompanyCount ?? 0.3,
        onboardingScore: data.onboardingScore ?? 0.2,
        meetingEvaluation: data.meetingEvaluation ?? 0.2,
      });
    } else {
      callback(defaultKPIWeights);
    }
  }, (error) => {
    console.error('Error listening to KPI weights:', error);
    callback(defaultKPIWeights);
  });

  return unsubscribe;
};
