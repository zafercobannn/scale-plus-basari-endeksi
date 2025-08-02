/**
 * Temsilci adından fotoğraf URL'si oluşturur
 */
export const getRepresentativeImage = (name: string): string => {
  // Türkçe karakterleri ve boşlukları temizle
  const cleanName = name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  // GitHub Pages için doğru yol
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '/cs-basari-endeksi' 
    : '/cs-basari-endeksi';
  
  return `${baseUrl}/images/representatives/${cleanName}.png`;
};

/**
 * Fotoğrafın var olup olmadığını kontrol eder
 */
export const checkImageExists = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * Varsayılan avatar URL'si
 */
export const getDefaultAvatar = (): string => {
  // GitHub Pages için doğru yol
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '/cs-basari-endeksi' 
    : '/cs-basari-endeksi';
  
  return `${baseUrl}/images/representatives/default.png`;
}; 