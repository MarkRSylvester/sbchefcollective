/* @ts-check */
/* Content-Type: text/javascript */

/**
 * app.js - Main application logic for Santa Barbara Chef Collective
 */

// Constants
const API_ENDPOINT = '/.netify/functions';
const DEFAULT_IMAGES = {
    CHEF: '/assets/images/chef/default-chef.jpg',
    MENU: '/assets/images/menu/default-menu.jpg',
    HERO: '/assets/images/hero/default-hero.jpg',
    BG: '/assets/images/background/default-bg.jpg',
    SECTION_BREAK: '/assets/images/section-break/default-break.jpg',
    ACCENT: '/assets/images/accent/default-accent.jpg',
    SERVICE: '/assets/images/service/default-service.jpg'
};

// Global variables
let approvedImages = {
    HERO: [],
    BG: [],
    SECTION_BREAK: [],
    ACCENT: [],
    MENU: [],
    SERVICE: []
};

let userPreferences = null;
let currentOpenAccordion = null;

// Button references for tab navigation (add these at the top, after constants)
const chefsButton = document.getElementById('chefsButton');
const menusButton = document.getElementById('menusButton');
const servicesButton = document.getElementById('servicesButton');
const faqButton = document.getElementById('faqButton');
const experienceButton = document.getElementById('experienceButton');
const planGatheringButton = document.getElementById('planGatheringButton');
const personalChefButton = document.getElementById('personalChefButton');

// --- DOM ELEMENT REFERENCES ---
// Only reference elements that exist in the HTML
const menuToggle = document.querySelector('.menu-toggle');
const navOverlay = document.querySelector('.nav-overlay');
const inquiryForm = document.getElementById('inquiryForm');
const viewAllChefs = document.querySelector('#viewAllChefs');
const viewAllMenus = document.querySelector('#viewAllMenus');
const closeExploreModal = document.querySelector('#exploreModal .close-modal');
const tabButtons = document.querySelectorAll('.tab-button');

// --- MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeForms();
    loadApprovedImages();
    initializeSmoothScroll();
    initializeParallax();
    initializeHeaderScroll();
});

// --- EVENT LISTENERS SETUP ---
function initializeEventListeners() {
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    // Close menu when clicking a link
    if (navOverlay) {
        navOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }
    // Inquiry form submit
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }
    // Explore modal buttons
    if (viewAllChefs) {
        viewAllChefs.addEventListener('click', showAllChefs);
    }
    if (viewAllMenus) {
        viewAllMenus.addEventListener('click', showAllMenus);
    }
    if (closeExploreModal) {
        closeExploreModal.addEventListener('click', closeExplore);
    }
    // Tab buttons (if any)
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = button.dataset.tab;
                if (tabName) {
                    openTab(e, tabName);
                }
            });
        });
    }
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    // Modal outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

