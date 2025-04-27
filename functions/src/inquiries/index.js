const functions = require('firebase-functions');
const { base, TABLES } = require('../airtable-config');
const cors = require('cors')({ origin: true });

exports.submitInquiry = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { name, email, phone, eventDate, guestCount, message } = request.body;

      // Validate required fields
      if (!name || !email || !eventDate) {
        response.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Create record in Airtable
      const record = await base(TABLES.INQUIRIES).create([
        {
          fields: {
            Name: name,
            Email: email,
            Phone: phone || '',
            'Event Date': eventDate,
            'Guest Count': guestCount || '',
            Message: message || '',
            Status: 'New'
          }
        }
      ]);

      response.json({ 
        success: true, 
        message: 'Inquiry submitted successfully',
        recordId: record[0].id
      });

    } catch (error) {
      console.error('Error in submitInquiry function:', error);
      response.status(500).json({ error: 'Failed to submit inquiry' });
    }
  });
}); 