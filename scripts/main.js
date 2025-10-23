/* Akay Dijital Pazarlama - main.js - Performance Optimized */

// Performance optimizations
(function() {
  // Optimized video preloading (only when needed)
  const preloadVideosOnDemand = () => {
    const videoSources = [
      './9694447-hd_1920_1080_25fps.mp4',
      './19705424-hd_1920_1080_24fps.mp4'
    ];
    
    // Only preload videos after user interaction or when they're about to be visible
    const preloadVideo = (src) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    };
    
    // Preload first video immediately, others on demand
    if (videoSources[0]) {
      preloadVideo(videoSources[0]);
    }
  };
  
  // Optimize video loading with lazy loading
  const optimizeVideos = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // Set up lazy loading for videos with data-src
      if (video.dataset.src && !video.src) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.src = video.dataset.src;
              video.preload = 'metadata';
              video.load();
              observer.unobserve(video);
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(video);
      }
      
      // Handle autoplay videos
      if (video.hasAttribute('data-autoplay-video')) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (video.preload === 'none') {
                video.preload = 'metadata';
                video.load();
              }
              observer.unobserve(video);
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(video);
      }
    });
  };
  
  // Optimize images with lazy loading
  const optimizeImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { threshold: 0.1 });
    
    images.forEach(img => imageObserver.observe(img));
  };

  // Debug logo loading
  const debugLogoLoading = () => {
    const logoImages = document.querySelectorAll('img[alt*="Akay Dijital Pazarlama logo"]');
    logoImages.forEach((img, index) => {
      img.addEventListener('load', () => {
        console.log(`Logo ${index + 1} loaded successfully`);
      });
      img.addEventListener('error', (e) => {
        console.error(`Logo ${index + 1} failed to load:`, e);
      });
      
      // Check if src is accessible (removed fetch to avoid CORS issues)
      console.log(`Logo ${index + 1} source:`, img.src);
    });
  };

  // Initialize optimizations with performance priority
  preloadVideosOnDemand();
  optimizeVideos();
  optimizeImages();
  debugLogoLoading();
  
  // Lazy load non-critical resources after initial load
  setTimeout(() => {
    // Additional optimizations can be added here if needed
    console.log('Site fully loaded and optimized');
  }, 2000);
})();

// Loader hide after 1.7 seconds
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity .5s ease';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, 1700);
  initVideoLayer();
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});

// Dark mode
(function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');

  if (!themeToggle) {
    console.error('Theme toggle button not found');
    return;
  }

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    if (iconSun) iconSun.style.display = isDark ? 'none' : 'block';
    if (iconMoon) iconMoon.style.display = isDark ? 'block' : 'none';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    console.log('Theme applied:', isDark ? 'dark' : 'light');
  };

  const saved = localStorage.getItem('theme');
  // Check system preference if no saved preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // Default to dark mode if no saved preference
  const isDark = saved ? saved === 'dark' : true;
  
  // Apply theme immediately
  applyTheme(isDark);

  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const nowDark = !document.documentElement.classList.contains('dark');
    applyTheme(nowDark);
  });

  console.log('Dark mode initialized. Current theme:', isDark ? 'dark' : 'light');
})();

// Lottie Hero
(function initLottie() {
  const container = document.getElementById('lottie-hero');
  if (!container || !window.lottie) return;
  window.lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets10.lottiefiles.com/packages/lf20_4kx2q32n.json'
  });
})();

// GSAP animations
function initGSAP() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Reveal animations
  const revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    });
  });

  // Parallax for background blobs
  const pxEls = document.querySelectorAll('[data-parallax]');
  pxEls.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed') || '0.3');
    gsap.to(el, {
      yPercent: 20 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  });
}
window.addEventListener('DOMContentLoaded', initGSAP);

// Background video controls with lazy loading
function initVideoLayer() {
  const video = document.getElementById('siteVideo');
  if (!video) return;
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    video.pause();
    video.removeAttribute('autoplay');
    video.currentTime = 0;
    return;
  }
  
  // Lazy load video when user scrolls or interacts
  const loadVideo = () => {
    if (video.preload === 'none') {
      video.preload = 'metadata';
      video.load();
    }
  };
  
  // Load video on first user interaction
  const onFirstInteraction = () => {
    loadVideo();
    video.play().catch((error) => {
      // Silently handle autoplay errors
      console.debug('Video autoplay failed:', error.message);
    });
    document.removeEventListener('pointerdown', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
  };
  
  // Load video when it comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadVideo();
        observer.unobserve(video);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(video);
  
  // Also load on user interaction
  document.addEventListener('pointerdown', onFirstInteraction, { once: true });
  document.addEventListener('keydown', onFirstInteraction, { once: true });

  // Handle page visibility changes with better playback control
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause(); 
    } else {
      // Resume playing when tab becomes visible
      setTimeout(() => {
        if (video.paused && !video.ended) {
          video.play().catch((error) => {
            console.debug('Video resume failed:', error.message);
          });
        }
      }, 100);
    }
  });

  // Ensure continuous playback
  video.addEventListener('pause', () => {
    if (!document.hidden && !video.ended) {
      setTimeout(() => {
        video.play().catch((error) => {
          console.debug('Video pause resume failed:', error.message);
        });
      }, 100);
    }
  });

  // Handle video end and restart
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch((error) => {
      console.debug('Video restart failed:', error.message);
    });
  });

  // Periodic check to ensure video is playing
  setInterval(() => {
    if (!document.hidden && video.paused && !video.ended && video.readyState >= 2) {
      video.play().catch((error) => {
        console.debug('Video periodic play failed:', error.message);
      });
    }
  }, 3000);
}

