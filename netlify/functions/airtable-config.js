const Airtable = require('airtable');

// Get API key and Base ID from environment variables with detailed logging
const initAirtable = () => {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY?.trim();
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID?.trim();

  if (!AIRTABLE_API_KEY) {
    console.error('Missing or invalid AIRTABLE_API_KEY:', {
      keyExists: !!process.env.AIRTABLE_API_KEY,
      keyLength: process.env.AIRTABLE_API_KEY?.length
    });
    throw new Error('Missing AIRTABLE_API_KEY environment variable');
  }

  if (!AIRTABLE_BASE_ID) {
    console.error('Missing or invalid AIRTABLE_BASE_ID:', {
      baseIdExists: !!process.env.AIRTABLE_BASE_ID,
      baseIdLength: process.env.AIRTABLE_BASE_ID?.length
    });
    throw new Error('Missing AIRTABLE_BASE_ID environment variable');
  }

  console.log('Initializing Airtable with:', {
    baseId: AIRTABLE_BASE_ID,
    keyLength: AIRTABLE_API_KEY.length,
    keyPrefix: AIRTABLE_API_KEY.substring(0, 10)
  });

  // Initialize Airtable with the PAT
  const base = new Airtable({ 
    apiKey: AIRTABLE_API_KEY
  }).base(AIRTABLE_BASE_ID);

  return base;
};

module.exports = { initAirtable }; 