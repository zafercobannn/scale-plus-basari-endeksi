# Scale Plus Başarı Endeksi Dashboard

Bu proje, Scale Plus temsilcilerinin performansını değerlendirmek için kullanılan bir başarı endeksi hesaplama ve görselleştirme uygulamasıdır.

## Özellikler

- **Başarı Endeksi Hesaplama**: 4 farklı metriğin ağırlıklı ortalaması
- **Gerçek Zamanlı Görselleştirme**: Modern ve kullanıcı dostu arayüz
- **Arama ve Filtreleme**: Temsilci adına göre arama
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## Hesaplama Formülü

Başarı endeksi aşağıdaki formülle hesaplanır:

```
Başarı Endeksi = (Canlıya Alınan Firma Adedi Puanı × 0.30) + 
                 (Audit Skoru Puanı × 0.30) + 
                 (NPS Call Score Puanı × 0.20) + 
                 (Toplantı Değerlendirmesi Puanı × 0.20)
```

### Metrik Açıklamaları

1. **Canlıya Alınan Firma Adedi (%30)**: Hedefi geçen temsilci %100 puan alır, aksi halde hedef oranına göre puanlanır
2. **Audit Skoru (%30)**: 0-100 arası, en yüksek skor en yüksek puanı alır
3. **NPS Call Score (%20)**: 0-5 arası, 5 olan "Mükemmel", diğerleri "İyi" olarak değerlendirilir
4. **Toplantı Değerlendirmesi (%20)**: 0-5 arası, 5 olan "Mükemmel", diğerleri "İyi" olarak değerlendirilir

## Kullanım

1. Uygulamayı başlatın: `npm start`
2. JSON verilerinizi textarea'ya yapıştırın
3. "Hesapla" butonuna tıklayın
4. Sonuçları dashboard'da görüntüleyin

## JSON Veri Formatı

```json
{
  "MT Adı": "Adil Hanedan",
  "Canlıya Alınan Firma Adedi": 25,
  "Canlıya Alınan Hesap Sayısı Hedefi": 23,
  "Audit Skoru": 85,
  "Onboarding Anket Skoru": 4.7,
  "Toplantı Değerlendirmesi": 4.5
}
```

## Kurulum

```bash
npm install
npm start
```

## Teknolojiler

- React 18
- TypeScript
- CSS3
- Modern JavaScript (ES6+)

## Geliştirici

Bu proje Scale Plus performans değerlendirmesi için geliştirilmiştir.
