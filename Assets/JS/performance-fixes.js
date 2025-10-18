/**
PERFORMANCE-FIXES.JS - CORREÇÕES URGENTES (ATUALIZADO)
Foco: Ajustes de z-index e desempenho, sem menu hambúrguer
*/

class PerformanceFixes {
    constructor() {
        this.init();
    }

    init() {
        this.fixZIndex();
        console.log('🚀 Correções de performance aplicadas');
    }

    fixZIndex() {
        this.applyCriticalZIndex();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyCriticalZIndex());
        }
        setTimeout(() => this.applyCriticalZIndex(), 100);
    }

    applyCriticalZIndex() {
        const elements = {
            '.cart-popup': 99999,
            '.cart-overlay': 99998,
            'header': 1000, // Alinhado com mobile.css
            '.banner-text': 99995
        };
        Object.entries(elements).forEach(([selector, zIndex]) => {
            const element = document.querySelector(selector);
            if (element) element.style.zIndex = zIndex;
        });
    }
}

if (typeof window !== 'undefined') {
    window.performanceFixes = new PerformanceFixes();
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔧 DOM Carregado - Aplicando z-index...');
        setTimeout(() => {
            const cart = document.querySelector('.cart-popup');
            if (cart) cart.style.zIndex = '99999';
            console.log('🎯 Z-index forçado aplicado');
        }, 50);
    });
}

// Função de debug (opcional)
window.debugMenu = function() {
    const cart = document.querySelector('.cart-popup');
    console.log('🔍 DEBUG:');
    console.log('Cart Popup:', cart);
    console.log('Cart z-index:', cart?.style.zIndex);
};