// Observe featured video visibility and pause/resume
(() => {
  const vid = document.getElementById('featureVideo');
  if (!vid) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { vid.pause(); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
          vid.play().catch((error) => {
            console.debug('Featured video play failed:', error.message);
          });
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.2 });
  io.observe(vid);
})();

// Generic observer for inline blog videos
(() => {
  const vids = Array.from(document.querySelectorAll('[data-autoplay-video]'));
  if (!vids.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const v = entry.target;
      if (prefersReduced) { v.pause(); return; }
      if (entry.isIntersecting) {
        v.play().catch((error) => {
          console.debug('Autoplay video play failed:', error.message);
        });
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.3 });
  vids.forEach(v => io.observe(v));
})();

// Cookie Policy modal controls
(() => {
  const modal = document.getElementById('cookieModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open="cookieModal"]');
  const closers = modal.querySelectorAll('[data-close]');
  const show = () => { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; };
  const hide = () => { modal.classList.add('hidden'); document.body.style.overflow = ''; };
  openers.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); show(); }));
  closers.forEach(btn => btn.addEventListener('click', hide));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) hide(); });
})();

// KVKK modal controls
(() => {
  const modal = document.getElementById('kvkkModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open="kvkkModal"]');
  const closers = modal.querySelectorAll('[data-close]');
  const show = () => { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; };
  const hide = () => { modal.classList.add('hidden'); document.body.style.overflow = ''; };
  openers.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); show(); }));
  closers.forEach(btn => btn.addEventListener('click', hide));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) hide(); });
})();

// Micro interaction: ripple cursor position
document.addEventListener('pointerdown', (e) => {
  const target = e.target.closest('button, a.btn-grad');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  target.style.setProperty('--x', `${x}%`);
  target.style.setProperty('--y', `${y}%`);
  // Click press animation
  target.classList.remove('btn-press');
  // Force reflow to restart animation
  void target.offsetWidth;
  target.classList.add('btn-press');
});

// Blog category filter
(() => {
  const categoryButtons = document.querySelectorAll('.blog-category');
  const blogCards = document.querySelectorAll('.blog-card');
  
  if (!categoryButtons.length || !blogCards.length) return;
  
  // Blog data with categories
  const blogData = [
    { element: blogCards[0], categories: ['performans-pazarlama'] },
    { element: blogCards[1], categories: ['seo'] },
    { element: blogCards[2], categories: ['web-tasarim'] }
  ];
  
  // Category mapping
  const categoryMap = {
    'tümü': 'all',
    'seo': 'seo',
    'performans-pazarlama': 'performans-pazarlama',
    'web-tasarım': 'web-tasarim',
    'analytics': 'analytics'
  };
  
  // Filter function
  const filterBlogs = (selectedCategory) => {
    blogCards.forEach((card, index) => {
      const blog = blogData[index];
      if (!blog) return;
      
      const shouldShow = selectedCategory === 'all' || 
                        blog.categories.includes(selectedCategory);
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Animate in
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      } else {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };
  
  // Add click handlers
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white');
        btn.classList.add('bg-white/70', 'dark:bg-white/5', 'text-black/70', 'dark:text-white/70');
      });
      
      // Add active class to clicked button
      button.classList.remove('bg-white/70', 'dark:bg-white/5', 'text-black/70', 'dark:text-white/70');
      button.classList.add('bg-brand-600', 'text-white');
      
      // Get category from button text
      const buttonText = button.textContent.trim().toLowerCase();
      const category = categoryMap[buttonText] || 'all';
      
      // Filter blogs
      filterBlogs(category);
    });
  });
  
  // Initialize with "Tümü" selected
  const allButton = Array.from(categoryButtons).find(btn => 
    btn.textContent.trim().toLowerCase() === 'tümü'
  );
  if (allButton) {
    allButton.classList.remove('bg-white/70', 'dark:bg-white/5', 'text-black/70', 'dark:text-white/70');
    allButton.classList.add('bg-brand-600', 'text-white');
  }
})();

