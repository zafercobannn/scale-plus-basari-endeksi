import { RepresentativeData, CalculatedRepresentative, KPIWeights } from '../types';

/**
 * Virgülle ayrılmış string sayıyı float'a çevirir
 */
const parseCommaNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Min-max normalizasyon yapar
 */
const normalizeValue = (value: number, min: number, max: number): number => {
  if (isNaN(value) || isNaN(min) || isNaN(max)) return 0;
  if (max === min) return 0.5; // Eğer tüm değerler aynıysa orta puan ver
  return (value - min) / (max - min);
};

/**
 * Varsayılan KPI ağırlıkları - Scale Plus için güncellendi
 */
export const defaultKPIWeights: KPIWeights = {
  callCount: 0.0,         // %0 - Artık kullanılmıyor
  callDuration: 0.0,      // %0 - Artık kullanılmıyor
  auditScore: 0.3,        // %30
  csatScore: 0.0,         // %0 - Artık kullanılmıyor
  // Scale Plus için yeni ağırlıklar
  liveCompanyCount: 0.3,      // %30 - Canlıya alınan firma adedi
  onboardingScore: 0.2,       // %20 - Onboarding anket skoru
  meetingEvaluation: 0.2      // %20 - Toplantı değerlendirmesi
};

/**
 * Başarı endeksi hesaplar
 */
export const calculateSuccessIndex = (
  data: RepresentativeData[], 
  weights: KPIWeights = defaultKPIWeights
): CalculatedRepresentative[] => {
  if (data.length === 0) return [];

  // Verileri parse et
  const parsedData = data
    .filter(item => 
      item["Audit Skoru"] !== "N/A" && 
      item["Canlıya Alınan Firma Adedi"] !== undefined &&
      item["Onboarding Anket Skoru"] !== undefined &&
      item["Toplantı Değerlendirmesi"] !== undefined
    )
    .map(item => ({
      name: item["MT Adı"],
      callCount: Number(item["Toplam Çağrı Adedi"]) || 0,
      callDuration: parseCommaNumber(item["Ortalama Konuşma Süresi"]),
      auditScore: Number(item["Audit Skoru"]) || 0,
      csatScore: parseCommaNumber(item["Çağrı Değerlendirme Ortalaması"]),
      // Scale Plus için yeni alanlar - 0-5'ten 0-100'e normalize et
      liveCompanyCount: Number(item["Canlıya Alınan Firma Adedi"]) || 0,
      liveCompanyTarget: Number(item["Canlıya Alınan Hesap Sayısı Hedefi"]) || 23,
      onboardingScore: (Number(item["Onboarding Anket Skoru"]) || 0) * 20,
      meetingEvaluation: (Number(item["Toplantı Değerlendirmesi"]) || 0) * 20,
      // Orijinal değerler (görünüm için)
      originalOnboardingScore: Number(item["Onboarding Anket Skoru"]) || 0,
      originalMeetingEvaluation: Number(item["Toplantı Değerlendirmesi"]) || 0
    }));

  // Min-max değerleri bul
  const liveCompanyCounts = parsedData.map(d => d.liveCompanyCount);
  const onboardingScores = parsedData.map(d => d.onboardingScore);
  const meetingEvaluations = parsedData.map(d => d.meetingEvaluation);

  const maxLiveCompanyCount = Math.max(...liveCompanyCounts);
  const minOnboardingScore = Math.min(...onboardingScores);
  const maxOnboardingScore = Math.max(...onboardingScores);
  const minMeetingEvaluation = Math.min(...meetingEvaluations);
  const maxMeetingEvaluation = Math.max(...meetingEvaluations);

  // Her temsilci için puanları hesapla
  const calculatedData: CalculatedRepresentative[] = parsedData.map(item => {
    // Audit skoru puanı - 100 tam puan üzerinden hesapla
    const auditScorePercentage = item.auditScore / 100;
    const auditScoreNormalized = auditScorePercentage * weights.auditScore;

    // Scale Plus için yeni hesaplamalar
    // Canlıya alınan firma adedi puanı - Hedefe göre yüzde hesapla
    const liveCompanyPercentage = item.liveCompanyCount >= item.liveCompanyTarget
      ? 1
      : item.liveCompanyCount / item.liveCompanyTarget;
    const liveCompanyScore = liveCompanyPercentage * weights.liveCompanyCount;

    // Onboarding anket skoru puanı - 0-100 aralığından normalize et
    const onboardingScorePercentage = item.onboardingScore / 100;
    const onboardingScoreNormalized = onboardingScorePercentage * weights.onboardingScore;

    // Toplantı değerlendirmesi puanı - 0-100 aralığından normalize et
    const meetingEvaluationPercentage = item.meetingEvaluation / 100;
    const meetingEvaluationNormalized = meetingEvaluationPercentage * weights.meetingEvaluation;

    // Toplam başarı endeksi (0-1 arası) - Scale Plus için güncellendi
    const successIndex = auditScoreNormalized + liveCompanyScore + onboardingScoreNormalized + meetingEvaluationNormalized;

    return {
      name: item.name,
      rank: 0, // Sıralama daha sonra yapılacak
      successIndex,
      callCount: item.callCount,
      callDuration: item.callDuration,
      auditScore: item.auditScore,
      surveyResult: item.csatScore,
      qualityEvaluation: item.csatScore,
      callCountScore: 0, // Artık kullanılmıyor
      callDurationScore: 0, // Artık kullanılmıyor
      auditScoreNormalized,
      csatScoreNormalized: 0, // Artık kullanılmıyor
      // Scale Plus için yeni alanlar
      liveCompanyCount: item.liveCompanyCount,
      liveCompanyTarget: item.liveCompanyTarget,
      onboardingScore: item.onboardingScore,
      meetingEvaluation: item.meetingEvaluation,
      liveCompanyScore,
      onboardingScoreNormalized,
      meetingEvaluationNormalized,
      // Orijinal değerler (görünüm için)
      originalOnboardingScore: item.originalOnboardingScore,
      originalMeetingEvaluation: item.originalMeetingEvaluation
    };
  });

  // Başarı endeksine göre sırala (yüksekten düşüğe)
  // Aynı başarı endeksi varsa, canlıya alınan firma adedi ve audit skoruna göre sırala
  calculatedData.sort((a, b) => {
    if (Math.abs(b.successIndex - a.successIndex) > 0.001) {
      return b.successIndex - a.successIndex;
    }
    // Başarı endeksi aynıysa, canlıya alınan firma adedine göre sırala
    if (b.liveCompanyCount !== a.liveCompanyCount) {
      return b.liveCompanyCount - a.liveCompanyCount;
    }
    // O da aynıysa, audit skoruna göre sırala
    return b.auditScore - a.auditScore;
  });

  // Sıralama numaralarını ata
  calculatedData.forEach((item, index) => {
    item.rank = index + 1;
  });

  return calculatedData;
};

