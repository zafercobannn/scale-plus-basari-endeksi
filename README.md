# Customer Success Başarı Endeksi Dashboard

Bu proje, Customer Success temsilcilerinin performansını değerlendirmek için kullanılan bir başarı endeksi hesaplama ve görselleştirme uygulamasıdır.

## Özellikler

- **Başarı Endeksi Hesaplama**: 4 farklı metriğin ağırlıklı ortalaması
- **Gerçek Zamanlı Görselleştirme**: Modern ve kullanıcı dostu arayüz
- **Arama ve Filtreleme**: Temsilci adına göre arama
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## Hesaplama Formülü

Başarı endeksi aşağıdaki formülle hesaplanır:

```
Başarı Endeksi = (Çağrı Adedi Puanı × 0.20) + 
                 (Konuşma Süresi Puanı × 0.20) + 
                 (Audit Skoru Puanı × 0.30) + 
                 (CSAT Puanı × 0.30)
```

### Metrik Açıklamaları

1. **Çağrı Adedi (%20)**: En yüksek çağrı adedi olan temsilci en yüksek puanı alır
2. **Ortalama Konuşma Süresi (%20)**: En düşük konuşma süresi olan temsilci en yüksek puanı alır
3. **Audit Skoru (%30)**: 0-100 arası, en yüksek skor en yüksek puanı alır
4. **CSAT (%30)**: 0-5 arası, en yüksek skor en yüksek puanı alır

## Kullanım

1. Uygulamayı başlatın: `npm start`
2. JSON verilerinizi textarea'ya yapıştırın
3. "Hesapla" butonuna tıklayın
4. Sonuçları dashboard'da görüntüleyin

## JSON Veri Formatı

```json
{
  "MT Adı": "Adil Hanedan",
  "Audit Skoru": 55,
  "Toplam Çağrı Adedi": 343,
  "Ortalama Konuşma Süresi": "601,54",
  "Lokal Kapatma Oranı": "76,68%",
  "Kaçan Çağrılar": 2,
  "Çağrı Değerlendirme Ortalaması": "4,81",
  "Çağrı Değerlendirme Adet": 74
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

Bu proje Customer Success performans değerlendirmesi için geliştirilmiştir. # Deploy trigger