// Form validation and submission
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const budget = String(formData.get('budget') || '').trim();
    const message = String(formData.get('message') || '').trim();
    
    // Validation
    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('Lütfen tüm zorunlu alanları doldurun ve geçerli bir e-posta adresi girin.', 'error');
      return;
    }
    
    const btn = form.querySelector('button[type="submit"]');
    const original = btn?.textContent;
    if (btn) {
      btn.textContent = 'Gönderiliyor...';
      btn.disabled = true;
    }
    
    try {
      const response = await fetch(form.getAttribute('action') || '', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          company: company,
          service: service,
          budget: budget,
          message: message,
          _subject: 'Akay Dijital Pazarlama İletişim Formu - Yeni Mesaj',
          _template: 'table',
          _captcha: false,
          _honey: ''
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Form submission error:', errorData);
        throw new Error('Gönderim başarısız');
      }
      
      form.reset();
      showNotification('Teşekkürler! Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.', 'success');
      
      // Analytics event (if available)
      if (typeof gtag !== 'undefined') {
        trackFormSubmission('contact_form', service, budget);
      }
      
    } catch (err) {
      console.error('Form submission error:', err);
      showNotification('Bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan torcherrllc@gmail.com adresine e-posta gönderin.', 'error');
    } finally {
      if (btn) {
        btn.textContent = original || 'Gönder';
        btn.disabled = false;
      }
    }
  });
})();

// Mobile menu functionality
(() => {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  const menuIcon = document.getElementById('menuIcon');
  const closeIcon = document.getElementById('closeIcon');

  if (!mobileMenuButton || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    document.body.style.overflow = '';
  };

  mobileMenuButton.addEventListener('click', openMenu);
  mobileMenuClose.addEventListener('click', closeMenu);
  mobileMenuBackdrop.addEventListener('click', closeMenu);

  // Close menu when clicking on navigation links
  const mobileNavLinks = mobileMenu.querySelectorAll('nav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  });
})();

// Cookie consent management
(() => {
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieModal = document.getElementById('cookieModal');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieSettings = document.getElementById('cookieSettings');
  const cookieReject = document.getElementById('cookieReject');
  const cookieModalClose = document.getElementById('cookieModalClose');
  const cookieModalBackdrop = document.getElementById('cookieModalBackdrop');
  const saveCookieSettings = document.getElementById('saveCookieSettings');
  const acceptAllCookies = document.getElementById('acceptAllCookies');
  const analyticsCookies = document.getElementById('analyticsCookies');
  const marketingCookies = document.getElementById('marketingCookies');

  if (!cookieBanner) return;

  // Check if user has already made a choice
  const hasConsented = localStorage.getItem('cookieConsent');
  
  if (!hasConsented) {
    // Show banner after a short delay
    setTimeout(() => {
      cookieBanner.classList.remove('hidden');
    }, 2000);
  }

  // Accept all cookies
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }));
    cookieBanner.classList.add('hidden');
    cookieModal.classList.add('hidden');
    
    // Initialize analytics if accepted
    initializeAnalytics();
    showNotification('Çerez tercihleriniz kaydedildi.', 'success');
  };

  // Reject all non-essential cookies
  const rejectAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }));
    cookieBanner.classList.add('hidden');
    cookieModal.classList.add('hidden');
    showNotification('Sadece gerekli çerezler kabul edildi.', 'info');
  };

  // Save custom settings
  const saveSettings = () => {
    const settings = {
      necessary: true,
      analytics: analyticsCookies.checked,
      marketing: marketingCookies.checked,
      timestamp: Date.now()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(settings));
    cookieModal.classList.add('hidden');
    
    if (settings.analytics) {
      initializeAnalytics();
    }
    
    showNotification('Çerez tercihleriniz kaydedildi.', 'success');
  };

  // Initialize analytics (placeholder for Google Analytics, etc.)
  const initializeAnalytics = () => {
    // Here you would initialize Google Analytics or other tracking
    console.log('Analytics initialized');
  };

  // Load saved preferences
  const loadPreferences = () => {
    const saved = localStorage.getItem('cookieConsent');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        if (analyticsCookies) analyticsCookies.checked = preferences.analytics || false;
        if (marketingCookies) marketingCookies.checked = preferences.marketing || false;
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
      }
    }
  };

  // Event listeners
  cookieAcceptAll?.addEventListener('click', acceptAll);
  cookieReject?.addEventListener('click', rejectAll);
  cookieSettings?.addEventListener('click', () => {
    loadPreferences();
    cookieModal.classList.remove('hidden');
  });
  cookieModalClose?.addEventListener('click', () => cookieModal.classList.add('hidden'));
  cookieModalBackdrop?.addEventListener('click', () => cookieModal.classList.add('hidden'));
  saveCookieSettings?.addEventListener('click', saveSettings);
  acceptAllCookies?.addEventListener('click', acceptAll);

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cookieModal.classList.contains('hidden')) {
      cookieModal.classList.add('hidden');
    }
  });
})();

