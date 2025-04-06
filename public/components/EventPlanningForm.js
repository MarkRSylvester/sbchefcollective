// EventPlanningForm.js
class EventPlanningForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--body-font, 'Inter', sans-serif);
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .form-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        h2 {
          font-family: var(--heading-font, 'Playfair Display', serif);
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        .helper-text {
          font-size: 0.875rem;
          color: #666;
          margin-top: 0.25rem;
        }

        button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button:hover {
          background: var(--primary-color-dark);
        }

        .required {
          color: #e74c3c;
        }

        .multi-select {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .multi-select-item {
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .multi-select-item.selected {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
      </style>

      <form id="eventPlanningForm">
        <div class="form-section">
          <h2>Event Details</h2>
          
          <div class="form-group">
            <label>Event Name <span class="required">*</span></label>
            <input type="text" name="eventName" required>
          </div>

          <div class="form-group">
            <label>Event Date <span class="required">*</span></label>
            <input type="date" name="eventDate" required>
          </div>

          <div class="form-group">
            <label>Event Time <span class="required">*</span></label>
            <input type="time" name="eventTime" required>
          </div>

          <div class="form-group">
            <label>Number of Guests <span class="required">*</span></label>
            <input type="number" name="guestCount" min="1" required>
          </div>

          <div class="form-group">
            <label>Budget per Person <span class="required">*</span></label>
            <select name="budgetPerPerson" required>
              <option value="">Select a budget range</option>
              <option value="under75">Under $75</option>
              <option value="75-125">$75 - $125</option>
              <option value="125-175">$125 - $175</option>
              <option value="175-225">$175 - $225</option>
              <option value="225-300">$225 - $300</option>
              <option value="over300">$300+</option>
            </select>
          </div>

          <div class="form-group">
            <label>Event Type <span class="required">*</span></label>
            <select name="eventType" required>
              <option value="">Select event type</option>
              <option value="dinner">Dinner Party</option>
              <option value="brunch">Brunch</option>
              <option value="cocktail">Cocktail Party</option>
              <option value="holiday">Holiday Celebration</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate Event</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h2>Culinary Preferences</h2>
          
          <div class="form-group">
            <label>Cuisine Preferences <span class="required">*</span></label>
            <div class="multi-select" id="cuisinePreferences">
              <div class="multi-select-item" data-value="california">California / Farm-to-Table</div>
              <div class="multi-select-item" data-value="mediterranean">Mediterranean</div>
              <div class="multi-select-item" data-value="mexican">Mexican</div>
              <div class="multi-select-item" data-value="paella">Paella</div>
              <div class="multi-select-item" data-value="pasta">Pasta & Salads</div>
              <div class="multi-select-item" data-value="sushi">Sushi</div>
              <div class="multi-select-item" data-value="seafood">Seafood</div>
              <div class="multi-select-item" data-value="greek">Greek</div>
              <div class="multi-select-item" data-value="asian">Asian-Inspired</div>
            </div>
            <input type="hidden" name="cuisinePreferences" required>
          </div>

          <div class="form-group">
            <label>Dietary Needs</label>
            <div class="multi-select" id="dietaryNeeds">
              <div class="multi-select-item" data-value="vegetarian">Vegetarian</div>
              <div class="multi-select-item" data-value="vegan">Vegan</div>
              <div class="multi-select-item" data-value="gluten-free">Gluten-Free</div>
              <div class="multi-select-item" data-value="dairy-free">Dairy-Free</div>
              <div class="multi-select-item" data-value="nut-free">Nut-Free</div>
              <div class="multi-select-item" data-value="none">No Special Needs</div>
            </div>
            <input type="hidden" name="dietaryNeeds">
          </div>

          <div class="form-group">
            <label>Dietary Notes</label>
            <textarea name="dietaryNotes" rows="3" placeholder="Please tell us about any allergies or specific dietary requirements"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h2>Event Atmosphere</h2>
          
          <div class="form-group">
            <label>Event Vibe</label>
            <div class="multi-select" id="eventVibe">
              <div class="multi-select-item" data-value="elegant">Elegant</div>
              <div class="multi-select-item" data-value="casual">Casual</div>
              <div class="multi-select-item" data-value="romantic">Romantic</div>
              <div class="multi-select-item" data-value="family">Family-Friendly</div>
              <div class="multi-select-item" data-value="cozy">Cozy & Intimate</div>
              <div class="multi-select-item" data-value="luxurious">Luxurious</div>
            </div>
            <input type="hidden" name="eventVibe">
          </div>

          <div class="form-group">
            <label>Vibe Description</label>
            <textarea name="vibeDescription" rows="3" placeholder="Tell us more about the atmosphere you want to create"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h2>Contact Information</h2>
          
          <div class="form-group">
            <label>Your Name <span class="required">*</span></label>
            <input type="text" name="clientName" required>
          </div>

          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" name="clientEmail" required>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" name="clientPhone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
            <div class="helper-text">Format: 123-456-7890</div>
          </div>
        </div>

        <button type="submit">Submit Inquiry</button>
      </form>
    `;
  }

  setupListeners() {
    // Handle multi-select items
    this.shadowRoot.querySelectorAll('.multi-select').forEach(container => {
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('multi-select-item')) {
          e.target.classList.toggle('selected');
          
          // Update hidden input with selected values
          const selectedItems = container.querySelectorAll('.selected');
          const values = Array.from(selectedItems).map(item => item.dataset.value);
          const hiddenInput = container.parentElement.querySelector('input[type="hidden"]');
          hiddenInput.value = values.join(',');
        }
      });
    });

    // Handle form submission
    this.shadowRoot.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      try {
        // TODO: Replace with actual API endpoint
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            type: 'Event',
            status: 'New Inquiry',
            createdTime: new Date().toISOString()
          })
        });

        if (response.ok) {
          // Show success message and redirect to menu suggestions
          this.dispatchEvent(new CustomEvent('formSubmitted', {
            detail: { data }
          }));
        } else {
          throw new Error('Failed to submit inquiry');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // TODO: Show error message to user
      }
    });
  }
}

customElements.define('event-planning-form', EventPlanningForm); 