async function handleInquirySubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    
    // Remove any existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    try {
        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Check which form is being submitted
        const isSimpleForm = form.id === 'inquiryForm';
        
        // Gather form data based on which form is being submitted
        const formData = isSimpleForm ? {
            // Simple inquiry form fields
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            phone: form.querySelector('#phone').value,
            eventName: 'Consultation',
            eventDate: form.querySelector('#eventDate').value,
            eventTime: form.querySelector('#eventTime').value || '12:00',
            guestCount: form.querySelector('#guestCount').value,
            budgetPerPerson: '0',
            eventType: form.querySelector('#eventType').value,
            cuisinePreferences: 'None specified'
        } : {
            // Detailed event planning form fields
            name: form.querySelector('#clientName').value,
            email: form.querySelector('#clientEmail').value,
            phone: form.querySelector('#clientPhone').value,
            eventName: form.querySelector('#eventName').value || 'Consultation',
            eventDate: form.querySelector('#eventDate').value,
            eventTime: form.querySelector('#eventTime').value || '12:00',
            guestCount: form.querySelector('#guestCount').value,
            budgetPerPerson: form.querySelector('#budgetPerPerson').value || '0',
            eventType: form.querySelector('#eventType').value,
            cuisinePreferences: Array.from(form.querySelectorAll('input[name="cuisinePreference"]:checked')).map(cb => cb.value).join(', ') || 'None specified',
            eventAddress: `${form.querySelector('#address').value}, ${form.querySelector('#city').value}, ${form.querySelector('#zipCode').value}`
        };

        console.log('Submitting form data:', formData);

        // Submit to API
        const response = await fetch('/.netlify/functions/inquiries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit inquiry');
        }

        const result = await response.json();
        console.log('Submission successful:', result);

        // Show success message
        form.innerHTML = `
            <div class="success-message">
                <h3>Thank you for your inquiry!</h3>
                <p>We've received your request and will be in touch shortly.</p>
            </div>
        `;

    } catch (error) {
        console.error('Error processing form:', error);
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = error.message || 'There was an error processing your request. Please try again later.';
        form.insertBefore(errorDiv, submitBtn);
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        // Scroll error into view
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

async function fetchMatchingMenus(preferences) {
    try {
        const response = await fetch(`/.netlify/functions/getMenus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch menus');
        }

        const menus = await response.json();
        
        // Score each menu based on preferences
        const scoredMenus = menus.map(menu => {
            let score = 0;
            let matchDetails = [];
            
            // Event type match (highest priority - 30 points max)
            const eventTypeScore = calculateEventTypeScore(menu.type, preferences.eventType);
            score += eventTypeScore;
            if (eventTypeScore > 0) {
                matchDetails.push(`Event type match: ${menu.type}`);
            }
            
            // Budget range match (25 points max)
            const budgetScore = calculateBudgetScore(menu.priceRange, preferences.budgetPerPerson);
            score += budgetScore;
            if (budgetScore > 0) {
                matchDetails.push(`Budget match: ${menu.priceRange}`);
            }
            
            // Cuisine preferences match (20 points max)
            const cuisineScore = calculateCuisineScore(menu.cuisines, preferences.cuisinePreferences);
            score += cuisineScore;
            if (cuisineScore > 0) {
                matchDetails.push(`Cuisine matches: ${menu.cuisines?.join(', ')}`);
            }
            
            // Vibe match (15 points max)
            const vibeScore = calculateVibeScore(menu.vibe, preferences.eventVibe);
            score += vibeScore;
            if (vibeScore > 0) {
                matchDetails.push(`Vibe matches: ${menu.vibe}`);
            }
            
            // Guest count suitability (10 points max)
            const guestScore = calculateGuestScore(menu.minGuests, menu.maxGuests, preferences.guestCount);
            score += guestScore;
            if (guestScore > 0) {
                matchDetails.push(`Suitable for ${preferences.guestCount} guests`);
            }
            
            return { 
                ...menu, 
                score,
                matchDetails,
                matchPercentage: Math.round((score / 100) * 100)
            };
        });
        
        // Filter out menus with very low scores (less than 40%)
        const viableMenus = scoredMenus.filter(menu => menu.matchPercentage >= 40);
        
        // Sort by score and return top 3
        return viableMenus
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
            
    } catch (error) {
        console.error('Error fetching matching menus:', error);
        return FALLBACK_MENUS?.slice(0, 3) || [];
    }
}

// Helper functions for score calculation
function calculateEventTypeScore(menuType, preferredType) {
    if (!menuType || !preferredType) return 0;
    
    menuType = menuType.toLowerCase();
    preferredType = preferredType.toLowerCase();
    
    // Exact match
    if (menuType === preferredType) return 30;
    
    // Related event types
    const relatedTypes = {
        'wedding': ['rehearsal dinner', 'engagement party', 'bridal shower'],
        'corporate': ['business lunch', 'conference', 'team building'],
        'private dinner': ['date night', 'anniversary', 'birthday'],
        'special occasion': ['birthday', 'anniversary', 'celebration']
    };
    
    // Check for related event types
    if (relatedTypes[menuType]?.includes(preferredType) || 
        Object.entries(relatedTypes).find(([key, values]) => 
            key === preferredType && values.includes(menuType))) {
        return 20;
    }
    
    return 0;
}

function calculateBudgetScore(menuPriceRange, userBudget) {
    if (!menuPriceRange || !userBudget) return 0;
    
    // Convert price ranges to numbers for comparison
    const priceRanges = {
        'budget': [0, 50],
        'moderate': [51, 100],
        'premium': [101, 200],
        'luxury': [201, Infinity]
    };
    
    const userBudgetNum = parseInt(userBudget);
    let menuRange = priceRanges[menuPriceRange.toLowerCase()];
    
    if (!menuRange || isNaN(userBudgetNum)) return 0;
    
    // Perfect match - budget falls within range
    if (userBudgetNum >= menuRange[0] && userBudgetNum <= menuRange[1]) return 25;
    
    // Close match - within 20% of range
    const rangeMidpoint = (menuRange[0] + menuRange[1]) / 2;
    const difference = Math.abs(userBudgetNum - rangeMidpoint);
    const percentDiff = difference / rangeMidpoint;
    
    if (percentDiff <= 0.2) return 15;
    if (percentDiff <= 0.4) return 10;
    
    return 0;
}

function calculateCuisineScore(menuCuisines, userPreferences) {
    if (!menuCuisines || !userPreferences || !userPreferences.length) return 0;
    
    // Define related cuisines mapping
    const relatedCuisines = {
        'Italian': ['Mediterranean', 'Greek', 'Spanish'],
        'Mediterranean': ['Italian', 'Greek', 'Spanish', 'Middle Eastern'],
        'Greek': ['Mediterranean', 'Italian', 'Turkish', 'Middle Eastern'],
        'Spanish': ['Mediterranean', 'Italian', 'Portuguese'],
        'French': ['Italian', 'Mediterranean'],
        'Asian': ['Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese'],
        'Chinese': ['Asian', 'Japanese', 'Korean', 'Thai', 'Vietnamese'],
        'Japanese': ['Asian', 'Chinese', 'Korean'],
        'Thai': ['Asian', 'Vietnamese', 'Cambodian'],
        'Vietnamese': ['Asian', 'Thai', 'Cambodian'],
        'Mexican': ['Latin American', 'Spanish', 'Caribbean'],
        'Latin American': ['Mexican', 'Caribbean', 'Spanish'],
        'Caribbean': ['Latin American', 'Mexican', 'Spanish'],
        'Indian': ['Middle Eastern', 'Pakistani', 'Nepalese'],
        'Middle Eastern': ['Indian', 'Greek', 'Turkish', 'Mediterranean']
    };

    let score = 0;
    const maxPointsPerCuisine = 20 / userPreferences.length; // Distribute 20 points among preferences
    
    userPreferences.forEach(preferredCuisine => {
        // Direct match
        if (menuCuisines.includes(preferredCuisine)) {
            score += maxPointsPerCuisine;
            return;
        }
        
        // Check related cuisines
        const related = relatedCuisines[preferredCuisine] || [];
        const hasRelatedMatch = menuCuisines.some(cuisine => related.includes(cuisine));
        if (hasRelatedMatch) {
            score += maxPointsPerCuisine * 0.7; // 70% points for related cuisine match
        }
    });
    
    return Math.min(20, score); // Cap at 20 points
}

function calculateVibeScore(menuVibe, userVibes) {
    if (!menuVibe || !userVibes || !userVibes.length) return 0;
    
    // Define vibe categories and their related vibes
    const vibeCategories = {
        'Elegant': {
            related: ['Sophisticated', 'Luxurious', 'Refined', 'Upscale'],
            weight: 1.0
        },
        'Casual': {
            related: ['Relaxed', 'Laid-back', 'Informal', 'Comfortable'],
            weight: 0.8
        },
        'Rustic': {
            related: ['Farm-to-table', 'Country', 'Natural', 'Homestyle'],
            weight: 0.9
        },
        'Modern': {
            related: ['Contemporary', 'Minimalist', 'Clean', 'Innovative'],
            weight: 1.0
        },
        'Traditional': {
            related: ['Classic', 'Heritage', 'Time-honored', 'Authentic'],
            weight: 0.9
        },
        'Fusion': {
            related: ['Creative', 'Innovative', 'Eclectic', 'Contemporary'],
            weight: 0.8
        },
        'Seasonal': {
            related: ['Fresh', 'Local', 'Farm-to-table', 'Natural'],
            weight: 0.9
        },
        'Celebratory': {
            related: ['Festive', 'Party', 'Fun', 'Lively'],
            weight: 1.0
        }
    };

    let score = 0;
    const maxPointsPerVibe = 15 / userVibes.length; // Distribute 15 points among preferences
    
    userVibes.forEach(preferredVibe => {
        // Direct match
        if (menuVibe === preferredVibe) {
            score += maxPointsPerVibe;
            return;
        }
        
        // Check related vibes
        const category = Object.entries(vibeCategories).find(([key, value]) => 
            key === preferredVibe || value.related.includes(preferredVibe)
        );
        
        if (category) {
            const [mainVibe, { related, weight }] = category;
            if (menuVibe === mainVibe || related.includes(menuVibe)) {
                score += maxPointsPerVibe * weight;
            }
        }
    });
    
    return Math.min(15, score); // Cap at 15 points
}

function calculateGuestScore(minGuests, maxGuests, guestCount) {
    if (!minGuests || !maxGuests || !guestCount) return 0;
    
    const count = parseInt(guestCount);
    if (isNaN(count)) return 0;
    
    // Perfect fit
    if (count >= minGuests && count <= maxGuests) return 10;
    
    // Within 20% of range
    const rangeMidpoint = (minGuests + maxGuests) / 2;
    const difference = Math.abs(count - rangeMidpoint);
    const percentDiff = difference / rangeMidpoint;
    
    if (percentDiff <= 0.2) return 7;
    if (percentDiff <= 0.4) return 4;
    
    return 0;
}

function showMenuSelectionView(menus) {
    const form = document.getElementById('eventForm');
    const menuSelectionView = document.createElement('div');
    menuSelectionView.className = 'menu-selection-view';
    menuSelectionView.innerHTML = `
        <h2>Curated Menu Selections</h2>
        <p class="helper-text">Based on your preferences, we've selected these menus that would be perfect for your event.</p>
        <p class="dietary-note">Note: All our menus can be customized to accommodate dietary restrictions and preferences. Please let us know about any specific requirements when you submit your inquiry.</p>
        
        <div class="menu-grid">
            ${menus.map(menu => `
                <div class="menu-card" data-menu-id="${menu.id}">
                    <div class="menu-match-badge">${menu.matchPercentage}% Match</div>
                    <h3>${menu.name}</h3>
                    <p>${menu.description}</p>
                    <div class="menu-match-details">
                        <h4>Why this menu matches your preferences:</h4>
                        <ul>
                            ${menu.matchDetails.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="select-menu-btn" onclick="selectMenu('${menu.id}')">Select This Menu</button>
                </div>
            `).join('')}
        </div>
        <button class="secondary-btn" onclick="goBackToForm()">Back to Form</button>
    `;
    
    form.style.display = 'none';
    form.parentNode.insertBefore(menuSelectionView, form);
}

function selectMenu(menuId) {
    // Store selected menu
    userPreferences.selectedMenuId = menuId;
    
    // Submit all data to backend
    submitFinalInquiry(userPreferences);
}

function goBackToForm() {
    // Re-initialize the form
    initializeEventForm();
}

async function submitFinalInquiry(data) {
    try {
        const response = await fetch('/.netlify/functions/inquiries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to submit inquiry');
        }

        // Show final success message
        const modalContent = document.querySelector('#eventPlanningModal .modal-content');
        modalContent.innerHTML = `
            <div class="success-message">
                <h3>Thank You!</h3>
                <p>We've received your event planning request and will be in touch within 24-48 hours to discuss your special event in detail.</p>
                <button onclick="closeModal('eventPlanningModal')" class="cta-btn">Close</button>
            </div>
        `;

    } catch (error) {
        console.error('Error submitting inquiry:', error);
        alert('There was an error submitting your inquiry. Please try again.');
    }
}

function handleCTAClick(action) {
    switch (action) {
        case 'chefs':
            openModal('chefsModal');
            break;
        case 'weekly':
            openModal('weeklyInquiryModal');
            break;
        case 'event':
            openModal('eventInquiryModal');
            break;
        case 'explore-chefs':
            window.location.href = '#chefDiscovery';
            break;
        case 'browse-menus':
            window.location.href = '#menuSection';
            break;
        case 'learn-more':
            document.getElementById('howItWorksModal').classList.add('active');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Load approved images from Airtable
async function loadApprovedImages() {
    try {
        const response = await fetch('/.netlify/functions/getImages');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const images = await response.json();
        if (images.error) {
            throw new Error(images.error);
        }
        // Store images globally
        window.approvedImages = images;
        // Update UI with new images
        updateUIImages(images);
    } catch (error) {
        console.error('Error loading images:', error);
        // Handle error gracefully in the UI
        document.querySelectorAll('.has-bg-image').forEach(el => {
            el.classList.remove('has-bg-image');
        });
    }
}

function updateUIImages(images) {
    if (!images) {
        console.error('No images provided to updateUIImages');
        return;
    }

    // Helper function to convert Dropbox URL to direct image URL
    function convertDropboxUrl(url) {
        if (url && url.includes('dropbox.com')) {
            // If it's already in the dl.dropboxusercontent.com format with raw=1, return as is
            if (url.includes('dl.dropboxusercontent.com') && url.includes('raw=1')) {
                return url;
            }
            // Convert www.dropbox.com URLs to direct links
            return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
                     .replace('?dl=0', '?raw=1');
        }
        return url;
    }

    // Update hero section background
    const hero = document.querySelector('.hero');
    if (hero && images.HERO && images.HERO.length > 0) {
        const heroImage = images.HERO[images.HERO.length - 1]; // Get the last (newest) hero image
        if (heroImage && heroImage.url) {
            const imageUrl = convertDropboxUrl(heroImage.url);
            hero.style.setProperty('--hero-bg', `url(${imageUrl})`);
            hero.classList.add('has-bg-image');
            console.log('Updated hero image:', imageUrl);
        }
    }

    // Update header background
    const header = document.querySelector('.header-bg');
    if (header && images.BG && images.BG.length > 0) {
        const bgImage = getRandomImage(images.BG);
        if (bgImage && bgImage.url) {
            const imageUrl = convertDropboxUrl(bgImage.url);
            header.style.backgroundImage = `linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.9)), url('${imageUrl}')`;
            console.log('Updated header background:', imageUrl);
        }
    }

    // Store the images globally for other functions to use
    window.approvedImages = images;

    // Update section break images
    document.querySelectorAll('.section-break').forEach(section => {
        if (images.SECTION_BREAK && images.SECTION_BREAK.length > 0) {
            const breakImage = getRandomImage(images.SECTION_BREAK);
            if (breakImage && breakImage.url) {
                const imageUrl = convertDropboxUrl(breakImage.url);
                section.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imageUrl}')`;
            }
        }
    });

    // Update accent images
    document.querySelectorAll('.accent-image').forEach(img => {
        if (images.ACCENT && images.ACCENT.length > 0) {
            const accentImage = getRandomImage(images.ACCENT);
            if (accentImage && accentImage.url) {
                img.src = convertDropboxUrl(accentImage.url);
                if (accentImage.alt) {
                    img.alt = accentImage.alt;
                }
            }
        }
    });

    // Update service images
    document.querySelectorAll('.service-image').forEach(img => {
        const serviceName = img.dataset.service;
        if (serviceName) {
            const imageUrl = convertDropboxUrl(getServiceImage(serviceName));
            img.src = imageUrl;
            img.alt = `${serviceName} service`;
        }
    });

    // Update menu images
    document.querySelectorAll('.menu-image img').forEach(img => {
        const menuName = img.dataset.menu;
        if (menuName) {
            const imageUrl = convertDropboxUrl(getMenuImage(menuName));
            img.src = imageUrl;
            img.alt = `${menuName} menu`;
        }
    });
}

