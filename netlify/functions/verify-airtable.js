const fetch = require('node-fetch');
const { base } = require('./airtable-config');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const results = {
      baseId: process.env.AIRTABLE_BASE_ID,
      apiKeyType: process.env.AIRTABLE_API_KEY?.startsWith('pat') ? 'PAT' : 'Legacy',
      tests: []
    };

    // Test 1: Verify API key by listing bases
    try {
      const response = await fetch('https://api.airtable.com/v0/meta/bases', {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      });
      const data = await response.json();
      results.tests.push({
        name: 'API Key Verification',
        success: response.ok,
        status: response.status,
        error: !response.ok ? data.error : null
      });
    } catch (error) {
      results.tests.push({
        name: 'API Key Verification',
        success: false,
        error: error.message
      });
    }

    // Test 2: Verify base access
    try {
      const response = await fetch(`https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}`, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
      });
      const data = await response.json();
      results.tests.push({
        name: 'Base Access',
        success: response.ok,
        status: response.status,
        error: !response.ok ? data.error : null,
        tables: response.ok ? data.tables?.map(t => ({ id: t.id, name: t.name })) : null
      });
    } catch (error) {
      results.tests.push({
        name: 'Base Access',
        success: false,
        error: error.message
      });
    }

    // Test 3: Try to access each table in TABLES config
    const { TABLES } = require('./airtable-config');
    for (const [key, tableId] of Object.entries(TABLES)) {
      try {
        const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
          }
        });
        const data = await response.json();
        results.tests.push({
          name: `Table Access: ${key}`,
          tableId: tableId,
          success: response.ok,
          status: response.status,
          error: !response.ok ? data.error : null
        });
      } catch (error) {
        results.tests.push({
          name: `Table Access: ${key}`,
          tableId: tableId,
          success: false,
          error: error.message
        });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results, null, 2)
    };
  } catch (error) {
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