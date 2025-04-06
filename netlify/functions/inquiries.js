const Airtable = require('airtable');
const DubsadoMock = require('./dubsado-mock');

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const INQUIRIES_TABLE = 'Inquiries';

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = [
      'eventName',
      'eventDate',
      'eventTime',
      'guestCount',
      'budgetPerPerson',
      'eventType',
      'cuisinePreferences',
      'name',
      'email',
      'phone'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields',
          fields: missingFields
        })
      };
    }

    // Create record in Airtable
    const airtableRecord = await base(INQUIRIES_TABLE).create({
      'Event Name': data.eventName,
      'Event Date': data.eventDate,
      'Event Time': data.eventTime,
      'Guest Count': parseInt(data.guestCount),
      'Budget per Person': data.budgetPerPerson,
      'Event Type': data.eventType,
      'Cuisine Preferences': data.cuisinePreferences,
      'Dietary Needs': data.dietaryNeeds || '',
      'Dietary Notes': data.dietaryNotes || '',
      'Contact Name': data.name,
      'Email': data.email,
      'Phone': data.phone,
      'Address': data.address || '',
      'City': data.city || '',
      'Special Requests': data.specialRequests || '',
      'Event Vibe': data.eventVibe || '',
      'Vibe Description': data.vibeDescription || '',
      'Status': 'New Inquiry',
      'Created At': new Date().toISOString()
    });

    // Create project in mock Dubsado
    const dubsadoResponse = await DubsadoMock.createProject(data);

    // Update Airtable record with Dubsado project ID
    await base(INQUIRIES_TABLE).update(airtableRecord.id, {
      'Dubsado Project ID': dubsadoResponse.projectId
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inquiry submitted successfully',
        airtableId: airtableRecord.id,
        dubsadoProjectId: dubsadoResponse.projectId
      })
    };

  } catch (error) {
    console.error('Error processing inquiry:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 