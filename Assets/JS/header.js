/**
 * HEADER.JS - OPTIMIZED FOR SEO & PERFORMANCE
 * Controls mobile menu, cart badge, and header interactions
 * Enhanced for accessibility, SEO, and Core Web Vitals
 */

// SEO and Performance Optimizations
class HeaderManager {
    constructor() {
        this.isMenuOpen = false;
        this.cartUpdateTimeout = null;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupCartBadge();
        this.setupHeaderScroll();
        this.setupKeyboardNavigation();
        this.setupPerformanceOptimizations();
        
        // Schema markup for header
        this.injectHeaderSchema();
    }

    /**
     * MOBILE MENU - SEO & ACCESSIBILITY OPTIMIZED
     */
    setupMobileMenu() {
        // CORREÇÃO: Usando IDs corretos do HTML atualizado
        this.hamburger = document.getElementById('hamburger-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.closeMenuBtn = document.getElementById('close-menu-btn');
        this.menuOverlay = document.getElementById('menu-overlay');
        
        if (!this.hamburger || !this.mobileMenu || !this.menuOverlay) {
            console.warn('Mobile menu elements not found - mobile menu disabled');
            return;
        }

        this.hamburgerIcon = this.hamburger.querySelector('i');
        this.navLinks = document.querySelectorAll('.mobile-nav-link');

        this.addMenuEventListeners();
        this.setupMenuAccessibility();
    }

    addMenuEventListeners() {
        // Hamburger click with debouncing
        this.hamburger.addEventListener('click', this.toggleMenu.bind(this), { passive: true });

        // Close button click
        if (this.closeMenuBtn) {
            this.closeMenuBtn.addEventListener('click', this.closeMenu.bind(this), { passive: true });
        }

        // Overlay click
        this.menuOverlay.addEventListener('click', this.closeMenu.bind(this), { passive: true });

        // Navigation links with event delegation
        if (this.navLinks.length > 0) {
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target.matches('.mobile-nav-link')) {
                    this.closeMenu();
                    this.trackNavigationClick(e.target);
                }
            }, { passive: true });
        }

        // ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Resize handler with debouncing
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        }, 250), { passive: true });
    }

    setupMenuAccessibility() {
        // ARIA attributes for accessibility
        this.hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.setAttribute('aria-controls', 'mobile-menu');
        
        this.mobileMenu.setAttribute('aria-label', 'Navegação mobile');
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        // CORREÇÃO: Ativar elementos do menu mobile
        this.mobileMenu.classList.add('active');
        this.menuOverlay.classList.add('active');
        this.hamburger.classList.add('active');
        
        if (this.hamburgerIcon) {
            this.hamburgerIcon.classList.replace('bx-menu', 'bx-x');
        }

        // Update accessibility
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.hamburger.setAttribute('aria-label', 'Fechar menu de navegação');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Trap focus in mobile menu
        this.trapFocus(this.mobileMenu);
        
        this.isMenuOpen = true;

        // SEO: Track menu open event
        this.trackEvent('menu_open');
    }

    closeMenu() {
        // CORREÇÃO: Desativar elementos do menu mobile
        this.mobileMenu.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        this.hamburger.classList.remove('active');
        
        if (this.hamburgerIcon && this.hamburgerIcon.classList.contains('bx-x')) {
            this.hamburgerIcon.classList.replace('bx-x', 'bx-menu');
        }

        // Update accessibility
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Release focus trap
        this.releaseFocus();
        
        this.isMenuOpen = false;

        // SEO: Track menu close event
        this.trackEvent('menu_close');
    }

    /**
     * CART BADGE - PERFORMANCE OPTIMIZED
     */
    setupCartBadge() {
        this.updateCartBadge();
        
        // Listen for cart updates with debouncing
        window.addEventListener('storage', this.debounce(() => {
            this.updateCartBadge();
        }, 100), { passive: true });

        // Custom event for cart updates within same tab
        document.addEventListener('cartUpdated', this.debounce(() => {
            this.updateCartBadge();
        }, 50), { passive: true });
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (!badge) return;

        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalQty = cart.reduce((acc, item) => acc + (item.quantity || item.qtd || 0), 0);
            
            // Update badge with animation
            this.animateBadgeUpdate(badge, totalQty);
            
            // Update accessibility
            badge.setAttribute('aria-label', `${totalQty} itens no carrinho`);
            
        } catch (error) {
            console.error('Error updating cart badge:', error);
            badge.textContent = '0';
        }
    }

    animateBadgeUpdate(badge, newCount) {
        const currentCount = parseInt(badge.textContent) || 0;
        
        if (newCount !== currentCount) {
            // Add animation class
            badge.classList.add('badge-updating');
            
            // Update count
            badge.textContent = newCount > 99 ? '99+' : newCount.toString();
            
            // Visual feedback
            if (newCount > currentCount) {
                badge.classList.add('badge-added');
                setTimeout(() => badge.classList.remove('badge-added'), 300);
            }
            
            // Remove animation class
            setTimeout(() => badge.classList.remove('badge-updating'), 150);
        }
        
        // Toggle visibility
        if (newCount > 0) {
            badge.classList.add('visible');
            badge.style.display = 'flex';
        } else {
            badge.classList.remove('visible');
            badge.style.display = 'none';
        }
    }

    /**
     * HEADER SCROLL EFFECTS - PERFORMANCE OPTIMIZED
     */
    setupHeaderScroll() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const header = document.getElementById('header');
            if (!header) return;

            const scrolled = window.scrollY > 100;
            
            if (scrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show on scroll direction
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = window.scrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * KEYBOARD NAVIGATION - ACCESSIBILITY
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation within header
            if (e.key === 'Tab' && this.isMenuOpen) {
                this.handleMenuTabNavigation(e);
            }
        });
    }

    handleMenuTabNavigation(e) {
        const focusableElements = this.mobileMenu.querySelectorAll(
            'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            setTimeout(() => focusableElements[0].focus(), 100);
        }
    }

    releaseFocus() {
        // Return focus to hamburger button
        setTimeout(() => this.hamburger.focus(), 100);
    }

    /**
     * PERFORMANCE OPTIMIZATIONS
     */
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Lazy load non-critical resources
        this.lazyLoadNonCriticalResources();
    }

    preloadCriticalResources() {
        // Preload mobile menu icons
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
        link.as = 'style';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    lazyLoadNonCriticalResources() {
        // Load non-critical CSS after page load
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Can be used for lazy loading additional resources
                        observer.unobserve(entry.target);
                    }
                });
            });
        }
    }

    /**
     * SEO & ANALYTICS
     */
    trackNavigationClick(link) {
        // SEO: Track internal navigation for analytics
        const linkText = link.textContent.trim();
        const linkHref = link.getAttribute('href');
        
        // Could be integrated with Google Analytics 4
        console.log('Navigation click:', { linkText, linkHref });
        
        // Schema markup for navigation
        this.updateBreadcrumbSchema(linkHref);
    }

    trackEvent(eventName) {
        // SEO: Track user interactions for UX optimization
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Could be sent to analytics service
        console.log('User event:', eventData);
    }

    injectHeaderSchema() {
        // Inject Organization schema for SEO
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "L&A Pescados e Mariscos",
            "url": window.location.origin,
            "logo": `${window.location.origin}/Assets/Images/Produtos/favicon_cropped_colors.png`,
            "description": "Peixaria online em Angola especializada em peixes frescos e mariscos",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Luanda",
                "addressCountry": "AO"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+244-994-779-159",
                "contactType": "customer service",
                "areaServed": "AO"
            }
        });
        document.head.appendChild(schemaScript);
    }

    updateBreadcrumbSchema(linkHref) {
        // Update breadcrumb schema for better SEO
        // This would be implemented based on your breadcrumb structure
    }

    /**
     * UTILITY FUNCTIONS
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            window.headerManager = new HeaderManager();
        });
    } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => {
            window.headerManager = new HeaderManager();
        }, 1000);
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderManager;
}

// Global function for cart updates (compatible with existing code)
window.headerHelpers = {
    updateCartBadge: function() {
        if (window.headerManager) {
            window.headerManager.updateCartBadge();
        }
    }
};

// Error handling for production
window.addEventListener('error', (e) => {
    console.error('Header script error:', e.error);
});

// Export updateCartBadge for backward compatibility
window.updateCartBadge = window.headerHelpers.updateCartBadge;