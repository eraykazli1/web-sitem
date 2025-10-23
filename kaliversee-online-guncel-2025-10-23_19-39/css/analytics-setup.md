# Google Analytics Kurulum Rehberi

## 🚀 Adım 1: Google Analytics Hesabı Oluşturma

1. [Google Analytics](https://analytics.google.com/) sitesine gidin
2. "Start measuring" butonuna tıklayın
3. Hesap adı: "Kalı Dijital Marketing Agency"
4. Web sitesi adı: "kaliversee.online"
5. Web sitesi URL'i: "https://kaliversee.online"
6. Sektör: "Business and Industrial Markets" > "Marketing and Advertising"
7. Zaman dilimi: "Turkey (GMT+03:00)"

## 📊 Adım 2: Measurement ID Alma

1. Analytics dashboard'da "Admin" (⚙️) simgesine tıklayın
2. "Data Streams" > "Web" seçin
3. "kaliversee.online" stream'ini seçin
4. "Measurement ID" kopyalayın (G-XXXXXXXXXX formatında)

## 🔧 Adım 3: Kodu Güncelleme

`index.html` dosyasında şu satırı bulun:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

`GA_MEASUREMENT_ID` kısmını gerçek Measurement ID ile değiştirin:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

Aynı şekilde `gtag('config', 'GA_MEASUREMENT_ID', ...)` satırlarında da değiştirin.

## 🎯 Adım 4: Gelişmiş Ayarlar

### Custom Events (Özel Etkinlikler)
```javascript
// Form gönderimi takibi
gtag('event', 'form_submit', {
  'event_category': 'engagement',
  'event_label': 'contact_form'
});

// Buton tıklama takibi
gtag('event', 'click', {
  'event_category': 'engagement',
  'event_label': 'cta_button'
});

// Scroll derinliği takibi
gtag('event', 'scroll', {
  'event_category': 'engagement',
  'event_label': 'scroll_depth',
  'value': 75
});
```

### Enhanced Ecommerce (Gelişmiş E-ticaret)
```javascript
// Hizmet görüntüleme
gtag('event', 'view_item', {
  'currency': 'TRY',
  'value': 5000,
  'items': [{
    'item_id': 'seo-service',
    'item_name': 'SEO Hizmeti',
    'category': 'Digital Marketing',
    'price': 5000
  }]
});
```

## 📱 Adım 5: Google Search Console Entegrasyonu

1. [Google Search Console](https://search.google.com/search-console/) gidin
2. "Add Property" > "URL prefix" seçin
3. "https://kaliversee.online" ekleyin
4. HTML tag doğrulaması yapın
5. Analytics ile bağlayın

## 🔍 Adım 6: Conversion Tracking

### Hedefler (Goals) Oluşturma
1. Analytics > Admin > Goals
2. "Custom" > "Event" seçin
3. Hedef adı: "Contact Form Submission"
4. Event Category: "engagement"
5. Event Action: "form_submit"

### E-commerce Tracking
```javascript
// Satış tamamlama
gtag('event', 'purchase', {
  'transaction_id': 'ORDER_123',
  'value': 5000,
  'currency': 'TRY',
  'items': [{
    'item_id': 'seo-package',
    'item_name': 'SEO Paketi',
    'category': 'Digital Marketing',
    'quantity': 1,
    'price': 5000
  }]
});
```

## 📊 Adım 7: Dashboard Kurulumu

### Önemli Metrikler
- **Kullanıcılar**: Toplam ziyaretçi sayısı
- **Sessions**: Oturum sayısı
- **Bounce Rate**: Hemen çıkma oranı
- **Average Session Duration**: Ortalama oturum süresi
- **Pages per Session**: Sayfa başına oturum
- **Conversion Rate**: Dönüşüm oranı

### Özel Raporlar
1. **Traffic Sources**: Trafik kaynakları analizi
2. **Behavior Flow**: Kullanıcı davranış akışı
3. **Site Speed**: Sayfa yükleme hızları
4. **Mobile Performance**: Mobil performans
5. **Real-time**: Gerçek zamanlı ziyaretçi verileri

## 🚨 Adım 8: GDPR Uyumluluğu

### Cookie Consent
```javascript
// Kullanıcı çerez onayı verdiğinde
if (userConsentedToAnalytics) {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
} else {
  gtag('consent', 'update', {
    'analytics_storage': 'denied'
  });
}
```

### Privacy Policy Güncelleme
KVKK sayfanızda Analytics kullanımı hakkında bilgi ekleyin:
- Hangi verilerin toplandığı
- Verilerin nasıl kullanıldığı
- Kullanıcı hakları
- Veri silme talepleri

## ✅ Adım 9: Test ve Doğrulama

### Google Analytics Debugger
1. Chrome'da "Google Analytics Debugger" eklentisini yükleyin
2. Sitenizi ziyaret edin
3. Console'da Analytics verilerini kontrol edin

### Real-time Raporu
1. Analytics > Real-time > Overview
2. Sitenizi farklı cihazlardan ziyaret edin
3. Verilerin gerçek zamanlı geldiğini doğrulayın

## 📈 Adım 10: İyileştirme Önerileri

### A/B Testing
- Farklı CTA butonları test edin
- Sayfa düzenlerini karşılaştırın
- Form alanlarını optimize edin

### Heatmap Analizi
- Hotjar veya Crazy Egg kullanın
- Kullanıcı davranışlarını analiz edin
- Scroll ve tıklama haritalarını inceleyin

### Performance Monitoring
- Core Web Vitals takibi
- Sayfa yükleme hızları
- Mobil performans optimizasyonu

---

**Not**: Bu rehberi takip ettikten sonra, Analytics verilerinin 24-48 saat içinde görünmeye başlayacağını unutmayın. İlk veriler için sabırlı olun!
