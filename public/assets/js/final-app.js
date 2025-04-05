// app.js - UI interaction and rendering with Airtable

const chefsContainer = document.getElementById('chefsContainer');
const menusContainer = document.getElementById('menusContainer');
const chefsButton = document.getElementById('chefsButton');
const menusButton = document.getElementById('menusButton');
const faqButton = document.getElementById('faqButton');
const servicesButton = document.getElementById('servicesButton');
const faqContainer = document.getElementById('faqContainer');
const servicesContainer = document.getElementById('servicesContainer');
const experienceButton = document.getElementById('experienceButton');
const planGatheringButton = document.getElementById('planGatheringButton');
const personalChefButton = document.getElementById('personalChefButton');
const pricingContainer = document.getElementById('pricingContainer');
const eventFormContainer = document.getElementById('eventFormContainer');
const mealServiceContainer = document.getElementById('mealServiceContainer');
const chefContainer = document.getElementById('chefContainer');
const menuContainer = document.getElementById('menuContainer');
let currentOpenAccordion = null;

// Default placeholder image
const DEFAULT_CHEF_IMAGE = '/assets/images/default-chef.jpg';

// Default images for menus and services
const DEFAULT_MENU_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzNlNWM3NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZW51PC90ZXh0Pjwvc3ZnPg==';
const DEFAULT_SERVICE_IMAGES = {
  'Private Chef Services': 'https://placehold.co/300x200/3e5c76/ffffff?text=Private+Chef',
  'Event Catering': 'https://placehold.co/300x200/3e5c76/ffffff?text=Event+Catering',
  'Cooking Classes': 'https://placehold.co/300x200/3e5c76/ffffff?text=Cooking+Classes',
  'Meal Preparation': 'https://placehold.co/300x200/3e5c76/ffffff?text=Meal+Prep',
  'Wine Pairing': 'https://placehold.co/300x200/3e5c76/ffffff?text=Wine+Pairing',
  'Kitchen Organization': 'https://placehold.co/300x200/3e5c76/ffffff?text=Kitchen+Org'
};

// Color palette for menu backgrounds
const MENU_COLORS = {
    "Surf & Turf Soirée": "#ffd7b3",
    "Pizza Night": "#ffe199",
    "Farm to Table": "#aee0a1",
    "Pasta & Salads": "#b6d89f",
    "Brunch in Bloom": "#fff4dc",
    "Thanksgiving": "#f5c6a0",
    "Sushi (Wasabi)": "#caf2e6",
    "Mexican Mesa": "#f8caa5",
    "Greek (Santorini)": "#a8caff",
    "Mediterranean": "#efe2bd",
    "Christmas": "#e7b8c1",
    "Cocktail Party": "#b7d6f2",
    "Asian Fusion": "#f9b9b7",
    "Fresh Catch": "#a9e5dc",
    "Paella Picnic": "#d2f1a3"
};

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

// Add click event listeners to buttons
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

// Add new button constants
const eventForm = document.getElementById('eventForm');
const mealServiceForm = document.getElementById('mealServiceForm');

// Add click handlers for new buttons
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

// Initialize the page with chefs tab
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    loadChefs();
    setupTabNavigation();
});

// Constants
const API_ENDPOINT = '/.netlify/functions/api';

// DOM Elements
const journeySelection = document.getElementById('journeySelection');
const eventJourney = document.getElementById('eventJourney');
const weeklyJourney = document.getElementById('weeklyJourney');
const exploringJourney = document.getElementById('exploringJourney');

// Journey Selection
document.querySelectorAll('.journey-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const journey = btn.dataset.journey;
        journeySelection.style.display = 'none';
        
        switch(journey) {
            case 'event':
                eventJourney.style.display = 'block';
                initializeEventForm();
                break;
            case 'weekly':
                weeklyJourney.style.display = 'block';
                initializeWeeklyForm();
                break;
            case 'exploring':
                exploringJourney.style.display = 'block';
                initializeExploringJourney();
                break;
        }
    });
});

// Event Journey
function initializeEventForm() {
    const eventForm = document.getElementById('eventForm');
    
    // Load dynamic options
    loadEventTypes();
    loadCuisinePreferences();
    loadVibeWords();
    loadOptionalServices();
    
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(eventForm);
        const data = {
            'Type': 'Event',
            'Status': 'New'
        };
        
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });
        
        try {
            const response = await fetch(`${API_ENDPOINT}?action=submitInquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            showSuccessMessage('Thank you! We will contact you shortly.');
            eventForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Sorry, there was an error submitting your inquiry. Please try again.');
        }
    });
}

// Weekly Journey
function initializeWeeklyForm() {
    const weeklyForm = document.getElementById('weeklyForm');
    
    weeklyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(weeklyForm);
        const data = {
            'Type': 'Weekly',
            'Status': 'New'
        };
        
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });
        
        try {
            const response = await fetch(`${API_ENDPOINT}?action=submitInquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            showSuccessMessage('Thank you! We will contact you shortly.');
            weeklyForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Sorry, there was an error submitting your inquiry. Please try again.');
        }
    });
}

