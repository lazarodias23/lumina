document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Menu Mobile --- */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Fechar menu ao clicar em um link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    /* --- Navbar Scroll Effect (Headroom: Hide on Down, Show on Up) --- */
    const navbar = document.getElementById('navbar');
    
    // Apenas executa a lógica de scroll se o navbar estático existir (para páginas legadas/estáticas)
    if (navbar) {
        let lastScrollTop = 0;
        const delta = 5; // Tolerância para evitar flickering

        window.addEventListener('scroll', () => {
            // Obter posição atual (com proteção para valores negativos no Safari mobile)
            const scrollTop = Math.max(0, window.scrollY || document.documentElement.scrollTop);
            const isMobileMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');

            // 1. Estilização do Fundo (Transparência vs Sólido)
            if (scrollTop > 20) {
                navbar.classList.add('bg-ivory-100/90', 'backdrop-blur-xl', 'border-bronze-200/50', 'shadow-sm');
                navbar.classList.remove('border-transparent', 'py-8');
                navbar.classList.add('py-4');
            } else {
                navbar.classList.remove('bg-ivory-100/90', 'backdrop-blur-xl', 'border-bronze-200/50', 'shadow-sm', 'py-4');
                navbar.classList.add('border-transparent', 'py-8');
            }

            // 2. Lógica de Esconder/Mostrar Navbar
            // Só executa se a diferença de scroll for maior que o delta
            if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

            // Se o menu mobile estiver aberto, NÃO esconde a barra
            if (!isMobileMenuOpen) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Rolando para BAIXO e não está no topo -> Esconde
                    navbar.classList.add('-translate-y-full');
                } else {
                    // Rolando para CIMA ou perto do topo -> Mostra
                    if(scrollTop + window.innerHeight < document.body.scrollHeight) {
                        navbar.classList.remove('-translate-y-full');
                    }
                }
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    /* --- Fade In Animation (Intersection Observer) --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));

    /* --- Mobile Testimonials Auto-Scroll (Rodando devagar) --- */
    const carousel = document.getElementById('testimonials-carousel');
    
    if (carousel && window.innerWidth < 768) {
        let scrollAmount = 0;
        const speed = 0.5; // Velocidade lenta
        let isPaused = false;
        
        // Pausar ao tocar/passar o mouse
        carousel.addEventListener('touchstart', () => isPaused = true);
        carousel.addEventListener('touchend', () => setTimeout(() => isPaused = false, 2000));
        carousel.addEventListener('mouseenter', () => isPaused = true);
        carousel.addEventListener('mouseleave', () => isPaused = false);

        function autoScroll() {
            if (!isPaused) {
                scrollAmount += speed;
                carousel.scrollLeft = scrollAmount;
                
                // Resetar se chegar ao fim
                if (Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth) {
                    scrollAmount = 0;
                    carousel.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScroll);
        }
        
        // Iniciar após um pequeno delay para carregar layout
        setTimeout(() => {
            autoScroll();
        }, 1000);
    }


    /* --- Form Submission Mock --- */
    const form = document.getElementById('contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Enviando...';
            btn.disabled = true;
            btn.classList.add('opacity-75');

            setTimeout(() => {
                alert('Solicitação recebida com sucesso! Nossa equipe entrará em contato em breve.');
                form.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                btn.classList.remove('opacity-75');
            }, 1500);
        });
    }
});