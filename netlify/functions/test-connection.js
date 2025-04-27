const { getBase, TABLES } = require('./airtable-config');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Get Airtable base instance
    const base = await getBase();
    
    // Test access to each table
    const tableResults = {};
    for (const [key, tableName] of Object.entries(TABLES)) {
      try {
        const records = await base(tableName).select({ maxRecords: 1 }).firstPage();
        tableResults[tableName] = {
          success: true,
          recordCount: records.length
        };
      } catch (error) {
        tableResults[tableName] = {
          success: false,
          error: error.message
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        tables: tableResults
      })
    };

  } catch (error) {
    console.error('Error in test-connection:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        type: error.type || error.name,
        details: error.details || error.stack
      })
    };
  }
}; 