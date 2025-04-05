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
    apiKey: `${AIRTABLE_API_KEY.substring(0, 10)}...`,
    apiKeyLength: AIRTABLE_API_KEY.length,
    availableEndpoints: Object.keys(TABLES),
    environment: process.env
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
        params: event.queryStringParameters,
        headers: event.headers
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
                const errorText = await inquiryResponse.text();
                console.error('Failed to create inquiry:', {
                    status: inquiryResponse.status,
                    statusText: inquiryResponse.statusText,
                    error: errorText
                });
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

        console.log('Airtable request:', {
            url,
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY.substring(0, 10)}...`,
                'Content-Type': 'application/json'
            }
        });

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
                url
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

        // Process records based on action
        let processedRecords = data.records;
        
        switch (action) {
            case 'getChefs':
                processedRecords = data.records.map(record => ({
                    id: record.id,
                    name: getField(record, 'Name'),
                    bio: getField(record, 'Bio'),
                    image: getPhotoUrl(record, 'Photo'),
                    specialties: getField(record, 'Specialties'),
                    availability: getField(record, 'Availability'),
                    active: getField(record, 'Active') === true
                }));
                break;
                
            case 'getMenus':
                processedRecords = data.records.map(record => ({
                    id: record.id,
                    name: getField(record, 'Name'),
                    description: getField(record, 'Description'),
                    menuTier: getField(record, 'Menu Tier'),
                    active: getField(record, 'Active') === true
                }));
                break;
                
            case 'getDishes':
                processedRecords = data.records.map(record => ({
                    id: record.id,
                    name: getField(record, 'Name'),
                    description: getField(record, 'Description'),
                    category: getField(record, 'Category'),
                    menuId: getField(record, 'Menu ID'),
                    sortOrder: getField(record, 'Sort Order')
                }));
                break;
                
            case 'getServices':
                processedRecords = data.records.map(record => ({
                    id: record.id,
                    name: getField(record, 'Name'),
                    description: getField(record, 'Description'),
                    type: getField(record, 'Type')
                }));
                break;
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