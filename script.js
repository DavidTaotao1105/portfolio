// Image Modal Functions
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImage.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the image
window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Native compositor smooth scrolling for navigation and anchor links
const navbar = document.querySelector('.navbar');
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight : 0;
            const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset + 2);
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
    });
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Lightweight staggered scroll reveal animations
document.querySelectorAll('.skills-grid, .achievements-grid, .projects-stack, .contact-grid').forEach(group => {
    group.querySelectorAll('.animate-on-scroll').forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index, 3) * 35}ms`;
    });
});

const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Cached layout metrics + GPU-only scroll updates
const scrollProgress = document.getElementById('scrollProgress');
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

let maxScroll = 1;
let navOffset = 160;
let sectionTops = [];

function measureLayout() {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    navOffset = (navbar ? navbar.offsetHeight : 0) + 120;
    sectionTops = sections.map(sec => ({ id: sec.id, top: sec.offsetTop }));
}

let scrollTicking = false;
function updateOnScroll() {
    const scrollY = window.scrollY;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    scrollProgress.style.transform = `scaleX(${progress})`;

    navbar.classList.toggle('scrolled', scrollY > 80);
    backToTopBtn.classList.toggle('visible', scrollY > 360);

    let activeId = '';
    for (let i = 0; i < sectionTops.length; i++) {
        if (scrollY + navOffset >= sectionTops[i].top) {
            activeId = sectionTops[i].id;
        }
    }
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.toggle('active', navLinks[i].getAttribute('href') === `#${activeId}`);
    }

    scrollTicking = false;
}

window.addEventListener('resize', () => {
    measureLayout();
    updateOnScroll();
}, { passive: true });

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateOnScroll);
        scrollTicking = true;
    }
}, { passive: true });

measureLayout();
updateOnScroll();
