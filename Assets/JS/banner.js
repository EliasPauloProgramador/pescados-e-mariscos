// Seleciona todos os slides
const slides = document.querySelectorAll('.banner-slider .slide');
let currentSlide = 0;

// Função para passar para o próximo slide
function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Troca de slide a cada 5 segundos
setInterval(nextSlide, 5000);
