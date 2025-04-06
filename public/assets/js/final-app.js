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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing SBCC application...');
    initializeJourneyButtons();
    initializeContactAccordion();
});

// Initialize journey buttons
function initializeJourneyButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const journey = btn.dataset.journey;
            if (!journey) return;
            
            // Only hide the action buttons, not the entire main content
            document.querySelector('.action-buttons').style.display = 'none';
            
            // Show appropriate journey content
            switch(journey) {
                case 'event':
                    showEventJourney();
                    break;
                case 'weekly':
                    showWeeklyJourney();
                    break;
                case 'exploring':
                    showExploringJourney();
                    break;
            }
        });
    });
}

// Journey display functions
function showEventJourney() {
    const container = document.getElementById('eventJourney') || createJourneyContainer('eventJourney');
    container.style.display = 'block';
    
    if (!container.dataset.initialized) {
        container.innerHTML = `
            <div class="journey-header">
                <h2>Plan Your Event</h2>
                <button class="back-btn" onclick="returnToHome()">← Back to Home</button>
            </div>
            <form id="eventForm" class="event-form">
                <div class="form-group">
                    <label for="eventType">Event Type*</label>
                    <select id="eventType" name="eventType" required>
                        <option value="">Select Event Type</option>
                        <option value="dinner">Dinner Party</option>
                        <option value="cocktail">Cocktail Party</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="guestCount">Number of Guests*</label>
                    <input type="number" id="guestCount" name="guestCount" min="1" required>
                </div>
                <div class="form-group">
                    <label for="location">Event Location*</label>
                    <input type="text" id="location" name="location" required>
                </div>
                <div class="form-group">
                    <label for="eventDate">Event Date*</label>
                    <input type="date" id="eventDate" name="eventDate" required>
                </div>
                <div class="form-group">
                    <label for="eventTime">Event Time*</label>
                    <input type="time" id="eventTime" name="eventTime" required>
                </div>
                <div class="form-group">
                    <label>Cuisine Preferences*</label>
                    <div id="cuisinePreferences" class="checkbox-group"></div>
                </div>
                <div class="form-group">
                    <label>Event Vibe</label>
                    <div id="vibeWords" class="checkbox-group"></div>
                </div>
                <div class="form-group">
                    <label for="specialRequests">Special Requests or Notes</label>
                    <textarea id="specialRequests" name="specialRequests" rows="4"></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit Request</button>
            </form>
        `;
        container.dataset.initialized = 'true';
        initializeEventForm();
    }
}

function showWeeklyJourney() {
    const container = document.getElementById('weeklyJourney') || createJourneyContainer('weeklyJourney');
    container.style.display = 'block';
    
    if (!container.dataset.initialized) {
        container.innerHTML = `
            <div class="journey-header">
                <h2>Weekly Meal Service</h2>
                <button class="back-btn" onclick="returnToHome()">← Back to Home</button>
            </div>
            <form id="weeklyForm" class="weekly-form">
                <div class="form-group">
                    <label for="serviceType">Service Type*</label>
                    <select id="serviceType" name="serviceType" required>
                        <option value="">Select Service Type</option>
                        <option value="meal-prep">Meal Prep</option>
                        <option value="daily-cooking">Daily Cooking</option>
                        <option value="hybrid">Hybrid Service</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="householdSize">Household Size*</label>
                    <input type="number" id="householdSize" name="householdSize" min="1" required>
                </div>
                <div class="form-group">
                    <label for="mealsPerWeek">Meals Per Week*</label>
                    <select id="mealsPerWeek" name="mealsPerWeek" required>
                        <option value="">Select Number of Meals</option>
                        <option value="3">3 Meals</option>
                        <option value="5">5 Meals</option>
                        <option value="7">7 Meals</option>
                        <option value="custom">Custom Plan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dietaryRestrictions">Dietary Restrictions</label>
                    <textarea id="dietaryRestrictions" name="dietaryRestrictions" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="kitchenAccess">Kitchen Access Details*</label>
                    <textarea id="kitchenAccess" name="kitchenAccess" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit Request</button>
            </form>
        `;
        container.dataset.initialized = 'true';
        initializeWeeklyForm();
    }
}

function showExploringJourney() {
    const container = document.getElementById('exploringJourney') || createJourneyContainer('exploringJourney');
    container.style.display = 'block';
    
    if (!container.dataset.initialized) {
        container.innerHTML = `
            <div class="journey-header">
                <h2>Explore Our Services</h2>
                <button class="back-btn" onclick="returnToHome()">← Back to Home</button>
            </div>
            <div class="exploring-content">
                <div class="explore-section">
                    <h3>Our Chefs</h3>
                    <div id="chefsGallery" class="gallery-grid"></div>
                </div>
                <div class="explore-section">
                    <h3>Sample Menus</h3>
                    <div id="menusGallery" class="gallery-grid"></div>
                </div>
                <div class="explore-section">
                    <h3>Get Updates</h3>
                    <form id="updatesForm" class="updates-form">
                        <div class="form-group">
                            <label for="updateEmail">Email Address*</label>
                            <input type="email" id="updateEmail" name="updateEmail" required>
                        </div>
                        <div class="form-group">
                            <label>Interests</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="interests" value="events"> Special Events</label>
                                <label><input type="checkbox" name="interests" value="weekly"> Weekly Service</label>
                                <label><input type="checkbox" name="interests" value="classes"> Cooking Classes</label>
                            </div>
                        </div>
                        <button type="submit" class="submit-btn">Subscribe</button>
                    </form>
                </div>
            </div>
        `;
        container.dataset.initialized = 'true';
        initializeExploringJourney();
    }
}

function createJourneyContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    container.className = 'journey-container';
    document.querySelector('.main-content').appendChild(container);
    return container;
}

// Return to home function
function returnToHome() {
    // Hide all journey containers
    document.querySelectorAll('.journey-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Show the action buttons
    document.querySelector('.action-buttons').style.display = 'grid';
}

// Make returnToHome available globally
window.returnToHome = returnToHome;

// Initialize contact form accordion
function initializeContactAccordion() {
    const toggle = document.querySelector('.contact-toggle');
    const wrapper = document.querySelector('.contact-form-wrapper');
    const form = document.querySelector('.contact-form');
    
    if (!toggle || !wrapper || !form) return;
    
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            wrapper.classList.add('expanded');
            setTimeout(() => {
                form.classList.add('visible');
            }, 100);
        } else {
            form.classList.remove('visible');
            setTimeout(() => {
                wrapper.classList.remove('expanded');
            }, 300);
        }
    });
}

// Constants
const API_ENDPOINT = '/.netlify/functions/api';

// DOM Elements
const journeySelection = document.getElementById('journeySelection');
const eventJourney = document.getElementById('eventJourney');
const weeklyJourney = document.getElementById('weeklyJourney');
const exploringJourney = document.getElementById('exploringJourney');

// Date validation
function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('eventDate').setAttribute('min', minDate);
}

// Initialize event form
function initializeEventForm() {
    const form = document.getElementById('eventForm');
    if (!form) return;

    // Set minimum date to tomorrow
    setMinDate();

    // Load cuisine preferences
    loadCuisinePreferences();

    // Load vibe words
    loadVibeWords();

    // Add validation for required fields
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => validateField(field));
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Check if at least one cuisine preference is selected
        const cuisineChecked = document.querySelectorAll('#cuisinePreferences input[type="checkbox"]:checked').length > 0;
        if (!cuisineChecked) {
            isValid = false;
            showErrorMessage('Please select at least one cuisine preference');
        }

        if (!isValid) return;

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            await submitForm(form);
            showSuccessMessage();
            form.reset();
        } catch (error) {
            showErrorMessage('There was an error submitting your request. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        }
    });
}

// Initialize weekly form
function initializeWeeklyForm() {
    const form = document.getElementById('weeklyForm');
    if (!form) return;

    // Add validation for required fields
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => validateField(field));
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            await submitForm(form);
            showSuccessMessage();
            form.reset();
        } catch (error) {
            showErrorMessage('There was an error submitting your request. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
        }
    });
}

// Initialize exploring journey
function initializeExploringJourney() {
    // Load chefs gallery
    loadChefs().then(chefs => {
        const gallery = document.getElementById('chefsGallery');
        if (gallery) {
            gallery.innerHTML = chefs.map(chef => `
                <div class="gallery-item">
                    <img src="${chef.image || DEFAULT_CHEF_IMAGE}" alt="${chef.name}">
                    <h4>${chef.name}</h4>
                    <p>${chef.specialty}</p>
                </div>
            `).join('');
        }
    });

    // Load menus gallery
    loadMenus().then(menus => {
        const gallery = document.getElementById('menusGallery');
        if (gallery) {
            gallery.innerHTML = menus.map(menu => `
                <div class="gallery-item">
                    <img src="${menu.image || DEFAULT_MENU_IMAGE}" alt="${menu.name}">
                    <h4>${menu.name}</h4>
                    <p>${menu.description}</p>
                </div>
            `).join('');
        }
    });

    // Initialize updates form
    const form = document.getElementById('updatesForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';

            try {
                await submitForm(form);
                showSuccessMessage('Thank you for subscribing! We\'ll keep you updated.');
                form.reset();
            } catch (error) {
                showErrorMessage('There was an error subscribing. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe';
            }
        });
    }
}

// Helper function to set minimum date to tomorrow
function setMinDate() {
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        eventDateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// Helper function to validate a field
function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('invalid', !isValid);
    
    // Show validation message
    let errorContainer = field.parentElement.querySelector('.error-message');
    if (!isValid) {
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'error-message';
            field.parentElement.appendChild(errorContainer);
        }
        errorContainer.textContent = field.validationMessage;
    } else if (errorContainer) {
        errorContainer.remove();
    }
    
    return isValid;
}

// Success message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>Thank You!</h3>
        <p>Your inquiry has been submitted successfully. We'll be in touch within 24 hours.</p>
    `;
    
    const form = document.getElementById('eventForm');
    form.parentNode.insertBefore(successMessage, form);
    form.style.display = 'none';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Error message
function showErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message || 'Something went wrong. Please try again.';
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.parentNode.insertBefore(errorMessage, submitBtn);
    
    // Remove error message after 5 seconds
    setTimeout(() => errorMessage.remove(), 5000);
}

// Form submission function
async function submitForm(form) {
    const formData = new FormData(form);
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

    return await response.json();
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



