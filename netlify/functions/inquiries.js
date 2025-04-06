const { base } = require('./airtable-config');
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
    const record = await base('Inquiries (Full)').create({
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

    console.log('Airtable record created:', record.id);

    // Create project in mock Dubsado
    const dubsadoResponse = await DubsadoMock.createProject(data);

    // Update Airtable record with Dubsado ID
    await base('Inquiries (Full)').update(record.id, {
      'Dubsado Project ID': dubsadoResponse.projectId
    }).catch(error => {
      console.error('Error updating Airtable with Dubsado ID:', error);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inquiry submitted successfully',
        airtableId: record.id,
        dubsadoProjectId: dubsadoResponse.projectId,
        data: record.fields
      })
    };

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.message?.includes('AUTHENTICATION_REQUIRED')) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Authentication failed',
          details: 'Invalid Airtable API key'
        })
      };
    }

    if (error.message?.includes('NOT_FOUND')) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Resource not found',
          details: 'Airtable base or table not found'
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