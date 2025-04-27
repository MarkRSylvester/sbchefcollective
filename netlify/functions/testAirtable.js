const { base, TABLES } = require('./airtable-config');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  const results = {
    tests: [],
    errors: []
  };

  try {
    // Test 1: Basic connection
    console.log('Test 1: Testing basic Airtable connection');
    try {
      const baseInfo = await base.makeRequest({
        method: 'GET',
        path: '/',
        qs: {}
      });
      results.tests.push({
        name: 'Basic Connection',
        success: true,
        details: baseInfo
      });
    } catch (error) {
      results.errors.push({
        test: 'Basic Connection',
        error: error.message,
        details: error.error || error
      });
    }

    // Test 2: List all tables
    console.log('Test 2: Listing all tables');
    try {
      const tables = await base.makeRequest({
        method: 'GET',
        path: '/meta/bases/' + process.env.AIRTABLE_BASE_ID + '/tables',
        qs: {}
      });
      results.tests.push({
        name: 'List Tables',
        success: true,
        tables: tables
      });
    } catch (error) {
      results.errors.push({
        test: 'List Tables',
        error: error.message,
        details: error.error || error
      });
    }

    // Test 3: Try to access Images table
    console.log('Test 3: Testing Images table specifically');
    try {
      const images = await base(TABLES.IMAGES).select({
        maxRecords: 1
      }).firstPage();
      results.tests.push({
        name: 'Images Table Access',
        success: true,
        recordCount: images.length
      });
    } catch (error) {
      results.errors.push({
        test: 'Images Table Access',
        error: error.message,
        details: error.error || error
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: results.errors.length === 0,
        results: results,
        environment: {
          baseId: process.env.AIRTABLE_BASE_ID,
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          configuredTables: TABLES
        }
      }, null, 2)
    };
  } catch (error) {
    console.error('Error in testAirtable function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to run Airtable tests',
        details: error.message,
        type: error.constructor.name
      })
    };
  }
}; 