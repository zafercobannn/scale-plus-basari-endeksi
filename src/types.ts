export interface RepresentativeData {
  "MT Adı": string;
  "Audit Skoru": number | string;
  "Toplam Çağrı Adedi": number | string;
  "Ortalama Konuşma Süresi": string;
  "Lokal Kapatma Oranı": string;
  "Kaçan Çağrılar": number | string;
  "Çağrı Değerlendirme Ortalaması": string;
  "Çağrı Değerlendirme Adet": number | string;
  // Scale Plus için yeni alanlar
  "Canlıya Alınan Firma Adedi": number | string;
  "Canlıya Alınan Hesap Sayısı Hedefi": number | string;
  "Onboarding Anket Skoru": number | string;
  "Toplantı Değerlendirmesi": number | string;
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
  // Scale Plus için yeni alanlar
  liveCompanyCount: number;
  liveCompanyTarget: number;
  onboardingScore: number;
  meetingEvaluation: number;
  liveCompanyScore: number;
  onboardingScoreNormalized: number;
  meetingEvaluationNormalized: number;
  // Orijinal değerler (görünüm için)
  originalOnboardingScore: number;
  originalMeetingEvaluation: number;
}

export interface KPIWeights {
  callCount: number;      // Çağrı Adedi ağırlığı
  callDuration: number;   // Konuşma Süresi ağırlığı
  auditScore: number;     // Audit Skoru ağırlığı
  csatScore: number;      // CSAT ağırlığı
  // Scale Plus için yeni ağırlıklar
  liveCompanyCount: number;    // Canlıya alınan firma adedi ağırlığı
  onboardingScore: number;     // Onboarding anket skoru ağırlığı
  meetingEvaluation: number;   // Toplantı değerlendirmesi ağırlığı
} 