// Helper function to get a random image from an array
function getRandomImage(images) {
    if (!Array.isArray(images) || images.length === 0) {
        console.warn('No images provided to getRandomImage');
        return null;
    }
    return images[Math.floor(Math.random() * images.length)];
}

// Get service image from approved images or fallback to default
function getServiceImage(serviceName) {
    if (!serviceName) {
        console.warn('No service name provided to getServiceImage');
        return DEFAULT_IMAGES.MENU;
    }
    
    if (window.approvedImages && window.approvedImages.SERVICE && window.approvedImages.SERVICE.length > 0) {
        // Try to find a specific image for this service
        const serviceImage = window.approvedImages.SERVICE.find(img => 
            img.filename && img.filename.toLowerCase().includes(serviceName.toLowerCase()));
        if (serviceImage && serviceImage.url) return serviceImage.url;
        
        // If no specific image, use a random approved service image
        const randomImage = getRandomImage(window.approvedImages.SERVICE);
        return randomImage && randomImage.url ? randomImage.url : DEFAULT_IMAGES.MENU;
    }
    return DEFAULT_IMAGES.MENU;
}

// Get menu image from approved images or fallback to default
function getMenuImage(menuName) {
    if (!menuName) {
        console.warn('No menu name provided to getMenuImage');
        return DEFAULT_IMAGES.MENU;
    }
    
    if (window.approvedImages && window.approvedImages.MENU && window.approvedImages.MENU.length > 0) {
        // Try to find a specific image for this menu
        const menuImage = window.approvedImages.MENU.find(img => 
            img.filename && img.filename.toLowerCase().includes(menuName.toLowerCase()));
        if (menuImage && menuImage.url) return menuImage.url;
        
        // If no specific image, use a random approved menu image
        const randomImage = getRandomImage(window.approvedImages.MENU);
        return randomImage && randomImage.url ? randomImage.url : DEFAULT_IMAGES.MENU;
    }
    return DEFAULT_IMAGES.MENU;
}

