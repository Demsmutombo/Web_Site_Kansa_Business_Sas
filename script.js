// Tesla Website Clone - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
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
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 56; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for section animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all hero sections
    const heroSections = document.querySelectorAll('.hero-section');
    heroSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
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
    
    // Parallax effect for hero backgrounds
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.car-placeholder');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Dynamic text animation
    function animateText(element, text, delay = 50) {
        element.textContent = '';
        element.style.opacity = '1';
        
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                element.textContent += text[i];
            }, delay * i);
        }
    }
    
    // Animate hero titles when they come into view
    const heroTitles = document.querySelectorAll('.hero-text h1');
    const titleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const originalText = entry.target.textContent;
                animateText(entry.target, originalText, 100);
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    heroTitles.forEach(title => {
        titleObserver.observe(title);
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Arrow keys for section navigation
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            scrollToNextSection();
        } else if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            scrollToPrevSection();
        }
    });
    
    function scrollToNextSection() {
        const currentScroll = window.pageYOffset;
        const sections = document.querySelectorAll('.hero-section');
        
        for (let section of sections) {
            if (section.offsetTop > currentScroll + 100) {
                section.scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }
    
    function scrollToPrevSection() {
        const currentScroll = window.pageYOffset;
        const sections = Array.from(document.querySelectorAll('.hero-section')).reverse();
        
        for (let section of sections) {
            if (section.offsetTop < currentScroll - 100) {
                section.scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }
    
    // Carousel functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const totalSlides = slides.length;
    let autoSlideInterval;
    const slideDelay = 6000; // 6 seconds per slide

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
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
        autoSlideInterval = setInterval(nextSlide, slideDelay);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Pause on hover
    const carousel = document.querySelector('.hero-carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
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

    // Keyboard navigation
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

    // Initialize carousel if slides exist
    if (slides.length > 0) {
        startAutoSlide();
    }

    // Loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate first slide immediately
        const firstSlide = document.querySelector('.carousel-slide.active');
        if (firstSlide) {
            setTimeout(() => {
                firstSlide.style.opacity = '1';
                firstSlide.style.transform = 'translateY(0)';
            }, 300);
        }
    });
    
    // Touch gestures for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - next section
                scrollToNextSection();
            } else {
                // Swipe down - previous section
                scrollToPrevSection();
            }
        }
    }
    
    // Performance optimization: Throttle scroll events
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
    
    // Apply throttling to scroll events
    const throttledScrollHandler = throttle(function() {
        // Scroll-based animations can be added here
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Preload images for better performance
    function preloadImages() {
        const imageUrls = [
            // Add actual Tesla car images here when available
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    preloadImages();
});

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}


function openModal(app) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

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
- Réduction des risques de perte et optimisation de l’espace de stockage.`;
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
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}
