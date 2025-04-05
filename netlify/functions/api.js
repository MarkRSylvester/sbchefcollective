const fetch = require('node-fetch');

// Use environment variable for API key
let AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
AIRTABLE_API_KEY = AIRTABLE_API_KEY.trim().replace(/^["']|["']$/g, '');

// Specify the exact Airtable base ID
const AIRTABLE_BASE_ID = 'appOWFyYIGbLoKalt';

// Define table names for each data type
const TABLES = {
    getChefs: 'Chefs',
    getMenus: 'Menus',
    getDishes: 'Dishes'
};

// Log configuration for debugging
console.log('API Function Configuration:');
console.log('- Base ID:', AIRTABLE_BASE_ID);
console.log('- API Key Length:', AIRTABLE_API_KEY.length);
console.log('- Tables:', Object.keys(TABLES).join(', '));

// Helper function to safely get field value
const getField = (record, fieldName) => {
    if (!record || !record.fields) {
        console.log('Invalid record structure:', record);
        return null;
    }
    return record.fields[fieldName];
};

// Helper function to get photo URL
const getPhotoUrl = (record, fieldName) => {
    const field = getField(record, fieldName);
    if (!field) return null;
    
    if (typeof field === 'string') return field;
    if (Array.isArray(field) && field[0] && field[0].url) return field[0].url;
    
    console.log('Unexpected photo field structure:', field);
    return null;
};

// Export the handler function
exports.handler = async (event) => {
    console.log('Received request:', {
        method: event.httpMethod,
        path: event.path,
        params: event.queryStringParameters
    });

    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const params = event.queryStringParameters || {};
        const { action } = params;

        if (!action || !TABLES[action]) {
            console.error('Invalid action:', action);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid or missing action parameter' })
            };
        }

        // Build Airtable API URL
        let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES[action])}`;
        
        // Add filters if needed
        if (action === 'getDishes' && params.menuId) {
            url += `?filterByFormula=${encodeURIComponent(`{Menu ID}='${params.menuId}'`)}`;
        }

        console.log('Fetching from Airtable:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Airtable API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
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
        
        if (!data.records) {
            console.error('No records found in response:', data);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'No records found' })
            };
        }

        const processedRecords = data.records.map(record => {
            switch (action) {
                case 'getChefs':
                    return {
                        id: record.id,
                        name: getField(record, 'Chef Name') || '',
                        bio: getField(record, 'Chef Description') || '',
                        photo: getPhotoUrl(record, 'Chef Photo'),
                        specialties: getField(record, 'Specialties') || [],
                        availability: getField(record, 'Availability') || ''
                    };
                case 'getMenus':
                    return {
                        id: record.id,
                        name: getField(record, 'Menu Name') || '',
                        description: getField(record, 'Menu Description') || '',
                        menuNumber: parseInt(getField(record, 'Menu Number')) || 9999,
                        type: getField(record, 'Menu Type') || '',
                        photo: getPhotoUrl(record, 'Stock Images')
                    };
                case 'getDishes':
                    return {
                        id: record.id,
                        name: getField(record, 'Dish Name') || '',
                        description: getField(record, 'Dish Description') || '',
                        category: getField(record, 'Category') || '',
                        menuId: getField(record, 'Menu ID') || ''
                    };
                default:
                    return record;
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(processedRecords)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message,
                stack: error.stack
            })
        };
    }
}; 