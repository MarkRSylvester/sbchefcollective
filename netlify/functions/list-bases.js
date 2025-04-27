const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json'
  };

  try {
    console.log('Attempting to list all accessible bases');
    
    // Make request to list all bases
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API response not OK: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();

    // Extract relevant information about each base
    const bases = data.bases.map(base => ({
      id: base.id,
      name: base.name,
      permissionLevel: base.permissionLevel
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        bases,
        currentBaseId: process.env.AIRTABLE_BASE_ID,
        apiKeyPrefix: process.env.AIRTABLE_API_KEY?.substring(0, 4)
      })
    };

  } catch (error) {
    console.error('Error listing bases:', error);
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