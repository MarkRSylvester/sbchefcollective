class EventPlanningForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
        }

        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        h2 {
          font-family: 'Playfair Display', serif;
          color: #2C3E50;
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2C3E50;
          font-weight: 500;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 1rem;
        }

        button {
          background: #2C3E50;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background: #1a252f;
        }

        .error {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .success-message {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          margin: 2rem auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      </style>

      <div class="form-container">
        <h2>Plan Your Event</h2>
        <form id="eventPlanningForm">
          <div class="form-group">
            <label for="eventName">Event Name</label>
            <input type="text" id="eventName" name="eventName" required>
          </div>

          <div class="form-group">
            <label for="eventDate">Event Date</label>
            <input type="date" id="eventDate" name="eventDate" required>
          </div>

          <div class="form-group">
            <label for="eventTime">Event Time</label>
            <input type="time" id="eventTime" name="eventTime" required>
          </div>

          <div class="form-group">
            <label for="guestCount">Number of Guests</label>
            <input type="number" id="guestCount" name="guestCount" min="1" required>
          </div>

          <div class="form-group">
            <label for="budgetPerPerson">Budget per Person ($)</label>
            <input type="number" id="budgetPerPerson" name="budgetPerPerson" min="0" step="10" required>
          </div>

          <div class="form-group">
            <label for="eventType">Event Type</label>
            <select id="eventType" name="eventType" required>
              <option value="">Select Event Type</option>
              <option value="Private Dinner">Private Dinner</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate Event</option>
              <option value="Special Occasion">Special Occasion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="cuisinePreferences">Cuisine Preferences</label>
            <textarea id="cuisinePreferences" name="cuisinePreferences" rows="3" required></textarea>
          </div>

          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" required>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" required>
          </div>

          <button type="submit">Submit Inquiry</button>
        </form>
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('#eventPlanningForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      try {
        const response = await fetch('/.netlify/functions/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'submitInquiry',
            ...data
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        // Show success message
        form.innerHTML = `
          <div class="success-message">
            <h3>Thank You!</h3>
            <p>Your inquiry has been submitted successfully. We'll be in touch with you shortly.</p>
          </div>
        `;

        // Dispatch event for parent components
        this.dispatchEvent(new CustomEvent('formSubmitted', {
          detail: { data: result },
          bubbles: true,
          composed: true
        }));

      } catch (error) {
        console.error('Error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = 'There was an error submitting your inquiry. Please try again.';
        form.prepend(errorDiv);
      }
    });
  }
}

customElements.define('event-planning-form', EventPlanningForm); 