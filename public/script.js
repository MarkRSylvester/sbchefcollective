// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('.header-nav');
const siteHeader = document.querySelector('.site-header');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    headerNav.classList.toggle('active');
});

// Header scroll effects
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for background change
    if (currentScroll > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide/show header based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        headerNav.classList.remove('active');
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.header-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        headerNav.classList.remove('active');
    });
}); 