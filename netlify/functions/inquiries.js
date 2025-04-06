const DubsadoMock = require('./dubsado-mock');

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

    // Mock Airtable record creation
    const mockAirtableRecord = {
      id: 'rec' + Math.random().toString(36).substr(2, 9),
      fields: {
        'Event Name': data.eventName,
        'Event Date': data.eventDate,
        'Event Time': data.eventTime,
        'Guest Count': parseInt(data.guestCount),
        'Budget per Person': data.budgetPerPerson,
        'Event Type': data.eventType,
        'Cuisine Preferences': data.cuisinePreferences,
        'Contact Name': data.name,
        'Email': data.email,
        'Phone': data.phone,
        'Status': 'New Inquiry',
        'Created At': new Date().toISOString()
      }
    };

    // Create project in mock Dubsado
    const dubsadoResponse = await DubsadoMock.createProject(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inquiry submitted successfully',
        airtableId: mockAirtableRecord.id,
        dubsadoProjectId: dubsadoResponse.projectId,
        data: mockAirtableRecord.fields
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