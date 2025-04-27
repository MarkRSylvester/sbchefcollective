const Airtable = require('airtable');

// Table names in Airtable
const TABLES = {
  IMAGES: 'Images',
  // Add other tables as needed
};

// Initialize Airtable base
function getBase() {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error('Missing required Airtable environment variables');
  }

  return new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID);
}

module.exports = {
  getBase,
  TABLES
}; 