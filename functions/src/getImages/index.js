const functions = require('firebase-functions');
const { base, TABLES } = require('../airtable-config');

// CORS headers
const cors = require('cors')({ origin: true });

exports.getImages = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    console.log('getImages function called');
    
    try {
      console.log('Attempting to fetch records from Images table');
      console.log('Using table ID:', TABLES.IMAGES);
      console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
      
      // Query configuration
      const queryConfig = {
        filterByFormula: "AND(NOT({Name} = \"\"), NOT({Name} = BLANK()))",
        view: "Grid view",
        maxRecords: 1000
      };
      
      console.log('Query configuration:', JSON.stringify(queryConfig, null, 2));
      
      // Fetch records from the table
      const records = await base(TABLES.IMAGES)
        .select(queryConfig)
        .all();
      
      console.log(`Found ${records.length} records`);
      
      // Process records
      const images = {
        HERO: [],
        BACKGROUND: [],
        SECTION_BREAK: [],
        ACCENT: []
      };
      
      records.forEach(record => {
        const fields = record.fields;
        const name = fields.Name || '';
        const url = fields.URL || '';
        const category = fields.Category || '';
        
        if (name && url && categoryMap[category]) {
          images[categoryMap[category]].push({
            url: url,
            alt: name
          });
        }
      });
      
      // Merge with default images for any missing categories
      Object.keys(images).forEach(category => {
        if (images[category].length === 0) {
          images[category] = defaultImages[category];
        }
      });
      
      console.log('Returning images:', JSON.stringify(images, null, 2));
      
      response.json({ images });
      
    } catch (error) {
      console.error('Error in getImages function:', {
        message: error.message,
        type: error.constructor.name,
        details: error.error || error,
        tableId: TABLES.IMAGES,
        baseId: process.env.AIRTABLE_BASE_ID
      });
      
      // Return default images on error
      response.json({ images: defaultImages });
    }
  });
}); 