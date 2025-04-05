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
const DEFAULT_CHEF_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzNlNWM3NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGVmPC90ZXh0Pjwvc3ZnPg==';

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
const API_ENDPOINT = '/api';  // Updated to use the new API endpoint

// Tab Navigation
function setupTabNavigation() {
    if (chefsButton && menusButton) {
        chefsButton.addEventListener('click', () => {
            console.log('Chefs tab clicked');
            setActiveTab('chefs');
            loadChefs();
        });

        menusButton.addEventListener('click', () => {
            console.log('Menus tab clicked');
            setActiveTab('menus');
            loadMenus();
        });
    }
}

function setActiveTab(tabName) {
    // Update button states
    if (chefsButton && menusButton) {
        chefsButton.classList.toggle('active', tabName === 'chefs');
        menusButton.classList.toggle('active', tabName === 'menus');
    }

    // Update content visibility
    if (chefsContainer && menusContainer) {
        chefsContainer.classList.toggle('active', tabName === 'chefs');
        menusContainer.classList.toggle('active', tabName === 'menus');
    }
}

// Load Chefs
async function loadChefs() {
    console.log('Loading chefs...');
    if (!chefsContainer) {
        console.error('Chef container not found');
        return;
    }

    chefsContainer.innerHTML = '<div class="loading">Loading our talented chefs...</div>';

    try {
        const response = await fetch(`${API_ENDPOINT}?action=getChefs`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const chefs = await response.json();
    
        if (!chefs || chefs.length === 0) {
            chefsContainer.innerHTML = '<div class="error">No chefs found. Please try again later.</div>';
            return;
        }
    
        chefsContainer.innerHTML = '';
        
        chefs.forEach(chef => {
            const chefCard = createChefCard(chef);
            chefsContainer.appendChild(chefCard);
        });
    } catch (error) {
        console.error('Error loading chefs:', error);
        chefsContainer.innerHTML = '<div class="error">Failed to load chefs. Please try again later.</div>';
    }
}

// Create Chef Card
function createChefCard(chef) {
    const card = document.createElement('div');
    card.className = 'chef-card';
    
    const photoUrl = chef.photo || DEFAULT_CHEF_IMAGE;
    
    card.innerHTML = `
        <div class="chef-photo">
            <img src="${photoUrl}" alt="${chef.name}" onerror="this.src='${DEFAULT_CHEF_IMAGE}'">
        </div>
        <div class="chef-info">
            <h3>${chef.name}</h3>
            <p>${chef.bio}</p>
            ${chef.specialties ? `<p class="specialties">Specialties: ${chef.specialties.join(', ')}</p>` : ''}
            ${chef.availability ? `<p class="availability">Availability: ${chef.availability}</p>` : ''}
        </div>
    `;
    
    return card;
}

// Load Menus
async function loadMenus() {
    console.log('Loading menus...');
    if (!menusContainer) {
        console.error('Menus container not found');
        return;
    }

    menusContainer.innerHTML = '<div class="loading">Loading our delicious menus...</div>';

    try {
        const response = await fetch(`${API_ENDPOINT}?action=getMenus`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const menus = await response.json();
    
        if (!menus || menus.length === 0) {
            menusContainer.innerHTML = '<div class="error">No menus found. Please try again later.</div>';
            return;
        }
    
        // Sort menus by menuNumber
        const sortedMenus = menus.sort((a, b) => (a.menuNumber || 9999) - (b.menuNumber || 9999));
        
        menusContainer.innerHTML = '';
        
        sortedMenus.forEach(menu => {
            const menuCard = createMenuCard(menu);
            menusContainer.appendChild(menuCard);
        });
    } catch (error) {
        console.error('Error loading menus:', error);
        menusContainer.innerHTML = '<div class="error">Failed to load menus. Please try again later.</div>';
    }
}

// Create Menu Card
function createMenuCard(menu) {
    const card = document.createElement('div');
    card.className = 'menu-accordion';
    
    const menuColor = MENU_COLORS[menu.name] || '#f9f9f9';
    card.style.backgroundColor = menuColor;
    
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.innerHTML = `
        <h3>${menu.name}</h3>
        <div class="accordion-arrow"></div>
    `;
    
    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.style.display = 'none';
    
    if (menu.description) {
        const description = document.createElement('p');
        description.className = 'menu-description';
        description.textContent = menu.description;
        content.appendChild(description);
    }
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading dishes...';
    content.appendChild(loading);
    
    card.appendChild(header);
    card.appendChild(content);
    
    header.addEventListener('click', async () => {
        const isOpen = content.style.display === 'block';
        
        // Close currently open accordion if exists
        if (currentOpenAccordion && currentOpenAccordion !== content) {
            currentOpenAccordion.style.display = 'none';
            currentOpenAccordion.previousElementSibling.classList.remove('active');
        }
        
        header.classList.toggle('active');
        content.style.display = isOpen ? 'none' : 'block';
        
        if (!isOpen) {
            currentOpenAccordion = content;
            if (!content.querySelector('.dish-category')) {
                try {
                    const response = await fetch(`${API_ENDPOINT}?action=getDishes&menuId=${menu.id}`);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    
                    const dishes = await response.json();
                    loading.remove();
                    
                    if (dishes && dishes.length > 0) {
                        // Group dishes by category
                        const categories = {};
                        dishes.forEach(dish => {
                            const category = dish.category || 'Other';
                            if (!categories[category]) {
                                categories[category] = [];
                            }
                            categories[category].push(dish);
                        });
                        
                        // Create sections for each category
                        Object.entries(categories).forEach(([category, categoryDishes]) => {
                            const categorySection = document.createElement('div');
                            categorySection.className = 'dish-category';
                            categorySection.innerHTML = `<h4>${category}</h4>`;
                            
                            const dishList = document.createElement('div');
                            dishList.className = 'dish-list';
                            
                            categoryDishes.forEach(dish => {
                                const dishItem = document.createElement('div');
                                dishItem.className = 'dish-item';
                                dishItem.innerHTML = `
                                    <label class="dish-checkbox">
                                        <input type="checkbox">
                                        <span class="checkmark"></span>
                                        <span class="dish-name">${dish.name}</span>
                                    </label>
                                    ${dish.description ? `<p class="dish-description">${dish.description}</p>` : ''}
                                `;
                                dishList.appendChild(dishItem);
                            });
                            
                            categorySection.appendChild(dishList);
                            content.appendChild(categorySection);
                        });
                    } else {
                        content.innerHTML = '<p class="no-dishes">No dishes available for this menu.</p>';
                    }
                } catch (error) {
                    console.error('Error loading dishes:', error);
                    content.innerHTML = '<p class="error">Failed to load dishes. Please try again later.</p>';
                }
            }
        } else {
            currentOpenAccordion = null;
        }
    });
    
    return card;
}

// Load Dishes
async function loadDishes(menuId, container) {
    console.log('Loading dishes for menu:', menuId);
    
    try {
        console.log('Fetching dishes from API...');
        const response = await fetch(`${API_ENDPOINT}/menus/${menuId}/dishes`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dishes = await response.json();
        console.log('Dishes data received:', dishes);
        
        if (!dishes || dishes.length === 0) {
            container.innerHTML = '<div class="no-dishes">No dishes available for this menu.</div>';
            return;
        }
        
        // Clear loading state
        container.innerHTML = '';
        
        // Group dishes by category
        const categories = {};
        dishes.forEach(dish => {
            const category = dish.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(dish);
        });
        
        // Define the order of categories
        const categoryOrder = [
            'Appetizers',
            'Starters',
            'Salads',
            'Mains',
            'Entrees',
            'Sides',
            'Desserts'
        ];
        
        // Sort categories
        const sortedCategories = Object.keys(categories).sort((a, b) => {
            const indexA = categoryOrder.indexOf(a);
            const indexB = categoryOrder.indexOf(b);
            
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
        
        // Create sections for each category
        sortedCategories.forEach(category => {
            const categoryDishes = categories[category];
            
            // Create category section
            const section = document.createElement('div');
            section.className = 'menu-category';
            
            // Add category title
            const title = document.createElement('h3');
            title.className = 'menu-category-title';
            title.textContent = category;
            section.appendChild(title);
            
            // Add dishes
            categoryDishes.forEach(dish => {
                const dishItem = document.createElement('div');
                dishItem.className = 'dish-item';
                
                const name = document.createElement('div');
                name.className = 'dish-name';
                name.textContent = dish.name;
                
                const description = document.createElement('div');
                description.className = 'dish-description';
                description.textContent = dish.description;
                
                dishItem.appendChild(name);
                dishItem.appendChild(description);
                section.appendChild(dishItem);
            });
            
            container.appendChild(section);
        });
    } catch (error) {
        console.error('Error loading dishes:', error);
        container.innerHTML = '<div class="error">Failed to load dishes. Please try again later.</div>';
    }
}

// Menu Customization
const customizeMenuButton = document.getElementById('customizeMenuButton');

const menuCustomization = {
    createMenuPreferenceForm: function() {
        return `
            <form id="menuPreferenceForm" class="menu-preference-form">
                <h3>Customize Your Menu</h3>
                <div class="form-group">
                    <label for="guestCount">Number of Guests</label>
                    <select id="guestCount" name="guestCount" required>
                        <option value="">Select guest count</option>
                        <option value="small">Small (6 or fewer)</option>
                        <option value="medium">Medium (7-12)</option>
                        <option value="large">Large (13+)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="eventStyle">Event Style</label>
                    <select id="eventStyle" name="eventStyle" required>
                        <option value="">Select event style</option>
                        <option value="casual">Casual Dining</option>
                        <option value="formal">Formal Dining</option>
                        <option value="celebration">Celebration</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="proteins">Preferred Proteins</label>
                    <select id="proteins" name="proteins" multiple required>
                        <option value="beef">Beef</option>
                        <option value="chicken">Chicken</option>
                        <option value="fish">Fish</option>
                        <option value="lamb">Lamb</option>
                        <option value="pork">Pork</option>
                        <option value="vegetarian">Vegetarian</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dietary">Dietary Restrictions</label>
                    <select id="dietary" name="dietary" multiple>
                        <option value="gluten-free">Gluten-Free</option>
                        <option value="dairy-free">Dairy-Free</option>
                        <option value="vegan">Vegan</option>
                        <option value="nut-free">Nut-Free</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="cuisine">Cuisine Preferences</label>
                    <select id="cuisine" name="cuisine" multiple required>
                        <option value="american">American</option>
                        <option value="italian">Italian</option>
                        <option value="french">French</option>
                        <option value="mediterranean">Mediterranean</option>
                        <option value="asian">Asian Fusion</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Generate Custom Menu</button>
            </form>
        `;
    },

    displayCustomMenu: function(preferences) {
        const basePrice = this.calculateBasePrice(preferences.guestCount);
        const menu = this.generateMenu(preferences);
        
        const menuHTML = `
            <div class="custom-menu">
                <h2 class="menu-title">Your Custom Menu</h2>
                <p class="menu-description">Crafted based on your preferences</p>
                
                <div class="menu-sections">
                    ${menu.courses.map(course => `
                        <div class="menu-section">
                            <h3>${course.title}</h3>
                            <ul>
                                ${course.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="menu-pricing">
                    <p class="base-price">Starting at $${basePrice} per person</p>
                    <p class="price-note">Final pricing may vary based on specific selections and add-ons</p>
                </div>
                
                <div class="menu-actions">
                    <button class="btn btn-primary" onclick="bookExperience()">Book This Experience</button>
                    <button class="btn btn-secondary" onclick="menuCustomization.showMenuForm()">Customize Again</button>
                </div>
            </div>
        `;
        
        menuContainer.innerHTML = menuHTML;
    },

    calculateBasePrice: function(guestCount) {
        const basePrices = {
            small: 125,
            medium: 110,
            large: 95
        };
        return basePrices[guestCount];
    },

    generateMenu: function(preferences) {
        // This is a simplified example - in production, this would be more sophisticated
        return {
            courses: [
                {
                    title: 'First Course',
                    items: [
                        'Seasonal Garden Salad with House Vinaigrette',
                        'Fresh Baked Artisan Bread'
                    ]
                },
                {
                    title: 'Main Course',
                    items: [
                        'Pan-Seared Local Fish with Herb Butter',
                        'Grass-Fed Beef Tenderloin with Red Wine Reduction',
                        'Seasonal Vegetable Medley',
                        'Roasted Fingerling Potatoes'
                    ]
                },
                {
                    title: 'Dessert',
                    items: [
                        'Dark Chocolate Mousse',
                        'Fresh Berries with Mint'
                    ]
                }
            ]
        };
    },

    showMenuForm: function() {
        menuContainer.innerHTML = this.createMenuPreferenceForm();
        this.setupFormHandlers();
    },

    setupFormHandlers: function() {
        const form = document.getElementById('menuPreferenceForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const preferences = Object.fromEntries(formData.entries());
                this.displayCustomMenu(preferences);
            });
        }
    }
};

if (customizeMenuButton) {
    customizeMenuButton.addEventListener('click', () => menuCustomization.showMenuForm());
}

function loadServices() {
    if (!servicesContainer.querySelector('.services-section')) {
        servicesContainer.innerHTML = `
        <div class="services-section">
          <div class="services-grid">
            <div class="service-card">
              <div class="service-image">
                <img src="${DEFAULT_SERVICE_IMAGES['Private Chef Services']}" alt="Private Chef Services" loading="lazy">
              </div>
              <h3>Private Chef Services</h3>
              <p>From intimate dinners to family gatherings, our chefs create personalized dining experiences in your home. Each menu is thoughtfully crafted to your preferences and dietary needs.</p>
            </div>
            <div class="service-card">
              <div class="service-image">
                <img src="${DEFAULT_SERVICE_IMAGES['Event Catering']}" alt="Event Catering" loading="lazy">
              </div>
              <h3>Event Catering</h3>
              <p>Elevate your special occasions with our custom catering services. From weddings to corporate events, we handle everything from menu planning to execution.</p>
            </div>
            <div class="service-card">
              <div class="service-image">
                <img src="${DEFAULT_SERVICE_IMAGES['Cooking Classes']}" alt="Cooking Classes" loading="lazy">
              </div>
              <h3>Cooking Classes</h3>
              <p>Learn the secrets of exceptional cooking with our interactive classes. Perfect for team building, special occasions, or expanding your culinary horizons.</p>
            </div>
            <div class="service-card">
              <div class="service-image">
                <img src="${DEFAULT_SERVICE_IMAGES['Meal Preparation']}" alt="Meal Preparation" loading="lazy">
              </div>
              <h3>Meal Preparation</h3>
              <p>Weekly meal prep services tailored to your dietary preferences and lifestyle needs. Fresh, healthy, and convenient meals prepared in your home.</p>
            </div>
            <div class="service-card">
              <div class="service-image">
                <img src="${DEFAULT_SERVICE_IMAGES['Wine Pairing']}" alt="Wine Pairing" loading="lazy">
              </div>
              <h3>Wine Pairing</h3>
              <p>Expert wine selection and pairing services to complement your menu. Our sommeliers create the perfect wine experience for your event.</p>
            </div>
            <div class="service-card">
              <div class="service-image">
                <img src="${DEFAULT_SERVICE_IMAGES['Kitchen Organization']}" alt="Kitchen Organization" loading="lazy">
              </div>
              <h3>Kitchen Organization</h3>
              <p>Professional kitchen setup and organization services. We help optimize your space for efficiency and enjoyment.</p>
            </div>
          </div>
          
          <section class="estate-chef-section">
            <h2>Full-Time Estate Chef Placement</h2>
            <p class="subtitle">Live-in OR Offsite Options Available</p>
            
            <div class="partnership-announcement">
              <h3>Exclusive Yacht & Estate Placement Partnership</h3>
              <p>Santa Barbara Chef Collective is thrilled to announce our exclusive partnership with premier private yacht placement agencies, offering discerning clients access to the world's top culinary talent.</p>
            </div>
            
            <div class="step-grid">
              <div class="step-card">
                <h4>1. Chef Selection</h4>
                <p>Receive carefully curated resumes of international chefs matched to your preferences and requirements.</p>
              </div>
              <div class="step-card">
                <h4>2. Personal Interviews</h4>
                <p>Interview chefs personally to ensure their culinary style and personality align with your vision.</p>
              </div>
              <div class="step-card">
                <h4>3. Perfect Match</h4>
                <p>Select your ideal chef with our expert guidance for a seamless culinary partnership.</p>
              </div>
            </div>
            
            <div class="global-network">
              <h3>Access to Global Culinary Talent</h3>
              <p>Connect with world-class chefs specializing in diverse cuisines and styles, from Michelin-starred professionals to innovative culinary artists.</p>
            </div>
            
            <div class="cta-buttons">
              <button class="cta-button">Inquire About Estate Chef Placement</button>
        </div>
          </section>
        </div>`;
    }
    
    // Add event listeners to service cards
    const serviceCards = servicesContainer.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });
}

// FAQ Functionality
function loadFAQ() {
    console.log('Loading FAQ section...');
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                // Close other open answers
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.classList.remove('open');
                        }
                    }
                });
                
                // Toggle current answer
                answer.classList.toggle('open');
            });
        }
    });
}

function loadPricingSection() {
    if (!pricingContainer.querySelector('.pricing-section')) {
        const pricingSection = document.createElement('div');
        pricingSection.className = 'pricing-section';
        
        pricingSection.innerHTML = `
            <h2 class="pricing-title">Private Dining Experience</h2>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <h3>Casual</h3>
                    <p class="price">$135 - $165 pp</p>
                    <p class="guests">8+ guests</p>
                </div>
                <div class="pricing-card">
                    <h3>Gourmet</h3>
                    <p class="price">$170 - $200 pp</p>
                    <p class="guests">8+ guests</p>
                </div>
                <div class="pricing-card featured">
                    <h3>Chef\'s Table</h3>
                    <p class="price">Starting at $210 pp</p>
                    <p class="guests">8+ guests</p>
                </div>
                <div class="pricing-card">
                    <h3>Intimate</h3>
                    <p class="price">Starting at $170 pp</p>
                    <p class="guests">4-7 guests</p>
                </div>
                <div class="pricing-card">
                    <h3>Large Events</h3>
                    <p class="price">Custom Pricing</p>
                    <p class="guests">25+ guests</p>
                </div>
            </div>
            <p class="pricing-note">*Prices may vary depending on group sizes and menu items.</p>
            <div class="cta-buttons">
                <button class="cta-button" onclick="openTab(null, 'eventFormContainer')">Plan Your Gathering</button>
                <button class="cta-button secondary" onclick="openTab(null, 'mealServiceContainer')">Personal Chef Service</button>
            </div>
        `;
        
        pricingContainer.appendChild(pricingSection);
    }
}

function loadEventForm() {
    if (!eventFormContainer.querySelector('.event-form')) {
        const formSection = document.createElement('div');
        formSection.className = 'event-form-section';
        
        formSection.innerHTML = `
            <h2 class="form-title">Plan Your Gathering</h2>
            <form class="event-form" id="eventForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="firstName">First Name*</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name*</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email*</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone*</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    <div class="form-group full-width">
                        <label for="address">Address*</label>
                        <input type="text" id="address" name="address" required>
                    </div>
                    <div class="form-group">
                        <label for="guestCount">How many adults & children?*</label>
                        <input type="number" id="guestCount" name="guestCount" required>
                    </div>
                    <div class="form-group">
                        <label for="mealsPerWeek">How many meals a week?*</label>
                        <input type="number" id="mealsPerWeek" name="mealsPerWeek" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Which Days of the Week?*</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" name="days" value="Monday"> Monday</label>
                            <label><input type="checkbox" name="days" value="Tuesday"> Tuesday</label>
                            <label><input type="checkbox" name="days" value="Wednesday"> Wednesday</label>
                            <label><input type="checkbox" name="days" value="Thursday"> Thursday</label>
                            <label><input type="checkbox" name="days" value="Friday"> Friday</label>
                            <label><input type="checkbox" name="days" value="Saturday"> Saturday</label>
                            <label><input type="checkbox" name="days" value="Sunday"> Sunday</label>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>Meals*</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" name="meals" value="Breakfast"> Breakfast</label>
                            <label><input type="checkbox" name="meals" value="Lunch"> Lunch</label>
                            <label><input type="checkbox" name="meals" value="Dinner"> Dinner</label>
                            <label><input type="checkbox" name="meals" value="Snacks"> Snacks</label>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>Type of Meal Service?*</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" name="serviceType" value="In-person"> In-person Cooking</label>
                            <label><input type="checkbox" name="serviceType" value="Glass"> Delivery - Glass Containers</label>
                            <label><input type="checkbox" name="serviceType" value="Disposable"> Delivery - Disposable Containers</label>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>Serving Style?*</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" name="servingStyle" value="Individual"> Individual Portion</label>
                            <label><input type="checkbox" name="servingStyle" value="Family"> Family Style</label>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label for="dietaryNeeds">Special Dietary Needs?*</label>
                        <textarea id="dietaryNeeds" name="dietaryNeeds" rows="4"></textarea>
                    </div>
                    <div class="form-group full-width">
                        <label for="additionalInfo">How can we help?</label>
                        <textarea id="additionalInfo" name="additionalInfo" rows="4"></textarea>
                    </div>
                </div>
                <button type="submit" class="submit-button">Submit</button>
            </form>
        `;
        
        eventFormContainer.appendChild(formSection);
        
        // Add form submission handler
        const form = formSection.querySelector('#eventForm');
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    // Add form submission logic here
    console.log('Form submitted');
}

// Form submission handlers
if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(eventForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = eventForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Here you would typically send the data to your server
            // For now, we'll just simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Thank you for your inquiry! We will contact you shortly.');
            eventForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your inquiry. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

if (mealServiceForm) {
    mealServiceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(mealServiceForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitButton = mealServiceForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Here you would typically send the data to your server
            // For now, we'll just simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Thank you for your interest in our meal service! We will contact you shortly.');
            mealServiceForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your request. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
    }
  });
}

// Menu submission and integration functions
const menuIntegration = {
    async generatePDF(menuData) {
        // Initialize jsPDF with window.jspdf
        const doc = new window.jspdf.jsPDF();
        
        // Add branding
        doc.addImage('logo.png', 'PNG', 15, 15, 30, 30);
        doc.setFont('Playfair Display');
        doc.setFontSize(24);
        doc.text('Santa Barbara Chef Collective', 50, 30);
        
        // Client Information
        doc.setFontSize(14);
        doc.text('Custom Menu Proposal', 15, 50);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 60);
        
        // Guest Information
        doc.text(`Guest Count: ${menuData.guestCount}`, 15, 75);
        doc.text(`Event Style: ${menuData.eventStyle}`, 15, 85);
        
        // Menu Details
        doc.setFontSize(16);
        doc.text('Selected Menu', 15, 105);
        
        let yPos = 120;
        menuData.menu.courses.forEach(course => {
            doc.setFontSize(14);
            doc.text(course.title, 15, yPos);
            yPos += 10;
            
            doc.setFontSize(12);
            course.items.forEach(item => {
                doc.text(`• ${item}`, 20, yPos);
                yPos += 8;
            });
            yPos += 5;
        });
        
        // Pricing
        doc.setFontSize(14);
        doc.text('Pricing Details', 15, yPos + 10);
        doc.setFontSize(12);
        doc.text(`Base Price: $${menuData.basePrice} per person`, 15, yPos + 20);
        doc.text('* Final pricing may vary based on specific selections and add-ons', 15, yPos + 30);
        
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text('Santa Barbara Chef Collective | www.sbchefcollective.com', 15, pageHeight - 20);
        
        return doc.output('blob');
    },
    
    async sendToDubsado(menuData) {
        try {
            // You'll need to replace these with your actual Dubsado API credentials
            const DUBSADO_API_URL = 'https://api.dubsado.com/v1/forms';
            const DUBSADO_API_KEY = process.env.DUBSADO_API_KEY;
            
            // Format data for Dubsado
            const dubsadoData = {
                formId: 'your_form_id_here', // Replace with actual Dubsado form ID
                clientInfo: {
                    guestCount: menuData.guestCount,
                    eventStyle: menuData.eventStyle,
                    selectedProteins: menuData.proteins,
                    dietaryRestrictions: menuData.dietary,
                    cuisinePreferences: menuData.cuisine
                },
                menuDetails: menuData.menu,
                pricing: {
                    basePrice: menuData.basePrice,
                    totalGuests: menuData.guestCount,
                    estimatedTotal: menuData.basePrice * parseInt(menuData.guestCount)
                }
            };
            
            // Send to Dubsado
            const response = await fetch(DUBSADO_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DUBSADO_API_KEY}`
                },
                body: JSON.stringify(dubsadoData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to send data to Dubsado');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error sending to Dubsado:', error);
            throw error;
        }
    }
};

// Update the menu form submission handler
function setupFormHandlers() {
    const form = document.getElementById('menuPreferenceForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            try {
                // Gather form data
                const formData = new FormData(form);
                const preferences = Object.fromEntries(formData.entries());
                
                // Generate menu and calculate pricing
                const menu = menuCustomization.generateMenu(preferences);
                const basePrice = menuCustomization.calculateBasePrice(preferences.guestCount);
                
                // Combine all data
                const menuData = {
                    ...preferences,
                    menu,
                    basePrice
                };
                
                // Generate PDF
                const pdfBlob = await menuIntegration.generatePDF(menuData);
                
                // Send to Dubsado
                await menuIntegration.sendToDubsado(menuData);
                
                // Create download link for PDF
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const downloadLink = document.createElement('a');
                downloadLink.href = pdfUrl;
                downloadLink.download = 'menu-proposal.pdf';
                
                // Display success message with download link
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <h3>Thank you for your menu request!</h3>
                    <p>We've received your preferences and will be in touch shortly.</p>
                    <p>Click <a href="${pdfUrl}" download="menu-proposal.pdf">here</a> to download your custom menu proposal.</p>
                `;
                
                // Replace form with success message
                form.parentNode.replaceChild(successMessage, form);
                
            } catch (error) {
                console.error('Error processing menu submission:', error);
                alert('There was an error processing your request. Please try again or contact us directly.');
                
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}


