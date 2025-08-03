export interface RepresentativeData {
  "MT Adı": string;
  "İşe Giriş Tarihi"?: string;
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
  hireDate?: string;
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