// FAQ Accordion functionality
(() => {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    
    toggle?.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          otherContent?.classList.add('hidden');
          otherIcon?.style.setProperty('transform', 'rotate(0deg)');
        }
      });
      
      // Toggle current item
      if (isOpen) {
        content.classList.add('hidden');
        icon?.style.setProperty('transform', 'rotate(0deg)');
      } else {
        content.classList.remove('hidden');
        icon?.style.setProperty('transform', 'rotate(180deg)');
      }
    });
  });
})();

// Live chat widget functionality
(() => {
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const closeChat = document.getElementById('closeChat');
  const chatIcon = document.getElementById('chatIcon');
  const closeIcon = document.getElementById('closeIcon');

  if (!chatToggle || !chatPanel) return;

  const isOpen = () => !chatPanel.classList.contains('hidden');
  
  const openChat = () => {
    chatPanel.classList.remove('hidden');
    chatIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    
    // Animate panel entrance
    chatPanel.style.transform = 'translateY(20px) scale(0.95)';
    chatPanel.style.opacity = '0';
    
    requestAnimationFrame(() => {
      chatPanel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      chatPanel.style.transform = 'translateY(0) scale(1)';
      chatPanel.style.opacity = '1';
    });
  };

  const closeChatPanel = () => {
    chatPanel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    chatPanel.style.transform = 'translateY(20px) scale(0.95)';
    chatPanel.style.opacity = '0';
    
    setTimeout(() => {
      chatPanel.classList.add('hidden');
      chatIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      chatPanel.style.transition = '';
      chatPanel.style.transform = '';
      chatPanel.style.opacity = '';
    }, 300);
  };

  // Event listeners
  chatToggle.addEventListener('click', () => {
    if (isOpen()) {
      closeChatPanel();
    } else {
      openChat();
    }
  });

  closeChat.addEventListener('click', closeChatPanel);

  // Close chat when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen() && !e.target.closest('#liveChatWidget')) {
      closeChatPanel();
    }
  });

  // Close chat on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeChatPanel();
    }
  });

  // Show chat widget after page load with delay
  setTimeout(() => {
    const chatWidget = document.getElementById('liveChatWidget');
    if (chatWidget) {
      chatWidget.style.transform = 'translateY(100px)';
      chatWidget.style.opacity = '0';
      chatWidget.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      requestAnimationFrame(() => {
        chatWidget.style.transform = 'translateY(0)';
        chatWidget.style.opacity = '1';
      });
    }
  }, 3000);
})();

// WhatsApp tracking function
function trackWhatsAppClick() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_click', {
      'event_category': 'contact',
      'event_label': 'whatsapp_chat',
      'value': 1
    });
  }
  console.log('WhatsApp button clicked - tracking event sent');
}

// Analytics tracking functions
function trackFormSubmission(formName, service, budget) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submit', {
      'event_category': 'engagement',
      'event_label': formName,
      'custom_parameter_1': service,
      'custom_parameter_2': budget
    });
  }
}

function trackButtonClick(buttonName, section) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'click', {
      'event_category': 'engagement',
      'event_label': buttonName,
      'custom_parameter_1': section
    });
  }
}

function trackPageView(pageName) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      'page_title': pageName,
      'page_location': window.location.href
    });
  }
}

function trackScroll(depth) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'scroll', {
      'event_category': 'engagement',
      'event_label': 'scroll_depth',
      'value': depth
    });
  }
}

// Track scroll depth
(() => {
  let maxScroll = 0;
  const trackScrollDepth = () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll >= 25 && maxScroll < 50) trackScroll(25);
      else if (maxScroll >= 50 && maxScroll < 75) trackScroll(50);
      else if (maxScroll >= 75 && maxScroll < 90) trackScroll(75);
      else if (maxScroll >= 90) trackScroll(90);
    }
  };
  
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
})();

// Track button clicks
(() => {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button, a.btn-grad, a[href^="#"]');
    if (button) {
      const buttonText = button.textContent.trim();
      const section = button.closest('section')?.id || 'unknown';
      trackButtonClick(buttonText, section);
    }
  });
})();

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-shrink-0">
        ${type === 'success' ? 
          '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' :
          type === 'error' ?
          '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg>' :
          '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
        }
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 ml-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}


