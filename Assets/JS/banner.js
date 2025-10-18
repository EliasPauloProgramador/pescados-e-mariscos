/**
 * BANNER.JS - CORREÇÃO FINAL E OTIMIZAÇÃO
 */

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.banner-slider .slide');
    const indicators = document.querySelectorAll('.slider-indicators .indicator');
    let currentSlide = 0;
    let slideshowInterval = null;

    if (slides.length === 0) {
        console.warn('❌ Nenhum slide encontrado');
        return;
    }

    function nextSlide() {
        try {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            updateIndicators();
        } catch (error) {
            console.error('Erro no slider:', error);
        }
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function startSlideshow() {
        if (!slideshowInterval && slides.length > 1) {
            slideshowInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopSlideshow() {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }

    // Ativar indicadores clicáveis
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            updateIndicators();
        });
    });

    // Pausar ao abrir menu mobile (custom event)
    document.addEventListener('menuStateChange', (e) => {
        if (e.detail.isOpen) stopSlideshow();
        else startSlideshow();
    });

    // Inicia o slider
    startSlideshow();
});