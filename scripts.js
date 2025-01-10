// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize slider
    showSlide(0);
    setInterval(nextSlide, 3000);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize Bootstrap components
    const carousel = new bootstrap.Carousel(document.querySelector('#heroSlider'), {
        interval: 3000,
        touch: true
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Pin tooltips
    const pins = document.querySelectorAll('.pin');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    pins.forEach(pin => {
        pin.addEventListener('mouseenter', (e) => {
            const location = e.target.dataset.location;
            const rect = e.target.getBoundingClientRect();
            
            tooltip.textContent = location;
            tooltip.style.left = `${rect.left + rect.width/2}px`;
            tooltip.style.top = `${rect.top - 30}px`;
            tooltip.style.opacity = '1';
        });

        pin.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // Animate connection lines
    const lines = document.querySelectorAll('.connection-line');
    lines.forEach(line => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        line.style.animation = 'drawLine 2s forwards';
    });

    // Add delay for staggered animation
    const markers = document.querySelectorAll('.map-marker');
    markers.forEach((marker, index) => {
        marker.style.setProperty('--delay', index);
    });

    // Add connection line animation delay
    const paths = document.querySelectorAll('.connection-lines path');
    paths.forEach((path, index) => {
        path.style.animationDelay = `${index * 0.2}s`;
    });

    // Animate route lines
    const routes = document.querySelectorAll('.route-line');
    
    function animateRoutes() {
        routes.forEach((route, index) => {
            const length = route.getTotalLength();
            route.style.strokeDasharray = length;
            route.style.animation = `drawRoute 3s linear ${index * 0.5}s`;
        });

        setTimeout(() => {
            routes.forEach(route => {
                route.style.animation = 'none';
                setTimeout(() => animateRoutes(), 100);
            });
        }, (routes.length * 0.5 + 3) * 1000);
    }

    animateRoutes();

    // Add route line animation delay
    routes.forEach((route, index) => {
        route.style.animationDelay = `${index * 0.5}s`;
    });

    // Add animation delays to pins
    const mapPins = document.querySelectorAll('.map-pin');
    mapPins.forEach((pin, index) => {
        pin.style.setProperty('--delay', index);
    });

    // Animate routes
    function animateMapRoutes() {
        routes.forEach((route, index) => {
            const length = route.getTotalLength();
            route.style.strokeDasharray = length;
            route.style.animation = `drawRoute 2s ${index * 0.3}s forwards`;
        });

        // Reset and repeat animation
        setTimeout(() => {
            routes.forEach(route => {
                route.style.animation = 'none';
                route.offsetHeight;
            });
            setTimeout(animateMapRoutes, 100);
        }, routes.length * 300 + 2000);
    }

    // Start animation
    animateMapRoutes();

    // Navigation functionality
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavigation(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.classList.add('slide-exit');
                setTimeout(() => {
                    section.classList.remove('active', 'slide-exit');
                }, 600);
            }
        });

        setTimeout(() => {
            targetSection.classList.add('active', 'slide-enter');
            window.history.pushState({}, '', `#${targetId}`);
        }, 600);
    }

    // Initialize observers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
    navLinks.forEach(link => link.addEventListener('click', handleNavigation));

    // Smooth scroll navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, targetId);
        });
    });

    // Active nav item on scroll
    const sectionsWithId = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const navHeight = document.querySelector('.navbar').offsetHeight;

        sectionsWithId.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 10;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navItem = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navItem?.classList.add('active');
            } else {
                navItem?.classList.remove('active');
            }
        });
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        delay: 100
    });

    // Refresh AOS on dynamic content changes
    setTimeout(() => {
        AOS.refresh();
    }, 500);
});



async function fetchMetrics() {
    try {
        const response = await fetch('data/metrics.json');
        // ...existing code...
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return null;
    }
}
