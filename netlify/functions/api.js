const { initAirtable } = require('./airtable-config');

// Helper function to safely get field value
const getField = (record, fieldName) => {
  if (!record?.fields) {
    console.log('Invalid record:', record);
    return null;
  }
  return record.fields[fieldName] || null;
};

// Helper function to get photo URL from Airtable attachment
const getPhotoUrl = (record, fieldName) => {
  if (!record?.fields?.[fieldName]) return '';
  const attachments = record.fields[fieldName];
  return Array.isArray(attachments) && attachments[0]?.url ? attachments[0].url : '';
};

// Helper function to simulate Dubsado sync
const simulateDubsadoSync = async (base, inquiryData) => {
  try {
    await base('Dubsado Sync Log').create({
      fields: {
        'Inquiry ID': inquiryData.id,
        'Timestamp': new Date().toISOString(),
        'Operation': 'Create Inquiry',
        'Payload Summary': JSON.stringify(inquiryData),
        'Sync Status': 'Simulated'
      }
    });
    return { projectId: `MOCK-${Date.now()}` };
  } catch (error) {
    console.error('Dubsado sync simulation error:', error);
    return { projectId: null };
  }
};

// Main handler function
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Initializing Airtable connection...');
    const base = initAirtable();
    const params = event.httpMethod === 'GET'
      ? event.queryStringParameters || {}
      : JSON.parse(event.body || '{}');

    console.log('Received data:', params);
    const { action } = params;

    if (!action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Action parameter is required' })
      };
    }

    // Handle form submissions
    if (action === 'submitInquiry') {
      if (event.httpMethod !== 'POST') {
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
      }

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

      const missingFields = requiredFields.filter(field => !params[field]);
      if (missingFields.length > 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Missing required fields',
            fields: missingFields
          })
        };
      }

      console.log('Creating Airtable record...');
      // Create inquiry record
      const record = await base('Inquiries (Full)').create({
        'Event Name': params.eventName,
        'Event Date': params.eventDate,
        'Event Time': params.eventTime,
        'Guest Count': parseInt(params.guestCount),
        'Budget per Person': parseFloat(params.budgetPerPerson),
        'Event Type': params.eventType,
        'Cuisine Preferences': params.cuisinePreferences,
        'First Name': params.name.split(' ')[0],
        'Last Name': params.name.split(' ').slice(1).join(' '),
        'Email': params.email,
        'Phone': params.phone,
        'Status': 'New Inquiry',
        'Created At': new Date().toISOString()
      });

      // Simulate Dubsado sync
      const dubsadoResponse = await simulateDubsadoSync(base, record);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          inquiry: record,
          dubsadoProjectId: dubsadoResponse.projectId
        })
      };
    }

    // Handle GET requests for data
    let table, filterFormula;
    switch (action) {
      case 'getChefs':
        table = 'Chefs';
        filterFormula = 'AND(NOT({Name} = ""), {Active} = TRUE())';
        break;
      case 'getMenus':
        table = 'Menus';
        filterFormula = 'AND(NOT({Name} = ""), {Active} = TRUE())';
        break;
      case 'getDishes':
        if (!params.menuId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Menu ID is required' })
          };
        }
        table = 'Dishes';
        filterFormula = `AND(NOT({Name} = ""), {Menu ID} = "${params.menuId}")`;
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

    const records = await base(table).select({
      filterByFormula: filterFormula
    }).all();

    let formattedData;
    switch (action) {
      case 'getChefs':
        formattedData = records.map(record => ({
          id: record.id,
          name: getField(record, 'Name'),
          photo: getPhotoUrl(record, 'Photo'),
          bio: getField(record, 'Bio'),
          specialties: getField(record, 'Specialties'),
          active: getField(record, 'Active')
        }));
        break;
      case 'getMenus':
        formattedData = records.map(record => ({
          id: record.id,
          name: getField(record, 'Name'),
          description: getField(record, 'Description'),
          photo: getPhotoUrl(record, 'Photo'),
          priceRange: getField(record, 'Price Range'),
          type: getField(record, 'Type')
        }));
        break;
      case 'getDishes':
        formattedData = records.map(record => ({
          id: record.id,
          name: getField(record, 'Name'),
          description: getField(record, 'Description'),
          category: getField(record, 'Category'),
          price: getField(record, 'Price'),
          menuId: getField(record, 'Menu ID'),
          photo: getPhotoUrl(record, 'Photo')
        }));
        break;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedData)
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