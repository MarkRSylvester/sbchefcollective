const airtableBase = require('./airtable-config');

exports.handler = async function(event, context) {
  try {
    // Enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Get records from the Chefs table
    const records = await airtableBase('Chefs').select({
      view: 'Grid view',
      filterByFormula: '{Active} = TRUE()'
    }).all();

    // Transform the records into a cleaner format
    const chefs = records.map(record => ({
      id: record.id,
      name: record.get('Chef Name') || '',
      specialties: record.get('Vibe') || '',
      bio: record.get('Chef Description') || '',
      image: record.get('Chef Photo') ? record.get('Chef Photo')[0].url : null,
      active: true,
      cuisineTypes: [],
      eventTypes: [],
      tagline: ''
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(chefs)
    };

  } catch (error) {
    console.error('Error fetching chefs:', error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message || 'Failed to fetch chefs data',
        details: error.error || error.name
      })
    };
  }
}; 