// Exploring Journey
function initializeExploringJourney() {
    document.querySelectorAll('.action-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const action = tile.dataset.action;
            
            switch(action) {
                case 'viewChefs':
                    loadChefs();
                    chefsContainer.style.display = 'block';
                    menusContainer.style.display = 'none';
                    servicesContainer.style.display = 'none';
                    break;
                case 'viewMenus':
                    loadMenus();
                    chefsContainer.style.display = 'none';
                    menusContainer.style.display = 'block';
                    servicesContainer.style.display = 'none';
                    break;
                case 'learnMore':
                    loadServices();
                    chefsContainer.style.display = 'none';
                    menusContainer.style.display = 'none';
                    servicesContainer.style.display = 'block';
                    break;
            }
        });
    });
    
    const quickForm = document.getElementById('quickInquiryForm');
    quickForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(quickForm);
        const data = {
            'Type': 'Exploring',
            'Status': 'New'
        };
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        try {
            const response = await fetch(`${API_ENDPOINT}?action=submitInquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            showSuccessMessage('Thank you! We will contact you shortly.');
            quickForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Sorry, there was an error submitting your inquiry. Please try again.');
        }
    });
}

// Load Dynamic Content
async function loadEventTypes() {
    const select = document.getElementById('eventType');
    const types = [
        'Dinner Party',
        'Boutique Wedding',
        'Retreat',
        'Corporate Event',
        'Holiday Celebration',
        'Birthday Party',
        'Anniversary',
        'Other'
    ];
    
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });
}

async function loadCuisinePreferences() {
    const container = document.getElementById('cuisinePreferences');
    const cuisines = [
        'California / Farm-to-Table',
        'Mediterranean',
        'Mexican',
        'Paella',
        'Pasta & Salads',
        'Sushi',
        'Seafood',
        'Greek',
        'Asian-Inspired',
        'Pizza',
        'BBQ',
        'Brunch',
        'Holiday',
        'Cocktail Party',
        'Vegetarian / Plant-Based'
    ];
    
    cuisines.forEach(cuisine => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" name="Cuisine Preference" value="${cuisine}">
            ${cuisine}
        `;
        container.appendChild(label);
    });
}

