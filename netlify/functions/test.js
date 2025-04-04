const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Test function is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports.handler = serverless(app); 