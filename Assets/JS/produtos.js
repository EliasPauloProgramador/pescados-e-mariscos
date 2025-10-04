/* produtos.js - L&A Pescados e Mariscos
 * OTIMIZADO PARA SEO, PERFORMANCE E ACESSIBILIDADE
 * Funcionalidades:
 * - Lista de produtos com schema markup
 * - Filtros e busca otimizados
 * - Carrinho sincronizado
 * - Lazy loading de imagens
 * - Core Web Vitals otimizado
 */

(function() {
  'use strict';

  // ==================== CONFIGURAÇÕES E CONSTANTES ====================
  const CONFIG = {
    PLACEHOLDER_IMAGE: '../../Images/Produtos/sem-imagem.jpg',
    LAZY_LOAD_THRESHOLD: 100, // pixels para lazy loading
    DEBOUNCE_DELAY: 300, // ms para debounce da busca
    CURRENCY: 'Kz',
    LOCALE: 'pt-AO' // Angola locale
  };

  // ==================== SCHEMA MARKUP PARA SEO ====================
  function generateProductSchema(products) {
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

    // Remove schema existente e adiciona novo
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) existingSchema.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function getCategoryName(category) {
    const categories = {
      'mariscos': 'Mariscos e Frutos do Mar',
      'peixes': 'Peixes Frescos',
      'filetes': 'Filetes de Peixe',
      'lombos': 'Lombos de Peixe'
    };
    return categories[category] || 'Produtos do Mar';
  }

  // ==================== UTILITÁRIOS DE PERFORMANCE ====================
  const utils = {
    // Formatação de números com locale de Angola
    formatCurrency: (n) => n.toLocaleString(CONFIG.LOCALE),
    
    // Debounce para otimizar buscas
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

    // Lazy loading de imagens
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

    // Medição de performance
    perfMetrics: {
      startTime: 0,
      start: () => { utils.perfMetrics.startTime = performance.now(); },
      end: (label) => {
        const duration = performance.now() - utils.perfMetrics.startTime;
        console.log(`${label}: ${duration.toFixed(2)}ms`);
      }
    }
  };

  // ==================== DADOS DOS PRODUTOS ====================
  const PRODUCTS = [
    /* MARISCOS / MOLUSCOS / CRUSTACEOS */
    { sku: 'SKU0001', nome: 'Chocos em tiras', preco: 12850, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/WhatsApp Image 2025-09-07 at 21.21.14.jpeg', desc:'Tiras de choco frescas, prontas para cozinhar.'},
    { sku: 'SKU0002', nome: 'Choco com tinta', preco: 6850, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/choco com tinta.jpg', desc:'Choco com tinta para pratos tradicionais.'},
    { sku: 'SKU0003', nome: 'Choco limpo', preco: 8850, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/choco.jpg', desc:'Choco limpo e pronto para consumo.'},
    { sku: 'SKU0004', nome: 'Choquinho', preco: 2800, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/choquinho.jpg', desc:'Choquinhos pequenos, sabor delicado.'},
    { sku: 'SKU0005', nome: 'Polvo', preco: 6500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/Polvo.jpg', desc:'Polvo fresco, ideal para grelhados e caldeiradas.'},
    { sku: 'SKU0006', nome: 'Lulas', preco: 5500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/Lulas.jpg', desc:'Lulas inteiras, versáteis na cozinha.'},
    { sku: 'SKU0007', nome: 'Camarão de rissóis', preco: 3500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/camarao a ressois.jpg', desc:'Camarão pequeno ideal para rissóis.'},
    { sku: 'SKU0008', nome: 'Camarão pequeno', preco: 6950, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/WhatsApp Image 2025-09-07 at 22.18.09.jpeg', desc:'Camarão pequeno, perfeito para petiscos.'},
    { sku: 'SKU0009', nome: 'Camarão normal', preco: 8850, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/camarão normal.jpg', desc:'Camarão tamanho padrão, fresco.'},
    { sku: 'SKU0010', nome: 'Camarão Médio', preco: 10850, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/camarao medio.jpg', desc:'Camarão médio para pratos principais.'},
    { sku: 'SKU0011', nome: 'Caranguejo santola', preco: 3700, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/caranguejo santola2.jpg', desc:'Caranguejo santola fresco.'},
    { sku: 'SKU0012', nome: 'Camarão graúdo', preco: 12850, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/camarão normal.jpg', desc:'Camarão graúdo, bom para churrasco.'},
    { sku: 'SKU0013', nome: 'Gambas', preco: 22600, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/gambas.jpg', desc:'Gambas selecionadas, alta qualidade.'},
    { sku: 'SKU0014', nome: 'Mexilhão', preco: 3000, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/mexilhão.jpg', desc:'Mexilhão fresco, ótimo para molhos.'},
    { sku: 'SKU0015', nome: 'Amêijoas', preco: 3500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/ameijoas.jpg', desc:'Amêijoas limpas e prontas.'},
    { sku: 'SKU0016', nome: 'Marquitas', preco: 3500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/faltaimagem1.jpg', desc:'Marquitas fresquinhas.'},
    { sku: 'SKU0017', nome: 'Kingoles', preco: 3000, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/kingole.jpg', desc:'Kingoles/berbigões para pratos tradicionais.'},
    { sku: 'SKU0018', nome: 'Lagosta', preco: 23500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/Lagosta.jpg', desc:'Lagosta premium.'},
    { sku: 'SKU0019', nome: 'Lagostas bruxa', preco: 11000, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/lagostas bruxas.jpg', desc:'Lagosta bruxa, sabor marcante.'},
    { sku: 'SKU0020', nome: 'Navalha', preco: 3500, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/navalha.jpg', desc:'Navalhas frescas.'},

    /* PEIXES - OTIMIZADO PARA PALAVRAS-CHAVE "PEIXES FRESCOS ANGOLA" */
    { sku: 'SKU0021', nome: 'Tilápia chopas', preco: 5650, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/images (12).jpeg', desc:'Tilápia fresca, sabor suave. Entrega em Luanda.'},
    { sku: 'SKU0022', nome: 'Tilápia pequenos (cacussos)', preco: 3850, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/Tilapia pequenas.jpg', desc:'Tilápia pequena, ideal para fritar. Peixaria Angola.'},
    { sku: 'SKU0023', nome: 'Sardinha', preco: 1950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/sardinha.jpg', desc:'Sardinha fresca do dia. Melhor peixaria em Luanda.'},
    { sku: 'SKU0024', nome: 'Macoas', preco: 3950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/faltaimagem.jpg', desc:'Peixe macoas, sabor tradicional. Frutos do mar Angola.'},
    { sku: 'SKU0025', nome: 'Malessos', preco: 1900, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/faltaimagem1.jpg', desc:'Malessos, bom preço e sabor. Pescados frescos.'},
    { sku: 'SKU0026', nome: 'Bagri', preco: 3800, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/Bagre.jpg', desc:'Bagri fresco. Peixaria online Angola.'},
    { sku: 'SKU0027', nome: 'Santolas', preco: 4200, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/santolas.jpg', desc:'Santolas selecionadas. Mariscos frescos Luanda.'},
    { sku: 'SKU0028', nome: 'Peixe Sofia', preco: 3950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe sofia.jpg', desc:'Peixe Sofia fresco. Entrega rápida.'},
    { sku: 'SKU0029', nome: 'Corvina de prato', preco: 4800, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/corvina.jpg', desc:'Corvina para servir inteira. Qualidade premium.'},
    { sku: 'SKU0030', nome: 'Calafate', preco: 4500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/calafate.jpg', desc:'Calafate fresco. Peixes marinhos Angola.'},
    { sku: 'SKU0031', nome: 'Peixe tubarão (postas)', preco: 5800, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/filete de tubarao.jpg', desc:'Postas de tubarão. Produtos marinhos frescos.'},
    { sku: 'SKU0032', nome: 'Garoupa das pedras', preco: 3300, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/WhatsApp Image 2025-09-07 at 21.21.13.jpeg', desc:'Garoupa das pedras. Melhor qualidade em Luanda.'},
    { sku: 'SKU0033', nome: 'Garoupinhas', preco: 5850, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/garoupinha.jpeg', desc:'Garoupinhas pequenas. Peixaria L&A Pescados.'},
    { sku: 'SKU0034', nome: 'Garoupas vermelhas', preco: 6850, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/WhatsApp Image 2025-09-07 at 21.21.13.jpeg', desc:'Garoupa vermelha premium. Frutos do mar selecionados.'},
    { sku: 'SKU0035', nome: 'Bacalhau fresco', preco: 4500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/Bacalhau fresco.jpg', desc:'Bacalhau fresco. Tradição e qualidade.'},
    { sku: 'SKU0036', nome: 'Peixe Santo Antônio', preco: 3100, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe santo antonio.jpg', desc:'Peixe Santo Antônio. Peixaria em Angola.'},
    { sku: 'SKU0037', nome: 'Peixe Garoupas', preco: 6850, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/garoupas.jpg', desc:'Garoupas maiores. Pescados frescos diariamente.'},
    { sku: 'SKU0038', nome: 'Garoupa cherne', preco: 7250, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/garoupas.jpg', desc:'Garoupa tipo cherne. Qualidade superior.'},
    { sku: 'SKU0039', nome: 'Corvinas grandes', preco: 6850, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/corvina.jpg', desc:'Corvinas grandes. Ideal para famílias.'},
    { sku: 'SKU0040', nome: 'Peixe Liro', preco: 6500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe liro.jpg', desc:'Peixe Liro fresco. Entrega em Luanda.'},
    { sku: 'SKU0041', nome: 'Peixe Pargo', preco: 6200, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe pargo.jpg', desc:'Pargo saboroso. Peixaria online de confiança.'},
    { sku: 'SKU0042', nome: 'Peixe Piazeite', preco: 4300, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe piazeite.jpg', desc:'Piazeite fresco. Melhor preço em Angola.'},
    { sku: 'SKU0043', nome: 'Peixe Barbudo', preco: 5500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe barbudo.jpg', desc:'Barbudo, muito apreciado. Qualidade garantida.'},
    { sku: 'SKU0044', nome: 'Peixe Parguete', preco: 5700, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe parguete.jpg', desc:'Parguete fresco. Peixaria L&A Pescados e Mariscos.'},
    { sku: 'SKU0045', nome: 'Corvinas de prato', preco: 4200, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/corvina.jpg', desc:'Corvinas para prato. Frescor garantido.'},
    { sku: 'SKU0046', nome: 'Tacutaco', preco: 4500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/tacutaco.jpg', desc:'Tacutaco saboroso. Mariscos e peixes frescos.'},
    { sku: 'SKU0047', nome: 'Linguados', preco: 4500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/linguado.jpg', desc:'Linguados macios. Qualidade premium Angola.'},
    { sku: 'SKU0048', nome: 'Corvinas brancas/pretas médias', preco: 6300, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/corvina.jpg', desc:'Corvinas mistas médias. Variedade e qualidade.'},
    { sku: 'SKU0049', nome: 'Caxuxu', preco: 4500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe caxuxo.jpg', desc:'Caxuxu fresco. Peixaria em Luanda com entrega.'},
    { sku: 'SKU0050', nome: 'Carapau médio', preco: 5300, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/carapau medio.jpg', desc:'Carapau médio. Fresco todos os dias.'},
    { sku: 'SKU0051', nome: 'Carapau pequeno', preco: 2900, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/carapau pequeno.jpg', desc:'Carapau pequeno para fritar. Preço competitivo.'},
    { sku: 'SKU0052', nome: 'Atum', preco: 2950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/atum.jpg', desc:'Atum fresco. Melhor peixaria de Angola.'},
    { sku: 'SKU0053', nome: 'Peixe dourado', preco: 4950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe dourado.jpg', desc:'Peixe dourado fresco. Qualidade e sabor.'},
    { sku: 'SKU0054', nome: 'Peixe prata', preco: 4950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe prata.jpg', desc:'Peixe prata. Pescados selecionados.'},
    { sku: 'SKU0055', nome: 'Peixe Ferreira', preco: 3500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe ferreira.jpg', desc:'Peixe Ferreira. Tradição em peixaria.'},
    { sku: 'SKU0056', nome: 'Caixa de caranguejo 28/30 (5kg)', preco: 11500, unidade:'caixa (5kg)', categoria:'mariscos', img:'../../Images/Produtos/caixa de caranguejo.jpg', desc:'Caixa com 28-30 caranguejos (cerca 5kg). Ideal para eventos.'},
    { sku: 'SKU0057', nome: 'Caranguejo kg (avulso)', preco: 3000, unidade:'kg', categoria:'mariscos', img:'../../Images/Produtos/caranguejo santola2.jpg', desc:'Caranguejo por kg. Mariscos frescos Luanda.'},
    { sku: 'SKU0058', nome: 'Peixe galo', preco: 4950, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe galo.jpg', desc:'Peixe galo. Peixaria online Angola.'},
    { sku: 'SKU0059', nome: 'Peixe Ticherra', preco: 3500, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe ticherra.jpg', desc:'Ticherra fresco. Entrega rápida em Luanda.'},
    { sku: 'SKU0060', nome: 'Peixe Arrancador', preco: 3300, unidade:'kg', categoria:'peixes', img:'../../Images/Produtos/peixe arrancador.jpg', desc:'Arrancador de qualidade. L&A Pescados e Mariscos.'},

    /* FILETES - OTIMIZADO PARA "FILETES DE PEIXE ANGOLA" */
    { sku: 'SKU0061', nome: 'Filetes de atum', preco: 10500, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de atum.jpg', desc:'Filetes limpos de atum. Práticos e saborosos.'},
    { sku: 'SKU0062', nome: 'Filete de Garoupas', preco: 17850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de garoupa.jpg', desc:'Filete premium de garoupa. Alta qualidade.'},
    { sku: 'SKU0063', nome: 'Filetes de pescada', preco: 13850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de pescado.jpg', desc:'Filetes de pescada. Filetes de peixe Angola.'},
    { sku: 'SKU0064', nome: 'Filetes de tilápia (chopas)', preco: 15850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de tilapia.jpg', desc:'Filetes de tilápia chopas. Prontos para cozinhar.'},
    { sku: 'SKU0065', nome: 'Filetes Corvinas', preco: 15850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de corvina.jpg', desc:'Filetes de corvina. Sabor e qualidade.'},
    { sku: 'SKU0066', nome: 'Filetes de dourado', preco: 13850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de dourado.jpg', desc:'Filetes de dourado. Peixaria L&A Angola.'},
    { sku: 'SKU0067', nome: 'Filetes de linguados', preco: 13850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de linguado.jpg', desc:'Filetes de linguados. Textura macia.'},
    { sku: 'SKU0068', nome: 'Filetes de piazete', preco: 12850, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de piazete.jpg', desc:'Filetes de piazete. Filetes frescos Luanda.'},
    { sku: 'SKU0069', nome: 'Filetes de Bacalhau', preco: 14500, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/lombo de bacalhau.jpg', desc:'Filetes de bacalhau. Tradição portuguesa.'},
    { sku: 'SKU0070', nome: 'Filetes de peixe Sofia', preco: 10500, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de sofia.jpg', desc:'Filetes do peixe Sofia. Práticos e saborosos.'},
    { sku: 'SKU0071', nome: 'Filetes de tubarão', preco: 10500, unidade:'kg', categoria:'filetes', img:'../../Images/Produtos/filete de tubarao.jpg', desc:'Filetes de tubarão. Textura firme.'},

    /* LOMBOS - OTIMIZADO PARA "LOMBOS DE PEIXE FRESCO" */
    { sku: 'SKU0072', nome: 'Lombos de Atum', preco: 10000, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/lombo de atum.jpg', desc:'Lombo de atum. Cortes premium Angola.'},
    { sku: 'SKU0073', nome: 'Lombos de pescada', preco: 13200, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/filete de pescado.jpg', desc:'Lombo de pescada. Qualidade superior.'},
    { sku: 'SKU0074', nome: 'Lombos de piazete', preco: 12100, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/filete de piazete.jpg', desc:'Lombo de piazete. Sabor intenso.'},
    { sku: 'SKU0075', nome: 'Lombos de garoupa', preco: 17300, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/filete de garoupa.jpg', desc:'Lombo de garoupa premium. Melhor peixaria Luanda.'},
    { sku: 'SKU0076', nome: 'Lombos de Sofia', preco: 9000, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/filete de sofia.jpg', desc:'Lombo de Sofia. Frescor garantido.'},
    { sku: 'SKU0077', nome: 'Lombos de tubarão', preco: 9000, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/filete de tubarao.jpg', desc:'Lombo de tubarão. Textura única.'},
    { sku: 'SKU0078', nome: 'Lombos de Corvinas', preco: 15300, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/filete de corvina.jpg', desc:'Lombo de corvina grande. Ideal para assar.'},
    { sku: 'SKU0079', nome: 'Lombos de bacalhau', preco: 12500, unidade:'kg', categoria:'lombos', img:'../../Images/Produtos/lombo de bacalhau.jpg', desc:'Lombo de bacalhau. Sabor tradicional.'}
  ];

  // ==================== GERENCIAMENTO DE ESTADO ====================
  const state = {
    currentProducts: [],
    cart: [],
    filters: {
      categoria: 'todos',
      search: ''
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

    toggleProduct: (product) => {
      const cart = cartManager.getCart();
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

      cartManager.saveCart(cart);
      return cart;
    },

    isInCart: (sku) => {
      const cart = cartManager.getCart();
      return cart.some(item => item.sku === sku);
    }
  };

  // ==================== RENDERIZAÇÃO DE PRODUTOS ====================
  const productRenderer = {
    createProductCard: (product) => {
      const inCart = cartManager.isInCart(product.sku);
      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-sku', product.sku);
      card.setAttribute('data-category', product.categoria);
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `${product.nome} - ${utils.formatCurrency(product.preco)} ${CONFIG.CURRENCY} por ${product.unidade}`);

      card.innerHTML = `
        <div class="product-image-container">
          <img 
            class="lazy" 
            data-src="${product.img}" 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E"
            alt="${product.nome} - ${product.desc}"
            loading="lazy"
            width="300"
            height="200"
            onerror="this.src='${CONFIG.PLACEHOLDER_IMAGE}'; this.classList.remove('lazy')"
          >
          <div class="category-badge">${getCategoryName(product.categoria)}</div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.nome}</h3>
          <p class="product-description">${product.desc}</p>
          <p class="product-price">${utils.formatCurrency(product.preco)} ${CONFIG.CURRENCY} / ${product.unidade}</p>
          <button class="add-cart-btn ${inCart ? 'in-cart' : ''}" 
                  aria-label="${inCart ? 'Remover' : 'Adicionar'} ${product.nome} do carrinho"
                  data-sku="${product.sku}">
            <i class='bx ${inCart ? 'bx-check' : 'bx-cart-add'}'></i>
            <span>${inCart ? 'No Carrinho' : 'Adicionar'}</span>
          </button>
        </div>
      `;

      productRenderer.attachCardEventListeners(card, product);
      return card;
    },

    attachCardEventListeners: (card, product) => {
      // Apenas o botão de carrinho é clicável agora
      const addBtn = card.querySelector('.add-cart-btn');
      addBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        productRenderer.handleAddToCart(product, addBtn);
      });

      // Lazy loading da imagem
      const img = card.querySelector('img');
      if (utils.lazyLoadObserver) {
        utils.lazyLoadObserver.observe(img);
      }
    },

    handleAddToCart: (product, button) => {
      // Feedback visual imediato
      button.classList.add('adding');
      button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i><span>Adicionando...</span>';

      setTimeout(() => {
        const newCart = cartManager.toggleProduct(product);
        const nowInCart = cartManager.isInCart(product.sku);

        button.classList.toggle('in-cart', nowInCart);
        button.innerHTML = nowInCart ? 
          '<i class="bx bx-check"></i><span>No Carrinho</span>' : 
          '<i class="bx bx-cart-add"></i><span>Adicionar</span>';

        button.classList.remove('adding');

        // Feedback de acessibilidade
        const message = nowInCart ? 
          `${product.nome} adicionado ao carrinho` : 
          `${product.nome} removido do carrinho`;
        
        productRenderer.showFeedbackMessage(message);
      }, 300);
    },

    showFeedbackMessage: (message) => {
      const existingMessage = document.querySelector('.cart-feedback-message');
      if (existingMessage) existingMessage.remove();

      const feedback = document.createElement('div');
      feedback.className = 'cart-feedback-message';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      feedback.textContent = message;
      
      document.body.appendChild(feedback);

      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 3000);
    },

    renderProductsGrid: (products) => {
      const listaEl = document.getElementById('lista-produtos');
      if (!listaEl) return;

      utils.perfMetrics.start();

      // Limpa container
      listaEl.innerHTML = '';

      if (products.length === 0) {
        listaEl.innerHTML = `
          <div class="no-products" role="status" aria-live="polite">
            <i class='bx bx-search-alt'></i>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente ajustar os filtros ou termos de busca</p>
          </div>
        `;
        utils.perfMetrics.end('Renderização - Sem produtos');
        return;
      }

      // Renderiza produtos
      products.forEach(product => {
        const card = productRenderer.createProductCard(product);
        listaEl.appendChild(card);
      });

      // Atualiza schema markup para SEO
      generateProductSchema(products);

      utils.perfMetrics.end(`Renderização - ${products.length} produtos`);
    }
  };

  // ==================== FILTROS E BUSCA ====================
  const filterManager = {
    init: () => {
      const filtroEl = document.getElementById('categoria');
      const buscaEl = document.getElementById('pesquisa');

      if (filtroEl) {
        filtroEl.addEventListener('change', filterManager.handleFilterChange);
      }

      if (buscaEl) {
        const debouncedSearch = utils.debounce(filterManager.handleSearch, CONFIG.DEBOUNCE_DELAY);
        buscaEl.addEventListener('input', debouncedSearch);
        buscaEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            filterManager.handleSearch();
          }
        });
      }
    },

    handleFilterChange: (event) => {
      state.filters.categoria = event.target.value;
      filterManager.applyFilters();
    },

    handleSearch: () => {
      const buscaEl = document.getElementById('pesquisa');
      state.filters.search = buscaEl ? buscaEl.value.trim().toLowerCase() : '';
      filterManager.applyFilters();
    },

    applyFilters: () => {
      utils.perfMetrics.start();

      const filteredProducts = PRODUCTS.filter(product => {
        const matchesCategory = !state.filters.categoria || 
                               state.filters.categoria === 'todos' || 
                               product.categoria === state.filters.categoria;
        
        const matchesSearch = !state.filters.search || 
                             product.nome.toLowerCase().includes(state.filters.search) ||
                             product.desc.toLowerCase().includes(state.filters.search);

        return matchesCategory && matchesSearch;
      });

      state.currentProducts = filteredProducts;
      productRenderer.renderProductsGrid(filteredProducts);

      // Atualiza contador de resultados
      filterManager.updateResultsCount(filteredProducts.length);
    },

    updateResultsCount: (count) => {
      let counterEl = document.getElementById('results-counter');
      
      if (!counterEl) {
        counterEl = document.createElement('div');
        counterEl.id = 'results-counter';
        counterEl.className = 'results-counter';
        counterEl.setAttribute('aria-live', 'polite');
        
        const filtrosContainer = document.querySelector('.filtros');
        if (filtrosContainer) {
          filtrosContainer.appendChild(counterEl);
        }
      }

      counterEl.textContent = `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
  };

  // ==================== INICIALIZAÇÃO ====================
  const init = () => {
    // Inicializa utilitários
    utils.initLazyLoading();
    
    // Inicializa componentes
    filterManager.init();

    // Renderiza produtos iniciais
    state.currentProducts = PRODUCTS;
    productRenderer.renderProductsGrid(PRODUCTS);

    // Carrega carrinho
    state.cart = cartManager.getCart();

    // Schema markup inicial
    generateProductSchema(PRODUCTS);

    console.log('✅ produtos.js inicializado - Versão sem popup');
  };

  // ==================== EXPORTAÇÃO PARA ESCOPO GLOBAL ====================
  window.produtosHelpers = {
    renderProducts: () => productRenderer.renderProductsGrid(state.currentProducts),
    PRODUCTS,
    cartManager,
    filterManager,
    utils
  };

  // ==================== INICIALIZAÇÃO QUANDO DOM ESTIVER PRONTO ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();