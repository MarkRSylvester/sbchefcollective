const Airtable = require('airtable');

exports.handler = async function(event, context) {
  console.log('Starting Airtable connection test');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Configure Airtable with the token from the request
    const token = event.headers['x-airtable-token'];
    const baseId = process.env.AIRTABLE_BASE_ID;
    
    if (!token) {
      throw new Error('No token provided in x-airtable-token header');
    }

    console.log('Testing with config:', {
      baseId,
      hasToken: !!token,
      tokenType: token?.startsWith('pat') ? 'PAT' : 'Legacy'
    });

    // Initialize Airtable
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: token,
      defaultHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const base = Airtable.base(baseId);

    // Try to list tables
    const records = await base('Images')
      .select({
        maxRecords: 1,
        view: 'Grid view'
      })
      .firstPage();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully connected to Airtable',
        recordCount: records.length,
        sampleFields: records[0] ? Object.keys(records[0].fields) : []
      })
    };

  } catch (error) {
    console.error('Airtable test failed:', error);
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({
        error: 'Airtable test failed',
        message: error.message,
        details: error.details || null,
        technical: {
          type: error.type || error.name,
          baseId: process.env.AIRTABLE_BASE_ID
        }
      })
    };
  }
}; 