const airtableBase = require('./airtable-config');

exports.handler = async function(event, context) {
  try {
    // Enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Get records from the Menus table
    const records = await airtableBase('Menus').select({
      view: 'Grid view',
      filterByFormula: '{Active}=1' // Only get active menus
    }).all();

    // Transform the records into a cleaner format
    const menus = records.map(record => ({
      id: record.id,
      name: record.get('Name') || '',
      description: record.get('Description') || '',
      priceRange: record.get('Price Range') || '',
      cuisineType: record.get('Cuisine Type') || '',
      eventType: record.get('Event Type') || '',
      dietaryOptions: record.get('Dietary Options') || [],
      image: record.get('Image') ? record.get('Image')[0].url : null,
      active: record.get('Active') || false
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(menus)
    };

  } catch (error) {
    console.error('Error fetching menus:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch menus data' })
    };
  }
}; 