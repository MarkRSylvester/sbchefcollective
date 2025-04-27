const Airtable = require('airtable');
const airtableBase = require('./airtable-config');

// Helper function to get photo URL from Airtable attachment
const getPhotoUrl = (record, fieldName) => {
  const photo = record.get(fieldName);
  return photo && Array.isArray(photo) && photo[0]?.url ? photo[0].url : null;
};

// Helper function to simulate Dubsado sync
const simulateDubsadoSync = async (base, inquiryData) => {
  try {
    await airtableBase('Dubsado Sync Log').create({
      'Inquiry ID': inquiryData.id,
      'Timestamp': new Date().toISOString(),
      'Operation': 'Create Inquiry',
      'Payload Summary': JSON.stringify(inquiryData),
      'Sync Status': 'Simulated'
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
      const record = await airtableBase('Inquiries (Full)').create({
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
      const dubsadoResponse = await simulateDubsadoSync(airtableBase, record);

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
        filterFormula = '{Active} = TRUE()';
        break;
      case 'getMenus':
        table = 'Menus';
        filterFormula = '{Active} = TRUE()';
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
        filterFormula = `{Menu ID} = "${params.menuId}"`;
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

    const records = await airtableBase(table).select({
      view: 'Grid view',
      filterByFormula: filterFormula
    }).all();

    let formattedData;
    switch (action) {
      case 'getChefs':
        formattedData = records.map(record => ({
          id: record.id,
          name: record.get('Name') || '',
          photo: getPhotoUrl(record, 'Photo'),
          bio: record.get('Bio') || '',
          specialties: record.get('Specialties') || '',
          active: record.get('Active') || false,
          cuisineTypes: record.get('Cuisine Types') || [],
          eventTypes: record.get('Event Types') || [],
          tagline: record.get('Tagline') || ''
        }));
        break;
      case 'getMenus':
        formattedData = records.map(record => ({
          id: record.id,
          name: record.get('Name') || '',
          description: record.get('Description') || '',
          photo: getPhotoUrl(record, 'Photo'),
          priceRange: record.get('Price Range') || '',
          type: record.get('Type') || ''
        }));
        break;
      case 'getDishes':
        formattedData = records.map(record => ({
          id: record.id,
          name: record.get('Name') || '',
          description: record.get('Description') || '',
          category: record.get('Category') || '',
          price: record.get('Price') || '',
          menuId: record.get('Menu ID') || '',
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
    console.error('Error details:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Internal server error'
      })
    };
  }
}; 