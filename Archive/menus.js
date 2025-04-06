// Menu color palette from blueprint
const MENU_COLORS = {
    "Brunch in Bloom": "#fff4dc",
    "Surf & Turf Soirée": "#ffd7b3",
    "Mexican Mesa": "#f8caa5",
    "Paella Picnic": "#d2f1a3",
    "Farm to Table": "#aee0a1",
    "Pasta & Salads": "#b6d89f",
    "Sushi": "#caf2e6",
    "Fresh Catch": "#a9e5dc",
    "Cocktail Party": "#b7d6f2",
    "Greek": "#a8caff",
    "Mediterranean": "#efe2bd",
    "Pizza Night": "#ffe199",
    "Asian Fusion": "#f9b9b7",
    "Thanksgiving": "#f5c6a0",
    "Christmas": "#e7b8c1"
};

// Global state for tracking menu selections
let menuSelections = {};
let activeMenuId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    document.querySelector('.tab-button[onclick="openTab(\'chefs\')"]').addEventListener('click', function() {
        openTab('chefs');
    });
    
    document.querySelector('.tab-button[onclick="openTab(\'menus\')"]').addEventListener('click', function() {
        openTab('menus');
    });
    
    // Load chefs data
    loadChefs();
    
    // Load menus data (in background)
    loadMenus();
});

// Tab switching function
function openTab(tabName) {
    // Hide all tabs
    document.getElementById('chefs').style.display = 'none';
    document.getElementById('menus').style.display = 'none';
    
    // Deactivate all tabs
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show and activate selected tab
    document.getElementById(tabName).style.display = 'block';
    document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

// Load chefs data
async function loadChefs() {
    const chefsContainer = document.getElementById('chefs-container');
    chefsContainer.innerHTML = '<div class="loading">Loading chefs information...</div>';
    
    try {
        const chefs = await getChefs();
        displayChefs(chefs);
    } catch (error) {
        console.error('Error loading chefs:', error);
        chefsContainer.innerHTML = `
            <div class="error">
                <p>Error loading chef information: ${error.message}</p>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

// Load menus data
async function loadMenus() {
    const menusContainer = document.getElementById('menus-container');
    menusContainer.innerHTML = '<div class="loading">Loading menu information...</div>';
    
    try {
        const menus = await getMenus();
        displayMenus(menus);
    } catch (error) {
        console.error('Error loading menus:', error);
        menusContainer.innerHTML = `
            <div class="error">
                <p>Error loading menu information: ${error.message}</p>
                <p>Please refresh the page to try again.</p>
            </div>
        `;
    }
}

// Display chefs data in the UI using your template format
function displayChefs(chefs) {
    const container = document.getElementById('chefs-container');
    container.innerHTML = '';
    
    chefs.forEach(chef => {
        // Create chef element
        const chefElement = document.createElement('div');
        chefElement.className = 'accordion chef-accordion';
        
        // Use your exact template format with the template literals
        chefElement.innerHTML = `
${chef.name}

Chef

Click to Expand
<img src="${chef.imageUrl || 'https://via.placeholder.com/120'}" alt="${chef.name}">
${chef.bio || 'Biography coming soon.'}
`;
        
        // Add to container
        container.appendChild(chefElement);
    });
}

// Display menus data in the UI using your template format
function displayMenus(menus) {
    const container = document.getElementById('menus-container');
    container.innerHTML = '';
    
    menus.forEach(menu => {
        // Create menu element
        const menuElement = document.createElement('div');
        menuElement.className = 'accordion menu-accordion';
        
        // Set the menu color from palette or use default
        const menuColor = MENU_COLORS[menu.name] || '#ccc';
        menuElement.style.borderLeftColor = menuColor;
        
        // Use your exact template format with the template literals
        menuElement.innerHTML = `
${menu.name}

${menu.description || 'Menu details'}

Click to Expand
Loading menu details...
`;
        
        // Add data attribute for menu ID
        menuElement.setAttribute('data-menu-id', menu.id);
        
        // Add click handler for the Click to Expand text
        menuElement.querySelector('Click to Expand').addEventListener('click', function() {
            const menuId = menuElement.getAttribute('data-menu-id');
            loadMenuDetails(menuId, menuElement);
        });
        
        // Add to container
        container.appendChild(menuElement);
    });
}

// Load menu details when a menu is expanded
async function loadMenuDetails(menuId, menuElement) {
    const contentElement = menuElement.querySelector('Loading menu details...');
    contentElement.textContent = 'Loading menu details...';
    
    try {
        // Fetch dishes for this menu
        const dishes = await getDishes(menuId);
        
        // Set active menu and reset selections
        activeMenuId = menuId;
        menuSelections = {};
        
        // Display the dishes
        displayDishes(dishes, contentElement);
    } catch (error) {
        console.error('Error loading menu details:', error);
        contentElement.innerHTML = `
            <div class="error">
                <p>Error loading menu details: ${error.message}</p>
                <p>Please try again.</p>
            </div>
        `;
    }
}

// Display dishes grouped by category using your template format
function displayDishes(dishes, container) {
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
    
    // Sort the categories
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
        
        const sectionElement = document.createElement('div');
        sectionElement.className = 'menu-section';
        sectionElement.innerHTML = `<h3 class="menu-section-title">${category}</h3>`;
        
        // Add dishes to section using your template format
        categoryDishes.forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.className = 'dish-item';
            
            // Use your exact template format with the template literals
            dishElement.innerHTML = `
${dish.dishName}
${dish.description || ''}
☐ Select
`;
            
            // Add to section
            sectionElement.appendChild(dishElement);
        });
        
        // Add section to container
        container.appendChild(sectionElement);
    });
}