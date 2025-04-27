const Airtable = require('airtable');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Log environment variables (redacting sensitive parts)
    const apiKeyLength = process.env.AIRTABLE_API_KEY ? process.env.AIRTABLE_API_KEY.length : 0;
    console.log('Environment check:', {
      AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
      AIRTABLE_API_KEY_LENGTH: apiKeyLength,
      NODE_ENV: process.env.NODE_ENV
    });

    // Configure Airtable with debug logging
    console.log('Configuring Airtable...');
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: process.env.AIRTABLE_API_KEY
    });

    // Create base instance
    console.log('Creating base instance with ID:', process.env.AIRTABLE_BASE_ID);
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

    // List all tables
    console.log('Attempting to list tables...');
    const tables = await base.tables();
    
    console.log('Successfully retrieved tables:', {
      count: tables.length,
      tables: tables.map(table => ({
        id: table.id,
        name: table.name,
        primaryFieldId: table.primaryFieldId
      }))
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        baseId: process.env.AIRTABLE_BASE_ID,
        tables: tables.map(table => ({
          id: table.id,
          name: table.name,
          primaryFieldId: table.primaryFieldId
        }))
      })
    };
  } catch (error) {
    console.error('Error in listTables:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack,
      details: error.error || error
    });

    // Special handling for common errors
    let userMessage = 'Failed to list tables';
    if (error.message.includes('NOT_FOUND')) {
      userMessage = 'Could not find the Airtable base. Please verify your base ID.';
    } else if (error.message.includes('AUTHENTICATION')) {
      userMessage = 'Authentication failed. Please check your API key.';
    }

    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({
        error: userMessage,
        details: {
          message: error.message,
          type: error.constructor.name
        }
      })
    };
  }
}; 