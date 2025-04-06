const Airtable = require('airtable');

// Get API key and Base ID from environment variables with detailed logging
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';

// Log full configuration for debugging (in development only)
if (process.env.NODE_ENV === 'development') {
    console.log('Airtable Configuration:', {
        hasApiKey: !!AIRTABLE_API_KEY,
        apiKeyLength: AIRTABLE_API_KEY.length,
        apiKeyStart: AIRTABLE_API_KEY.substring(0, 10),
        baseId: AIRTABLE_BASE_ID,
        environment: process.env.NODE_ENV,
        allEnvVars: process.env
    });
}

// Initialize Airtable base with explicit error handling
let base;
try {
    if (!AIRTABLE_API_KEY) {
        throw new Error('Airtable API key is missing');
    }
    if (!AIRTABLE_BASE_ID) {
        throw new Error('Airtable Base ID is missing');
    }
    
    base = new Airtable({ 
        apiKey: AIRTABLE_API_KEY,
        endpointUrl: 'https://api.airtable.com'
    }).base(AIRTABLE_BASE_ID);
    
    console.log('Airtable base initialized successfully');
} catch (error) {
    console.error('Failed to initialize Airtable:', error);
    throw error;
}

module.exports = { base }; 