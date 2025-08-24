// Kansa Business Website - Interactive JavaScript

// Loading Screen Management
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Show loading screen for minimum time
window.addEventListener('load', function() {
    // Minimum loading time of 2 seconds
    setTimeout(hideLoadingScreen, 2000);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations with mobile optimization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 // Disable on mobile for better performance
        });
    }
    
    // Mobile menu functionality with improved stability
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuToggle && mobileMenu) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }
    
    function openMobileMenu() {
        if (mobileMenu && mobileMenuToggle) {
            mobileMenuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
    }
    
    function closeMobileMenu() {
        if (mobileMenu && mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }
    
    // Navbar scroll effect with throttling for better performance
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Change navbar background on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.webkitBackdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.webkitBackdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Smooth scrolling for anchor links with mobile optimization
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
                
                // Use smooth scroll on desktop, instant on mobile for better performance
                if (window.innerWidth >= 768) {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'auto'
                    });
                }
            }
        });
    });
    
    // Button hover effects with touch device detection
    const buttons = document.querySelectorAll('.btn');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Carousel functionality with mobile optimization
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const totalSlides = slides.length;
    let autoSlideInterval;
    const slideDelay = 6000; // 6 seconds per slide
    let isAutoPlaying = true;

    function showSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        
        currentSlide = index;
        
        // Update progress bar
        updateProgressBar();
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    function startAutoSlide() {
        if (isAutoPlaying && !autoSlideInterval) {
            autoSlideInterval = setInterval(nextSlide, slideDelay);
        }
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    function updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }
    }

    // Event listeners for carousel controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                showSlide(index);
                startAutoSlide();
            });
        });
    }

    // Pause on hover (desktop only)
    if (!isTouchDevice) {
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
        }
    }

    // Touch/swipe support for mobile with improved stability
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = false;
    }

    function handleTouchMove(e) {
        if (!isSwiping) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const diffX = Math.abs(touchStartX - touchEndX);
            const diffY = Math.abs(touchStartY - touchEndY);
            
            // Only start swiping if horizontal movement is greater than vertical
            if (diffX > diffY && diffX > 10) {
                isSwiping = true;
            }
        }
    }

    function handleTouchEnd(e) {
        if (isSwiping) {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                stopAutoSlide();
                if (diff > 0) {
                    nextSlide(); // Swipe left - next slide
                } else {
                    prevSlide(); // Swipe right - previous slide
                }
                startAutoSlide();
            }
        }
        
        isSwiping = false;
    }

    // Add touch event listeners to carousel
    const carousel = document.querySelector('.hero-carousel');
    if (carousel && isTouchDevice) {
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Keyboard navigation with mobile consideration
    if (!isTouchDevice) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            }
        });
    }

    // Start auto-slide
    if (totalSlides > 1) {
        startAutoSlide();
        
        // Pause auto-slide when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });
    }
    
    // Utility function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Apply throttling to scroll events for better performance
    const throttledScrollHandler = throttle(function() {
        // Scroll-based animations can be added here
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Preload critical images for better performance
    function preloadImages() {
        const imageUrls = [
            'img/carosels/busn.jpg',
            'img/carosels/logiciel.jpg',
            'img/carosels/rx.jpg',
            'img/carosels/equpem.jpg',
            'img/carosels/logi.jpg',
            'img/carosels/innov.jpg'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Only preload images on desktop for better mobile performance
    if (!isTouchDevice) {
        preloadImages();
    }
    
    // Initialize first slide
    if (slides.length > 0) {
        showSlide(0);
    }
});

// Scroll to section function with mobile optimization
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for navbar
        
        // Use smooth scroll on desktop, instant on mobile
        if (window.innerWidth >= 768) {
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: offsetTop,
                behavior: 'auto'
            });
        }
    }
}

// Modal functionality
function openModal(app) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalImage || !modalTitle || !modalBody) return;

    switch(app) {
        case 'kelasi':
            modalImage.src = 'img/logos/kelasi.jpg';
            modalTitle.textContent = 'Kelasi na Biso';
            modalBody.textContent = `Kelasi na Biso est une solution numérique innovante conçue pour moderniser la gestion des établissements éducatifs (écoles, instituts, centres de formation). Elle permet :
- Gestion administrative complète (apprenants, enseignants, classes, programmes)
- Suivi financier avec paiement en ligne des frais
- Communication fluide avec les familles et notifications
- Consultation des résultats et progrès des apprenants
- Collaboration entre le personnel éducatif et les familles.`;
            break;
        case 'congoHotel':
            modalImage.src = 'img/logos/mabota.jpg';
            modalTitle.textContent = 'Congo Hôtel';
            modalBody.textContent = `Congo Hôtel est une application innovante destinée à la gestion complète des hôtels. Elle offre :
- Gestion des réservations et disponibilités en temps réel
- Suivi des services : chambres, restauration, événements
- Communication avec les clients et gestion de leurs demandes
- Tableau de bord centralisé pour suivi de performance et satisfaction client.`;
            break;
        case 'kArchive':
            modalImage.src = 'img/logos/k_archi.jpg';
            modalTitle.textContent = 'K-Archive Pro';
            modalBody.textContent = `K-Archive Pro est une solution numérique sécurisée pour entreprises et institutions. Elle permet :
- Centralisation et sécurisation des documents
- Archivage organisé par catégorie ou projet
- Accès contrôlé pour le personnel autorisé
- Traçabilité complète des consultations et modifications
- Réduction des risques de perte et optimisation de l'espace de stockage.`;
            break;
        case 'ndaku':
            modalImage.src = 'img/logos/ndaku.jpg';
            modalTitle.textContent = 'Ndaku';
            modalBody.textContent = `Ndaku est une application complète pour la gestion immobilière. Elle permet :
- Publication des biens à vendre ou louer
- Consultation des offres et contact avec les propriétaires
- Gestion sécurisée des transactions
- Optimisation de la visibilité des biens
- Collaboration entre vendeurs, acheteurs et locataires pour des transactions efficaces.`;
            break;
    }

    modal.style.display = "block";
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = "none";
    }
}
