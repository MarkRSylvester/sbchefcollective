const { base } = require('./airtable-config');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET'
  };

  try {
    // Test 1: Try to access the Images table
    console.log('Test 1: Testing Images table access');
    const records = await base('Images').select({
      maxRecords: 1,
      view: 'Grid view'
    }).firstPage();

    // Test 2: Get field names from the first record
    const fields = records[0]?.fields ? Object.keys(records[0].fields) : [];
    console.log('Test 2: Available fields:', fields);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        hasRecords: records.length > 0,
        availableFields: fields,
        firstRecord: records[0]?.fields || null
      })
    };
  } catch (error) {
    console.error('Diagnostic error:', {
      message: error.message,
      type: error.constructor.name,
      details: error.error || error
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        type: error.constructor.name,
        details: error.error || error
      })
    };
  }
}; 