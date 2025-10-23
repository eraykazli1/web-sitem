# Google Ads ve Tracking Kurulum Kılavuzu

Bu kılavuz, kaliversee.online web sitesinde Google Ads, Facebook Pixel ve diğer tracking araçlarının nasıl kurulacağını adım adım açıklar.

## 📋 Gerekli Bilgiler

Kurulum için aşağıdaki ID'leri almanız gerekiyor:

- **Google Analytics 4 Measurement ID** (G-XXXXXXXXXX)
- **Google Ads Conversion ID** (AW-XXXXXXXXX)
- **Facebook Pixel ID** (XXXXXXXXXXXXXXX)
- **Microsoft Clarity ID** (XXXXXXXXXX)

## 🔧 Kurulum Adımları

### 1. Google Analytics 4 (GA4) Kurulumu

1. [Google Analytics](https://analytics.google.com/) hesabınıza giriş yapın
2. Yeni bir özellik oluşturun veya mevcut özelliği seçin
3. **Yönetici** > **Veri Akışları** > **Web** seçin
4. Web sitesi URL'nizi girin: `https://kaliversee.online`
5. **Ölçüm Kimliği**'ni kopyalayın (G-XXXXXXXXXX formatında)

**Kodda değiştirilecek yer:**
```html
<!-- Satır 94'te -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```
`GA_MEASUREMENT_ID` yerine kendi ID'nizi yazın.

### 2. Google Ads Conversion Tracking

1. [Google Ads](https://ads.google.com/) hesabınıza giriş yapın
2. **Araçlar ve Ayarlar** > **Ölçüm** > **Dönüşümler** seçin
3. **+** butonuna tıklayın ve **Web sitesi** seçin
4. Dönüşüm eylemini adlandırın: "Web Sitesi Ziyareti"
5. **Dönüşüm değeri** ve **Dönüşüm kategorisi** ayarlayın
6. **Etiket oluştur** butonuna tıklayın
7. **Etiket kodu**'nu kopyalayın

**Kodda değiştirilecek yerler:**
```html
<!-- Satır 110'da -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID"></script>

<!-- Satır 1914'te -->
'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
```
`AW-CONVERSION_ID` ve `CONVERSION_LABEL` yerine kendi değerlerinizi yazın.

### 3. Facebook Pixel Kurulumu

1. [Facebook Business Manager](https://business.facebook.com/) hesabınıza giriş yapın
2. **Olay Yöneticisi** > **Veri Kaynakları** > **Piksel** seçin
3. Yeni piksel oluşturun veya mevcut pikseli seçin
4. **Piksel Kimliği**'ni kopyalayın

**Kodda değiştirilecek yerler:**
```html
<!-- Satır 128'de -->
fbq('init', 'PIXEL_ID');

<!-- Satır 132'de -->
src="https://www.facebook.com/tr?id=PIXEL_ID&ev=PageView&noscript=1"
```
`PIXEL_ID` yerine kendi ID'nizi yazın.

### 4. Microsoft Clarity Kurulumu

1. [Microsoft Clarity](https://clarity.microsoft.com/) hesabınıza giriş yapın
2. **Yeni proje oluştur** butonuna tıklayın
3. Proje adını girin: "kaliversee.online"
4. Web sitesi URL'nizi girin: `https://kaliversee.online`
5. **Proje oluştur** butonuna tıklayın
6. **Kurulum** sekmesinden **Clarity kodu**'nu kopyalayın

**Kodda değiştirilecek yer:**
```html
<!-- Satır 141'de -->
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "CLARITY_ID");
```
`CLARITY_ID` yerine kendi ID'nizi yazın.

## 🧪 Test Etme

### 1. Google Analytics Testi

1. Web sitenizi ziyaret edin
2. **F12** tuşuna basarak Developer Tools'u açın
3. **Console** sekmesine gidin
4. `gtag` yazın ve Enter'a basın
5. Eğer fonksiyon tanımlıysa, GA4 düzgün çalışıyor demektir

### 2. Google Ads Conversion Testi

1. Web sitesinde bir form doldurun veya CTA butonuna tıklayın
2. Google Ads hesabınıza gidin
3. **Araçlar ve Ayarlar** > **Ölçüm** > **Dönüşümler** seçin
4. Dönüşümlerinizi kontrol edin (1-2 saat sürebilir)

### 3. Facebook Pixel Testi

1. [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome eklentisini yükleyin
2. Web sitenizi ziyaret edin
3. Eklenti simgesine tıklayın
4. Pixel'in düzgün yüklendiğini kontrol edin

### 4. Microsoft Clarity Testi

1. Web sitenizi ziyaret edin
2. Clarity hesabınıza gidin
3. **Kayıtlar** sekmesini kontrol edin
4. Ziyaretçi kayıtlarını görebiliyorsanız, Clarity düzgün çalışıyor demektir

## 📊 A/B Test Sistemi

Web sitesinde A/B test sistemi kurulmuştur. Test sonuçlarını görmek için:

1. Web sitesinde **F12** tuşuna basın
2. **Console** sekmesine gidin
3. Aşağıdaki komutları yazın:

```javascript
// Tüm test sonuçlarını görüntüle
getABTestResults('hero_cta')

// Test performansını analiz et
getABTestPerformance('hero_cta')
```

## 🔍 Sorun Giderme

### Yaygın Sorunlar

1. **Tracking kodları çalışmıyor**
   - ID'lerin doğru yazıldığından emin olun
   - Tarayıcı cache'ini temizleyin
   - Ad blocker'ı kapatın

2. **Conversion tracking çalışmıyor**
   - Google Ads hesabında dönüşüm eyleminin aktif olduğundan emin olun
   - 24-48 saat bekleyin (veriler gecikmeli gelebilir)

3. **Facebook Pixel çalışmıyor**
   - Pixel Helper eklentisini kullanın
   - Facebook Business Manager'da pixel'in doğru kurulduğunu kontrol edin

### Destek

Herhangi bir sorun yaşarsanız:
- **E-posta:** kalidijitalmarketingagency@gmail.com
- **WhatsApp:** +90 553 710 22 95

## 📈 Performans İzleme

Kurulum tamamlandıktan sonra aşağıdaki metrikleri izleyin:

- **Google Analytics:** Ziyaretçi sayısı, sayfa görüntüleme, dönüşüm oranı
- **Google Ads:** Tıklama oranı (CTR), dönüşüm maliyeti, ROAS
- **Facebook Pixel:** Etkileşim oranı, lead sayısı
- **Clarity:** Kullanıcı davranışları, heatmap'ler

## ✅ Kontrol Listesi

- [ ] Google Analytics 4 ID'si eklendi
- [ ] Google Ads Conversion ID'si eklendi
- [ ] Facebook Pixel ID'si eklendi
- [ ] Microsoft Clarity ID'si eklendi
- [ ] Tüm tracking kodları test edildi
- [ ] A/B test sistemi çalışıyor
- [ ] Form submission tracking çalışıyor
- [ ] CTA button tracking çalışıyor

---

**Not:** Bu kılavuz, kaliversee.online web sitesi için özel olarak hazırlanmıştır. Diğer web siteleri için uyarlanması gerekebilir.
