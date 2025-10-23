/**
 * Security Validation Script for kaliversee.online
 * Client-side security enhancements and validation
 */

// CSRF Token Generation
function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Form Security Enhancement
function enhanceFormSecurity() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Add CSRF token
    const tokenField = form.querySelector('input[name="_token"]');
    if (tokenField) {
      tokenField.value = generateCSRFToken();
    }
    
    // Rate limiting
    let submitCount = 0;
    const maxSubmits = 5;
    const timeWindow = 60000; // 1 minute
    
    form.addEventListener('submit', function(e) {
      submitCount++;
      
      if (submitCount > maxSubmits) {
        e.preventDefault();
        alert('Çok fazla form gönderimi yaptınız. Lütfen 1 dakika bekleyin.');
        return false;
      }
      
      // Reset counter after time window
      setTimeout(() => {
        submitCount = Math.max(0, submitCount - 1);
      }, timeWindow);
    });
    
    // Input validation
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(this);
      });
    });
  });
}

// Input Validation
function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  const name = input.name;
  
  // Remove existing error classes
  input.classList.remove('border-red-500', 'bg-red-50');
  
  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showInputError(input, 'Geçerli bir e-posta adresi girin');
      return false;
    }
  }
  
  // Phone validation
  if (type === 'tel' && value) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      showInputError(input, 'Geçerli bir telefon numarası girin');
      return false;
    }
  }
  
  // Name validation
  if (name === 'name' && value) {
    if (value.length < 2) {
      showInputError(input, 'Ad en az 2 karakter olmalıdır');
      return false;
    }
    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(value)) {
      showInputError(input, 'Ad sadece harf içerebilir');
      return false;
    }
  }
  
  return true;
}

// Show Input Error
function showInputError(input, message) {
  input.classList.add('border-red-500', 'bg-red-50');
  
  // Remove existing error message
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message text-red-500 text-sm mt-1';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
}

// XSS Protection
function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Content Security Policy Violation Handler
function setupCSPViolationHandler() {
  document.addEventListener('securitypolicyviolation', function(e) {
    console.warn('CSP Violation:', e.violatedDirective, e.blockedURI);
    
    // Log to analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'csp_violation', {
        event_category: 'security',
        event_label: e.violatedDirective,
        value: 1
      });
    }
  });
}

// HTTPS Enforcement
function enforceHTTPS() {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace('https:' + window.location.href.substring(window.location.protocol.length));
  }
}

// Initialize Security Features
document.addEventListener('DOMContentLoaded', function() {
  // Enforce HTTPS
  enforceHTTPS();
  
  // Enhance form security
  enhanceFormSecurity();
  
  // Setup CSP violation handler
  setupCSPViolationHandler();
  
  // Add security headers to all forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.setAttribute('autocomplete', 'on');
    form.setAttribute('novalidate', 'true');
  });
  
  // Sanitize all text inputs on blur
  const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
  textInputs.forEach(input => {
    input.addEventListener('blur', function() {
      this.value = sanitizeInput(this.value);
    });
  });
});

// Export for testing
window.SecurityValidation = {
  generateCSRFToken,
  validateInput,
  sanitizeInput,
  enhanceFormSecurity
};
