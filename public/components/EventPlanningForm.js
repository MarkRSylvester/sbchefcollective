/* @ts-check */
/* Content-Type: text/javascript */

/**
 * EventPlanningForm.js
 * Custom element for handling event planning form functionality
 */
class EventPlanningForm extends HTMLElement {
  /** @type {ShadowRoot} */
  shadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.attachEventListeners();
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <h3>${isError ? 'Error' : 'Success!'}</h3>
        <p>${message}</p>
        ${!isError ? '<p>We will be in touch with you shortly to discuss your event in detail.</p>' : ''}
        <button class="close-message">Close</button>
      </div>
    `;
    
    messageDiv.querySelector('.close-message').addEventListener('click', () => {
      messageDiv.remove();
      if (!isError) {
        // Reset form on success
        this.shadowRoot.querySelector('form').reset();
      }
    });

    this.shadowRoot.appendChild(messageDiv);
  }

  async submitForm(formData) {
    try {
      const response = await fetch('/.netlify/functions/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      this.showMessage('Your inquiry has been submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showMessage(error.message || 'An error occurred while submitting your inquiry. Please try again.', true);
      return false;
    }
  }

  setupListeners() {
    if (!this.shadowRoot) return;

    // Handle multi-select items
    this.shadowRoot.querySelectorAll('.multi-select').forEach(container => {
      container.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        
        if (target.classList.contains('multi-select-item')) {
          target.classList.toggle('selected');
          
          // Update hidden input with selected values
          const selectedItems = container.querySelectorAll('.selected');
          const values = Array.from(selectedItems).map(item => {
            if (!(item instanceof HTMLElement)) return '';
            return item.dataset.value || '';
          }).filter(Boolean);
          
          const hiddenInput = container.parentElement?.querySelector('input[type="hidden"]');
          if (hiddenInput instanceof HTMLInputElement) {
            hiddenInput.value = values.join(',');
          }
        }
      });
    });

    // Handle form submission
    const form = this.shadowRoot.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (!isValid) {
        this.showMessage('Please fill in all required fields.', true);
        return;
      }

      // Submit form
      const formData = new FormData(form);
      const success = await this.submitForm(formData);

      if (success) {
        // Optionally trigger any post-submission actions
        this.dispatchEvent(new CustomEvent('formSubmitted', {
          detail: { data: Object.fromEntries(formData) }
        }));
      }
    });
  }

  render() {
    if (!this.shadowRoot) return;
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

        .message {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .message-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          text-align: center;
        }

        .message.error .message-content {
          border-left: 4px solid #e74c3c;
        }

        .message.success .message-content {
          border-left: 4px solid #2ecc71;
        }

        .close-message {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }

        .error {
          border-color: #e74c3c !important;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      </style>

      <form id="eventInquiryForm" class="inquiry-form">
        <h2>Plan Your Event</h2>
        <p>Tell us about your vision, and we'll help make it a reality.</p>
        
        <div class="form-group">
          <label for="eventName">Event Name/Type</label>
          <input type="text" id="eventName" name="eventName" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="eventDate">Date</label>
            <input type="date" id="eventDate" name="eventDate" required>
          </div>
          <div class="form-group">
            <label for="eventTime">Time</label>
            <input type="time" id="eventTime" name="eventTime" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="guestCount">Number of Guests</label>
            <input type="number" id="guestCount" name="guestCount" min="2" required>
          </div>
          <div class="form-group">
            <label for="budgetPerPerson">Budget per Person</label>
            <input type="number" id="budgetPerPerson" name="budgetPerPerson" min="50" required>
          </div>
        </div>
        
        <div class="form-group">
          <label for="eventType">Event Type</label>
          <select id="eventType" name="eventType" required>
            <option value="">Select an event type</option>
            <option value="dinner">Intimate Dinner</option>
            <option value="party">Dinner Party</option>
            <option value="celebration">Special Celebration</option>
            <option value="corporate">Corporate Event</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="cuisinePreferences">Cuisine Preferences</label>
          <textarea id="cuisinePreferences" name="cuisinePreferences" rows="3"></textarea>
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
        
        <button type="submit" class="submit-btn">Submit Inquiry</button>
      </form>
    `;
  }

  attachEventListeners() {
    const form = this.querySelector('#eventInquiryForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
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
            <p>We'll be in touch with you shortly to discuss your event.</p>
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

customElements.define('event-planning-form', EventPlanningForm); 