function getColor(index) {
    return defaultColors[index % defaultColors.length] || '#f9f9f9';
}

// Function to switch between tabs
function openTab(evt, tabName) {
    console.log('Opening tab:', tabName);
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content and activate button
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
        
        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add('active');
        }

        // Load content based on tab
        switch(tabName) {
            case 'pricingContainer':
                loadPricingSection();
                break;
            case 'eventFormContainer':
                loadEventForm();
                break;
            case 'mealServiceContainer':
                // Add meal service form loading logic
                break;
            case 'chefsContainer':
                if (!selectedTab.querySelector('.chef-accordion')) {
    loadChefs();
                }
                break;
            case 'menusContainer':
                if (!selectedTab.querySelector('.menu-accordion')) {
    loadMenus();
  }
                break;
            case 'servicesContainer':
                loadServices();
                break;
            case 'faqContainer':
                loadFAQ();
                break;
        }
    }
}

// Add null checks for all button event listeners
if (chefsButton) {
    chefsButton.addEventListener('click', (event) => openTab(event, 'chefsContainer'));
}
if (menusButton) {
    menusButton.addEventListener('click', (event) => openTab(event, 'menusContainer'));
}
if (servicesButton) {
    servicesButton.addEventListener('click', (event) => openTab(event, 'servicesContainer'));
}
if (faqButton) {
    faqButton.addEventListener('click', (event) => openTab(event, 'faqContainer'));
}
if (experienceButton) {
    experienceButton.addEventListener('click', () => {
        openTab('pricing-content');
    });
}
if (planGatheringButton) {
    planGatheringButton.addEventListener('click', () => {
        openTab('event-form-content');
    });
}
if (personalChefButton) {
    personalChefButton.addEventListener('click', () => {
        openTab('meal-service-content');
    });
}

