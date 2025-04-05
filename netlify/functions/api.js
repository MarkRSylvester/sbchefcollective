const fetch = require('node-fetch');

// Use environment variable for API key
let AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
AIRTABLE_API_KEY = AIRTABLE_API_KEY.trim().replace(/^["']|["']$/g, '');

// Specify the exact Airtable base ID
const AIRTABLE_BASE_ID = 'appOWFyYIGbLoKalt';

// Define table names for each data type - matching the new separate tables
const TABLES = {
    getChefs: 'Chefs',
    getMenus: 'Menus',
    getDishes: 'Dishes',
    getImages: 'Images',
    getServices: 'Services',
    getFAQ: 'FAQ',
    getEventTypes: 'Event Types'
};

// Log configuration
console.log('Airtable configuration:');
console.log(`- Base ID: ${AIRTABLE_BASE_ID}`);
console.log(`- API Key (first/last 5 chars): ${AIRTABLE_API_KEY.substring(0, 5)}...${AIRTABLE_API_KEY.substring(AIRTABLE_API_KEY.length-5)}`);
console.log(`- Tables: ${JSON.stringify(TABLES)}`);

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
    
    const photoField = record.fields[fieldName];
    if (typeof photoField === 'string') {
        return photoField;
    }
    
    if (Array.isArray(photoField) && photoField.length > 0) {
        return photoField[0].url || '';
    }
    
    return '';
};

// Export the handler function
module.exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const params = event.httpMethod === 'GET'
            ? event.queryStringParameters || {}
            : JSON.parse(event.body || '{}');

        const { action } = params;

        if (!action || !TABLES[action]) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid or missing action parameter' })
            };
        }

        let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLES[action])}`;
        let filterFormula = '';

        // Add filters based on action
        switch (action) {
            case 'getDishes':
                if (!params.menuId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Menu ID is required for dishes' })
                    };
                }
                filterFormula = `{Menu ID}='${params.menuId}'`;
                break;
            case 'getImages':
                if (params.category) {
                    filterFormula = `{Category}='${params.category}'`;
                }
                break;
        }

        if (filterFormula) {
            url += `?filterByFormula=${encodeURIComponent(filterFormula)}`;
        }

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
        let processedRecords = [];

        if (data.records) {
            processedRecords = data.records.map(record => {
                switch (action) {
                    case 'getChefs':
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            bio: getField(record, 'Bio') || '',
                            photo: getPhotoUrl(record, 'Photo'),
                            specialties: getField(record, 'Specialties') || [],
                            availability: getField(record, 'Availability') || ''
                        };
                    case 'getMenus':
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            description: getField(record, 'Description') || '',
                            menuNumber: Number(getField(record, 'Menu Number')) || 9999,
                            type: getField(record, 'Type') || '',
                            photo: getPhotoUrl(record, 'Photo')
                        };
                    case 'getDishes':
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            description: getField(record, 'Description') || '',
                            category: getField(record, 'Category') || '',
                            menuId: getField(record, 'Menu ID') || ''
                        };
                    case 'getImages':
                        return {
                            id: record.id,
                            url: getPhotoUrl(record, 'Image'),
                            category: getField(record, 'Category') || '',
                            description: getField(record, 'Description') || ''
                        };
                    case 'getServices':
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            description: getField(record, 'Description') || '',
                            photo: getPhotoUrl(record, 'Photo'),
                            price: getField(record, 'Price') || ''
                        };
                    case 'getFAQ':
                        return {
                            id: record.id,
                            question: getField(record, 'Question') || '',
                            answer: getField(record, 'Answer') || '',
                            category: getField(record, 'Category') || ''
                        };
                    case 'getEventTypes':
                        return {
                            id: record.id,
                            name: getField(record, 'Name') || '',
                            description: getField(record, 'Description') || '',
                            photo: getPhotoUrl(record, 'Photo'),
                            minGuests: getField(record, 'Min Guests') || '',
                            maxGuests: getField(record, 'Max Guests') || ''
                        };
                    default:
                        return record;
                }
            });
        }

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
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
}; 