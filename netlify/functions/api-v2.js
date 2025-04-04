const fetch = require('node-fetch');

// Move this to environment variables in Netlify
const AIRTABLE_API_KEY = 'pat99NhmHmsfe5AJN.4aa9d5bf62d05e2e601cfa8a7083089011a75bb76497d120643bb5ef83c7df70';
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
exports.handler = async function(event, context) {
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
                filterFormula = `AND(NOT({Name} = ''), {Type} = 'Chef')`;
                break;
            case 'getMenus':
                filterFormula = `AND(NOT({Menu Name} = ''), {Type} = 'Menu')`;
                break;
            case 'getDishes':
                if (!params.menuId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Menu ID is required' })
                    };
                }
                filterFormula = `AND(NOT({Name} = ''), {Type} = 'Dish', {Menu ID} = '${params.menuId}')`;
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
            console.error('Airtable API error:', {
                status: response.status,
                statusText: response.statusText
            });
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'Failed to fetch from Airtable' })
            };
        }

        const data = await response.json();
        console.log('Raw Airtable response:', JSON.stringify(data, null, 2));

        if (!data || !data.records) {
            console.warn('No records found in Airtable response');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify([])
            };
        }

        let formattedData;
        switch (action) {
            case 'getChefs':
                formattedData = data.records
                    .filter(record => {
                        const hasName = getField(record, 'Name');
                        console.log('Processing chef record:', {
                            id: record.id,
                            fields: record.fields,
                            hasName
                        });
                        return hasName;
                    })
                    .map(record => {
                        const photoUrl = getPhotoUrl(record, 'Photo');
                        console.log('Chef photo URL:', photoUrl);
                        return {
                            id: record.id,
                            chef_id: String(getField(record, 'Chef ID') || '').trim(),
                            name: String(getField(record, 'Name') || '').trim(),
                            chefPhoto: photoUrl,
                            vibe: String(getField(record, 'Vibe') || '').trim(),
                            description: String(getField(record, 'Description') || '').trim()
                        };
                    });
                break;

            case 'getMenus':
                formattedData = data.records
                    .filter(record => {
                        const hasName = getField(record, 'Menu Name');
                        console.log('Processing menu record:', {
                            id: record.id,
                            fields: record.fields,
                            hasName
                        });
                        return hasName;
                    })
                    .map(record => {
                        const photoUrl = getPhotoUrl(record, 'Photo');
                        console.log('Menu photo URL:', photoUrl);
                        return {
                            id: String(getField(record, 'Menu ID') || '').trim(),
                            name: String(getField(record, 'Menu Name') || '').trim(),
                            description: String(getField(record, 'Description') || '').trim(),
                            menuPhoto: photoUrl
                        };
                    });
                break;

            case 'getDishes':
                formattedData = data.records
                    .filter(record => {
                        const hasName = getField(record, 'Name');
                        console.log('Processing dish record:', {
                            id: record.id,
                            fields: record.fields,
                            hasName
                        });
                        return hasName;
                    })
                    .map(record => ({
                        id: record.id,
                        name: getField(record, 'Name'),
                        description: getField(record, 'Description') || '',
                        category: getField(record, 'Category') || 'Other',
                        menuId: getField(record, 'Menu ID'),
                        price: getField(record, 'Price'),
                        order: getField(record, 'Order') || 0
                    }))
                    .sort((a, b) => a.order - b.order);
                break;
        }

        console.log('Formatted data:', JSON.stringify(formattedData, null, 2));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(formattedData)
        };

    } catch (error) {
        console.error('Function error:', {
            error: error.message,
            stack: error.stack
        });
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
}; 