// Initialize smooth scrolling
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize parallax effect
function initializeParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }
}

// Initialize header scroll behavior
function initializeHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 50) {
                header.style.background = 'rgba(74, 144, 167, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
    }
}

// Initialize all forms
function initializeForms() {
    // Initialize inquiry form
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }

    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Initialize weekly service form
    const weeklyForm = document.getElementById('weeklyInquiryForm');
    if (weeklyForm) {
        weeklyForm.addEventListener('submit', handleWeeklyInquirySubmit);
    }

    // Set minimum date for all date inputs
    setMinDate();

    // Initialize phone number formatting
    initializePhoneFormatting();
}

// Initialize phone number formatting
function initializePhoneFormatting() {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
                e.target.value = value;
            }
        });
    });
}

// Initialize date inputs with min date of today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });
}

// Function to display chefs in the explore modal
async function displayChefs() {
    const chefsContainer = document.getElementById('explore-chefs');
    if (!chefsContainer) return;

    const loadingEl = chefsContainer.querySelector('.loading');
    if (!loadingEl) return;

    try {
        const chefs = await loadChefs();
        if (chefs.length === 0) {
            loadingEl.textContent = 'No chefs available at the moment.';
            return;
        }

        const chefsGrid = document.createElement('div');
        chefsGrid.className = 'explore-grid';
        
        // Display up to 4 chefs
        chefs.slice(0, 4).forEach(chef => {
            const chefCard = document.createElement('div');
            chefCard.className = 'chef-card';
            chefCard.innerHTML = `
                <h4>${chef.name}</h4>
                <p>${chef.specialty || 'Various Cuisines'}</p>
            `;
            chefsGrid.appendChild(chefCard);
        });

        loadingEl.replaceWith(chefsGrid);
    } catch (error) {
        loadingEl.textContent = 'Failed to load chefs. Please try again later.';
    }
}