/**
 * Takım istatistiklerini hesaplar
 */
export const calculateTeamStats = (data: RepresentativeData[]) => {
  if (data.length === 0) return null;

  const parsedData = data
    .filter(item => 
      item["Audit Skoru"] !== "N/A" && 
      item["Canlıya Alınan Firma Adedi"] !== undefined &&
      item["Onboarding Anket Skoru"] !== undefined &&
      item["Toplantı Değerlendirmesi"] !== undefined
    )
    .map(item => ({
      name: item["MT Adı"],
      callCount: Number(item["Toplam Çağrı Adedi"]) || 0,
      callDuration: parseCommaNumber(item["Ortalama Konuşma Süresi"]),
      auditScore: Number(item["Audit Skoru"]) || 0,
      csatScore: parseCommaNumber(item["Çağrı Değerlendirme Ortalaması"]),
      // Scale Plus için yeni alanlar
      liveCompanyCount: Number(item["Canlıya Alınan Firma Adedi"]) || 0,
      onboardingScore: (Number(item["Onboarding Anket Skoru"]) || 0) * 20,
      meetingEvaluation: (Number(item["Toplantı Değerlendirmesi"]) || 0) * 20
    }));

  const callCounts = parsedData.map(d => d.callCount);
  const callDurations = parsedData.map(d => d.callDuration);
  const auditScores = parsedData.map(d => d.auditScore);
  const csatScores = parsedData.map(d => d.csatScore);
  // Scale Plus için yeni değerler
  const liveCompanyCounts = parsedData.map(d => d.liveCompanyCount);
  const onboardingScores = parsedData.map(d => d.onboardingScore);
  const meetingEvaluations = parsedData.map(d => d.meetingEvaluation);

  // Sabit takım ortalamaları
  return {
    callCount: {
      min: Math.min(...callCounts),
      max: Math.max(...callCounts),
      avg: 415 // Sabit değer: Çağrı adet ort
    },
    callDuration: {
      min: Math.min(...callDurations),
      max: Math.max(...callDurations),
      avg: 459.24 // Sabit değer: Ortalama konuşma süresi
    },
    auditScore: {
      min: Math.min(...auditScores),
      max: Math.max(...auditScores),
      avg: Math.round(auditScores.reduce((a, b) => a + b, 0) / auditScores.length * 10) / 10 || 0
    },
    csatScore: {
      min: Math.min(...csatScores),
      max: Math.max(...csatScores),
      avg: 4.88 // Sabit değer: CSAT
    },
    // Scale Plus için yeni istatistikler
    liveCompanyCount: {
      min: Math.min(...liveCompanyCounts),
      max: Math.max(...liveCompanyCounts),
      avg: Math.round(liveCompanyCounts.reduce((a, b) => a + b, 0) / liveCompanyCounts.length) || 0
    },
    onboardingScore: {
      min: Math.min(...onboardingScores),
      max: Math.max(...onboardingScores),
      avg: Math.round(onboardingScores.reduce((a, b) => a + b, 0) / onboardingScores.length * 10) / 10 || 0
    },
    meetingEvaluation: {
      min: Math.min(...meetingEvaluations),
      max: Math.max(...meetingEvaluations),
      avg: Math.round(meetingEvaluations.reduce((a, b) => a + b, 0) / meetingEvaluations.length * 10) / 10 || 0
    }
  };
};

