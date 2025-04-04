const handler = async function(event, context) {
  // Log the request details
  console.log('Event:', event);
  console.log('Context:', context);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({ 
      message: 'Test 2 Response',
      path: event.path,
      httpMethod: event.httpMethod,
      headers: event.headers
    })
  };
};

exports.handler = handler; 