// Function to display menus in the explore modal
async function displayMenus() {
    const menusContainer = document.getElementById('explore-menus');
    if (!menusContainer) return;

    const loadingEl = menusContainer.querySelector('.loading');
    if (!loadingEl) return;

    try {
        const menus = await loadMenus();
        if (menus.length === 0) {
            loadingEl.textContent = 'No menus available at the moment.';
            return;
        }

        const menusGrid = document.createElement('div');
        menusGrid.className = 'explore-grid';
        
        // Display up to 4 menus
        menus.slice(0, 4).forEach(menu => {
            const menuCard = document.createElement('div');
            menuCard.className = 'menu-card';
            menuCard.innerHTML = `
                    <h4>${menu.name}</h4>
                <p>${menu.description || 'Delicious selections'}</p>
            `;
            menusGrid.appendChild(menuCard);
        });

        loadingEl.replaceWith(menusGrid);
            } catch (error) {
        loadingEl.textContent = 'Failed to load menus. Please try again later.';
    }
}

// Function to initialize explore modal content
function initializeExploreModal() {
    const exploreModal = document.getElementById('exploreModal');
    if (!exploreModal) return;

    exploreModal.addEventListener('shown.bs.modal', () => {
        displayChefs();
        displayMenus();
    });
}

// Explore Modal Functions
function openExploreModal() {
    const exploreModal = document.getElementById('exploreModal');
    if (!exploreModal) return;
    
    exploreModal.style.display = 'block';
    loadFeaturedChefs();
    loadSampleMenus();
}

