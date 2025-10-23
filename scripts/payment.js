/*
  Payment page logic
  - Read service from query string and prefill
  - Keep price list mapping
  - Update summary as user changes
  - Fake processing flow (placeholder for real PSP)
*/

const SERVICE_PRICES = {
  'basic-package': 15000,
  'pro-package': 35000,
  'enterprise-package': 75000,
  'performance-ads': 2500,
  'seo-content': 1800,
  'web-design': 8500,
  'social-media': 1200,
  'ecommerce': 3500,
  'analytics': 800
};

const SERVICE_NAMES = {
  'basic-package': 'Başlangıç Paketi',
  'pro-package': 'Profesyonel Paketi',
  'enterprise-package': 'Kurumsal Paketi',
  'performance-ads': 'Performans Reklamları',
  'seo-content': 'SEO ve İçerik Stratejisi',
  'web-design': 'Web Tasarım & Geliştirme',
  'social-media': 'Sosyal Medya Yönetimi',
  'ecommerce': 'E‑ticaret Optimizasyonu',
  'analytics': 'Analytics & Raporlama'
};

document.addEventListener('DOMContentLoaded', () => {
  const url = new URL(window.location.href);
  const serviceParam = url.searchParams.get('service');
  const packageParam = url.searchParams.get('package');
  const yearlyParam = url.searchParams.get('yearly') === 'true';

  const serviceSelect = document.getElementById('serviceSelect');
  const amountInput = document.getElementById('amountInput');
  const summaryService = document.getElementById('summaryService');
  const summaryAmount = document.getElementById('summaryAmount');
  const form = document.getElementById('paymentForm');

  function format(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  }

  function setFromService(svc) {
    if (!SERVICE_PRICES[svc]) return;
    serviceSelect.value = svc;
    
    // Calculate price based on service and yearly option
    let price = SERVICE_PRICES[svc];
    
    // Apply yearly discount if applicable
    if (yearlyParam) {
      price = Math.round(price * 12 * 0.8); // 20% discount for yearly
    }
    
    amountInput.value = price;
    summaryService.textContent = SERVICE_NAMES[svc];
    summaryAmount.textContent = format(price);
  }

  // Initialize pricing toggle
  function initPricingToggle() {
    const monthlyToggle = document.getElementById('monthlyToggle');
    const yearlyToggle = document.getElementById('yearlyToggle');
    
    // Set initial state based on URL parameter
    if (yearlyParam) {
      yearlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all bg-brand-600 text-white';
      monthlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all text-black/70 dark:text-white/70 hover:text-brand-600';
    } else {
      monthlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all bg-brand-600 text-white';
      yearlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all text-black/70 dark:text-white/70 hover:text-brand-600';
    }
    
    monthlyToggle?.addEventListener('click', () => {
      monthlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all bg-brand-600 text-white';
      yearlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all text-black/70 dark:text-white/70 hover:text-brand-600';
      
      // Update current service price if it's a package
      const currentService = serviceSelect.value;
      if (currentService && currentService.includes('package')) {
        updateServicePrice(currentService, false);
      }
    });

    yearlyToggle?.addEventListener('click', () => {
      yearlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all bg-brand-600 text-white';
      monthlyToggle.className = 'px-6 py-3 rounded-xl text-sm font-medium transition-all text-black/70 dark:text-white/70 hover:text-brand-600';
      
      // Update current service price if it's a package
      const currentService = serviceSelect.value;
      if (currentService && currentService.includes('package')) {
        updateServicePrice(currentService, true);
      }
    });
  }

  // Update service price based on yearly/monthly selection
  function updateServicePrice(service, isYearly) {
    if (!SERVICE_PRICES[service]) return;
    
    let price = SERVICE_PRICES[service];
    
    if (isYearly && service.includes('package')) {
      price = Math.round(price * 12 * 0.8); // 20% discount for yearly packages
    }
    
    amountInput.value = price;
    summaryAmount.textContent = format(price);
  }

  // Initialize pricing toggle
  initPricingToggle();

  // Initialize payment method selection
  function initPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('input[name="method"]');
    const cardDetails = document.getElementById('cardDetails');
    const bankDetails = document.getElementById('bankDetails');
    const paymentOptions = document.querySelectorAll('.payment-method-option');

    // Handle payment method selection
    paymentMethods.forEach(method => {
      method.addEventListener('change', (e) => {
        const selectedMethod = e.target.value;
        
        // Update visual selection
        paymentOptions.forEach(option => {
          const optionMethod = option.dataset.method;
          if (optionMethod === selectedMethod) {
            option.classList.add('ring-brand-500', 'bg-brand-50', 'dark:bg-brand-900/20');
            option.classList.remove('ring-black/10', 'dark:ring-white/10');
          } else {
            option.classList.remove('ring-brand-500', 'bg-brand-50', 'dark:bg-brand-900/20');
            option.classList.add('ring-black/10', 'dark:ring-white/10');
          }
        });

        // Show/hide appropriate details
        if (selectedMethod === 'card') {
          cardDetails.classList.remove('hidden');
          bankDetails.classList.add('hidden');
          
          // Make card fields required
          const cardFields = cardDetails.querySelectorAll('input, select');
          cardFields.forEach(field => field.setAttribute('required', 'required'));
          
          // Remove required from bank fields
          const bankFields = bankDetails.querySelectorAll('input, select');
          bankFields.forEach(field => field.removeAttribute('required'));
          
        } else if (selectedMethod === 'bank') {
          cardDetails.classList.add('hidden');
          bankDetails.classList.remove('hidden');
          
          // Remove required from card fields
          const cardFields = cardDetails.querySelectorAll('input, select');
          cardFields.forEach(field => field.removeAttribute('required'));
          
          // Bank transfer doesn't need additional required fields
        }
      });
    });

    // Handle click on payment method options
    paymentOptions.forEach(option => {
      option.addEventListener('click', () => {
        const method = option.dataset.method;
        const radioButton = option.querySelector('input[type="radio"]');
        radioButton.checked = true;
        radioButton.dispatchEvent(new Event('change'));
      });
    });
  }

  // Initialize payment method selection
  initPaymentMethodSelection();

  // Prefill if query contains service
  if (serviceParam && SERVICE_PRICES[serviceParam]) {
    setFromService(serviceParam);
  } else {
    // default
    setFromService('performance-ads');
  }

  serviceSelect.addEventListener('change', () => {
    const svc = serviceSelect.value;
    let price = SERVICE_PRICES[svc] || 0;
    
    // Check current toggle state
    const yearlyToggle = document.getElementById('yearlyToggle');
    const isYearly = yearlyToggle && yearlyToggle.className.includes('bg-brand-600');
    
    // Apply yearly discount if applicable and it's a package
    if (isYearly && (svc.includes('package'))) {
      price = Math.round(price * 12 * 0.8); // 20% discount for yearly packages
    }
    
    amountInput.value = price;
    summaryService.textContent = SERVICE_NAMES[svc] || 'Hizmet';
    summaryAmount.textContent = format(price);
  });

  // Tutar input'unu readonly yap ve manuel değişiklikleri engelle
  amountInput.readOnly = true;
  amountInput.addEventListener('input', (e) => {
    // Tutarı geri eski haline getir
    const currentService = serviceSelect.value;
    if (SERVICE_PRICES[currentService]) {
      let price = SERVICE_PRICES[currentService];
      
      // Check current toggle state
      const yearlyToggle = document.getElementById('yearlyToggle');
      const isYearly = yearlyToggle && yearlyToggle.className.includes('bg-brand-600');
      
      // Apply yearly discount if applicable and it's a package
      if (isYearly && (currentService.includes('package'))) {
        price = Math.round(price * 12 * 0.8); // 20% discount for yearly packages
      }
      
      amountInput.value = price;
    }
    e.preventDefault();
  });

  // Tutar input'una tıklama olayını engelle
  amountInput.addEventListener('click', (e) => {
    e.preventDefault();
    amountInput.blur();
  });

  // Klavye olaylarını engelle
  amountInput.addEventListener('keydown', (e) => {
    e.preventDefault();
  });

  // Focus olayını engelle
  amountInput.addEventListener('focus', (e) => {
    e.preventDefault();
    amountInput.blur();
  });

  // Kart numarası formatlaması
  const cardNumberInput = document.querySelector('input[name="cardNumber"]');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  // CVV input formatlaması (sadece rakam)
  const cvvInput = document.querySelector('input[name="cvv"]');
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  // Kart sahibi formatlaması (sadece harf ve boşluk)
  const cardHolderInput = document.querySelector('input[name="cardHolder"]');
  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '').toUpperCase();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const firstName = String(fd.get('firstName') || '').trim();
    const lastName = String(fd.get('lastName') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const service = serviceSelect.value;
    const amount = Number(amountInput.value || 0);
    const method = fd.get('method');

     if (!firstName || !lastName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || amount < 100) {
       showResult('error', 'Eksik veya geçersiz bilgi', 'Lütfen tüm zorunlu alanları doldurun ve geçerli bir tutar girin.');
       return;
     }

     if (!method) {
       showResult('error', 'Ödeme yöntemi seçilmedi', 'Lütfen bir ödeme yöntemi seçin.');
       return;
     }

     // Validate card details if card payment is selected
     if (method === 'card') {
       const cardNumber = String(fd.get('cardNumber') || '').trim();
       const cardHolder = String(fd.get('cardHolder') || '').trim();
       const expMonth = String(fd.get('expMonth') || '').trim();
       const expYear = String(fd.get('expYear') || '').trim();
       const cvv = String(fd.get('cvv') || '').trim();

       if (!cardNumber || !cardHolder || !expMonth || !expYear || !cvv) {
         showResult('error', 'Kart bilgileri eksik', 'Lütfen tüm kart bilgilerini doldurun.');
         return;
       }

       // Kart numarası validasyonu (16 haneli)
       const cleanCardNumber = cardNumber.replace(/\s/g, '');
       if (cleanCardNumber.length !== 16) {
         showResult('error', 'Geçersiz kart numarası', 'Kart numarası 16 haneli olmalıdır.');
         return;
       }

       // CVV validasyonu (3-4 haneli)
       if (cvv.length < 3 || cvv.length > 4) {
         showResult('error', 'Geçersiz CVV', 'CVV kodu 3-4 haneli olmalıdır.');
         return;
       }
     }

    showProcessing(true);
    try {
      // PLACEHOLDER: Burada gerçek ödeme sağlayıcısına yönlendirme veya tokenizasyon yapılır.
      // Şimdilik demo akışı: 1.2 saniye bekletip başarılı gösteriyoruz.
      await new Promise((r) => setTimeout(r, 1200));
      showResult('success', 'Ödeme Başarılı', `${SERVICE_NAMES[service]} için ${format(amount)} ödemeniz alındı. Size kısa süre içinde ulaşacağız.`);
    } catch (err) {
      showResult('error', 'Ödeme Hatası', 'Bir sorun oluştu, lütfen tekrar deneyin.');
    } finally {
      showProcessing(false);
    }
  });
});

function showProcessing(show) {
  const modal = document.getElementById('processingModal');
  if (!modal) return;
  modal.classList.toggle('hidden', !show);
}

function showResult(type, title, text) {
  const modal = document.getElementById('resultModal');
  const icon = document.getElementById('resultIcon');
  const mTitle = document.getElementById('resultTitle');
  const mText = document.getElementById('resultText');
  const closeBtn = document.getElementById('closeResult');

  icon.className = 'w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center ' + (type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30');
  icon.innerHTML = type === 'success'
    ? '<svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    : '<svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>';
  mTitle.textContent = title;
  mText.textContent = text;

  modal.classList.remove('hidden');
  closeBtn.onclick = () => modal.classList.add('hidden');
}


