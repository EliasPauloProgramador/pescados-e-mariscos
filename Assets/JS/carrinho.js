/* carrinho.js - L&A Pescados e Mariscos
 * OTIMIZADO PARA SEO, PERFORMANCE E ACESSIBILIDADE
 * Funcionalidades:
 * - Carrinho com schema markup
 * - Performance otimizada
 * - Acessibilidade completa
 * - WhatsApp integration
 * - LocalStorage sync
 */

(function() {
  'use strict';

  // ==================== CONFIGURAÇÕES E CONSTANTES ====================
  const CONFIG = {
    WHATSAPP_NUMBER: '244994779159',
    CURRENCY: 'Kz',
    LOCALE: 'pt-AO',
    PLACEHOLDER_IMAGE: 'Assets/Images/Produtos/sem-imagem.jpg'
  };

  // ==================== SCHEMA MARKUP PARA CARRINHO ====================
  function generateCartSchema(cart) {
    if (!cart || cart.length === 0) return;

    const orderSchema = {
      "@context": "https://schema.org",
      "@type": "Order",
      "acceptedOffer": cart.map(item => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": item.nome,
          "sku": item.sku,
          "image": item.img
        },
        "price": item.preco,
        "priceCurrency": "AOA",
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": item.qtd
        }
      }))
    };

    // Remove schema existente e adiciona novo
    const existingSchema = document.querySelector('script[data-type="cart-schema"]');
    if (existingSchema) existingSchema.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-type', 'cart-schema');
    script.textContent = JSON.stringify(orderSchema);
    document.head.appendChild(script);
  }

  // ==================== UTILITÁRIOS ====================
  const utils = {
    formatCurrency: (n) => Number(n).toLocaleString(CONFIG.LOCALE),

    // Debounce para evitar múltiplos cliques rápidos
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
    },

    // Feedback visual para usuário
    showFeedback: (message, type = 'success') => {
      const existingFeedback = document.querySelector('.cart-feedback');
      if (existingFeedback) existingFeedback.remove();

      const feedback = document.createElement('div');
      feedback.className = `cart-feedback ${type}`;
      feedback.textContent = message;
      feedback.setAttribute('role', 'alert');
      feedback.setAttribute('aria-live', 'polite');

      // Estilos básicos
      feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;

      document.body.appendChild(feedback);

      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 3000);
    }
  };

  // ==================== GERENCIAMENTO DO CARRINHO ====================
  const cartManager = {
    getCart: () => {
      try {
        return JSON.parse(localStorage.getItem('cart')) || [];
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e);
        return [];
      }
    },

    saveCart: (cart) => {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        // Atualiza badge do carrinho no header
        if (window.headerHelpers && typeof window.headerHelpers.updateCartBadge === 'function') {
          window.headerHelpers.updateCartBadge();
        }
        // Dispara evento customizado para outros componentes
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
      } catch (e) {
        console.error('Erro ao salvar carrinho:', e);
      }
    },

    addItem: (product) => {
      const cart = cartManager.getCart();
      const existingItem = cart.find(item => item.sku === product.sku);

      if (existingItem) {
        existingItem.qtd += 1;
      } else {
        cart.push({
          sku: product.sku,
          nome: product.nome,
          preco: product.preco,
          unidade: product.unidade,
          qtd: 1,
          img: product.img
        });
      }

      cartManager.saveCart(cart);
      return cart;
    },

    removeItem: (sku) => {
      const cart = cartManager.getCart();
      const filteredCart = cart.filter(item => item.sku !== sku);
      cartManager.saveCart(filteredCart);
      return filteredCart;
    },

    updateQuantity: (sku, newQty) => {
      const cart = cartManager.getCart();
      const item = cart.find(item => item.sku === sku);

      if (item) {
        if (newQty < 1) {
          return cartManager.removeItem(sku);
        } else {
          item.qtd = newQty;
          cartManager.saveCart(cart);
          return cart;
        }
      }
      return cart;
    },

    clearCart: () => {
      localStorage.removeItem('cart');
      if (window.headerHelpers && typeof window.headerHelpers.updateCartBadge === 'function') {
        window.headerHelpers.updateCartBadge();
      }
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
    }
  };

  // ==================== ELEMENTOS DO DOM ====================
  const domElements = {
    cartOverlay: null,
    cartPopup: null,
    cartItemsList: null,
    cartTotalEl: null,
    clearCartBtn: null,
    checkoutBtn: null,
    emptyCartMessage: null,
    nameInput: null,
    locationInput: null,
    cartIcon: null,
    closeCartBtn: null
  };

  function initializeDOMElements() {
    domElements.cartOverlay = document.getElementById('cart-overlay');
    domElements.cartPopup = document.getElementById('cart-popup');
    domElements.cartItemsList = document.getElementById('cart-items');
    domElements.cartTotalEl = document.getElementById('cart-total');
    domElements.clearCartBtn = document.getElementById('clear-cart');
    domElements.checkoutBtn = document.getElementById('checkout');
    domElements.emptyCartMessage = document.getElementById('empty-cart-message');
    domElements.nameInput = document.getElementById('cart-customer-name');
    domElements.locationInput = document.getElementById('cart-customer-location');
    domElements.cartIcon = document.getElementById('cart-btn');
    domElements.closeCartBtn = document.getElementById('close-cart');

    // Criar campos de cliente se não existirem
    ensureCustomerFields();
  }

  function ensureCustomerFields() {
    if (!domElements.nameInput || !domElements.locationInput) {
      const formArea = document.querySelector('.cart-form');
      
      if (!formArea) {
        const formDiv = document.createElement('div');
        formDiv.className = 'cart-form';
        formDiv.innerHTML = `
          <div class="form-group">
            <label for="cart-customer-name" class="sr-only">Seu nome</label>
            <input 
              id="cart-customer-name" 
              placeholder="Seu nome (opcional)"
              aria-label="Seu nome"
            >
          </div>
          <div class="form-group">
            <label for="cart-customer-location" class="sr-only">Sua localização</label>
            <input 
              id="cart-customer-location" 
              placeholder="Localização / referência (ex: Bairro, Rotunda)"
              aria-label="Sua localização"
            >
          </div>
        `;
        
        const cartFooter = document.querySelector('.cart-footer');
        if (cartFooter) {
          domElements.cartPopup.insertBefore(formDiv, cartFooter);
        }
      }
      
      // Atualizar as referências
      domElements.nameInput = document.getElementById('cart-customer-name');
      domElements.locationInput = document.getElementById('cart-customer-location');
    }
  }

  // ==================== RENDERIZAÇÃO DO CARRINHO ====================
  const cartRenderer = {
    render: () => {
      const cart = cartManager.getCart();
      
      if (!cart || cart.length === 0) {
        cartRenderer.renderEmptyCart();
        return;
      }

      cartRenderer.renderCartItems(cart);
      cartRenderer.updateTotal(cart);
      cartRenderer.toggleEmptyMessage(false);

      // Gerar schema markup para o pedido
      generateCartSchema(cart);
    },

    renderEmptyCart: () => {
      if (domElements.cartItemsList) {
        domElements.cartItemsList.innerHTML = '';
      }
      if (domElements.cartTotalEl) {
        domElements.cartTotalEl.textContent = `Total: 0 ${CONFIG.CURRENCY}`;
      }
      cartRenderer.toggleEmptyMessage(true);
    },

    renderCartItems: (cart) => {
      if (!domElements.cartItemsList) return;

      domElements.cartItemsList.innerHTML = '';

      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.setAttribute('data-sku', item.sku);
        li.setAttribute('aria-label', `${item.nome}, quantidade: ${item.qtd}, preço: ${utils.formatCurrency(item.preco * item.qtd)} ${CONFIG.CURRENCY}`);

        li.innerHTML = `
          <div class="meta">
            <img 
              src="${item.img || CONFIG.PLACEHOLDER_IMAGE}" 
              onerror="this.src='${CONFIG.PLACEHOLDER_IMAGE}'" 
              alt="${item.nome}" 
              loading="lazy"
            >
            <div class="details">
              <div class="name">${item.nome}</div>
              <div class="unit">${utils.formatCurrency(item.preco)} ${CONFIG.CURRENCY} / ${item.unidade}</div>
            </div>
          </div>

          <div class="controls">
            <div class="qty-row">
              <button class="decrease" aria-label="Diminuir quantidade de ${item.nome}">-</button>
              <div class="quantity" aria-live="polite">${item.qtd}</div>
              <button class="increase" aria-label="Aumentar quantidade de ${item.nome}">+</button>
            </div>
            <div class="item-total">${utils.formatCurrency(item.preco * item.qtd)} ${CONFIG.CURRENCY}</div>
            <button class="btn-remove" aria-label="Remover ${item.nome} do carrinho">
              <i class='bx bx-trash' aria-hidden="true"></i>
            </button>
          </div>
        `;

        // Event listeners com debounce para performance
        const increaseBtn = li.querySelector('.increase');
        const decreaseBtn = li.querySelector('.decrease');
        const removeBtn = li.querySelector('.btn-remove');

        const debouncedIncrease = utils.debounce(() => {
          cartManager.updateQuantity(item.sku, item.qtd + 1);
          cartRenderer.render();
        }, 150);

        const debouncedDecrease = utils.debounce(() => {
          cartManager.updateQuantity(item.sku, item.qtd - 1);
          cartRenderer.render();
        }, 150);

        increaseBtn.addEventListener('click', debouncedIncrease);
        decreaseBtn.addEventListener('click', debouncedDecrease);

        removeBtn.addEventListener('click', () => {
          cartManager.removeItem(item.sku);
          cartRenderer.render();
          utils.showFeedback(`${item.nome} removido do carrinho`);
        });

        domElements.cartItemsList.appendChild(li);
      });
    },

    updateTotal: (cart) => {
      if (!domElements.cartTotalEl) return;
      
      const total = cart.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
      domElements.cartTotalEl.textContent = `Total: ${utils.formatCurrency(total)} ${CONFIG.CURRENCY}`;
      domElements.cartTotalEl.setAttribute('aria-label', `Total do carrinho: ${utils.formatCurrency(total)} Kwanza`);
    },

    toggleEmptyMessage: (show) => {
      if (!domElements.emptyCartMessage) return;
      
      if (show) {
        domElements.emptyCartMessage.style.display = 'block';
        domElements.emptyCartMessage.setAttribute('aria-hidden', 'false');
      } else {
        domElements.emptyCartMessage.style.display = 'none';
        domElements.emptyCartMessage.setAttribute('aria-hidden', 'true');
      }
    }
  };

  // ==================== CHECKOUT WHATSAPP ====================
  const checkoutManager = {
    handleCheckout: () => {
      const cart = cartManager.getCart();
      if (!cart || cart.length === 0) { 
        utils.showFeedback('Seu carrinho está vazio!', 'error');
        return; 
      }

      // Obter dados do cliente
      const nome = (domElements.nameInput && domElements.nameInput.value.trim()) || '';
      const localizacao = (domElements.locationInput && domElements.locationInput.value.trim()) || '';

      // Validar localização se for crítica
      if (!localizacao) {
        if (!confirm('Deseja continuar sem informar a localização?')) {
          if (domElements.locationInput) {
            domElements.locationInput.focus();
          }
          return;
        }
      }

      // Construir mensagem
      const mensagem = checkoutManager.buildMessage(cart, nome, localizacao);
      const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

      // Abrir WhatsApp
      window.open(url, '_blank');

      // Feedback visual
      utils.showFeedback('Pedido enviado para o WhatsApp!');
      
      // Opcional: limpar carrinho após envio
      // cartManager.clearCart();
      // cartRenderer.render();
    },

    buildMessage: (cart, nome, localizacao) => {
      const hora = new Date();
      const saudacao = hora.getHours() < 12 ? 'Bom dia' : hora.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
      
      let mensagem = `${saudacao},\n\n`;
      mensagem += `Meu nome ${nome ? 'é ' + nome : 'é (não informado)'}.\n`;
      mensagem += `Gostaria de fazer a seguinte encomenda:\n\n`;

      // Itens do carrinho
      let total = 0;
      cart.forEach(item => {
        const itemTotal = item.preco * item.qtd;
        mensagem += `• ${item.nome}\n`;
        mensagem += `  Quantidade: ${item.qtd} ${item.unidade}\n`;
        mensagem += `  Preço: ${utils.formatCurrency(itemTotal)} ${CONFIG.CURRENCY}\n\n`;
        total += itemTotal;
      });

      mensagem += `📍 *Localização:* ${localizacao || 'Não informada'}\n`;
      mensagem += `💰 *Total:* ${utils.formatCurrency(total)} ${CONFIG.CURRENCY}\n\n`;
      mensagem += `Por favor, confirmar disponibilidade e condições de entrega.\n`;
      mensagem += `Obrigado! 🐟`;

      return mensagem;
    }
  };

  // ==================== CONTROLES DE INTERFACE ====================
  const uiController = {
    openCart: () => {
      ensureCustomerFields();
      cartRenderer.render();
      if (domElements.cartOverlay) {
        domElements.cartOverlay.classList.add('active');
        domElements.cartOverlay.setAttribute('aria-hidden', 'false');
      }
      if (domElements.cartPopup) {
        domElements.cartPopup.classList.add('active');
        domElements.cartPopup.setAttribute('aria-hidden', 'false');
      }
      
      // Foco no primeiro elemento interativo
      setTimeout(() => {
        const firstInput = domElements.nameInput;
        if (firstInput) {
          firstInput.focus();
        }
      }, 300);
    },

    closeCart: () => {
      if (domElements.cartOverlay) {
        domElements.cartOverlay.classList.remove('active');
        domElements.cartOverlay.setAttribute('aria-hidden', 'true');
      }
      if (domElements.cartPopup) {
        domElements.cartPopup.classList.remove('active');
        domElements.cartPopup.setAttribute('aria-hidden', 'true');
      }
    },

    bindEvents: () => {
      // Botão de abrir carrinho
      if (domElements.cartIcon) {
        domElements.cartIcon.addEventListener('click', uiController.openCart);
      }

      // Botão de fechar carrinho
      if (domElements.closeCartBtn) {
        domElements.closeCartBtn.addEventListener('click', uiController.closeCart);
      }

      // Overlay para fechar
      if (domElements.cartOverlay) {
        domElements.cartOverlay.addEventListener('click', uiController.closeCart);
      }

      // Limpar carrinho
      if (domElements.clearCartBtn) {
        domElements.clearCartBtn.addEventListener('click', () => {
          if (!confirm('Tem certeza que deseja limpar o carrinho?')) return;
          cartManager.clearCart();
          cartRenderer.render();
          utils.showFeedback('Carrinho limpo com sucesso!');
        });
      }

      // Finalizar pedido
      if (domElements.checkoutBtn) {
        domElements.checkoutBtn.addEventListener('click', checkoutManager.handleCheckout);
      }

      // Tecla ESC para fechar o carrinho
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && domElements.cartOverlay.classList.contains('active')) {
          uiController.closeCart();
        }
      });
    }
  };

  // ==================== INICIALIZAÇÃO ====================
  const init = () => {
    initializeDOMElements();
    uiController.bindEvents();
    cartRenderer.render();

    console.log('✅ carrinho.js inicializado com sucesso!');
  };

  // ==================== EXPORTAÇÃO PARA ESCOPO GLOBAL ====================
  window.cartHelpers = {
    renderCart: cartRenderer.render,
    openCart: uiController.openCart,
    closeCart: uiController.closeCart,
    cartManager
  };

  // ==================== INICIALIZAÇÃO QUANDO DOM ESTIVER PRONTO ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();