function closeExplore() {
    const exploreModal = document.getElementById('exploreModal');
    if (!exploreModal) return;
    
    exploreModal.style.display = 'none';
}

async function loadFeaturedChefs() {
    try {
        const response = await fetch('/.netlify/functions/get-chefs');
        if (!response.ok) throw new Error('Failed to fetch chefs');
        
        const chefs = await response.json();
        const previewGrid = document.querySelector('#exploreModal .chefs-preview');
        if (!previewGrid) return;
        
        // Display first 3 chefs
        previewGrid.innerHTML = chefs.slice(0, 3).map(chef => `
            <div class="preview-card">
                <h4>${chef.name}</h4>
                <p class="specialty">${chef.specialty}</p>
                <p class="bio">${chef.bio.substring(0, 150)}...</p>
        </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading chefs:', error);
    }
}

async function loadSampleMenus() {
    try {
        const response = await fetch('/.netlify/functions/get-menus');
        if (!response.ok) throw new Error('Failed to fetch menus');
        
        const menus = await response.json();
        const previewGrid = document.querySelector('#exploreModal .menus-preview');
        if (!previewGrid) return;
        
        // Display first 3 menus
        previewGrid.innerHTML = menus.slice(0, 3).map(menu => `
            <div class="preview-card">
                <h4>${menu.name}</h4>
                <p class="cuisine">${menu.cuisine}</p>
                <p class="description">${menu.description.substring(0, 150)}...</p>
                    </div>
        `).join('');
            
        } catch (error) {
        console.error('Error loading menus:', error);
    }
}

// Explore functionality
async function loadPreviews() {
  try {
    // Load chefs preview
    const chefsResponse = await fetch(`${API_ENDPOINT}/getChefs`);
    const chefsData = await chefsResponse.json();
    
    const chefPreview = document.getElementById('chefPreview');
    if (chefPreview) {
      const previewChefs = chefsData.slice(0, 3); // Get first 3 chefs
      
      chefPreview.innerHTML = previewChefs.map(chef => `
        <div class="preview-card">
          <img src="${chef.photo || DEFAULT_IMAGES.CHEF}" alt="${chef.name}" class="preview-image">
          <div class="preview-content">
            <h4>${chef.name}</h4>
            <p>${chef.specialties?.join(', ') || 'Various Cuisines'}</p>
          </div>
        </div>
      `).join('');
    }

    // Load menus preview
    const menusResponse = await fetch(`${API_ENDPOINT}/getMenus`);
    const menusData = await menusResponse.json();
    
    const menuPreview = document.getElementById('menuPreview');
    if (menuPreview) {
      const previewMenus = menusData.slice(0, 3); // Get first 3 menus
      
      menuPreview.innerHTML = previewMenus.map(menu => `
        <div class="preview-card">
          <img src="${menu.image || DEFAULT_IMAGES.MENU}" alt="${menu.name}" class="preview-image">
          <div class="preview-content">
            <h4>${menu.name}</h4>
            <p>${menu.description}</p>
                                </div>
                    </div>
      `).join('');
    }
        } catch (error) {
    console.error('Error loading previews:', error);
  }
}

function showAllChefs() {
  // Store current scroll position
  const scrollPos = window.scrollY;
  
  // Close explore modal
  closeModal('exploreModal');
  
  // Open full chefs view
  openModal('chefDiscoveryModal');
  
  // Restore scroll position
  window.scrollTo(0, scrollPos);
}

function showAllMenus() {
  // Store current scroll position
  const scrollPos = window.scrollY;
  
  // Close explore modal
  closeModal('exploreModal');
  
  // Open full menus view
  openModal('menuExplorerModal');
  
  // Restore scroll position
  window.scrollTo(0, scrollPos);
}

// Initialize explore functionality
function initializeExploreModal() {
  const exploreModal = document.getElementById('exploreModal');
  if (exploreModal) {
    exploreModal.addEventListener('show', loadPreviews);
    
    // Initialize view all buttons
    const viewAllChefs = document.querySelector('#viewAllChefs');
    if (viewAllChefs) {
      viewAllChefs.addEventListener('click', showAllChefs);
    }

    const viewAllMenus = document.querySelector('#viewAllMenus');
    if (viewAllMenus) {
      viewAllMenus.addEventListener('click', showAllMenus);
    }
  }
}

// Modal handling
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Mobile menu handling
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-overlay a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });
});

// Form handling
document.addEventListener('DOMContentLoaded', function() {
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      try {
        const response = await fetch('/.netlify/functions/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          alert('Thank you for your inquiry! We will be in touch soon.');
          this.reset();
          closeModal('inquiryModal');
        } else {
          throw new Error('Failed to submit inquiry');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error submitting your inquiry. Please try again later.');
      }
    });
  }
});

async function handleWeeklyInquirySubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    const response = await fetch('/.netlify/functions/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        type: 'weekly'
      })
    });
    
    if (response.ok) {
      alert('Thank you for your inquiry! We will be in touch soon.');
      form.reset();
      closeModal('weeklyInquiryModal');
    } else {
      throw new Error('Failed to submit inquiry');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Sorry, there was an error submitting your inquiry. Please try again later.');
  }
}