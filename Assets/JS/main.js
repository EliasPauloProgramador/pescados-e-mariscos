// Inicializa o ScrollReveal apenas UMA vez
document.addEventListener("DOMContentLoaded", () => {
    const sr = ScrollReveal({
        distance: '50px',
        duration: 1000,
        easing: 'ease-out',
        reset: false // Desativado para evitar animações repetidas
    });

    // Aplica nas sections da página principal
    sr.reveal('.banner h2, .banner p, .banner-btn', { 
        origin: 'top', 
        delay: 200 
    });

    sr.reveal('.product-card', { 
        origin: 'bottom', 
        interval: 200 
    });

    sr.reveal('.step', { 
        origin: 'bottom', 
        interval: 200 
    });

    sr.reveal('.contact-card', { 
        origin: 'bottom', 
        interval: 200 
    });

    sr.reveal('.footer-container > *', { 
        origin: 'top', 
        interval: 200 
    });

    // Animações específicas para elementos únicos
    sr.reveal('.produtos h2, .highlight-text', { 
        origin: 'left',
        delay: 300
    });

    sr.reveal('.como-usar h2, .intro', { 
        origin: 'right',
        delay: 300
    });

    sr.reveal('.contato-header h2, .contato-header p', { 
        origin: 'top',
        delay: 200
    });
});