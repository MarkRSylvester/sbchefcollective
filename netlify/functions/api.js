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
    getDishes: 'Dishes',
    getServices: 'Services',
    getInquiries: 'Inquiries (Full)',
    getInquiriesSummary: 'Inquiries (Ops Summary)',
    getDubsadoLogs: 'Dubsado Sync Log',
    getImages: 'Images',
    getColors: 'Colors',
    submitInquiry: 'Inquiries (Full)'
};

// Log configuration for debugging
console.log('API Function Configuration:', {
    baseId: AIRTABLE_BASE_ID,
    apiKeyLength: AIRTABLE_API_KEY.length,
    availableEndpoints: Object.keys(TABLES)
});

// Helper function to safely get field value
const getField = (record, fieldName) => {
    if (!record?.fields) {
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
    if (Array.isArray(field) && field[0]?.url) return field[0].url;
    
    console.log('Unexpected photo field structure:', field);
    return null;
};

// Helper function to simulate Dubsado sync
const simulateDubsadoSync = async (inquiryData) => {
    try {
        const payload = {
            fields: {
                'Inquiry ID': inquiryData.id,
                'Timestamp': new Date().toISOString(),
                'Operation': 'Create Inquiry',
                'Payload Summary': JSON.stringify(inquiryData),
                'Sync Status': 'Simulated'
            }
        };

        await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLES.getDubsadoLogs}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        return true;
    } catch (error) {
        console.error('Dubsado sync simulation error:', error);
        return false;
    }
};

// Export the handler function
exports.handler = async (event) => {
    console.log('Request received:', {
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

        // Handle form submissions
        if (action === 'submitInquiry') {
            if (event.httpMethod !== 'POST') {
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
            }

            const formData = JSON.parse(event.body);
            
            // Create inquiry record
            const inquiryResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLES.submitInquiry}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        ...formData,
                        'Status': 'New',
                        'Created Time': new Date().toISOString()
                    }
                })
            });

            if (!inquiryResponse.ok) {
                throw new Error(`Failed to create inquiry: ${inquiryResponse.statusText}`);
            }

            const inquiry = await inquiryResponse.json();
            
            // Simulate Dubsado sync
            await simulateDubsadoSync(inquiry);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    inquiry: inquiry
                })
            };
        }

        // Handle GET requests
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
                        name: getField(record, 'Name'),
                        bio: getField(record, 'Bio'),
                        vibe: getField(record, 'Vibe'),
                        image: getPhotoUrl(record, 'Image URL'),
                        assignedMenus: getField(record, 'Assigned Menus'),
                        availability: getField(record, 'Availability'),
                        location: getField(record, 'Location'),
                        active: getField(record, 'Active')
                    };
                case 'getMenus':
                    return {
                        id: record.id,
                        name: getField(record, 'Menu Name'),
                        description: getField(record, 'Description'),
                        menuTier: getField(record, 'Menu Tier'),
                        associatedDishes: getField(record, 'Associated Dishes'),
                        chefs: getField(record, 'Chef(s)'),
                        heroImage: getPhotoUrl(record, 'Hero Image'),
                        tags: getField(record, 'Tags'),
                        active: getField(record, 'Active')
                    };
                case 'getDishes':
                    return {
                        id: record.id,
                        name: getField(record, 'Dish Name'),
                        category: getField(record, 'Category'),
                        description: getField(record, 'Description'),
                        isPremium: getField(record, 'Is Premium?'),
                        menuId: getField(record, 'Menu ID'),
                        sortOrder: getField(record, 'Sort Order')
                    };
                case 'getServices':
                    return {
                        id: record.id,
                        name: getField(record, 'Service Name'),
                        type: getField(record, 'Type'),
                        description: getField(record, 'Description'),
                        requiresVendor: getField(record, 'Requires Vendor'),
                        usage: getField(record, 'Usage'),
                        costLogic: getField(record, 'Cost Logic'),
                        notes: getField(record, 'Notes')
                    };
                case 'getImages':
                    return {
                        id: record.id,
                        url: getField(record, 'URL'),
                        filename: getField(record, 'Filename'),
                        moodTags: getField(record, 'Mood Tags'),
                        useCase: getField(record, 'Use Case'),
                        paletteTag: getField(record, 'Palette Tag')
                    };
                case 'getColors':
                    return {
                        id: record.id,
                        name: getField(record, 'Name'),
                        hue: getField(record, 'Hue'),
                        usage: getField(record, 'Usage')
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