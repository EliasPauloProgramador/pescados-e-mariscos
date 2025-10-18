(function() {
    'use strict';

    // ==================== CONFIGURAÇÕES E CONSTANTES ====================
    const CONFIG = {
        CURRENCY: 'Kz',
        LOCALE: 'pt-AO',
        PLACEHOLDER_IMAGE: 'Assets/Images/Produtos/sem-imagem.jpg',
        LAZY_LOAD_THRESHOLD: 100
    };

    // ==================== SCHEMA MARKUP PARA PRODUTOS EM DESTAQUE ====================
    function generateHomeProductsSchema() {
        const products = Object.values(homeProducts);
        const schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.nome,
                    "description": product.desc,
                    "sku": product.sku,
                    "category": getCategoryName(product.categoria),
                    "offers": {
                        "@type": "Offer",
                        "price": product.preco,
                        "priceCurrency": "AOA",
                        "availability": "https://schema.org/InStock",
                        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    },
                    "image": product.img
                }
            }))
        };

        const existingSchema = document.querySelector('script[data-type="home-products-schema"]');
        if (existingSchema) existingSchema.remove();

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-type', 'home-products-schema');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    function getCategoryName(category) {
        const categories = {
            'mariscos': 'Mariscos e Frutos do Mar',
            'peixes': 'Peixes Frescos',
            'filetes': 'Filetes de Peixe'
        };
        return categories[category] || 'Produtos do Mar';
    }

    // ==================== UTILITÁRIOS DE PERFORMANCE ====================
    const utils = {
        formatCurrency: (n) => {
            if (window.produtosHelpers && window.produtosHelpers.utils) {
                return window.produtosHelpers.utils.formatCurrency(n);
            }
            return Number(n).toLocaleString(CONFIG.LOCALE);
        },
        lazyLoadObserver: null,
        initLazyLoading: () => {
            if ('IntersectionObserver' in window) {
                utils.lazyLoadObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            utils.lazyLoadObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: `${CONFIG.LAZY_LOAD_THRESHOLD}px`,
                    threshold: 0.1
                });
            }
        },
        debounce: (func, wait) => {
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
    };

    // ==================== DADOS DOS PRODUTOS EM DESTAQUE ====================
    const homeProducts = {
        'SKU0001': { 
            sku: 'SKU0001',
            nome: 'Chocos em tiras', 
            preco: 12850, 
            unidade: 'kg', 
            img: 'Assets/Images/Produtos/WhatsApp Image 2025-09-07 at 21.21.14.jpeg', 
            categoria: 'mariscos',
            desc: 'Tiras de choco frescas, prontas para cozinhar. Entrega em Luanda.'
        },
        'SKU0008': { 
            sku: 'SKU0008',
            nome: 'Camarão Pequeno', 
            preco: 6950, 
            unidade: 'kg', 
            img: 'Assets/Images/Produtos/WhatsApp Image 2025-09-07 at 22.18.09.jpeg', 
            categoria: 'mariscos',
            desc: 'Camarão pequeno, perfeito para petiscos. Fresco todos os dias.'
        },
        'SKU0032': { 
            sku: 'SKU0032',
            nome: 'Garoupa das Pedras', 
            preco: 3300, 
            unidade: 'kg', 
            img: 'Assets/Images/Produtos/WhatsApp Image 2025-09-07 at 21.21.13.jpeg', 
            categoria: 'peixes',
            desc: 'Garoupa das pedras. Melhor qualidade em Luanda.'
        },
        'SKU0021': { 
            sku: 'SKU0021',
            nome: 'Tilápia Chopas', 
            preco: 5650, 
            unidade: 'kg', 
            img: 'Assets/Images/Produtos/images (12).jpeg', 
            categoria: 'peixes',
            desc: 'Tilápia fresca, sabor suave. Entrega em Luanda.'
        },
        'SKU0007': { 
            sku: 'SKU0007',
            nome: 'Camarão de Rissóis', 
            preco: 3500, 
            unidade: 'kg', 
            img: 'Assets/Images/Produtos/camarao a ressois.jpg', 
            categoria: 'mariscos',
            desc: 'Camarão pequeno ideal para rissóis. Qualidade premium.'
        },
        'SKU0069': { 
            sku: 'SKU0069',
            nome: 'Filete de Bacalhau', 
            preco: 14500, 
            unidade: 'kg', 
            img: 'Assets/Images/Produtos/lombo de bacalhau.jpg', 
            categoria: 'filetes',
            desc: 'Filetes de bacalhau. Tradição portuguesa com qualidade Angola.'
        }
    };

    // ==================== GERENCIAMENTO DO CARRINHO ====================
    const cartManager = {
        toggleProduct: (product) => {
            if (window.produtosHelpers && window.produtosHelpers.cartManager) {
                return window.produtosHelpers.cartManager.toggleProduct(product);
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingIndex = cart.findIndex(item => item.sku === product.sku);

            if (existingIndex >= 0) {
                cart.splice(existingIndex, 1);
            } else {
                cart.push({
                    sku: product.sku,
                    nome: product.nome,
                    preco: product.preco,
                    unidade: product.unidade,
                    qtd: 1,
                    img: product.img,
                    categoria: product.categoria
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
            if (window.headerHelpers && window.headerHelpers.updateCartBadge) {
                window.headerHelpers.updateCartBadge();
            }

            return cart;
        },
        isInCart: (sku) => {
            if (window.produtosHelpers && window.produtosHelpers.cartManager) {
                return window.produtosHelpers.cartManager.isInCart(sku);
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            return cart.some(item => item.sku === sku);
        }
    };

    // ==================== CONTROLE DOS PRODUTOS NA HOME ====================
    const homeProductsManager = {
        init: () => {
            utils.initLazyLoading();
            homeProductsManager.setupEventListeners();
            homeProductsManager.checkInitialCartState();
            homeProductsManager.setupLazyLoadingForImages();
            generateHomeProductsSchema();
            console.log('✅ home-products.js inicializado com sucesso!');
        },
        setupEventListeners: () => {
            const addCartButtons = document.querySelectorAll('.product-card .add-cart');

            addCartButtons.forEach(button => {
                const debouncedClick = utils.debounce((e) => {
                    e.stopPropagation();
                    const productCard = e.target.closest('.product-card');
                    const sku = productCard.getAttribute('data-sku');

                    if (sku && homeProducts[sku]) {
                        homeProductsManager.handleAddToCart(homeProducts[sku], sku, button);
                    }
                }, 300);

                button.addEventListener('click', debouncedClick);
            });

            window.addEventListener('cartUpdated', () => {
                homeProductsManager.checkInitialCartState();
            });
        },
        handleAddToCart: (product, sku, button) => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';
            button.classList.add('adding');
            button.disabled = true;

            setTimeout(() => {
                const newCart = cartManager.toggleProduct(product);
                const nowInCart = cartManager.isInCart(sku);

                homeProductsManager.updateButtonState(button, nowInCart);
                button.classList.remove('adding');
                button.disabled = false;

                homeProductsManager.showFeedbackMessage(
                    nowInCart ? 
                    `${product.nome} adicionado ao carrinho` : 
                    `${product.nome} removido do carrinho`,
                    nowInCart ? 'success' : 'info'
                );
            }, 300);
        },
        updateButtonState: (button, isInCart) => {
            if (isInCart) {
                button.classList.add('added');
                button.innerHTML = '<i class="bx bx-check"></i>';
                button.setAttribute('aria-label', 'Remover do carrinho');
                button.title = 'Remover do carrinho';
            } else {
                button.classList.remove('added');
                button.innerHTML = '<i class="bx bx-cart-add"></i>';
                button.setAttribute('aria-label', 'Adicionar ao carrinho');
                button.title = 'Adicionar ao carrinho';
            }
        },
        checkInitialCartState: () => {
            const productCards = document.querySelectorAll('.product-card');

            productCards.forEach(card => {
                const sku = card.getAttribute('data-sku');
                const button = card.querySelector('.add-cart');

                if (sku && button) {
                    const inCart = cartManager.isInCart(sku);
                    homeProductsManager.updateButtonState(button, inCart);
                }
            });
        },
        setupLazyLoadingForImages: () => {
            const productImages = document.querySelectorAll('.product-card img[data-src]');

            if (utils.lazyLoadObserver) {
                productImages.forEach(img => {
                    utils.lazyLoadObserver.observe(img);
                });
            } else {
                productImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.onerror = () => {
                        img.src = CONFIG.PLACEHOLDER_IMAGE;
                    };
                });
            }
        },
        showFeedbackMessage: (message, type = 'success') => {
            if (window.produtosHelpers && window.produtosHelpers.productRenderer) {
                window.produtosHelpers.productRenderer.showFeedbackMessage(message);
                return;
            }

            const existingFeedback = document.querySelector('.home-feedback-message');
            if (existingFeedback) existingFeedback.remove();

            const feedback = document.createElement('div');
            feedback.className = `home-feedback-message ${type}`;
            feedback.setAttribute('role', 'status');
            feedback.setAttribute('aria-live', 'polite');
            feedback.textContent = message;

            feedback.style.cssText = `
                position: fixed;
                top: 80px; /* Ajustado para evitar sobreposição com header */
                right: 20px;
                background: ${type === 'success' ? '#22c55e' : '#3b82f6'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 9999; /* Abaixo do menu e carrinho */
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;

            document.body.appendChild(feedback);

            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 3000);
        },
        updateFeaturedProducts: (newProducts) => {
            Object.assign(homeProducts, newProducts);
            generateHomeProductsSchema();
        }
    };

    // ==================== INICIALIZAÇÃO ====================
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', homeProductsManager.init);
        } else {
            homeProductsManager.init();
        }
    };

    // ==================== EXPORTAÇÃO PARA ESCOPO GLOBAL ====================
    window.homeProductsHelpers = {
        homeProductsManager,
        homeProducts,
        utils,
        cartManager
    };

    // ==================== INICIALIZAÇÃO AUTOMÁTICA ====================
    init();
})();