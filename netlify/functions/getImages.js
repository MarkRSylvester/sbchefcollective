const { getBase, TABLES } = require('./airtable-config');
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  console.log('Starting getImages function');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Get local images from the assets directory
    const assetsDir = path.join(process.cwd(), 'public', 'assets', 'images');
    const localImages = fs.readdirSync(assetsDir)
      .filter(file => /\.(jpg|jpeg|png|gif|svg)$/i.test(file))
      .map(file => ({
        id: `local-${file}`,
        name: file,
        url: `/.netlify/images/${file}`,
        description: '',
        category: 'LOCAL',
        mood: '',
        colorPalette: ''
      }));

    console.log(`Found ${localImages.length} local images`);

    // Try to get Airtable images
    let airtableImages = [];
    try {
      const base = getBase();
      console.log('Fetching images from Airtable...');
      
      const records = await base(TABLES.IMAGES)
        .select({
          view: 'Grid view',
          filterByFormula: "AND(NOT({Image Name} = ''), NOT({Image Name} = BLANK()))"
        })
        .all();

      console.log(`Found ${records.length} images in Airtable`);

      airtableImages = records.map(record => ({
        id: record.id,
        name: record.get('Image Name'),
        url: `/assets/images/${record.get('Image Name')}`,
        description: record.get('Description') || '',
        category: record.get('Category') || 'UNCATEGORIZED',
        mood: record.get('Mood') || '',
        colorPalette: record.get('Color Palette') || ''
      }));
    } catch (airtableError) {
      console.error('Error fetching from Airtable:', airtableError);
      // Continue with local images only if Airtable fails
    }

    // Combine both sources
    const allImages = [...localImages, ...airtableImages];
    console.log(`Total images: ${allImages.length}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(allImages)
    };

  } catch (error) {
    console.error('Error in getImages:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 