const { getBase, TABLES } = require('./airtable-config');

// Map Airtable categories to frontend categories
const CATEGORY_MAP = {
  'Hero Image': 'HERO',
  'Background': 'BG',
  'Section Break': 'SECTION_BREAK',
  'Accent Image': 'ACCENT',
  'Menu': 'MENU',
  'Service': 'SERVICE'
};

// Default images for each category
const DEFAULT_IMAGES = {
  HERO: [{ url: '/assets/images/hero/default-hero.jpg', alt: 'Default Hero' }],
  BG: [{ url: '/assets/images/background/default-bg.jpg', alt: 'Default Background' }],
  SECTION_BREAK: [{ url: '/assets/images/section-break/default-break.jpg', alt: 'Default Section Break' }],
  ACCENT: [{ url: '/assets/images/accent/default-accent.jpg', alt: 'Default Accent' }],
  MENU: [{ url: '/assets/images/menu/default-menu.jpg', alt: 'Default Menu' }],
  SERVICE: [{ url: '/assets/images/service/default-service.jpg', alt: 'Default Service' }]
};

exports.handler = async function(event, context) {
  console.log('Starting getImages function');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Get Airtable base instance
    const base = await getBase();
    console.log('Using table:', TABLES.IMAGES);

    // Fetch all images
    const records = await base(TABLES.IMAGES)
      .select({
        view: 'Grid view',
        filterByFormula: "AND(NOT({Image Name} = ''), NOT({Image Name} = BLANK()))"
      })
      .all();

    console.log(`Found ${records.length} images`);

    // Transform records
    const images = records.map(record => ({
      id: record.id,
      name: record.get('Image Name'),
      description: record.get('Image Description'),
      category: record.get('Category') || [],
      mood: record.get('Mood'),
      colorPalette: record.get('Color Palette')
    }));

    // Group images by category
    const groupedImages = {};
    Object.values(CATEGORY_MAP).forEach(category => {
      groupedImages[category] = [];
    });

    images.forEach(image => {
      const categories = Array.isArray(image.category) ? image.category : [image.category];
      categories.forEach(cat => {
        const mappedCategory = CATEGORY_MAP[cat];
        if (mappedCategory && image.name) {
          groupedImages[mappedCategory].push({
            url: `/assets/images/${mappedCategory.toLowerCase()}/${image.name}`,
            alt: image.name,
            description: image.description,
            mood: image.mood,
            colorPalette: image.colorPalette
          });
        }
      });
    });

    // Add default images for empty categories
    Object.entries(groupedImages).forEach(([category, images]) => {
      if (images.length === 0 && DEFAULT_IMAGES[category]) {
        groupedImages[category] = DEFAULT_IMAGES[category];
      }
    });

    console.log('Successfully processed images:', groupedImages);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(groupedImages)
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