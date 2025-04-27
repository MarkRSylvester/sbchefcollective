const functions = require('firebase-functions');
const { base, TABLES } = require('../airtable-config');
const cors = require('cors')({ origin: true });

exports.getChefs = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    console.log('getChefs function called');
    
    try {
      const records = await base(TABLES.CHEFS)
        .select({
          view: "Grid view",
          maxRecords: 1000
        })
        .all();
      
      const chefs = records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          name: fields.Name || '',
          bio: fields.Bio || '',
          image: fields.Image || '',
          specialties: fields.Specialties || [],
          availability: fields.Availability || []
        };
      });
      
      response.json({ chefs });
      
    } catch (error) {
      console.error('Error in getChefs function:', error);
      response.status(500).json({ error: 'Failed to fetch chefs' });
    }
  });
}); 