async function loadVibeWords() {
    const container = document.getElementById('vibeWords');
    const vibes = [
        'Elegant',
        'Casual',
        'Romantic',
        'Family-Friendly',
        'Cozy & Intimate',
        'Luxurious',
        'Seasonal / Farm-Fresh',
        'Coastal / Beachy',
        'Creative & Bold',
        'Wellness-Focused',
        'Rustic',
        'Festive & Fun',
        'Sophisticated',
        'Minimalist'
    ];
    
    vibes.forEach(vibe => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" name="Event Vibe" value="${vibe}">
            ${vibe}
        `;
        container.appendChild(label);
    });
}

async function loadOptionalServices() {
    try {
        const response = await fetch(`${API_ENDPOINT}?action=getServices`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const services = await response.json();
        const container = document.getElementById('optionalServices');
        
        services
            .filter(service => service.type === 'Enhancement')
            .forEach(service => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" name="Optional Services" value="${service.name}">
                    ${service.name}
                `;
                container.appendChild(label);
            });
            
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Load Content Functions
async function loadChefs() {
    if (!chefsContainer) return;
    
    chefsContainer.innerHTML = '<div class="loading">Loading our talented chefs...</div>';
    
    try {
        const response = await fetch(`${API_ENDPOINT}?action=getChefs`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const chefs = await response.json();
        
        if (!chefs || chefs.length === 0) {
            chefsContainer.innerHTML = '<div class="error">No chefs found. Please try again later.</div>';
            return;
        }
        
        chefsContainer.innerHTML = '';
        chefs.forEach(chef => {
            if (!chef.active) return;
            
            const card = document.createElement('div');
            card.className = 'chef-card';
            card.innerHTML = `
                <div class="chef-photo">
                    <img src="${chef.image || DEFAULT_CHEF_IMAGE}" alt="${chef.name}" onerror="this.src='${DEFAULT_CHEF_IMAGE}'">
                </div>
                <div class="chef-info">
                    <h3>${chef.name}</h3>
                    <p>${chef.bio}</p>
                    ${chef.specialties ? `<p class="specialties">Specialties: ${chef.specialties.join(', ')}</p>` : ''}
                    ${chef.availability ? `<p class="availability">Availability: ${chef.availability}</p>` : ''}
                </div>
            `;
            chefsContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading chefs:', error);
        chefsContainer.innerHTML = '<div class="error">Failed to load chefs. Please try again later.</div>';
    }
}

async function loadMenus() {
    if (!menusContainer) return;
    
    menusContainer.innerHTML = '<div class="loading">Loading our curated menus...</div>';
    
    try {
        const response = await fetch(`${API_ENDPOINT}?action=getMenus`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const menus = await response.json();
        
        if (!menus || menus.length === 0) {
            menusContainer.innerHTML = '<div class="error">No menus found. Please try again later.</div>';
            return;
        }
        
        menusContainer.innerHTML = '';
        menus
            .filter(menu => menu.active)
            .sort((a, b) => a.menuTier.localeCompare(b.menuTier))
            .forEach(menu => {
                const accordion = document.createElement('div');
                accordion.className = 'menu-accordion';
                accordion.innerHTML = `
                    <div class="accordion-header">
                        <h3>${menu.name}</h3>
                        <span class="accordion-arrow">▼</span>
                    </div>
                    <div class="accordion-content">
                        <p class="menu-description">${menu.description}</p>
                        <div class="dishes-container" data-menu-id="${menu.id}">
                            <div class="loading">Loading dishes...</div>
                        </div>
                    </div>
                `;
                
                const header = accordion.querySelector('.accordion-header');
                const content = accordion.querySelector('.accordion-content');
                
                header.addEventListener('click', () => {
                    const isActive = header.classList.contains('active');
                    
                    // Close all other accordions
                    document.querySelectorAll('.accordion-header').forEach(h => {
                        h.classList.remove('active');
                        h.nextElementSibling.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        header.classList.add('active');
                        content.classList.add('active');
                        loadDishes(menu.id);
                    }
                });
                
                menusContainer.appendChild(accordion);
            });
            
    } catch (error) {
        console.error('Error loading menus:', error);
        menusContainer.innerHTML = '<div class="error">Failed to load menus. Please try again later.</div>';
    }
}

async function loadDishes(menuId) {
    const container = document.querySelector(`[data-menu-id="${menuId}"]`);
    if (!container) return;
    
    try {
        const response = await fetch(`${API_ENDPOINT}?action=getDishes&menuId=${menuId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const dishes = await response.json();
        
        if (!dishes || dishes.length === 0) {
            container.innerHTML = '<div class="error">No dishes found for this menu.</div>';
            return;
        }
        
        // Group dishes by category
        const categories = {};
        dishes.forEach(dish => {
            if (!categories[dish.category]) {
                categories[dish.category] = [];
            }
            categories[dish.category].push(dish);
        });
        
        container.innerHTML = '';
        Object.entries(categories)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([category, dishes]) => {
                const section = document.createElement('div');
                section.className = 'dish-category';
                section.innerHTML = `
                    <h4>${category}</h4>
                    <div class="dish-list">
                        ${dishes
                            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                            .map(dish => `
                                <div class="dish-item">
                                    <label class="dish-checkbox">
                                        <input type="checkbox" name="selected_dishes" value="${dish.id}">
                                        <span class="checkmark"></span>
                                        <span class="dish-name">${dish.name}</span>
                                    </label>
                                    <p class="dish-description">${dish.description}</p>
                                </div>
                            `).join('')}
                    </div>
                `;
                container.appendChild(section);
            });
            
    } catch (error) {
        console.error('Error loading dishes:', error);
        container.innerHTML = '<div class="error">Failed to load dishes. Please try again later.</div>';
    }
}

async function loadServices() {
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = '<div class="loading">Loading our services...</div>';
    
    try {
        const response = await fetch(`${API_ENDPOINT}?action=getServices`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const services = await response.json();
        
        if (!services || services.length === 0) {
            servicesContainer.innerHTML = '<div class="error">No services found. Please try again later.</div>';
            return;
        }
        
        servicesContainer.innerHTML = `
            <div class="services-grid">
                ${services
                    .filter(service => service.type === 'Core')
                    .map(service => `
                        <div class="service-card">
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                        </div>
                    `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading services:', error);
        servicesContainer.innerHTML = '<div class="error">Failed to load services. Please try again later.</div>';
    }
}

// Utility Functions
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing SBCC application...');
});


