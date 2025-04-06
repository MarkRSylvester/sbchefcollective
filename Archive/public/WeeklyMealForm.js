class WeeklyMealForm extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <form id="weeklyMealForm" class="inquiry-form">
        <h2>Weekly Meal Service</h2>
        <p>Let us take care of your weekly meals with personalized chef service.</p>
        
        <div class="form-group">
          <label for="householdSize">Household Size</label>
          <input type="number" id="householdSize" name="householdSize" min="1" required>
        </div>
        
        <div class="form-group">
          <label for="mealsPerWeek">Meals per Week</label>
          <select id="mealsPerWeek" name="mealsPerWeek" required>
            <option value="">Select number of meals</option>
            <option value="3">3 meals</option>
            <option value="5">5 meals</option>
            <option value="7">7 meals</option>
            <option value="custom">Custom plan</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Dietary Preferences</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" name="dietary[]" value="vegetarian"> Vegetarian
            </label>
            <label>
              <input type="checkbox" name="dietary[]" value="vegan"> Vegan
            </label>
            <label>
              <input type="checkbox" name="dietary[]" value="gluten-free"> Gluten-Free
            </label>
            <label>
              <input type="checkbox" name="dietary[]" value="dairy-free"> Dairy-Free
            </label>
            <label>
              <input type="checkbox" name="dietary[]" value="paleo"> Paleo
            </label>
            <label>
              <input type="checkbox" name="dietary[]" value="keto"> Keto
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="allergies">Allergies or Restrictions</label>
          <textarea id="allergies" name="allergies" rows="3"></textarea>
        </div>
        
        <div class="form-group">
          <label for="cuisinePreferences">Cuisine Preferences</label>
          <textarea id="cuisinePreferences" name="cuisinePreferences" rows="3" placeholder="Tell us about your favorite types of cuisine"></textarea>
        </div>
        
        <div class="form-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" required>
          </div>
        </div>
        
        <div class="form-group">
          <label for="address">Delivery Address</label>
          <textarea id="address" name="address" rows="2" required></textarea>
        </div>
        
        <button type="submit" class="submit-btn">Submit Inquiry</button>
      </form>
    `;
  }

  attachEventListeners() {
    const form = this.querySelector('#weeklyMealForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      // Handle multiple checkbox values
      data.dietary = formData.getAll('dietary[]');
      
      try {
        const response = await fetch('/.netlify/functions/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Show success message
        form.innerHTML = `
          <div class="success-message">
            <h3>Thank you for your inquiry!</h3>
            <p>We'll be in touch with you shortly to discuss your meal service.</p>
          </div>
        `;
        
        // Close modal after delay
        setTimeout(() => {
          const modal = this.closest('.modal');
          if (modal) {
            modal.style.display = 'none';
            // Reset form after modal is closed
            this.render();
            this.attachEventListeners();
          }
        }, 3000);
        
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your inquiry. Please try again.');
      }
    });
  }
}

customElements.define('weekly-meal-form', WeeklyMealForm); 