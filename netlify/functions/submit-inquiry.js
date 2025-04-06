const Airtable = require('airtable');

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['eventName', 'eventDate', 'eventTime', 'guestCount', 'budgetPerPerson', 'eventType', 'cuisinePreferences', 'clientName', 'clientEmail'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields',
          fields: missingFields
        })
      };
    }

    // Format data for Airtable
    const record = {
      'Event Name': data.eventName,
      'Event Date': data.eventDate,
      'Event Time': data.eventTime,
      'Guest Count': parseInt(data.guestCount),
      'Budget per Person': data.budgetPerPerson,
      'Event Type': data.eventType,
      'Cuisine Preferences': data.cuisinePreferences.split(','),
      'Dietary Needs': data.dietaryNeeds ? data.dietaryNeeds.split(',') : [],
      'Dietary Notes': data.dietaryNotes,
      'Event Vibe': data.eventVibe ? data.eventVibe.split(',') : [],
      'Vibe Description': data.vibeDescription,
      'Client Name': data.clientName,
      'Client Email': data.clientEmail,
      'Client Phone': data.clientPhone,
      'Status': 'New Inquiry',
      'Type': 'Event',
      'Created Time': new Date().toISOString()
    };

    // Create record in Airtable
    const createdRecord = await base('Inquiries').create([
      { fields: record }
    ]);

    // Send confirmation email
    // TODO: Implement email sending using SendGrid or similar

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inquiry submitted successfully',
        id: createdRecord[0].id
      })
    };

  } catch (error) {
    console.error('Error processing inquiry:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing inquiry',
        error: error.message
      })
    };
  }
}; 