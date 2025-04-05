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
    const submitButton = eventForm.querySelector('.submit-btn');
    
    // Add validation to required fields
    const requiredFields = eventForm.querySelectorAll('input[required], select[required], textarea[required]');
    
    function validateField(field) {
        const isValid = field.checkValidity();
        if (!isValid) {
            field.classList.add('invalid');
            let validationMessage = field.nextElementSibling;
            if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
                validationMessage = document.createElement('div');
                validationMessage.className = 'validation-message';
                field.parentNode.insertBefore(validationMessage, field.nextSibling);
            }
            validationMessage.textContent = field.validationMessage || 'This field is required';
        } else {
            field.classList.remove('invalid');
            const validationMessage = field.nextElementSibling;
            if (validationMessage && validationMessage.classList.contains('validation-message')) {
                validationMessage.remove();
            }
        }
        return isValid;
    }
    
    // Add validation on blur
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });
    
    // Add validation for checkbox groups
    const validateCheckboxGroup = (groupName) => {
        const checkboxes = eventForm.querySelectorAll(`input[name="${groupName}"]`);
        const container = checkboxes[0]?.closest('.checkbox-group');
        if (!container) return true;
        
        const isValid = Array.from(checkboxes).some(cb => cb.checked);
        const validationMessage = container.nextElementSibling;
        
        if (!isValid) {
            container.style.borderColor = '#dc3545';
            if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
                const message = document.createElement('div');
                message.className = 'validation-message';
                message.textContent = 'Please select at least one option';
                container.parentNode.insertBefore(message, container.nextSibling);
            }
        } else {
            container.style.borderColor = '';
            if (validationMessage && validationMessage.classList.contains('validation-message')) {
                validationMessage.remove();
            }
        }
        return isValid;
    };
    
    // Add form submission handler
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate checkbox groups
        if (!validateCheckboxGroup('Cuisine Preference')) isValid = false;
        if (!validateCheckboxGroup('Event Vibe')) isValid = false;
        
        if (!isValid) {
            // Scroll to first error
            const firstError = eventForm.querySelector('.invalid, .validation-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        
        try {
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
            
            // Show success message and next steps
            showSuccessMessage('Thank you! Your inquiry has been submitted successfully.');
            
            // Show next steps
            const nextStepsContainer = document.createElement('div');
            nextStepsContainer.className = 'next-steps';
            nextStepsContainer.innerHTML = `
                <h3>Next Steps</h3>
                <p>Here's what happens next:</p>
                <ol>
                    <li>Our team will review your event details within 24 hours</li>
                    <li>We'll match you with available chefs based on your preferences</li>
                    <li>You'll receive an email with chef recommendations and menu options</li>
                    <li>We'll schedule a brief call to discuss your event in detail</li>
                </ol>
                <button class="back-to-home">Return to Home</button>
            `;
            
            eventForm.style.display = 'none';
            eventForm.parentNode.appendChild(nextStepsContainer);
            
            const backButton = nextStepsContainer.querySelector('.back-to-home');
            backButton.addEventListener('click', () => {
                window.location.reload();
            });
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorMessage('Sorry, there was an error submitting your inquiry. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.textContent = originalText;
        }
    });
}

// Weekly Journey
function initializeWeeklyForm() {
    const weeklyForm = document.getElementById('weeklyForm');
    
    // Initialize meal types dropdown
    loadMealTypes();
    
    // Initialize days of the week
    loadDaysOfWeek();
    
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

function loadMealTypes() {
    const select = document.getElementById('mealType');
    if (!select) return;
    
    const mealTypes = [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snacks',
        'Full Day Meal Plan',
        'Custom Plan'
    ];
    
    select.innerHTML = '<option value="">Select meal type...</option>';
    mealTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        select.appendChild(option);
    });
}

function loadDaysOfWeek() {
    const container = document.getElementById('daysOfWeek');
    if (!container) return;
    
    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    
    container.innerHTML = '';
    days.forEach(day => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        label.innerHTML = `
            <input type="checkbox" name="Preferred Days" value="${day}">
            <span class="checkmark"></span>
            ${day}
        `;
        container.appendChild(label);
    });
}

// Exploring Journey
function initializeExploringJourney() {
    const exploringContent = document.querySelector('.exploring-content');
    const contentContainers = document.querySelectorAll('.content-container');
    
    document.querySelectorAll('.action-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const action = tile.dataset.action;
            
            // Hide exploring content and all content containers first
            exploringContent.style.display = 'none';
            contentContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            switch(action) {
                case 'viewChefs':
                    const chefsContainer = document.getElementById('chefsContainer');
                    chefsContainer.style.display = 'block';
                    loadChefs();
                    break;
                case 'viewMenus':
                    const menusContainer = document.getElementById('menusContainer');
                    menusContainer.style.display = 'block';
                    loadMenus();
                    break;
                case 'learnMore':
                    const servicesContainer = document.getElementById('servicesContainer');
                    servicesContainer.style.display = 'block';
                    loadServices();
                    break;
            }
            
            // Add back button
            if (!document.querySelector('.back-to-exploring')) {
                const backButton = document.createElement('button');
                backButton.className = 'back-to-exploring';
                backButton.textContent = '← Back to Exploring';
                backButton.addEventListener('click', () => {
                    contentContainers.forEach(container => {
                        container.style.display = 'none';
                    });
                    exploringContent.style.display = 'block';
                    backButton.remove();
                });
                document.getElementById('exploringJourney').insertBefore(backButton, document.querySelector('.content-container'));
            }
        });
    });
    
    const quickForm = document.getElementById('quickInquiryForm');
    if (quickForm) {
        quickForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = quickForm.querySelector('.submit-btn');
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.textContent = 'Sending...';
            
            const formData = new FormData(quickForm);
            const data = {
                'Type': 'Quick Inquiry',
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
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.textContent = 'Send Message';
            }
        });
    }
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
    
    container.innerHTML = `
        <h4>Cuisine Preferences</h4>
        <p class="helper-text">Select all cuisines that interest you for your event</p>
        <div class="checkbox-group">
            ${cuisines.map(cuisine => `
                <label>
                    <input type="checkbox" name="Cuisine Preference" value="${cuisine}">
                    ${cuisine}
                </label>
            `).join('')}
        </div>
    `;
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
    
    container.innerHTML = `
        <h4>Event Vibe</h4>
        <p class="helper-text">Choose words that best describe your desired event atmosphere</p>
        <div class="checkbox-group">
            ${vibes.map(vibe => `
                <label>
                    <input type="checkbox" name="Event Vibe" value="${vibe}">
                    ${vibe}
                </label>
            `).join('')}
        </div>
    `;
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

// Add budget ranges loading function
function loadBudgetRanges() {
    const select = document.getElementById('budgetRange');
    if (!select) return;
    
    const budgetRanges = [
        'Under $1,000',
        '$1,000 - $2,500',
        '$2,500 - $5,000',
        '$5,000 - $7,500',
        '$7,500 - $10,000',
        '$10,000 - $15,000',
        '$15,000 - $25,000',
        '$25,000+'
    ];
    
    select.innerHTML = '<option value="">Select budget range...</option>';
    budgetRanges.forEach(range => {
        const option = document.createElement('option');
        option.value = range;
        option.textContent = range;
        select.appendChild(option);
    });
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


