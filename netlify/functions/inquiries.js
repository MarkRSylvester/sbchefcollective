const base = require('./airtable-config');
const DubsadoMock = require('./dubsado-mock');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Processing inquiry request...');
    const data = JSON.parse(event.body);
    console.log('Received data:', data);

    // Map form fields to expected fields
    const mappedData = {
      eventName: data.eventName || 'Consultation',
      eventDate: data.eventDate,
      eventTime: data.eventTime || '12:00',
      guestCount: data.guestCount,
      budgetPerPerson: data.budgetPerPerson || '0',
      eventType: data.eventType,
      cuisinePreferences: data.cuisinePreferences || 'None specified',
      name: data.name || data.clientName,
      email: data.email || data.clientEmail,
      phone: data.phone || data.clientPhone,
      eventAddress: data.eventAddress || `${data.address || ''}, ${data.city || ''}, ${data.zipCode || ''}`
    };
    
    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'phone',
      'eventName',
      'eventDate',
      'eventTime',
      'guestCount',
      'budgetPerPerson',
      'eventType',
      'cuisinePreferences'
    ];

    const missingFields = requiredFields.filter(field => !mappedData[field]);
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          fields: missingFields,
          receivedData: mappedData
        })
      };
    }

    // Initialize Airtable
    console.log('Initializing Airtable connection...');

    // Create Airtable record
    console.log('Creating Airtable record...');
    const record = await base('Inquiries (Full)').create({
      'First Name': mappedData.name.split(' ')[0],
      'Last Name': mappedData.name.split(' ').slice(1).join(' '),
      'Email': mappedData.email,
      'Phone': mappedData.phone,
      'Event Type': mappedData.eventType,
      'Event Date': mappedData.eventDate,
      'Guest Count': parseInt(mappedData.guestCount),
      'Event Address': mappedData.eventAddress || '',
      'Budget per Person': parseFloat(mappedData.budgetPerPerson),
      'Cuisine Preferences': mappedData.cuisinePreferences,
      'Status': 'New Inquiry',
      'Created At': new Date().toISOString()
    });

    console.log('Airtable record created:', record.id);

    // Create project in mock Dubsado
    const dubsadoResponse = await DubsadoMock.createProject(mappedData);

    // Update Airtable record with Dubsado ID
    await base('Inquiries (Full)').update(record.id, {
      'Dubsado Project ID': dubsadoResponse.projectId
    }).catch(error => {
      console.error('Error updating Airtable with Dubsado ID:', error);
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Inquiry submitted successfully',
        airtableId: record.id,
        dubsadoProjectId: dubsadoResponse.projectId,
        data: record.fields
      })
    };

  } catch (error) {
    console.error('Error processing inquiry:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      env: {
        hasApiKey: !!process.env.AIRTABLE_API_KEY,
        apiKeyLength: process.env.AIRTABLE_API_KEY?.length,
        hasBaseId: !!process.env.AIRTABLE_BASE_ID
      }
    });

    if (error.message?.includes('AUTHENTICATION_REQUIRED')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: 'Authentication failed',
          details: 'Invalid Airtable API key'
        })
      };
    }

    if (error.message?.includes('NOT_FOUND')) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Resource not found',
          details: 'Airtable base or table not found'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 