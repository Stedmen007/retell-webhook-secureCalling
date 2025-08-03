// index.js - For Render.com deployment
const express = require('express');
const app = express();

// 🔥 EDIT THESE: Your allowed phone numbers
const ALLOWED_NUMBERS = [
  '+13051234567',  // Replace with YOUR actual numbers
  '+17861234567',  // Add as many as you want
  // '+1xxxxxxxxxx',
];

app.use(express.json());

// Home page - shows webhook is working
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial; padding: 40px; max-width: 600px; margin: auto;">
      <h1>🎯 Retell AI Webhook is Live!</h1>
      <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📊 Status</h3>
        <p>✅ Webhook is running</p>
        <p>📞 Monitoring <strong>${ALLOWED_NUMBERS.length}</strong> allowed numbers</p>
        <p>🕒 Last checked: ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🔗 Your Webhook URL</h3>
        <code style="background: #f8f9fa; padding: 10px; display: block; border-radius: 4px;">
          https://${req.get('host')}/webhook
        </code>
        <p><small>👆 Use this URL in your Retell AI dashboard</small></p>
      </div>

      <div style="background: #d1ecf1; padding: 20px; border-radius: 8px;">
        <h3>📋 Allowed Numbers</h3>
        ${ALLOWED_NUMBERS.map(num => `<p>✅ ${num}</p>`).join('')}
      </div>
    </div>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    allowed_numbers_count: ALLOWED_NUMBERS.length,
    service: 'retell-webhook-filter'
  });
});

// Main webhook endpoint for Retell AI
app.post('/webhook', (req, res) => {
  try {
    const { from_number, to_number, agent_id } = req.body || {};
    
    console.log(`📞 Incoming call from ${from_number} to ${
