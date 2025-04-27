const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json'
  };

  try {
    console.log('Attempting to list tables with config:', {
      baseId: process.env.AIRTABLE_BASE_ID,
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      apiKeyType: process.env.AIRTABLE_API_KEY?.startsWith('pat') ? 'PAT' : 'Legacy'
    });

    // First, get the schema of all tables using the REST API
    const schemaResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      }
    );

    if (!schemaResponse.ok) {
      throw new Error(`Failed to fetch schema: ${schemaResponse.statusText}`);
    }

    const schema = await schemaResponse.json();
    console.log('Found tables:', schema.tables.map(t => t.name));

    // Map of results for each table
    const results = {};

    // Process each table from the schema
    for (const table of schema.tables) {
      results[table.name] = {
        success: true,
        id: table.id,
        fields: table.fields.map(f => f.name),
        primaryFieldId: table.primaryFieldId
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results,
        config: {
          baseId: process.env.AIRTABLE_BASE_ID,
          apiKeyType: process.env.AIRTABLE_API_KEY?.startsWith('pat') ? 'PAT' : 'Legacy'
        }
      })
    };

  } catch (error) {
    console.error('Error in list-tables function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        errorType: error.constructor.name,
        details: error.response?.data || error.error || error
      })
    };
  }
}; 