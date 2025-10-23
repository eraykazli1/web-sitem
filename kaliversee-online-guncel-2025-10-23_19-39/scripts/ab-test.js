/**
 * A/B Test Framework for kaliversee.online
 * Simple A/B testing system for CTA buttons, headlines, and pricing
 */

class ABTest {
  constructor(testName, variants, testDuration = 30) {
    this.testName = testName;
    this.variants = variants;
    this.testDuration = testDuration; // days
    this.storageKey = `ab_test_${testName}`;
    this.resultsKey = `ab_results_${testName}`;
    
    this.init();
  }
  
  init() {
    // Check if test is still valid
    if (this.isTestExpired()) {
      this.cleanup();
      return;
    }
    
    // Get or assign variant
    this.selectedVariant = this.getVariant();
    this.applyVariant();
    
    // Track test start
    this.trackEvent('test_start');
  }
  
  getVariant() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      return data.variant;
    }
    
    // Randomly assign variant
    const random = Math.random();
    const variant = random < 0.5 ? 'A' : 'B';
    
    // Store with timestamp
    localStorage.setItem(this.storageKey, JSON.stringify({
      variant: variant,
      timestamp: Date.now()
    }));
    
    return variant;
  }
  
  applyVariant() {
    const elements = document.querySelectorAll(`[data-ab-test="${this.testName}"]`);
    elements.forEach(element => {
      element.classList.add(`variant-${this.selectedVariant}`);
      
      // Apply variant-specific content
      const variantContent = this.variants[this.selectedVariant];
      if (variantContent) {
        this.updateElementContent(element, variantContent);
      }
    });
  }
  
  updateElementContent(element, content) {
    if (content.text) {
      element.textContent = content.text;
    }
    if (content.html) {
      element.innerHTML = content.html;
    }
    if (content.className) {
      element.className = content.className;
    }
    if (content.href) {
      element.href = content.href;
    }
  }
  
  trackEvent(eventType, additionalData = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test', {
        event_category: 'experimentation',
        event_label: `${this.testName}_${eventType}`,
        test_name: this.testName,
        variant: this.selectedVariant,
        event_type: eventType,
        ...additionalData
      });
    }
    
    // Store results locally
    this.storeResult(eventType, additionalData);
  }
  
  storeResult(eventType, data) {
    const results = JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
    results.push({
      timestamp: Date.now(),
      eventType,
      variant: this.selectedVariant,
      data
    });
    localStorage.setItem(this.resultsKey, JSON.stringify(results));
  }
  
  isTestExpired() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    const daysSinceStart = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
    return daysSinceStart > this.testDuration;
  }
  
  cleanup() {
    localStorage.removeItem(this.storageKey);
    // Keep results for analysis
  }
  
  getResults() {
    return JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
  }
}

// Initialize A/B Tests when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Test 1: Hero CTA Button
  new ABTest('hero_cta', {
    A: {
      text: 'Ücretsiz SEO Analizi',
      className: 'btn-grad btn-grad-secondary group relative overflow-hidden'
    },
    B: {
      text: 'Hemen Başlayalım',
      className: 'btn-grad btn-grad-primary group relative overflow-hidden'
    }
  });
  
  // Test 2: Hero Headline
  new ABTest('hero_headline', {
    A: {
      html: 'Profesyonel <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal to-lime">web tasarım</span> ve <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal via-lime to-brand-600">dijital pazarlama</span> çözümleri'
    },
    B: {
      html: 'Modern <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal to-lime">web siteleri</span> tasarlıyoruz. <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal via-lime to-brand-600">5-7 gün</span> teslimat!'
    }
  });
  
  // Test 3: Service Package Pricing Display
  new ABTest('pricing_display', {
    A: {
      // Original pricing display
    },
    B: {
      // Emphasize "Starting from" pricing
    }
  });
  
  // Test 4: Contact Form CTA
  new ABTest('contact_cta', {
    A: {
      text: 'Teklif Al'
    },
    B: {
      text: 'Ücretsiz Danışmanlık'
    }
  });
  
  // Track CTA clicks for A/B test analysis
  document.addEventListener('click', function(e) {
    const ctaButton = e.target.closest('[data-ab-test]');
    if (ctaButton) {
      const testName = ctaButton.getAttribute('data-ab-test');
      const test = window.abTests?.[testName];
      if (test) {
        test.trackEvent('cta_click', {
          button_text: ctaButton.textContent.trim(),
          button_location: ctaButton.closest('section')?.id || 'unknown'
        });
      }
    }
  });
  
  // Track form submissions
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const test = window.abTests?.['contact_cta'];
      if (test) {
        test.trackEvent('form_submit', {
          form_type: 'contact',
          service_type: this.querySelector('select[name="service"]')?.value || 'general'
        });
      }
    });
  }
  
  // Store test instances for external access
  window.abTests = {
    hero_cta: new ABTest('hero_cta', {
      A: { text: 'Ücretsiz SEO Analizi' },
      B: { text: 'Hemen Başlayalım' }
    }),
    hero_headline: new ABTest('hero_headline', {
      A: { html: 'Profesyonel web tasarım ve dijital pazarlama çözümleri' },
      B: { html: 'Modern web siteleri tasarlıyoruz. 5-7 gün teslimat!' }
    })
  };
});

// Utility function to get test results
function getABTestResults(testName) {
  const results = JSON.parse(localStorage.getItem(`ab_results_${testName}`) || '[]');
  return results;
}

// Utility function to get test performance
function getABTestPerformance(testName) {
  const results = getABTestResults(testName);
  const variants = {};
  
  results.forEach(result => {
    if (!variants[result.variant]) {
      variants[result.variant] = {
        impressions: 0,
        clicks: 0,
        conversions: 0
      };
    }
    
    if (result.eventType === 'test_start') {
      variants[result.variant].impressions++;
    } else if (result.eventType === 'cta_click') {
      variants[result.variant].clicks++;
    } else if (result.eventType === 'form_submit') {
      variants[result.variant].conversions++;
    }
  });
  
  // Calculate rates
  Object.keys(variants).forEach(variant => {
    const data = variants[variant];
    data.clickRate = data.impressions > 0 ? (data.clicks / data.impressions * 100).toFixed(2) : 0;
    data.conversionRate = data.clicks > 0 ? (data.conversions / data.clicks * 100).toFixed(2) : 0;
  });
  
  return variants;
}

// Export for external use
window.ABTest = ABTest;
window.getABTestResults = getABTestResults;
window.getABTestPerformance = getABTestPerformance;
