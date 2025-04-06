const Airtable = require('airtable');
const DubsadoMock = require('./dubsado-mock');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Validate and log environment variables
  console.log('Environment check:', {
    hasApiKey: !!process.env.AIRTABLE_API_KEY,
    apiKeyLength: process.env.AIRTABLE_API_KEY?.length,
    hasBaseId: !!process.env.AIRTABLE_BASE_ID,
    baseIdLength: process.env.AIRTABLE_BASE_ID?.length
  });

  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error('Missing required environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server configuration error',
        details: 'Missing required environment variables'
      })
    };
  }

  try {
    // Initialize Airtable with logging
    console.log('Initializing Airtable connection...');
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const data = JSON.parse(event.body);
    console.log('Received data:', data);
    
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

    // Create Airtable record
    console.log('Creating Airtable record...');
    const airtableRecord = await base('Inquiries (Full)').create({
      'First Name': data.name.split(' ')[0],
      'Last Name': data.name.split(' ').slice(1).join(' '),
      'Email': data.email,
      'Phone': data.phone,
      'Event Type': data.eventType,
      'Event Date': data.eventDate,
      'Guest Count': parseInt(data.guestCount),
      'Event Address': data.eventAddress || '',
      'Budget per Person': parseFloat(data.budgetPerPerson),
      'Cuisine Preferences': data.cuisinePreferences,
      'Status': 'New Inquiry',
      'Created At': new Date().toISOString()
    });

    console.log('Airtable record created:', airtableRecord.id);

    // Create project in mock Dubsado
    const dubsadoResponse = await DubsadoMock.createProject(data);

    // Update Airtable record with Dubsado ID
    await base('Inquiries (Full)').update(airtableRecord.id, {
      'Dubsado Project ID': dubsadoResponse.projectId
    }).catch(error => {
      console.error('Error updating Airtable with Dubsado ID:', error);
      // Don't throw here, as the main record was created successfully
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inquiry submitted successfully',
        airtableId: airtableRecord.id,
        dubsadoProjectId: dubsadoResponse.projectId,
        data: airtableRecord.fields
      })
    };

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.message?.includes('AUTHENTICATION_REQUIRED')) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Airtable authentication failed',
          details: 'Invalid API key'
        })
      };
    }
    
    if (error.message?.includes('NOT_FOUND')) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Airtable configuration error',
          details: 'Base or table not found'
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 