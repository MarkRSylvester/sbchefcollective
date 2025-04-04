const fetch = require('node-fetch');

// Use environment variable for API key
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'appOWFyYIGbLoKalt';
const TABLE_NAME = 'SBCC MAIN';

// Helper function to safely get field value
const getField = (record, fieldName) => {
    if (!record || !record.fields) {
        console.log('Invalid record:', record);
        return null;
    }
    return record.fields[fieldName] || null;
};

// Helper function to get photo URL from Airtable attachment
const getPhotoUrl = (record, fieldName) => {
    if (!record || !record.fields || !record.fields[fieldName]) {
        return '';
    }
    
    const attachments = record.fields[fieldName];
    if (Array.isArray(attachments) && attachments.length > 0) {
        // Log the attachment structure
        console.log('Attachment found:', attachments[0]);
        return attachments[0].url || '';
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

    try {
        // Parse parameters from either query string or body
        const params = event.httpMethod === 'GET'
            ? event.queryStringParameters || {}
            : JSON.parse(event.body || '{}');

        console.log('Request params:', params);

        const { action } = params;

        if (!action) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Action parameter is required' })
            };
        }

        let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
        let filterFormula = '';

        // Add filters based on action
        switch (action) {
            case 'getChefs':
                filterFormula = "{Type}='Chef'";
                break;
            case 'getMenus':
                filterFormula = "{Type}='Menu'";
                break;
            case 'getDishes':
                if (!params.menuId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Menu ID is required' })
                    };
                }
                filterFormula = `AND({Type}='Dish',{Menu ID}='${params.menuId}')`;
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
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Airtable response:', JSON.stringify(data, null, 2));
        
        // Process the records based on action
        let processedRecords = [];
        if (data.records) {
            processedRecords = data.records.map(record => {
                switch (action) {
                    case 'getChefs':
                        return {
                            id: record.id,
                            name: getField(record, 'Name'),
                            bio: getField(record, 'Bio'),
                            photo: getPhotoUrl(record, 'Photo'),
                            type: getField(record, 'Type')
                        };
                    case 'getMenus':
                        return {
                            id: record.id,
                            name: getField(record, 'Menu Name'),
                            description: getField(record, 'Description'),
                            photo: getPhotoUrl(record, 'Photo'),
                            type: getField(record, 'Type')
                        };
                    case 'getDishes':
                        return {
                            id: record.id,
                            name: getField(record, 'Name'),
                            description: getField(record, 'Description'),
                            price: getField(record, 'Price'),
                            photo: getPhotoUrl(record, 'Photo'),
                            type: getField(record, 'Type'),
                            menuId: getField(record, 'Menu ID')
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
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
}; 