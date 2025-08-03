export interface RepresentativeData {
  "MT Adı": string;
  "Audit Skoru": number | string;
  "Toplam Çağrı Adedi": number | string;
  "Ortalama Konuşma Süresi": string;
  "Lokal Kapatma Oranı": string;
  "Kaçan Çağrılar": number | string;
  "Çağrı Değerlendirme Ortalaması": string;
  "Çağrı Değerlendirme Adet": number | string;
}

export interface CalculatedRepresentative {
  name: string;
  rank: number;
  successIndex: number;
  callCount: number;
  callDuration: number;
  auditScore: number;
  surveyResult: number;
  qualityEvaluation: number;
  callCountScore: number;
  callDurationScore: number;
  auditScoreNormalized: number;
  csatScoreNormalized: number;
}

export interface KPIWeights {
  callCount: number;      // Çağrı Adedi ağırlığı
  callDuration: number;   // Konuşma Süresi ağırlığı
  auditScore: number;     // Audit Skoru ağırlığı
  csatScore: number;      // CSAT ağırlığı
} 