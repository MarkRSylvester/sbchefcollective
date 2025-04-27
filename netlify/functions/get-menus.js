const Airtable = require('airtable');
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check for required environment variables
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('Required environment variables are not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    // Initialize Airtable
    const base = new Airtable({ accessToken: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    // Fetch records from the Menus table
    const records = await base('Menus')
      .select({
        maxRecords: 10,
        sort: [{ field: 'Name', direction: 'asc' }],
        fields: ['Name', 'Cuisine', 'Description', 'Items']
      })
      .all();

    // Transform records into the desired format
    const menus = records.map(record => ({
      id: record.id,
      name: record.get('Name'),
      cuisine: record.get('Cuisine'),
      description: record.get('Description'),
      items: record.get('Items')
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(menus)
    };

  } catch (error) {
    console.error('Error fetching menus:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || 'Failed to fetch menus' })
    };
  }
}; 