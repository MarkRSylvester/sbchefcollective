// Fetch chefs from the API
async function fetchChefs() {
  try {
    const response = await fetch('/.netlify/functions/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getChefs'
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chefs:', error);
    return [];
  }
}

// Fetch menus from the API
async function fetchMenus() {
  try {
    const response = await fetch('/.netlify/functions/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getMenus'
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching menus:', error);
    return [];
  }
}

// Fetch dishes for a specific menu
async function fetchDishes(menuId) {
  try {
    const response = await fetch('/.netlify/functions/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getDishes',
        menuId
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }
}

// Render chef cards
function renderChefCards(chefs) {
  const chefGrid = document.getElementById('chefGrid');
  if (!chefGrid) return;

  chefGrid.innerHTML = chefs.map(chef => `
    <div class="chef-card">
      <img src="${chef.photo}" alt="${chef.name}" class="chef-photo">
      <h3>${chef.name}</h3>
      <p class="chef-specialties">${chef.specialties}</p>
      <p class="chef-bio">${chef.bio}</p>
      <button class="book-btn" data-chef-id="${chef.id}">Book This Chef</button>
    </div>
  `).join('');

  // Add event listeners to booking buttons
  chefGrid.querySelectorAll('.book-btn').forEach(button => {
    button.addEventListener('click', () => {
      const chefId = button.getAttribute('data-chef-id');
      document.getElementById('eventPlanningModal').classList.add('active');
      // You could store the selected chef ID in a hidden input if needed
    });
  });
}

// Initialize the chef discovery section
async function initChefDiscovery() {
  const chefs = await fetchChefs();
  renderChefCards(chefs);
}

// Export functions for use in other modules
window.sbccData = {
  fetchChefs,
  fetchMenus,
  fetchDishes,
  initChefDiscovery
}; 