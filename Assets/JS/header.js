/**
HEADER.JS - CORREÇÕES APLICADAS - CARRINHO MANTIDO
Foco: Sistema de notificação do carrinho e efeitos de scroll
*/

class HeaderManager {
    constructor() {
        this.cartUpdateTimeout = null;
        this.init();
    }

    init() {
        this.setupCartBadge();
        this.setupHeaderScroll();
        console.log('HeaderManager inicializado - Sistema de carrinho e scroll funcionando');
    }

    /**
     * SISTEMA DE CARRINHO - MANTIDO E OTIMIZADO
     */
    setupCartBadge() {
        this.updateCartBadge();

        // Escutar atualizações do carrinho com debounce
        window.addEventListener('storage', this.debounce(() => {
            this.updateCartBadge();
        }, 100));

        document.addEventListener('cartUpdated', this.debounce(() => {
            this.updateCartBadge();
        }, 50));

        window.addEventListener('cartUpdate', this.debounce(() => {
            this.updateCartBadge();
        }, 50));
    }

    updateCartBadge() {
        const badge = document.querySelector('.cart-count');
        if (!badge) return;

        try {
            const cart = JSON.parse(localStorage.getItem('carrinho')) || 
                         JSON.parse(localStorage.getItem('cart')) || [];

            const totalQty = cart.reduce((acc, item) => {
                return acc + (item.quantidade || item.quantity || item.qtd || 0);
            }, 0);

            this.animateBadgeUpdate(badge, totalQty);

        } catch (error) {
            console.error('Erro ao atualizar badge do carrinho:', error);
            this.hideBadge(badge);
        }
    }

    animateBadgeUpdate(badge, newCount) {
        const currentCount = parseInt(badge.textContent) || 0;

        if (newCount !== currentCount) {
            badge.classList.add('badge-updating');

            badge.textContent = newCount > 99 ? '99+' : newCount.toString();

            if (newCount > currentCount && newCount > 0) {
                badge.classList.add('badge-added');
                setTimeout(() => badge.classList.remove('badge-added'), 300);
            }

            setTimeout(() => badge.classList.remove('badge-updating'), 150);
        }

        if (newCount > 0) {
            badge.classList.add('visible');
            badge.style.display = 'flex';
        } else {
            this.hideBadge(badge);
        }
    }

    hideBadge(badge) {
        badge.classList.remove('visible');
        badge.style.display = 'none';
        badge.textContent = '0';
    }

    /**
     * HEADER SCROLL - CORREÇÃO PERFORMANCE
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
     * FUNÇÕES UTILITÁRIAS - CORREÇÕES APLICADAS
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

// Inicialização universal
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.headerManager = new HeaderManager();

        setTimeout(() => {
            if (window.headerManager && window.headerManager.updateCartBadge) {
                window.headerManager.updateCartBadge();
            }
        }, 500);

    } catch (error) {
        console.error('Erro na inicialização do HeaderManager:', error);
    }
});

// Funções globais para compatibilidade
window.headerHelpers = {
    updateCartBadge: function() {
        if (window.headerManager && window.headerManager.updateCartBadge) {
            window.headerManager.updateCartBadge();
        }
    }
};

window.updateCartBadge = window.headerHelpers.updateCartBadge;

console.log('Header.js carregado - Sistema de carrinho e scroll funcionais');