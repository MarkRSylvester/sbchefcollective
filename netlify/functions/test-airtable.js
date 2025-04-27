const Airtable = require('airtable');

exports.handler = async function(event, context) {
  console.log('Starting Airtable test');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Configure Airtable
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    
    console.log('Testing with config:', {
      baseId,
      hasToken: !!apiKey,
      tokenType: apiKey?.startsWith('pat') ? 'PAT' : 'Legacy'
    });

    // Initialize Airtable
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: apiKey,
      defaultHeaders: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const base = Airtable.base(baseId);

    // Try to list tables
    const tables = await base.tables();
    console.log('Available tables:', tables.map(t => t.name));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        tables: tables.map(t => t.name)
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