const Airtable = require('airtable');

// Get API key and Base ID from environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY?.trim().replace(/^["']|["']$/g, '') || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID?.trim() || '';

// Initialize Airtable base
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Log configuration for debugging (without exposing full API key)
console.log('Airtable Configuration:', {
    baseId: AIRTABLE_BASE_ID,
    apiKeyLength: AIRTABLE_API_KEY.length,
    apiKeyPrefix: AIRTABLE_API_KEY.substring(0, 10) + '...',
    environment: process.env.NODE_ENV
});

module.exports = {
    base,
    AIRTABLE_API_KEY,
    AIRTABLE_BASE_ID
}; 