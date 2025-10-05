/**
 * HEADER.JS - VERSÃO FINAL 100% FUNCIONAL
 * Menu mobile completo com links funcionais
 */

class HeaderManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupCartBadge();
        this.setupHeaderScroll();
    }

    /**
     * MOBILE MENU - 100% FUNCIONAL COM LINKS
     */
    setupMobileMenu() {
        this.hamburguer = document.querySelector('.hamburguer');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.overlay = document.querySelector('.overlay');
        this.closeBtn = document.querySelector('.close-menu');
        
        // Verifica se elementos existem
        if (!this.hamburguer || !this.mobileMenu || !this.overlay) {
            console.warn('Elementos do menu mobile não encontrados');
            return;
        }

        this.addMenuEventListeners();
        this.setupMenuAccessibility();
    }

    addMenuEventListeners() {
        // Hamburger click - ABRE menu
        this.hamburguer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openMenu();
        });

        // Overlay click - FECHA menu
        this.overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeMenu();
        });

        // Botão FECHAR - 100% FUNCIONAL
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenu();
            });
        }

        // Fecha menu ao clicar em links (navegação)
        const mobileLinks = this.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // ESC key para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Fecha menu ao redimensionar para desktop
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 968 && this.isMenuOpen) {
                this.closeMenu();
            }
        }, 250));
    }

    setupMenuAccessibility() {
        // ARIA para acessibilidade
        this.hamburguer.setAttribute('aria-label', 'Abrir menu de navegação');
        this.hamburguer.setAttribute('aria-expanded', 'false');
        this.hamburguer.setAttribute('aria-controls', 'mobile-menu');
        
        this.mobileMenu.setAttribute('id', 'mobile-menu');
        this.mobileMenu.setAttribute('aria-label', 'Navegação mobile');
    }

    openMenu() {
        this.mobileMenu.classList.add('active');
        this.overlay.classList.add('active');
        this.hamburguer.classList.add('active');
        
        // Atualiza ícone
        const icon = this.hamburguer.querySelector('i');
        if (icon) {
            icon.classList.replace('bx-menu', 'bx-x');
        }

        // Atualiza acessibilidade
        this.hamburguer.setAttribute('aria-expanded', 'true');
        this.hamburguer.setAttribute('aria-label', 'Fechar menu de navegação');
        
        // Trava scroll do body
        document.body.style.overflow = 'hidden';
        
        this.isMenuOpen = true;
    }

    closeMenu() {
        this.mobileMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        this.hamburguer.classList.remove('active');
        
        // Atualiza ícone
        const icon = this.hamburguer.querySelector('i');
        if (icon && icon.classList.contains('bx-x')) {
            icon.classList.replace('bx-x', 'bx-menu');
        }

        // Atualiza acessibilidade
        this.hamburguer.setAttribute('aria-expanded', 'false');
        this.hamburguer.setAttribute('aria-label', 'Abrir menu de navegação');
        
        // Libera scroll do body
        document.body.style.overflow = '';
        
        this.isMenuOpen = false;
    }

    /**
     * CART BADGE - OTIMIZADO
     */
    setupCartBadge() {
        this.updateCartBadge();
        
        // Escuta atualizações do carrinho
        window.addEventListener('storage', this.debounce(() => {
            this.updateCartBadge();
        }, 100));

        document.addEventListener('cartUpdated', this.debounce(() => {
            this.updateCartBadge();
        }, 50));
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (!badge) return;

        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalQty = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
            
            badge.textContent = totalQty > 99 ? '99+' : totalQty.toString();
            
            if (totalQty > 0) {
                badge.style.display = 'flex';
                badge.classList.add('visible');
            } else {
                badge.style.display = 'none';
                badge.classList.remove('visible');
            }
            
        } catch (error) {
            console.error('Erro ao atualizar badge:', error);
            badge.textContent = '0';
        }
    }

    /**
     * HEADER SCROLL - PERFORMANCE
     */
    setupHeaderScroll() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const header = document.querySelector('header');
            if (!header) return;

            const scrolled = window.scrollY > 100;
            
            if (scrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
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
     * FUNÇÕES UTILITÁRIAS
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
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            window.headerManager = new HeaderManager();
        });
    } else {
        setTimeout(() => {
            window.headerManager = new HeaderManager();
        }, 1000);
    }
});

// Função global para atualizar badge do carrinho
window.updateCartBadge = function() {
    if (window.headerManager) {
        window.headerManager.updateCartBadge();
    }
};

// Tratamento de erros
window.addEventListener('error', (e) => {
    console.error('Erro no header.js:', e.error);
});