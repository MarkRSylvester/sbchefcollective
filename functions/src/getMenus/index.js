const functions = require('firebase-functions');
const { base, TABLES } = require('../airtable-config');
const cors = require('cors')({ origin: true });

exports.getMenus = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    console.log('getMenus function called');
    
    try {
      const records = await base(TABLES.MENUS)
        .select({
          view: "Grid view",
          maxRecords: 1000
        })
        .all();
      
      const menus = records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          name: fields.Name || '',
          description: fields.Description || '',
          price: fields.Price || '',
          category: fields.Category || '',
          items: fields.Items || [],
          image: fields.Image || ''
        };
      });
      
      response.json({ menus });
      
    } catch (error) {
      console.error('Error in getMenus function:', error);
      response.status(500).json({ error: 'Failed to fetch menus' });
    }
  });
}); 