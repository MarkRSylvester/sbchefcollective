const Airtable = require('airtable');
const DubsadoMock = require('./dubsado-mock');

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const TABLE_NAME = 'Inquiries (Full)';

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Validate environment variables
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

    // Create Airtable record
    const airtableRecord = await base(TABLE_NAME).create({
      'Record ID': `REC${Date.now()}`,
      'Inquiry Type': data.eventType,
      'First Name': data.name.split(' ')[0],
      'Last Name': data.name.split(' ').slice(1).join(' '),
      'Email': data.email,
      'Phone': data.phone,
      'Event Type': data.eventType,
      'Event Date': data.eventDate,
      'Guest Count': parseInt(data.guestCount),
      'Event Address': data.eventAddress || '',
      'Budget per Person': data.budgetPerPerson,
      'Cuisine Preferences': data.cuisinePreferences,
      'Status': 'New Inquiry',
      'Created At': new Date().toISOString()
    }).catch(error => {
      console.error('Airtable error:', error);
      throw new Error(`Airtable error: ${error.message}`);
    });

    // Create project in mock Dubsado
    const dubsadoResponse = await DubsadoMock.createProject(data);

    // Update Airtable record with Dubsado ID
    await base(TABLE_NAME).update(airtableRecord.id, {
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
    console.error('Error processing inquiry:', error);
    
    // Handle specific error types
    if (error.message.includes('AUTHENTICATION_REQUIRED')) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Airtable authentication failed',
          details: 'Invalid API key'
        })
      };
    }
    
    if (error.message.includes('NOT_FOUND')) {
      return {
        statusCode: 500,
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