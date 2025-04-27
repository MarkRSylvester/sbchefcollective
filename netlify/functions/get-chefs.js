const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
const Airtable = require('airtable');

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
    console.error('Required environment variables are missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    // Initialize Airtable
    const base = new Airtable({ accessToken: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    // Fetch records from the Chefs table
    const records = await base('Chefs')
      .select({
        maxRecords: 10,
        sort: [{ field: 'Name', direction: 'asc' }],
        fields: ['Name', 'Specialty', 'Bio']
      })
      .all();

    // Transform records to the desired format
    const chefs = records.map(record => ({
      id: record.id,
      name: record.get('Name'),
      specialty: record.get('Specialty'),
      bio: record.get('Bio')
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chefs)
    };
  } catch (error) {
    console.error('Error fetching chefs:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || 'Failed to fetch chefs' })
    };
  }
}; 