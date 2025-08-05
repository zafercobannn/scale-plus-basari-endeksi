/**
 * Temsilci adından fotoğraf URL'si oluşturur
 */
export const getRepresentativeImage = (name: string): string => {
  // Özel eşleştirmeler
  const nameMappings: { [key: string]: string } = {
    'Dilşad Gergin': 'dilsadgergin',
    'Ahmet Onur': 'ahmetonuryarici',
    'Tolga Özen Kabasakal': 'tolgaozenkabasakal',
    'Hüseyin Günder': 'huseyingunder',
    'Ozan Berk Fettahlı': 'ozanberkfettahli'
  };

  // Özel eşleştirme varsa onu kullan
  if (nameMappings[name]) {
    const baseUrl = process.env.PUBLIC_URL || '';
    return `${baseUrl}/images/representatives/${nameMappings[name]}.png`;
  }

  // Genel temizleme mantığı (eski temsilciler için)
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
  
  const baseUrl = process.env.PUBLIC_URL || '';
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
  const baseUrl = process.env.PUBLIC_URL || '';
  return `${baseUrl}/images/representatives/default.png`;
}; 