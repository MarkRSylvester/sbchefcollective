const fetch = require('node-fetch');

// Use environment variable for API key
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appOWFyYIGbLoKalt';
const TABLE_NAME = 'SBCC MAIN';

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

        let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
        let filterFormula = '';

        // Add filters based on action
        switch (action) {
            case 'getChefs':
                filterFormula = "NOT({Chef Name}='')";
                break;
            case 'getMenus':
                filterFormula = "NOT({Menu Name}='')";
                break;
            case 'getDishes':
                if (!params.menuId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Menu ID is required' })
                    };
                }
                // Get the menu record to find its Menu ID
                const menuResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${params.menuId}`, {
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!menuResponse.ok) {
                    return {
                        statusCode: menuResponse.status,
                        headers,
                        body: JSON.stringify({ error: 'Failed to fetch menu' })
                    };
                }
                
                const menuData = await menuResponse.json();
                const menuNumber = getField(menuData, 'Menu Number');
                
                if (!menuNumber) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Menu Number not found' })
                    };
                }
                
                filterFormula = `AND(NOT({Dish Name}=''),{Menu ID}='${menuNumber}')`;
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

        console.log('Fetching from Airtable:', url);
        console.log('Using API key:', AIRTABLE_API_KEY ? 'Present' : 'Missing');
        console.log('Filter formula:', filterFormula);

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
                        const chefId = getField(record, 'Chef ID');
                        return {
                            id: Array.isArray(chefId) ? chefId[0] : chefId,
                            name: getField(record, 'Chef Name'),
                            bio: getField(record, 'Chef Description'),
                            photo: getPhotoUrl(record, 'Chef Photo'),
                            vibe: getField(record, 'Vibe')
                        };
                    case 'getMenus':
                        // Log field names to help debug
                        console.log('Menu record fields:', record.fields);
                        const menuNumber = getField(record, 'Menu Number');
                        const menuName = getField(record, 'Menu Name');
                        const menuDesc = getField(record, 'Menu Description');
                        
                        console.log(`Processing menu: ${menuName}, Number: ${menuNumber}, Description: ${menuDesc}`);
                        
                        return {
                            id: record.id,
                            fields: {
                                name: menuName,
                                description: menuDesc,
                                menuNumber: menuNumber
                            },
                            // Also include direct properties for flexibility
                            name: menuName,
                            description: menuDesc,
                            menuNumber: menuNumber,
                            photo: getPhotoUrl(record, 'Menu Photo'),
                            type: getField(record, 'Menu Type')
                        };
                    case 'getDishes':
                        return {
                            id: record.id,
                            fields: {
                                name: getField(record, 'Dish Name'),
                                description: getField(record, 'Dish Description'),
                                category: getField(record, 'Category'),
                                menuId: getField(record, 'Menu ID')
                            },
                            name: getField(record, 'Dish Name'),
                            description: getField(record, 'Dish Description'),
                            category: getField(record, 'Category'),
                            menuId: getField(record, 'Menu ID')
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