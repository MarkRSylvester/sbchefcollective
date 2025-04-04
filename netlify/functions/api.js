const fetch = require('node-fetch');

// Use environment variable for API key
const AIRTABLE_API_KEY = (process.env.AIRTABLE_API_KEY || '').trim();
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appOWFyYIGbLoKalt';

// Define table names for each data type - update to match exact Airtable tab names
const TABLES = {
    getChefs: 'Chefs',     // Tab name for chefs
    getMenus: 'Menus',     // Tab name for menus
    getDishes: 'Dishes'    // Tab name for dishes
};

// Default table is kept for backward compatibility
const DEFAULT_TABLE = 'SBCC MAIN';

// Validate required environment variables
if (!AIRTABLE_API_KEY) {
    console.error('Missing required AIRTABLE_API_KEY environment variable');
    throw new Error('Missing required AIRTABLE_API_KEY environment variable');
}

// Function to safely log URLs without exposing API keys
const safeLogUrl = (url) => {
    return url.replace(AIRTABLE_API_KEY, '[REDACTED]');
};

// Helper function to safely get field value
const getField = (record, fieldName) => {
    if (!record || !record.fields) {
        console.log('Invalid record:', record);
        return null;
    }
    return record.fields[fieldName] || null;
};

// Helper function to get photo URL from Airtable field
const getPhotoUrl = (record, fieldName) => {
    if (!record || !record.fields || !record.fields[fieldName]) {
        return '';
    }
    
    // If the field is a direct URL string
    const photoField = record.fields[fieldName];
    if (typeof photoField === 'string') {
        return photoField;
    }
    
    // Fallback for attachment type fields
    if (Array.isArray(photoField) && photoField.length > 0) {
        console.log('Attachment found:', photoField[0]);
        return photoField[0].url || '';
    }
    
    return '';
};

// Export the handler function
module.exports.handler = async (event) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    console.log('API Request:', {
        httpMethod: event.httpMethod,
        path: event.path,
        queryParams: event.queryStringParameters || {},
        body: event.body ? 'Present' : 'Not present'
    });

    try {
        // Parse parameters from either query string or body
        const params = event.httpMethod === 'GET'
            ? event.queryStringParameters || {}
            : JSON.parse(event.body || '{}');

        console.log('Request params:', params);

        const { action } = params;

        if (!action) {
            console.error('Missing action parameter');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Action parameter is required' })
            };
        }

        console.log('Processing action:', action);

        let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES[action] || DEFAULT_TABLE)}`;
        let filterFormula = '';

        // Add filters based on action
        switch (action) {
            case 'getChefs':
                // When using the dedicated Chefs table, no filter needed
                // Just ensure we have sufficient fields
                break;
            case 'getMenus':
                // When using the dedicated Menus table, no filter needed
                break;
            case 'getDishes':
                if (!params.menuId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Menu ID is required' })
                    };
                }
                
                // For dishes, filter by the menu ID
                filterFormula = `{Menu ID}='${params.menuId}'`;
                break;
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid action' })
                };
        }

        // Add filter to URL if present
        if (filterFormula) {
            url += `?filterByFormula=${encodeURIComponent(filterFormula)}`;
        }

        // Add debug logging for API key before making the request
        console.log('Fetching from Airtable:', url);
        console.log('Using API key:', AIRTABLE_API_KEY ? `${AIRTABLE_API_KEY.substring(0, 5)}...` : 'Missing');
        console.log('Filter formula:', filterFormula);

        // Ensure proper authentication header format
        const authHeader = `Bearer ${AIRTABLE_API_KEY}`;
        console.log('Auth header format (first 10 chars):', authHeader.substring(0, 10) + '...');

        const response = await fetch(url, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Airtable API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                url: safeLogUrl(url)
            });
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: `Airtable API error: ${response.status} ${response.statusText}`,
                    details: errorText
                })
            };
        }

        const data = await response.json();
        
        // Log the first record to see its structure
        if (data.records && data.records.length > 0) {
            console.log('First record structure:', JSON.stringify(data.records[0], null, 2));
            console.log('Available fields:', Object.keys(data.records[0].fields).join(', '));
        }
        
        // Process the records based on action
        let processedRecords = [];
        if (data.records) {
            // Debug: Log the first record's fields
            if (data.records.length > 0) {
                console.log('First record fields:', JSON.stringify(data.records[0].fields, null, 2));
            }
            
            processedRecords = data.records.map(record => {
                switch (action) {
                    case 'getChefs':
                        // Adjust field names to match the Chefs tab structure
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            bio: getField(record, 'Bio') || '',
                            photo: getPhotoUrl(record, 'Photo'),
                            vibe: getField(record, 'Vibe') || ''
                        };
                    case 'getMenus':
                        // Log all available fields for debugging
                        console.log('Menu record fields for:', record.id);
                        console.log('Available fields:', Object.keys(record.fields).join(', '));
                        
                        // Adjust field names to match the Menus tab structure
                        const menuOrderValue = getField(record, 'Order') || 
                                             getField(record, 'Menu Number') || 
                                             getField(record, 'Sort Order') || 
                                             '9999';
                        
                        // Convert to a number if possible
                        const menuNumberValue = Number(menuOrderValue);
                        const finalMenuNumber = isNaN(menuNumberValue) ? 9999 : menuNumberValue;
                        
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            description: getField(record, 'Description') || '',
                            menuNumber: finalMenuNumber,
                            photo: getPhotoUrl(record, 'Photo'),
                            type: getField(record, 'Type') || ''
                        };
                    case 'getDishes':
                        // Adjust field names to match the Dishes tab structure
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            description: getField(record, 'Description') || '',
                            category: getField(record, 'Category') || '',
                            menuId: getField(record, 'Menu ID') || ''
                        };
                    default:
                        return record;
                }
            });
        }

        // Add debug logging
        console.log(`${action} - First record fields:`, data.records?.[0]?.fields);
        console.log(`${action} - First processed record:`, processedRecords[0]);
        console.log(`${action} - Total records processed:`, processedRecords.length);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(processedRecords)
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 