const Airtable = require('airtable');

exports.handler = async function(event, context) {
  console.log('Starting Airtable token test');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-airtable-token',
    'Content-Type': 'application/json'
  };

  try {
    // Get token from header
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

    // Initialize Airtable with the token
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: token
    });

    const base = Airtable.base(baseId);

    // Test access to the Images table
    const records = await base('Images')
      .select({
        maxRecords: 1,
        view: 'Grid view',
        fields: ['Image Name', 'Image URL', 'Category']
      })
      .firstPage();

    // Get table schema to verify field names
    const tables = await base.tables();
    const imagesTable = tables.find(t => t.name === 'Images');
    const fields = imagesTable ? imagesTable.fields : [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully connected to Airtable',
        tableInfo: {
          recordCount: records.length,
          sampleFields: records[0] ? Object.keys(records[0].fields) : [],
          availableFields: fields.map(f => f.name)
        },
        sampleRecord: records[0] ? {
          id: records[0].id,
          fields: records[0].fields
        } : null
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