/**
 * Debug için hesaplama detaylarını yazdırır
 */
export const debugCalculation = (data: RepresentativeData[]): void => {
  if (data.length === 0) return;

  const parsedData = data.map(item => ({
    name: item["MT Adı"],
    callCount: Number(item["Toplam Çağrı Adedi"]) || 0,
    callDuration: parseCommaNumber(item["Ortalama Konuşma Süresi"]),
    auditScore: Number(item["Audit Skoru"]) || 0,
    csatScore: parseCommaNumber(item["Çağrı Değerlendirme Ortalaması"]),
    // Scale Plus için yeni alanlar
    liveCompanyCount: Number(item["Canlıya Alınan Firma Adedi"]) || 0,
    onboardingScore: (Number(item["Onboarding Anket Skoru"]) || 0) * 20,
    meetingEvaluation: (Number(item["Toplantı Değerlendirmesi"]) || 0) * 20
  }));

  const liveCompanyCounts = parsedData.map(d => d.liveCompanyCount);
  const onboardingScores = parsedData.map(d => d.onboardingScore);
  const meetingEvaluations = parsedData.map(d => d.meetingEvaluation);

  const maxLiveCompanyCount = Math.max(...liveCompanyCounts);
  const minOnboardingScore = Math.min(...onboardingScores);
  const maxOnboardingScore = Math.max(...onboardingScores);
  const minMeetingEvaluation = Math.min(...meetingEvaluations);
  const maxMeetingEvaluation = Math.max(...meetingEvaluations);

  console.log('=== DEBUG HESAPLAMA ===');
  console.log('Min-Max Değerler:');
  console.log(`Canlıya Alınan Firma Adedi: ${Math.min(...liveCompanyCounts)} - ${maxLiveCompanyCount}`);
  console.log(`Onboarding Anket Skoru: ${minOnboardingScore} - ${maxOnboardingScore}`);
  console.log(`Toplantı Değerlendirmesi: ${minMeetingEvaluation} - ${maxMeetingEvaluation}`);

  parsedData.forEach(item => {
    const auditScoreNormalized = (item.auditScore / 100) * 0.3;
    const liveCompanyScore = (maxLiveCompanyCount > 0 ? item.liveCompanyCount / maxLiveCompanyCount : 0) * 0.3;
    const onboardingScoreNormalized = (item.onboardingScore / 100) * 0.2;
    const meetingEvaluationNormalized = (item.meetingEvaluation / 100) * 0.2;
    const successIndex = auditScoreNormalized + liveCompanyScore + onboardingScoreNormalized + meetingEvaluationNormalized;

    console.log(`\n${item.name}:`);
    console.log(`  Audit: ${item.auditScore} → ${auditScoreNormalized.toFixed(4)}`);
    console.log(`  Canlıya Alınan Firma Adedi: ${item.liveCompanyCount} → ${liveCompanyScore.toFixed(4)}`);
    console.log(`  Onboarding Anket Skoru: ${item.onboardingScore} → ${onboardingScoreNormalized.toFixed(4)}`);
    console.log(`  Toplantı Değerlendirmesi: ${item.meetingEvaluation} → ${meetingEvaluationNormalized.toFixed(4)}`);
    console.log(`  Toplam: ${successIndex.toFixed(4)}`);
  });
}; 